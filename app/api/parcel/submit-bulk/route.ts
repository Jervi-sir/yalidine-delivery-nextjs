// app/api/parcel/submit-bulk/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/prisma/prisma';
import { Prisma } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';
import axios from 'axios';

const { randomUUID } = new ShortUniqueId({ length: 10 });

interface ParcelInput {
  from_wilaya_id?: number;
  from_wilaya_name?: string;
  firstName: string;
  familyName: string;
  contactPhone: string;
  address?: string;
  to_commune_id?: number;
  to_commune_name?: string;
  to_wilaya_id?: number;
  to_wilaya_name?: string;
  to_center_id?: number;
  to_center_name?: string;
  is_stopdesk?: boolean;
  product_list: string;
  price: number | string;
  freeshipping?: boolean;
  more_then_5kg?: boolean;
  order_length?: number | string;
  order_width?: number | string;
  order_height?: number | string;
  order_weight?: number | string;
}

export async function POST(req: Request) {
  try {
    // Authentication
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { user_id, user_email, parcels } = await req.json();

    // Validation
    if (!user_id || !user_email || !Array.isArray(parcels) || parcels.length === 0) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    if (session.user.email !== user_email) {
      return NextResponse.json({ message: 'Unauthorized: User mismatch' }, { status: 401 });
    }

    // Guepex API credentials
    const apiUrl = process.env.GUEPEX_API_URL;
    const apiId = process.env.GUEPEX_API_ID;
    const apiToken = process.env.GUEPEX_API_TOKEN;

    if (!apiUrl || !apiId || !apiToken) {
      console.error("Guepex API credentials not found in environment variables.");
      return NextResponse.json({ error: "Guepex API credentials missing." }, { status: 500 });
    }

    // Transform parcel data for both Prisma and Guepex
    const parcelData: Prisma.ParcelCreateManyInput[] = parcels.map((parcel: ParcelInput, index: number) => {
      if (
        !parcel.firstName ||
        !parcel.familyName ||
        !parcel.contactPhone ||
        !parcel.product_list ||
        parcel.price === undefined ||
        parcel.to_wilaya_id === undefined ||
        parcel.from_wilaya_id === undefined
      ) {
        throw new Error(`Missing required fields in parcel at index ${index}`);
      }

      const parsedPrice = parseInt(parcel.price.toString(), 10);
      if (isNaN(parsedPrice)) {
        throw new Error(`Invalid price in parcel at index ${index}`);
      }

      if (!/^\d+$/.test(parcel.contactPhone)) {
        throw new Error(`Invalid phone number in parcel at index ${index}`);
      }

      const orderId = `user_${user_id}_uuid_${randomUUID()}`;

      return {
        user_id: parseInt(user_id),
        order_id: orderId,
        from_wilaya_id: parseInt(parcel.from_wilaya_id.toString()),
        from_wilaya_name: parcel.from_wilaya_name || '',
        firstname: parcel.firstName,
        familyname: parcel.familyName,
        contact_phone: parcel.contactPhone,
        address: parcel.address || null,
        to_commune_id: parseInt(parcel.to_commune_id.toString()) || null,
        to_commune_name: parcel.to_commune_name || '',
        to_wilaya_id: parseInt(parcel.to_wilaya_id.toString()),
        to_wilaya_name: parcel.to_wilaya_name || '',
        to_center_id: parcel.to_center_id ? parseInt(parcel.to_center_id.toString()) : null,
        to_center_name: parcel.to_center_name || null,
        stopdesk_id: parcel.is_stopdesk && parcel.to_center_id ? parseInt(parcel.to_center_id.toString()) : null,
        is_stopdesk: parcel.is_stopdesk.toString() === 'true',
        product_list: parcel.product_list,
        price: parsedPrice,
        freeshipping: parcel.freeshipping ?? false,
        height: parcel.more_then_5kg && parcel.order_height ? parseInt(parcel.order_height.toString(), 10) : null,
        width: parcel.more_then_5kg && parcel.order_width ? parseInt(parcel.order_width.toString(), 10) : null,
        length: parcel.more_then_5kg && parcel.order_length ? parseInt(parcel.order_length.toString(), 10) : null,
        weight: parcel.more_then_5kg && parcel.order_weight ? parseFloat(parcel.order_weight.toString()) : null,
        do_insurance: false,
        declared_value: null,
        has_exchange: false,
        product_to_collect: null,
        tracking: `TRK${orderId.slice(-6)}${Date.now().toString().slice(-4)}`,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    // Perform transaction
    const createdParcels = await prisma.$transaction(async (tx) => {
      // Create parcels in database
      await tx.parcel.createMany({
        data: parcelData,
        skipDuplicates: true,
      });

      // Fetch created parcels
      const newParcels = await tx.parcel.findMany({
        where: {
          user_id: parseInt(user_id),
          created_at: { gte: new Date(Date.now() - 1000) },
        },
        orderBy: { id: 'desc' },
        take: parcelData.length,
      });

      // Prepare data for Guepex API
      const guepexData = newParcels.map(parcel => ({
        user_id: user_id,
        order_id: parcel.order_id,
        from_wilaya_id: parcel.from_wilaya_id,
        from_wilaya_name: parcel.from_wilaya_name,
        firstname: parcel.firstname,
        familyname: parcel.familyname,
        contact_phone: parcel.contact_phone,
  
        // address
        address: parcel.address,
        to_wilaya_id: parcel.to_wilaya_id,
        to_wilaya_name: parcel.to_wilaya_name,
        to_commune_id: parcel.to_commune_id,
        to_commune_name: parcel.to_commune_name,
        to_center_id: parcel.to_center_id,
        to_center_name: parcel.to_center_name,
        is_stopdesk: parcel.is_stopdesk,
        stopdesk_id: parcel.to_center_id ? parseInt(parcel.to_center_id.toString()) : null, // Handle null values

        // product
        product_list: parcel.product_list,
        price: parseInt(parcel.price.toString(), 10),
        freeshipping: parcel.freeshipping,
        height: parcel.height || null, // Handle null values
        width: parcel.width || null,   // Handle null values
        length: parcel.length || null,  // Handle null values
        weight: parcel.weight || null,  // Handle null values

        do_insurance: parcel.do_insurance,
        declared_value: parcel.declared_value,
        has_exchange: parcel.has_exchange,
        product_to_collect: parcel.product_to_collect || null, // Handle null values
      }));

      // Send to Guepex API
      const response = await axios.post(apiUrl, guepexData, {
        headers: {
          "X-API-ID": apiId,
          "X-API-TOKEN": apiToken,
          "Content-Type": "application/json",
        },
      });
      console.log('response: ', response.data)
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Guepex API error: ${response.status}`);
      }

      // Get tracking numbers
      const trackingArray: string[] = guepexData
        .map(element => response.data[element.order_id]?.tracking)
        .filter(Boolean);

      // Delay before second API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Retrieve parcels from Guepex
      const retrievedParcels = await axios.get(`${apiUrl}?tracking=${trackingArray.join(',')}`, {
        headers: {
          "X-API-ID": apiId,
          "X-API-TOKEN": apiToken,
          "Content-Type": "application/json",
        },
      });

      // Update parcels with Guepex data
      const updatedParcels = await Promise.all(retrievedParcels.data.data.map(async (element: any) => {
        const parcelData = element;
        const generatedLabels = response.data[element.order_id]?.labels || null;

        return await tx.parcel.update({
          where: { order_id: element.order_id },
          data: {
            success: parcelData.success,
            tracking: parcelData.tracking,
            import_id: parcelData.import_id,
            label: parcelData.label || null,
            labels: generatedLabels,
            message: parcelData.message,
            grouped_tracking: trackingArray.join(','),
            product_to_collect: parcelData.product_to_collect,
            stopdesk_name: parcelData.stopdesk_name,
            taxe_percentage: parcelData.taxe_percentage,
            taxe_from: parcelData.taxe_from,
            taxe_retour: parcelData.taxe_retour,
            delivery_fee: parcelData.delivery_fee,
            date_creation: parcelData.date_creation ? new Date(parcelData.date_creation) : null,
            date_expedition: parcelData.date_expedition ? new Date(parcelData.date_expedition) : null,
            date_last_status: parcelData.date_last_status ? new Date(parcelData.date_last_status) : null,
            last_status: parcelData.last_status,
            parcel_type: parcelData.parcel_type,
            parcel_sub_type: parcelData.parcel_sub_type,
            qr_text: parcelData.qr_text,
            pin: parcelData.pin,
            status: parcelData.status,
            payment_id: parcelData.payment_id,
            payment_status: parcelData.payment_status,
            event_id: parcelData.event_id,
            occurred_at: parcelData.occurred_at,
            updated_at: new Date(),
          },
        });
      }));

      return updatedParcels;
    });

    return NextResponse.json({
      message: `Successfully created and submitted ${createdParcels.length} parcels to Guepex`,
      count: createdParcels.length,
      parcels: createdParcels,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Bulk parcel submission error:', error.message);
    return NextResponse.json(
      { message: 'Failed to process parcels', details: error.message },
      { status: 500 }
    );
  }
}
// app/api/parcel/submit-bulk/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // Adjust path
import prisma from '@/prisma/prisma'; // Adjust path
import { Prisma } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';

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
    console.log('session: ', session)
    // Parse request body
    const { user_id, user_email, parcels } = await req.json();
    console.log('user_id: ', user_id)
    console.log('user_email: ', user_email)

    // Validation
    if (!user_id || !user_email || !Array.isArray(parcels) || parcels.length === 0) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    if (session.user.email !== user_email) {
      return NextResponse.json({ message: 'Unauthorized: User mismatch' }, { status: 401 });
    }

    // Validate and transform parcel data
    const parcelData: Prisma.ParcelCreateManyInput[] = parcels.map((parcel: ParcelInput, index: number) => {
      // Required fields validation
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

      // Validate phone number (numbers only, can start with 0)
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
        to_center_id: parseInt(parcel.to_center_id.toString()) || null,
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

    // Perform bulk creation in a transaction
    const createdParcels = await prisma.$transaction(async (tx) => {
      const result = await tx.parcel.createMany({
        data: parcelData,
        skipDuplicates: true,
      });

      // Fetch created parcels for response
      const newParcels = await tx.parcel.findMany({
        where: {
          user_id: parseInt(user_id),
          created_at: { gte: new Date(Date.now() - 1000) }, // Last second
        },
        orderBy: { id: 'desc' },
        take: parcelData.length,
      });

      return newParcels;
    });

    return NextResponse.json({
      message: `Successfully created ${createdParcels.length} parcels`,
      count: createdParcels.length,
      parcels: createdParcels,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Bulk parcel submission error:', error.message);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message, details: error.stack },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
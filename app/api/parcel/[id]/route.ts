import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/prisma/prisma';
import axios from 'axios';

interface Params {
  id: string;
}

export async function PUT(req: Request, { params }: { params: Params }) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const data = await req.json();

    // Basic validation
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ message: 'Invalid parcel ID' }, { status: 400 });
    }

    // Update the parcel in the database
    const updatedParcel = await prisma.parcel.update({
      where: { id: Number(id) },
      data: {
        // Map the fields from the request data to the parcel fields
        firstname: data.firstName,
        familyname: data.familyName,
        contact_phone: data.contactPhone,
        from_wilaya_id: data.from_wilaya_id,
        from_wilaya_name: data.from_wilaya_name,
        to_wilaya_id: data.to_wilaya_id,
        to_wilaya_name: data.to_wilaya_name,
        to_commune_id: data.to_commune_id,
        to_commune_name: data.to_commune_name,
        to_center_id: data.to_center_id,
        to_center_name: data.to_center_name,
        address: data.address,
        is_stopdesk: data.is_stopdesk,
        do_insurance: data.do_insurance,
        declared_value: data.declared_value,
        freeshipping: data.freeshipping,
        product_list: data.product_list,
        price: data.price,
        height: data.height,
        width: data.width,
        length: data.length,
        weight: data.weight,
        // Add other fields as needed
      },
    });

    return NextResponse.json(updatedParcel, { status: 200 });
    /*
    |--------------------------------------------------------------------------
    | Update parcel in the Guepex api
    |--------------------------------------------------------------------------
    */
    const guepexApiUrl = process.env.GUEPEX_API_URL; // the parcel's edition endpoint
    const guepexApiId = process.env.GUEPEX_API_ID; // your api ID
    const guepexApiToken = process.env.GUEPEX_API_TOKEN; // your api token
    if (!guepexApiId || !guepexApiToken || !guepexApiUrl) {
      console.error("Guepex API credentials or URL not found in environment variables.");
      return NextResponse.json({ message: "Guepex API credentials or URL missing." }, { status: 500 });
    }
    const tracking = data.tracking; // parcel to edit
    const order_id = data.order_id; // parcel to edit
    const guepexUpdateUrl = `${guepexApiUrl}${tracking}`; // adding the $tracking to the url
    // array of parameters to edit and their new values
    const guepexData = {
      ...data
    };
    try {
      const guepexResponse = await axios.patch(guepexUpdateUrl, guepexData, {
        headers: {
          "X-API-ID": guepexApiId,
          "X-API-TOKEN": guepexApiToken,
          "Content-Type": "application/json",
        },
      });

      if (guepexResponse.status >= 200 && guepexResponse.status < 300) {
        // Guepex API call was successful
        const parcelData = guepexResponse.data[order_id]; // Access the nested object
        if (parcelData && parcelData.success) {
          // Update the parcel in the database with the tracking and import_id
          const updatedParcel = await prisma.parcel.update({
            where: { id: Number(id) },
            data: {
              order_id: order_id,
              success: parcelData.success,
              tracking: parcelData.tracking,
              import_id: parcelData.import_id,
              label: parcelData.label,
              labels: parcelData.labels,
              message: parcelData.message,
            },
          });

          return NextResponse.json({
            message: 'parcel successfully submitted to Delivery',
            ...updatedParcel
          }, { status: 200 }); // Return the updated parcel
        } else {
          console.error("Guepex API returned an error:", guepexResponse.status, guepexResponse.data);
          return NextResponse.json({ details: guepexResponse.data, }, { status: 500 }); // Return the updated parcel
        }
        return NextResponse.json({ ...updatedParcel, guepex: guepexResponse.data }, { status: 200 });
      } else {
        // Guepex API call failed
        return NextResponse.json({ ...updatedParcel, guepexError: guepexResponse.data }, { status: 500 });
      }
    } catch (error: any) {
      return NextResponse.json({ ...updatedParcel, guepexError: error.message }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to update parcel', error: error.message }, { status: 500 });
  }
}

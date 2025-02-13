// app/api/parcel/submit/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/prisma/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const data = await req.json();
    const user_id = parseInt(data.user_id);
    const user_email = data.user_email;
    // Validators
    if (session?.user.email !== user_email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    if (!data.contactPhone || !data.to_wilaya_id || !data.from_wilaya_id) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    const parsedPrice = parseInt(data.price, 10);
    if (isNaN(parsedPrice)) {
      return NextResponse.json({ message: 'Invalid price' }, { status: 400 });
    }
    
    let dataToSave = {
      user_id: user_id,
      // order_id: order_id, // should be filled after saving it
      from_wilaya_name: data.from_wilaya_name, // Use the name directly
      firstname: data.firstName,
      familyname: data.familyName,
      contact_phone: data.contactPhone,
      address: data.address,
      to_commune_name: data.to_commune_name, // Use the name directly
      to_wilaya_name: data.to_wilaya_name,
      product_list: data.product_list,
      price: parsedPrice,
      do_insurance: data.do_insurance,
      declared_value: data.declared_value,
      height: data.height || null, // Handle null values
      width: data.width || null,   // Handle null values
      length: data.length || null,  // Handle null values
      weight: data.weight || null,  // Handle null values
      freeshipping: data.freeshipping,
      is_stopdesk: data.is_stopdesk,
      stopdesk_id: data.stopdesk_id || null, // Handle null values
      has_exchange: data.has_exchange,
      product_to_collect: data.product_to_collect || null, // Handle null values
    };

    /*
    |--------------------------------------------------------------------------
    | Save parcel in the database
    |--------------------------------------------------------------------------
    */
    const parcel = await prisma.parcel.create({ data: dataToSave, });
    const order_id = 'user_' + String(user_id) + '_parcel_' + String(parcel.id);
    const dataToFetchToGuepex = { order_id: order_id, ...dataToSave };
    
    /*
    |--------------------------------------------------------------------------
    | Fetch saved parcel to the Guepex api
    |--------------------------------------------------------------------------
    */

    const apiUrl = process.env.GUEPEX_API_URL; // the parcel's creation endpoint
    const apiId = process.env.GUEPEX_API_ID; // your api ID
    const apiToken = process.env.GUEPEX_API_TOKEN; // your api token

    if (!apiId || !apiToken) {
      console.error("Guepex API ID or Token not found in environment variables.");
      return new NextResponse(
        JSON.stringify({ error: "Guepex API credentials missing." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Use axios to make the POST request
    const response = await axios.post(apiUrl, [dataToFetchToGuepex], {
      headers: {
        "X-API-ID": apiId,
        "X-API-TOKEN": apiToken,
        "Content-Type": "application/json",
      },
    })

    // Check for successful response
    if (response.status >= 200 && response.status < 300) {
      // Return the response from the external API
      const parcelData = response.data[order_id]; // Access the nested object
      if (parcelData && parcelData.success) {
        // Update the parcel in the database with the tracking and import_id
        const updatedParcel = await prisma.parcel.update({
          where: { id: parcel.id },
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

        return NextResponse.json({ ...updatedParcel }, { status: 200 }); // Return the updated parcel
      } else {
        console.error("Guepex API returned an error:", response.status, response.data);
        return NextResponse.json({ details: response.data, }, { status: 500 }); // Return the updated parcel
      }

      return NextResponse.json({ ...response.data }, { status: 200 });
    } else {
      // Handle non-successful responses
      return NextResponse.json({ details: response.data, status: response.status, }, { status: 401 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit order", details: error.message, }, { status: 500 });
  }
}

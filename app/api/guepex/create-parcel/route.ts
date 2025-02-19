// app/api/parcel/submit/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/prisma/prisma';

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const data = await req.json();

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

    // Create Parcels
    const response = await axios.post(apiUrl, data, {
      headers: {
        "X-API-ID": apiId,
        "X-API-TOKEN": apiToken,
        "Content-Type": "application/json",
      },
    })
    if (response.status < 200 || response.status >= 300) {
      console.error("Guepex API returned an error:", response.status, response.data);
      return NextResponse.json({ details: response.data }, { status: 500 });
    }

    // get tracking of parcels
    const trackingArray: string[] = data.map(element => response.data[element.order_id]?.tracking).filter(Boolean);
    // Introduce a delay before the second API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // Second API call: Retrieve Parcels by tracking
    const retrievedParcels = await axios.get(apiUrl + '?tracking=' + trackingArray.join(','), {
      headers: {
        "X-API-ID": apiId,
        "X-API-TOKEN": apiToken,
        "Content-Type": "application/json",
      },
    })
    if (retrievedParcels.status < 200 || retrievedParcels.status >= 300) {
      console.error("Guepex API returned an error:", retrievedParcels.status, retrievedParcels.data);
      return NextResponse.json({ details: retrievedParcels.data }, { status: 500 });
    }
    let updatedParcels = [];
    await Promise.all(retrievedParcels.data.data.map(async (element) => {
      try {
        const parcelData = element; // Access the nested object
        if (parcelData) {
          // Update the parcel in the database with the tracking and import_id
          const updatedParcel = await prisma.parcel.update({
            where: { order_id: element.order_id },
            data: {
              success: parcelData.success,
              tracking: parcelData.tracking,
              import_id: parcelData.import_id,
              label: parcelData.label ? parcelData.label : null,
              labels: parcelData.labels ? parcelData.labels : null,
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

            },
          });

          updatedParcels.push(updatedParcel); // Add the updated parcel to the array
        }
      } catch (error) {
        console.error('error: ', error.message);
      }
    }));
    console.log('updatedParcels: ', updatedParcels);

    return NextResponse.json({
      message: 'Parcels successfully submitted to Delivery',
      parcels: updatedParcels.filter(Boolean),
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit orderss", details: error.message, }, { status: 500 });
  }
}

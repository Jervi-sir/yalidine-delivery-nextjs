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

    // // Use axios to make the POST request
    const response = await axios.post(apiUrl, data, {
      headers: {
        "X-API-ID": apiId,
        "X-API-TOKEN": apiToken,
        "Content-Type": "application/json",
      },
    })

    // Check for successful response
    if (response.status >= 200 && response.status < 300) {
      let updatedParcels = []; // Create an array to store updated parcels
      let trackingArray = [];
      data.forEach(async (element) => {
        const parcelData = response.data[element.order_id];
        trackingArray.push(parcelData.tracking)
      });

      await Promise.all(data.map(async (element) => {
        // Return the response from the external API
        const parcelData = response.data[element.order_id]; // Access the nested object
        if (parcelData && parcelData.success) {
          // Update the parcel in the database with the tracking and import_id
          const updatedParcel = await prisma.parcel.update({
            where: { id: element.id },
            data: {
              order_id: element.order_id,
              success: parcelData.success,
              tracking: parcelData.tracking,
              import_id: parcelData.import_id,
              label: parcelData.label,
              labels: parcelData.labels,
              message: parcelData.message,
              grouped_tracking: trackingArray.join(','),
            },
          });

          updatedParcels.push(updatedParcel); // Add the updated parcel to the array
        }
      }));
      console.log('updatedParcels: ', updatedParcels);
      return NextResponse.json({
        message: 'Parcels successfully submitted to Delivery',
        parcels: updatedParcels, // Send the updated parcels array
      }, { status: 200 });
    } else {
      console.error("Guepex API returned an error:", response.status, response.data);
      return NextResponse.json({ details: response.data, }, { status: 500 }); // Return the updated parcel
    }
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to submit orderss", details: error.message, }, { status: 500 });
  }
}

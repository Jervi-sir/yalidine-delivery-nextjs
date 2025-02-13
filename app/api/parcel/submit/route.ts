// app/api/parcel/submit/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const data = await req.json(); // Get the data from the request body
    return NextResponse.json({ message: 'success', data }, { status: 201 }); // Return a success response with status 201 (Created)

    const apiUrl = "https://api.guepex.app/v1/parcels/"; // the parcel's creation endpoint
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
    const response = await axios.post(apiUrl, data, {
      headers: {
        "X-API-ID": apiId,
        "X-API-TOKEN": apiToken,
        "Content-Type": "application/json",
      },
      // SSL verification is generally recommended, but can be disabled if needed:
      // httpsAgent: new https.Agent({  
      //   rejectUnauthorized: false 
      // }),
    });

    // Check for successful response
    if (response.status >= 200 && response.status < 300) {
      // Return the response from the external API
      return new NextResponse(JSON.stringify(response.data), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Handle non-successful responses
      console.error("Guepex API returned an error:", response.status, response.data);
      return new NextResponse(
        JSON.stringify({
          error: "Guepex API request failed",
          details: response.data,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error submitting order to Guepex:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to submit order", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

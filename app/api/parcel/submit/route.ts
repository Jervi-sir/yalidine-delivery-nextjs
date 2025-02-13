import { NextResponse } from 'next/server'; // Import NextResponse

export async function POST(req) {
  try {
    const data = await req.json(); // Get the data from the request body

    // 1. Validate the data (Important!)
    // if (!data.firstName || !data.familyName || !data.contactPhone || !data.to_wilaya_id || !data.to_commune_id || !data.to_center_center_id || !data.address || !data.order_date || !data.product_id || !data.quantity || !data.amount) {
    //   return new NextResponse("Missing required fields", { status: 400 }); // Bad Request
    // }

    // 2. Process the data (e.g., save to database, send to delivery API)
    // Example using Prisma (adjust to your database and schema):
    // import { PrismaClient } from '@prisma/client';
    // const prisma = new PrismaClient();

    // const order = await prisma.order.create({
    //   data: {
    //     ...data, // Spread the data from the request
    //     // ... any additional data transformations or calculations
    //   },
    // });

    // Example: Logging the data for now
    console.log("Received order data:", data);

    // 3. Return a success response
    return new NextResponse(JSON.stringify({ message: 'Order submitted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error submitting order:", error);
    return new NextResponse(JSON.stringify({ error: 'Failed to submit order' }), {
      status: 500, // Internal Server Error
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
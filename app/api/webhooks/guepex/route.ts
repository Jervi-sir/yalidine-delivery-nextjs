import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import prisma from '@/prisma/prisma';

// Function to validate the HMAC signature
function verifyHmacSignature(payload: string, signature: string, secret: string): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  return expectedSignature === signature;
}

export async function POST(req: Request) {
  try {
    const secret = process.env.GUEPEX_WEBHOOK_SECRET; // Store your secret key in an environment variable

    if (!secret) {
      console.error('Guepex Webhook Secret not found in environment variables.');
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    const signature = req.headers.get('x-guepex-signature'); // Adjust header name if needed

    if (!signature) {
      console.warn('Missing signature on Guepex webhook request');
      return new NextResponse('Missing signature', { status: 400 });
    }

    const payload = await req.text(); // Get the raw request body as text

    // Verify the HMAC signature
    const isSignatureValid = verifyHmacSignature(payload, signature, secret);

    if (!isSignatureValid) {
      console.warn('Invalid HMAC signature on Guepex webhook request');
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const data = JSON.parse(payload); // Parse the JSON payload

    const eventType = data.type;
    const events = data.events;

    if (!eventType || !events || !Array.isArray(events)) {
      console.warn('Invalid event format from Guepex webhook');
      return new NextResponse('Invalid event format', { status: 400 });
    }

    // Process events based on type
    switch (eventType) {
      case 'parcel_status_updated':
        for (const event of events) {
          const { event_id, occurred_at, data } = event;
          const { tracking, status, reason } = data;

          if (!tracking) {
            console.warn('Missing tracking in parcel_status_updated event');
            continue; // Skip to the next event
          }

          try {
            // Update the parcel in the database
            const updatedParcel = await prisma.parcel.updateMany({
              where: { tracking: tracking },
              data: { tracking: tracking, status: status, message: reason },
            });

            console.log(`Updated parcel ${tracking} with status ${status}`);
          } catch (error) {
            console.error(`Error updating parcel ${tracking}:`, error);
            // Handle the error (e.g., log it, retry later)
          }
        }
        break;

      case 'parcel_payment_updated':
        for (const event of events) {
          const { event_id, occurred_at, data } = event;
          const { tracking, status, payment_id } = data;

          if (!tracking) {
            console.warn('Missing tracking in parcel_payment_updated event');
            continue; // Skip to the next event
          }

          try {
            // Update the parcel in the database
            const updatedParcel = await prisma.parcel.updateMany({
              where: { tracking: tracking },
              data: { status: status, payment_id: payment_id },
            });

            console.log(`Updated parcel ${tracking} with payment status ${status}`);
          } catch (error) {
            console.error(`Error updating parcel ${tracking}:`, error);
            // Handle the error (e.g., log it, retry later)
          }
        }
        break;

      case 'parcel_deleted':
        for (const event of events) {
          const { event_id, occurred_at, data } = event;
          const { tracking } = data;

          if (!tracking) {
            console.warn('Missing tracking in parcel_deleted event');
            continue; // Skip to the next event
          }

          try {
            // Delete the parcel from the database
            const deletedParcel = await prisma.parcel.deleteMany({
              where: { tracking: tracking },
            });

            console.log(`Deleted parcel with tracking ${tracking}`);
          } catch (error) {
            console.error(`Error deleting parcel ${tracking}:`, error);
            // Handle the error (e.g., log it, retry later)
          }
        }
        break;

      // Handle other event types (parcel_created, parcel_edited, etc.)
      default:
        console.log(`Received event type: ${eventType}`);
        break;
    }

    return new NextResponse('Webhook received', { status: 200 });

  } catch (error: any) {
    console.error('Error processing Guepex webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const secret = process.env.GUEPEX_WEBHOOK_SECRET; // Store your secret key in an environment variable

    if (!secret) {
      console.error('Guepex Webhook Secret not found in environment variables.');
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    const data = Object.fromEntries(req.nextUrl.searchParams.entries())

    // Handle crc_token validation
    if (data.subscribe && data.crc_token) {
      const crcToken = data.crc_token;
      return new NextResponse(crcToken, { status: 200 });
    }
    return new NextResponse('No crc_token', { status: 400 });

  } catch (error: any) {
    console.error('Error processing Guepex webhook:', error);
    return new NextResponse('Error processing webhook', { status: 500 });
  }
}


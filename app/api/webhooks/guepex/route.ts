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
    const secret = process.env.GUEPEX_WEBHOOK_SECRET;
    if (!secret) {
      console.error("Guepex Webhook Secret not found.");
      return new NextResponse("Webhook secret not configured", { status: 500 });
    }

    const signature = req.headers.get("x-yalidine-signature");
    if (!signature) {
      console.warn('Missing signature on Guepex webhook request');
      return new NextResponse('Missing signature', { status: 400 });
    }
    const payload = await req.text();
    const data = JSON.parse(payload);
    const eventType = data.type;
    const events = data.events;

    if (!eventType || !events || !Array.isArray(events)) {
      console.warn("Invalid event format");
      return new NextResponse("Invalid event format", { status: 400 });
    }
    console.log('eventType: ', eventType)
    // Process events based on type
    switch (eventType) {
      case "parcel_status_updated":
        for (const event of events) {
          const { event_id, occurred_at, data } = event;
          const { tracking, status, reason } = data;

          if (!tracking) {
            console.warn("Missing tracking in parcel_status_updated event");
            continue;
          }

          await prisma.parcel.updateMany({
            where: { tracking },
            data: {
              tracking,
              status,
              last_status: status,
              message: reason,
              event_id,
              occurred_at: occurred_at ? new Date(occurred_at) : null,
            },
          });
        }
        break;

      case "parcel_payment_updated":
        for (const event of events) {
          const { event_id, occurred_at, data } = event;
          const { tracking, status: paymentStatus, payment_id } = data;

          if (!tracking) {
            console.warn("Missing tracking in parcel_payment_updated event");
            continue;
          }

          await prisma.$transaction(async (tx) => {
            // Find the parcel
            const parcel = await tx.parcel.findFirst({ where: { tracking } });
            if (!parcel) {
              console.warn(`Parcel ${tracking} not found`);
              return;
            }

            // Update payment status
            await tx.parcel.update({
              where: { id: parcel.id },
              data: {
                payment_status: paymentStatus,
                payment_id,
                event_id,
                occurred_at: occurred_at ? new Date(occurred_at) : null,
              },
            });

            // Credit money if payment_status is "payed" and not yet credited
            if (paymentStatus === "payed") {
              const existingCredit = await tx.paymentHistory.findFirst({
                where: {
                  parcel_id: parcel.id,
                  type: "CREDIT",
                },
              });

              if (!existingCredit) {
                let amountToCredit = 0;
                if(parcel.freeshipping) {
                  amountToCredit = parcel.price; // Adjust as needed
                } else {
                  amountToCredit = parcel.price - (parcel.delivery_fee || 0); // Adjust as needed
                }

                // Update or create wallet
                await tx.wallet.upsert({
                  where: { user_id: parcel.user_id },
                  update: { balance: { increment: amountToCredit } },
                  create: {
                    user_id: parcel.user_id,
                    crypto_type: "USD",
                    wallet_address: "default",
                    balance: amountToCredit,
                  },
                });

                // Log payment history
                await tx.paymentHistory.create({
                  data: {
                    user_id: parcel.user_id,
                    amount: amountToCredit,
                    description: `Credit from parcel ${tracking} payment`,
                    parcel_id: parcel.id,
                    type: "CREDIT",
                    transaction_id: payment_id || event_id,
                  },
                });

                console.log(`Credited ${amountToCredit} to user ${parcel.user_id} for parcel ${tracking}`);
              }
            }
          });
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

export async function GET(req: any) {
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


// case 'parcel_created':     //! I have removed this since m already covering this case during fetch of the order 
// for (const event of events) {       //! Maybe I will use it if I wont use the queue for the order creation
//   const { event_id, occurred_at, data } = event;
//   const { order_id, tracking, label, import_id } = data;
//   console.log('occurred_at: ', occurred_at);

//   if (!order_id) {
//     console.warn('Missing order_id in parcel_created event');
//     continue; // Skip to the next event
//   }

//   try {
//     // Update the parcel in the database
//     await prisma.parcel.updateMany({
//       where: { order_id: order_id },
//       data: {
//         tracking: tracking,
//         label: label,
//         import_id: import_id,
//         event_id: event_id,
//         occurred_at: occurred_at ? new Date(occurred_at) : null
//       },
//     });

//     console.log(`Updated parcel ${order_id} with tracking ${tracking}`);
//   } catch (error) {
//     console.error(`Error updating parcel ${order_id}:`, error);
//     // Handle the error (e.g., log it, retry later)
//   }
// }
// break;

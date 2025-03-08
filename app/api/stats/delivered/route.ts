import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: Request) {
  try {
    // Get the session from the request
    const session: any = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    // Calculate the start of the week
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    // Count delivered parcels with "payed" status for this week
    const deliveredParcels = await prisma.parcel.count({
      where: {
        user_id: user.id,
        status: "payed",
        payment_status: "payed", // Check for paid status
        occurred_at: {
          gte: startOfWeek,
        },
      },
    });

    return NextResponse.json({
      count: deliveredParcels,
    });
  } catch (error) {
    console.error('Error fetching delivered parcels:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
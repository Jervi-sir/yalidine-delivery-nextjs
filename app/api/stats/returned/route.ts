import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

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

    // Count returned parcels for this week
    const returnedCount = await prisma.parcel.count({
      where: {
        user_id: user.id,
        last_status: "retournee",
        updated_at: {
          gte: startOfWeek,
        },
      },
    });

    return NextResponse.json({
      count: returnedCount,
    });
  } catch (error) {
    console.error('Error fetching returned parcels:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
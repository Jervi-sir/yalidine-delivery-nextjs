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

    // Fetch parcels for the last 30 days (you can adjust this timeframe)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const parcels = await prisma.parcel.findMany({
      where: {
        user_id: user.id,
        created_at: {
          gte: thirtyDaysAgo,
        },
      },
      select: {
        created_at: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });

    // Group parcels by date
    const groupedData: { [key: string]: number } = {};
    parcels.forEach((parcel) => {
      const date = parcel.created_at.toISOString().split('T')[0];
      groupedData[date] = (groupedData[date] || 0) + 1;
    });

    // Convert to chart data format
    const chartData = Object.entries(groupedData).map(([date, count]) => ({
      date,
      parcels: count,
    }));

    return NextResponse.json({
      data: chartData,
    });
  } catch (error) {
    console.error('Error fetching parcels over time:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
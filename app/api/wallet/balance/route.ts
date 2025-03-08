import { NextResponse } from 'next/server';
import prisma from '@/prisma/prisma';
import { getSession } from 'next-auth/react';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

// GET /api/wallet/balance
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

    // Fetch the wallet for the authenticated user
    const wallet = await prisma.wallet.findUnique({
      where: {
        user_id: user?.id,
      },
      select: {
        balance: true,
        crypto_type: true,
      },
    });
    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Convert Decimal to number for JSON serialization
    const balance = Number(wallet.balance);

    return NextResponse.json({
      balance,
      crypto_type: wallet.crypto_type,
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
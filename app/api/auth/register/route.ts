import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import prisma from '@/prisma/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, password, repeatPassword } = await request.json();

    if (password !== repeatPassword) {
      return NextResponse.json({ message: 'passwords do not match' }, { status: 403 });
    }

    const hashedPassword = await hash(password, 10);

    // Use a transaction to ensure both user and wallet creation succeed or fail together
    const data = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          password_text: password, // Consider removing this in production
        },
      });

      // Create a wallet for the new user
      const wallet = await tx.wallet.create({
        data: {
          user_id: user.id,
          crypto_type: "USDT", // Set a default crypto type
          wallet_address: "default", // Set a default wallet address
        },
      });
      return { user, wallet }; // Return both user and wallet data
    });

    console.log('User and wallet created successfully:', data);
    return NextResponse.json({ message: 'success', data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'error', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

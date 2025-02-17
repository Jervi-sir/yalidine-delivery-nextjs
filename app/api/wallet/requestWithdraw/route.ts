import prisma from "@/prisma/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { user_id, crypto_type, wallet_address, amount } = await request.json();

    if (!user_id || !crypto_type || !wallet_address || !amount) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const userIdInt = parseInt(user_id);
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { message: "Invalid userId. Must be an integer." },
        { status: 400 }
      );
    }
    const amountDecimal = new Decimal(amount);
    // 1. Check if the user has a wallet
    let wallet = await prisma.wallet.findUnique({
      where: {
        user_id: userIdInt,
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { message: "Wallet not found for this user" },
        { status: 404 }
      );
    }

    // 2. Check if the user has sufficient balance
    if (wallet.balance.lessThan(amountDecimal)) {
      return NextResponse.json(
        { message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // 3. Create a withdrawal request
    const withdrawalRequest = await prisma.withdrawalRequest.create({
      data: {
        user_id: userIdInt,
        crypto_type: crypto_type,
        wallet_address: wallet_address,
        amount: amountDecimal,
      },
    });

    // 4. Update the wallet balance (optimistic update - adjust based on your needs)
    // await prisma.wallet.update({
    //   where: {
    //     user_id: userIdInt,
    //   },
    //   data: {
    //     balance: {
    //       minus: amountDecimal,
    //     },
    //   },
    // });

    return NextResponse.json(
      { message: "Withdrawal request submitted", withdrawalRequest },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit order", details: error.message, }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

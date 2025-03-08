// src/app/api/wallet/withdraw/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/prisma/prisma";

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { amount, crypto_type, wallet_address } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const withdrawal = await prisma.$transaction(async (tx) => {
      // Check wallet balance
      const wallet = await tx.wallet.findUnique({ where: { user_id: userId } });
      if (!wallet || wallet.balance < amount) {
        throw new Error("Insufficient balance");
      }

      // Create withdrawal request
      const withdrawal = await tx.withdrawalRequest.create({
        data: {
          user_id: userId,
          amount,
          crypto_type: crypto_type || wallet.crypto_type,
          wallet_address: wallet_address || wallet.wallet_address,
          status: "PENDING",
        },
      });

      // Update wallet balance
      await tx.wallet.update({
        where: { user_id: userId },
        data: { balance: { decrement: amount } },
      });

      // Log payment history
      await tx.paymentHistory.create({
        data: {
          user_id: userId,
          amount,
          description: `Withdrawal request #${withdrawal.id}`,
          type: "DEBIT",
        },
      });

      return withdrawal;
    });

    return NextResponse.json({ message: "Withdrawal request created", withdrawal }, { status: 200 });
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    return NextResponse.json({ error: error.message || "Failed to process withdrawal" }, { status: 500 });
  }
}
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import prisma from "@/prisma/prisma";

export default function WalletBalanceCard() {
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    // async function fetchWalletBalance() {
    //   const currentUserId = 1; // Replace with your actual user ID
    //   const wallet = await prisma.wallet.findUnique({
    //     where: {
    //       user_id: currentUserId,
    //     },
    //   });
    //   setWalletBalance(wallet?.balance as any || 0);
    // }

    // fetchWalletBalance();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
        <small>DA</small>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{walletBalance} <small>DA</small></div>
        <p className="text-xs text-muted-foreground">
          {/* +20.1% from last month (replace with actual data) */}
          No data available
        </p>
      </CardContent>
    </Card>
  );
}

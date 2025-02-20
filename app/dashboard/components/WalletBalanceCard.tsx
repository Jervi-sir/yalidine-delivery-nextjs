"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import prisma from "@/prisma/prisma";
import { useTranslation } from "@/provider/language-provider";

export default function WalletBalanceCard() {
  const [walletBalance, setWalletBalance] = useState(0);
  const doTranslate = useTranslation(translations);

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
        <CardTitle className="text-sm font-medium">{doTranslate('Wallet Balance')}</CardTitle>
        <small>{doTranslate('DA')}</small>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{walletBalance} <small>{doTranslate('DA')}</small></div>
        <p className="text-xs text-muted-foreground">
          {/* +20.1% from last month (replace with actual data) */}
          {doTranslate('No data available')}
        </p>
      </CardContent>
    </Card>
  );
}
const translations = {
  "Wallet Balance": {
    "English": "Wallet Balance",
    "French": "Solde du portefeuille",
    "Arabic": "رصيد المحفظة"
  },
  "DA": {
    "English": "DA",
    "French": "DA",
    "Arabic": "دج"
  },
  "No data available": {
    "English": "No data available",
    "French": "Aucune donnée disponible",
    "Arabic": "لا توجد بيانات متاحة"
  },
}
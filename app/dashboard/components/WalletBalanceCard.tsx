"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useTranslation } from "@/provider/language-provider";
import axios from 'axios';

export default function WalletBalanceCard() {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const doTranslate = useTranslation(translations);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('/api/wallet/balance', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        setWalletBalance(response.data.balance);
        setError(null);
      } catch (err) {
        console.error('Error fetching wallet balance:', err);
        setError('Failed to load wallet balance');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletBalance();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {doTranslate('Wallet Balance')}
        </CardTitle>
        <small>{doTranslate('DA')}</small>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-2xl font-bold">Loading...</div>
        ) : error ? (
          <div className="text-2xl font-bold text-red-500">{error}</div>
        ) : (
          <div className="text-2xl font-bold">
            {walletBalance.toLocaleString('fr-DZ')} <small>{doTranslate('DA')}</small>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          {isLoading || error ? doTranslate('No data available') : 'Current balance'}
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
  }
};
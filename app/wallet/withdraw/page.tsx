"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"
import { getSession } from "next-auth/react";
import axios from "axios";
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";
import { useTranslation } from "@/provider/language-provider";

const cryptoOptions = [
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "USDT", label: "Tether (USDT)" },
  { value: "LTC", label: "Litecoin (LTC)" },
];

export default function Page() {
  const doTranslate = useTranslation(translations);
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  setHeaderTitles([doTranslate('Wallet'), doTranslate('Withdraw')]);

  const [cryptoType, setCryptoType] = useState(cryptoOptions[0].value);
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!walletAddress || !amount) {
      toast({
        title: doTranslate('Error'),
        description: doTranslate('Please fill in all fields'),
        variant: "destructive",
      });
      return;
    }
    setProcessing(true); // Disable the button while processing
    try {
      const session = await getSession();
      const response = await axios.post('/api/wallet/requestWithdraw', {
        user_id: (session.user as any).id,
        crypto_type: cryptoType,
        wallet_address: walletAddress,
        amount: amount,
      });
      toast({
        title: doTranslate('Success'),
        description: response.data.message,
      });
      setWalletAddress("");
      setAmount("");
    } catch (error) {
      console.error("Withdrawal request failed:", error);
      toast({
        title: doTranslate('Error'),
        description: doTranslate('Failed to submit withdrawal request.'),
        variant: "destructive",
      });
    } finally {
      setProcessing(false); // Re-enable the button
    }

  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">{doTranslate('Request Withdrawal')}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cryptoType">{doTranslate('Crypto Type')}</Label>
            <Select
              value={cryptoType}
              onValueChange={setCryptoType}
            >
              <SelectTrigger>
                <SelectValue placeholder={doTranslate('Select Crypto')} />
              </SelectTrigger>
              <SelectContent>
                {cryptoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="walletAddress">{doTranslate('Wallet Address')}</Label>
            <Input
              type="text"
              id="walletAddress"
              placeholder={doTranslate('Enter your wallet address')}
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">{doTranslate('Amount')}</Label>
            <Input
              type="number"
              id="amount"
              placeholder={doTranslate('Enter amount to withdraw')}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit} disabled={false}>
            {processing ? doTranslate('Processing...') : doTranslate('Request Withdrawal')}
          </Button>
        </div>
      </form>
    </div>
  );
}

const translations = {
  "Wallet": {
    "English": "Wallet",
    "French": "Portefeuille",
    "Arabic": "محفظة"
  },
  "Withdraw": {
    "English": "Withdraw",
    "French": "Retirer",
    "Arabic": "سحب"
  },
  "Error": {
    "English": "Error",
    "French": "Erreur",
    "Arabic": "خطأ"
  },
  "Please fill in all fields": {
    "English": "Please fill in all fields",
    "French": "Veuillez remplir tous les champs",
    "Arabic": "يرجى ملء جميع الحقول"
  },
  "Failed to submit withdrawal request.": {
    "English": "Failed to submit withdrawal request.",
    "French": "Échec de la soumission de la demande de retrait.",
    "Arabic": "فشل تقديم طلب السحب."
  },
  "Request Withdrawal": {
    "English": "Request Withdrawal",
    "French": "Demande de retrait",
    "Arabic": "طلب سحب"
  },
  "Crypto Type": {
    "English": "Crypto Type",
    "French": "Type de crypto-monnaie",
    "Arabic": "نوع العملة المشفرة"
  },
  "Select Crypto": {
    "English": "Select Crypto",
    "French": "Sélectionner une crypto-monnaie",
    "Arabic": "اختر عملة مشفرة"
  },
  "Wallet Address": {
    "English": "Wallet Address",
    "French": "Adresse du portefeuille",
    "Arabic": "عنوان المحفظة"
  },
  "Enter your wallet address": {
    "English": "Enter your wallet address",
    "French": "Entrez votre adresse de portefeuille",
    "Arabic": "أدخل عنوان محفظتك"
  },
  "Amount": {
    "English": "Amount",
    "French": "Montant",
    "Arabic": "المبلغ"
  },
  "Enter amount to withdraw": {
    "English": "Enter amount to withdraw",
    "French": "Entrez le montant à retirer",
    "Arabic": "أدخل مبلغ السحب"
  },
  "Processing...": {
    "English": "Processing...",
    "French": "Traitement en cours...",
    "Arabic": "جاري المعالجة..."
  },
}
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

const cryptoOptions = [
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "USDT", label: "Tether (USDT)" },
  { value: "LTC", label: "Litecoin (LTC)" },
];

export default function Page() {
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  setHeaderTitles(['Wallet', 'Withdraw']);

  const [cryptoType, setCryptoType] = useState(cryptoOptions[0].value);
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!walletAddress || !amount) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
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
          title: "Success",
          description: response.data.message,
        });
        setWalletAddress("");
        setAmount("");
    } catch (error) {
      console.error("Withdrawal request failed:", error);
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false); // Re-enable the button
    }

  };

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Request Withdrawal</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cryptoType">Crypto Type</Label>
            <Select
              value={cryptoType}
              onValueChange={setCryptoType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Crypto" />
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
            <Label htmlFor="walletAddress">Wallet Address</Label>
            <Input
              type="text"
              id="walletAddress"
              placeholder="Enter your wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              type="number"
              id="amount"
              placeholder="Enter amount to withdraw"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={0}
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit} disabled={false}>
            {processing ? 'Processing...' : 'Request Withdrawal'}
          </Button>
        </div>
      </form>
    </div>
  );
}

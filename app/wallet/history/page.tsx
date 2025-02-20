'use client'
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";
import { ListWithdrawalsProvider } from "./list-withdrawals-provider";
import { WithdrawalTable } from "./withdrawal-table";
import { useTranslation } from "@/provider/language-provider";

export default function MyWithdrawalsPage() {
  const doTranslate = useTranslation(translations);
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  setHeaderTitles([doTranslate('Wallet'), doTranslate('History')]);
  return (
    <ListWithdrawalsProvider>
      <WithdrawalTable />
    </ListWithdrawalsProvider>
  );
}

const translations = {
  "Wallet": {
    "English": "Wallet",
    "French": "Portefeuille",
    "Arabic": "محفظة"
  },
  "History": {
    "English": "History",
    "French": "Historique",
    "Arabic": "سجل"
  },

}

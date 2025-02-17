'use client'
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";
import { ListWithdrawalsProvider } from "./list-withdrawals-provider";
import { WithdrawalTable } from "./withdrawal-table";

export default function MyWithdrawalsPage() {
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  setHeaderTitles(['Wallet', 'History']);
  return (
    <ListWithdrawalsProvider>
      <WithdrawalTable />
    </ListWithdrawalsProvider>
  );
}

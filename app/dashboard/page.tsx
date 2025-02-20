"use client"

import useHeadbarInsetStore from "@/zustand/headbarInsetStore"
import WalletBalanceCard from "./components/WalletBalanceCard";
import { ParcelsOverTimeChart } from "./components/ParcelsOverTimeChart";
import ParcelStatusChart from "./components/ParcelStatusChart";
import AverageParcelPriceCard from "./components/AverageParcelPriceCard";
import ParcelsDeliveredCard from "./components/ParcelsDeliveredCard";
import { useTranslation } from "@/provider/language-provider";

export default function Page() {
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  const doTranslate = useTranslation(translations);
  setHeaderTitles([doTranslate('Dashboard')]);

  return (
    <div className="flex flex-1 flex-col gap-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-muted/50">
          <WalletBalanceCard />
        </div>
        <div className="rounded-xl bg-muted/50">
          <ParcelsDeliveredCard />
        </div>
        <div className="rounded-xl bg-muted/50">
          <AverageParcelPriceCard />
        </div>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <ParcelsOverTimeChart />
      </div>
    </div>
  )
}

const translations = {
  "Dashboard": {
    "English": "Dashboard",
    "French": "Tableau de bord",
    "Arabic": "لوحة التحكم"
  }
}

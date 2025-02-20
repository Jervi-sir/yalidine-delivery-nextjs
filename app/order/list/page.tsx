'use client'

import Head from "next/head";
import { ListOrdersProvider } from "./list-orders-provider";
import { OrderTable } from "./order-table";
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";
import { useTranslation } from "@/provider/language-provider";

export default function Page() {
  const doTranslate = useTranslation(translations);
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  setHeaderTitles([doTranslate('Parcle'), doTranslate('List')]);
  return (
    <ListOrdersProvider>
      <OrderTable />
    </ListOrdersProvider>
  );
}

const translations = {
  "Parcle": {
    "English": "Parcle",
    "French": "Colis",
    "Arabic": "طرد"
  },
  "List": {
    "English": "List",
    "French": "Liste",
    "Arabic": "قائمة"
  },

}
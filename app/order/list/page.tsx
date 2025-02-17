'use client'

import Head from "next/head";
import { ListOrdersProvider } from "./list-orders-provider";
import { OrderTable } from "./order-table";
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";

export default function Page() {
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  setHeaderTitles(['Parcle', 'List']);
  return (
    <ListOrdersProvider>
       <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <OrderTable />
    </ListOrdersProvider>
  );
}
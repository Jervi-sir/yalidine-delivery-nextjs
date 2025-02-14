'use client'

import { ListOrdersProvider } from "./list-orders-provider";
import { OrderTable } from "./order-table";

export default function Page() {
  return (
    <ListOrdersProvider>
      <OrderTable />
    </ListOrdersProvider>
  );
}
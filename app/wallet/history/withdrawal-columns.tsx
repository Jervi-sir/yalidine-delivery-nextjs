import { WithdrawalRequest } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<WithdrawalRequest>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "crypto_type",
    header: "Crypto Type",
  },
  {
    accessorKey: "wallet_address",
    header: "Wallet Address",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "requested_at",
    header: "Requested At",
    cell: ({ row }) => row.original.requested_at.toLocaleString(),
  },
  {
    accessorKey: "processed_at",
    header: "Processed At",
    cell: ({ row }) =>
      row.original.processed_at ? row.original.processed_at.toLocaleString() : "N/A",
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
  },
];

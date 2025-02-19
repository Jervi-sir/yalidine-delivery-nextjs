"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Parcel } from "@prisma/client";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PrinterIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { useListOrders } from "./list-orders-provider";
import Link from "next/link";

export const columns: ColumnDef<Parcel>[] = [
  {
    id: "select",
    header: () => {
      const { handleShowPrintBulkConfirmation } = useListOrders();

      return (
        <PrinterIcon size={16} onClick={handleShowPrintBulkConfirmation} className="cursor-pointer hover:scale-125" />
      )
    },
    cell: ({ row }) => {
      const parcel = row.original;
      const notPrintedYet = !parcel.label; //? !parcel.labels || 

      if (notPrintedYet)
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)} // Correct toggle
            aria-label="Select row"
            disabled={!notPrintedYet} // Disable checkbox if no tracking
          />
        );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "Client",
    header: "Client",
    cell: ({ row }) => {
      const parcel = row.original;
      const firstname = parcel.firstname;
      const familyname = parcel.familyname;
      const contact_phone = parcel.contact_phone;

      return (
        <div className="flex flex-col">
          <span className="truncate font-semibold">
            {firstname}
            {' - '}
            {familyname}
          </span>
          <span className="truncate text-xs">{contact_phone}</span>
        </div>
      )
    },

  },
  {
    accessorKey: "Tracking",
    header: "Tracking",
    cell: ({ row }) => row.original.tracking && <Badge variant="outline" className="text-nowrap">{row.original.tracking}</Badge>,
  },
  {
    accessorKey: "Full Loaction",
    header: "Loaction",
    cell: ({ row }) => {
      const parcel = row.original;
      const to_wilaya_name = parcel.to_wilaya_name;
      const to_commune_name = parcel.to_commune_name;
      const address = parcel.address;
      const is_stopdesk = parcel.is_stopdesk;

      return (
        <div className="flex flex-col">
          <span className="truncate font-semibold">
            {to_wilaya_name}
          </span>
          <span className="truncate text-xs">{to_commune_name}</span>
          {(address && !is_stopdesk) && <span className="truncate text-xs">{address}</span>}
        </div>
      )
    },
  },
  {
    accessorKey: "Stop Desk",
    header: "Stop Desk",
    cell: ({ row }) => (row.original.is_stopdesk ? "Yes" : "No"),
  },
  {
    accessorKey: "Insurance",
    header: "Insurance",
    cell: ({ row }) => (row.original.do_insurance ? "Yes" : "No"),
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const parcel = row.original;
      let status = '';
      let textColor = 'black';
      if (parcel?.status === 'receivable') { status = 'green'; textColor = 'white'; }
      if (parcel?.status === 'ready') { status = 'greenyellow'; textColor = 'darkgreen'; }
      if (parcel?.status)
        return (
          <Badge style={{ backgroundColor: status, color: textColor }}>{parcel?.status}</Badge>
        )
      else
        return (
          <Badge variant="outline">{'not ready'}</Badge>
        )
    }
  },
  {
    accessorKey: "Free Shipping",
    header: "Free Shipping",
    cell: ({ row }) => (row.original.freeshipping ? "Yes" : "No"),
  },
  {
    accessorKey: "Produit List",
    header: () => <span>Produit List</span>,
    cell: ({ row }) => {
      const parcel = row.original;
      const product_list = parcel.product_list;
      const price = parcel.price;

      return (
        <div className="flex flex-col">
          <span className="truncate font-semibold">
            {product_list}
          </span>
          <span className="truncate text-xs">{price} <small>da</small></span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const parcel = row.original;
      const { showThisParcel, editThisParcel, showThisBulkPrint } = useListOrders(); // eslint-disable-next-line react-hooks/exhaustive-deps

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              {parcel?.label
                && <DropdownMenuItem>
                  <Link href={parcel.label} target="_blank">Print Parcel</Link>
                </DropdownMenuItem>
              }
              {parcel?.labels
                && <DropdownMenuItem onClick={() => showThisBulkPrint(parcel)}>
                  Print (available) Bulk
                </DropdownMenuItem>
              }
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => showThisParcel(parcel)}>
                View parcel details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => editThisParcel(parcel)}>
                Edit parcel details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
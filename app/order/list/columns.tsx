"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Parcel } from "@prisma/client";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PrinterIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge"
import { ViewParcelDialog } from "./view-parcel";
import { useState } from "react";
import { EditParcelDialog } from "./edit-parcel";
import { z } from "zod";
import { useCreateOrder } from "../create/createOrderContext";
import { useListOrders } from "./list-orders-provider";

export const columns: ColumnDef<Parcel>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const { handlePrint } = useListOrders();

      return (
        <PrinterIcon size={16} onClick={handlePrint} className="cursor-pointer hover:scale-125" />
          // <Checkbox
          //   checked={
          //     (table.getIsAllPageRowsSelected() ||
          //       (table.getIsSomePageRowsSelected() && "indeterminate")) as boolean
          //   }
          //   onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          //   aria-label="Select all"
          // />
      )
    },
    cell: ({ row }) => {
      const parcel = row.original;
      const canSelect = !!parcel.label; // Only allow selection if tracking exists

      if(canSelect)
        return (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)} // Correct toggle
            aria-label="Select row"
            disabled={!canSelect} // Disable checkbox if no tracking
          />
        );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstname",
    header: "First Name",
  },
  {
    accessorKey: "familyname",
    header: "Family Name",
  },
  {
    accessorKey: "tracking",
    header: "Tracking",
    cell: ({ row }) => row.original.tracking && <Badge>{row.original.tracking}</Badge>,
  },
  {
    accessorKey: "to_commune_name",
    header: "Commune",
  },
  {
    accessorKey: "to_wilaya_name",
    header: "Wilaya",
  },
  {
    accessorKey: "is_stopdesk",
    header: "Stop Desk",
    cell: ({ row }) => (row.original.is_stopdesk ? "Yes" : "No"),
  },
  {
    accessorKey: "do_insurance",
    header: "Insurance",
    cell: ({ row }) => (row.original.do_insurance ? "Yes" : "No"),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      if (row.original.status === 'ready') return <Badge>{row.original.status}</Badge>
      if (row.original.status === 'receivable') return <Badge>{row.original.status}</Badge>
    }
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "freeshipping",
    header: "Free Shipping",
    cell: ({ row }) => (row.original.freeshipping ? "Yes" : "No"),
  },
  {
    accessorKey: "product_list",
    header: "Product List",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const parcel = row.original;
      const { showThisParcel, editThisParcel } = useListOrders();


      const handleSave = (values) => {
        //  Here you would make your API call to update the parcel
        //  For example:
        //  updateParcel(parcel.id, values)
        //    .then(() => {
        //      // Refresh your data or update the row in the table
        //    })
        //    .catch(error => {
        //      console.error("Error updating parcel:", error);
        //      toast.error("Failed to update parcel.");
        //    });
        console.log("Saving:", values); // Placeholder - replace with your API call
      };

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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(parcel.tracking || "")}
              >
                Copy tracking ID
              </DropdownMenuItem>
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
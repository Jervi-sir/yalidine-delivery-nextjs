"use client";

import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useListOrders } from "./list-orders-provider";
import { FilterSection } from "./filter-section";
import { columns } from "./columns";
import { PaginationWrapper } from "./components/PaginationWrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/provider/language-provider";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function OrderTable() {
  const doTranslate = useTranslation(translations);
  const {
    table,
    perPage,
    isLoadingData,
    setCurrentPage,
    currentPage,
    totalPages,
  } = useListOrders();

  return (
    <div className="">
      {/* Filtering Inputs */}
      <FilterSection />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoadingData ? (
              Array(7)
                .fill(null)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell
                      colSpan={columns.length}
                      className="h-16 text-center"
                    >
                      <Skeleton className="h-full w-full" />
                    </TableCell>
                  </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => {
                const currentParcel = row.original;
                const previousParcel =
                  index > 0 ? table.getRowModel().rows[index - 1].original : null;
                const nextParcel =
                  index < table.getRowModel().rows.length - 1
                    ? table.getRowModel().rows[index + 1].original
                    : null;

                // Check if this is the end of a group
                const isEndOfGroup =
                  currentParcel.labels &&
                  (!nextParcel || nextParcel.labels !== currentParcel.labels);

                return (
                  <>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {isEndOfGroup && (
                      <TableRow key={`${row.id}-group`}>
                        <TableCell colSpan={columns.length}>
                          <div className="flex flex-row justify-end gap-4">
                            <Badge variant="secondary">
                              <Link
                                target="_blank"
                                href={currentParcel.labels}
                                className="text-blue-500 underline"
                              >
                                View Labels
                              </Link>
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {doTranslate("No results.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationWrapper
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

const translations = {
  "No results.": {
    English: "No results.",
    French: "Aucun résultat.",
    Arabic: "لا نتائج.",
  },
};
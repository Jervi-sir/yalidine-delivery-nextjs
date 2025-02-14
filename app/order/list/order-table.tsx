"use client";

import { flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { useListOrders } from "./list-orders-provider";
import { FilterSection } from "./filter-section";
import { columns } from "./columns";
import { PaginationWrapper } from "./components/PaginationWrapper";
import { Skeleton } from "@/components/ui/skeleton";

export function OrderTable() {
  const {
    table, perPage,
    isLoadingData, setCurrentPage, currentPage, totalPages
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
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoadingData
              ? Array(7).fill(null).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={columns.length} className="h-12 text-center">
                    <Skeleton className="h-full w-full" />
                  </TableCell>
                </TableRow>
              ))
              : (
                table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )
              )
            }
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
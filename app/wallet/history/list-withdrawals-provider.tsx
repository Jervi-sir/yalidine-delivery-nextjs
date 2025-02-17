"use client";

import { WithdrawalRequest } from "@prisma/client";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { columns } from "./withdrawal-columns";
import { getSession } from "next-auth/react";

const ListWithdrawalsContext = createContext(null);

export function ListWithdrawalsProvider({ children }) {
  const perPage = 7;
  const [userId, setUserId] = useState(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    {}
  );
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<WithdrawalRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const getUserId = async () => {
    const session = await getSession();
    setUserId((session.user as any).id);
  }

  useEffect(() => {
    getUserId();
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const params = new URLSearchParams({
          userId: userId.toString(),
          page: currentPage.toString(),
          perPage: perPage.toString(),
        });

        const response = await fetch(`/api/wallet/list?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        setData(result.data);
        setTotalCount(result.totalCount);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
      } catch (error: any) {
        console.error("Error fetching withdrawals:", error);
        // Handle error appropriately (e.g., display an error message)
      } finally {
        setIsLoadingData(false);
      }
    };

    if(userId) {
      fetchData();
    }
  }, [userId, currentPage, perPage]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const value = {
    table,
    totalPages,
    totalCount,
    setCurrentPage,
    currentPage,
    isLoadingData,
  };

  return (
    <ListWithdrawalsContext.Provider value={value}>
      {children}
    </ListWithdrawalsContext.Provider>
  );
}

export const useListWithdrawals = () => {
  const context = useContext(ListWithdrawalsContext);
  if (!context) {
    throw new Error(
      "useListWithdrawals must be used within a ListWithdrawalsProvider"
    );
  }
  return context;
};

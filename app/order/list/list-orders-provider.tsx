'use client'
import { Parcel } from '@prisma/client';
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { columns } from './columns';
const ListOrdersContext = createContext(null);

export function ListOrdersProvider({ children, products = [] }) {
  const perPage = 7;
  const userId = 1
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Parcel[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Filtering state
  const [wilayaFilter, setWilayaFilter] = useState<string>("");
  const [communeFilter, setCommuneFilter] = useState<string>("");
  const [isStopdeskFilter, setIsStopdeskFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [doInsuranceFilter, setDoInsuranceFilter] = useState<boolean | undefined>(undefined);
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  // Fetch data on initial load and when filters/pagination change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const params = new URLSearchParams({
          userId: userId.toString(),
          page: currentPage.toString(),
          perPage: perPage.toString(),
          ...(wilayaFilter && { wilaya: wilayaFilter }),
          ...(communeFilter && { commune: communeFilter }),
          ...(isStopdeskFilter !== undefined && {
            isStopdesk: isStopdeskFilter.toString(),
          }),
          ...(statusFilter && { status: statusFilter }),
          ...(doInsuranceFilter !== undefined && {
            doInsurance: doInsuranceFilter.toString(),
          }),
        });

        const response = await fetch(`/api/parcel/list?${params.toString()}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        setData(result.data);
        setTotalCount(result.totalCount);
        setCurrentPage(result.currentPage);
        setTotalPages(result.totalPages);
      } catch (error: any) {
        console.error("Error fetching parcels:", error);
        // Handle error appropriately (e.g., display an error message)
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, [
    perPage, userId, currentPage, wilayaFilter, communeFilter,
    isStopdeskFilter, statusFilter, doInsuranceFilter,
  ]);


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
    state: { sorting, columnFilters, columnVisibility, rowSelection, },
  });

  const value = {
    table, totalPages,
    totalCount, setCurrentPage, currentPage,
    wilayaFilter, setWilayaFilter, 
    communeFilter, setCommuneFilter, 
    isStopdeskFilter, setIsStopdeskFilter, 
    statusFilter, setStatusFilter, 
    doInsuranceFilter, setDoInsuranceFilter,
    isLoadingData
  };

  return (
    <ListOrdersContext.Provider value={value}>
      {children}
    </ListOrdersContext.Provider>
  );
}

export const useListOrders = () => {
  const context = useContext(ListOrdersContext);
  if (!context) {
    throw new Error('useListOrders must be used within an OrderProvider');
  }
  return context;
};


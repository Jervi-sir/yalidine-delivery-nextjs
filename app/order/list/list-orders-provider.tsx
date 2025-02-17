'use client'
import { Parcel } from '@prisma/client';
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from '@tanstack/react-table';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { columns } from './columns';
import { getSession } from 'next-auth/react';
import { ViewParcelDialog } from './view-parcel';
import { EditParcelDialog } from './edit-parcel';
const ListOrdersContext = createContext(null);

export function ListOrdersProvider({ children, products = [] }) {
  const perPage = 7;
  const [userId, setUserId] = useState(null);
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

  const getUserId = async () => {
    const session = await getSession();
    setUserId((session.user as any).id);
  }
  useEffect(() => {
    getUserId();
  }, [])
  // Fetch data on initial load and when filters/pagination change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingData(true);
        const params = new URLSearchParams({
          userId: userId,
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

        // if (!response.ok) {
        //   throw new Error(`HTTP error! Status: ${response.status}`);
        // }

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

    if (userId) {
      fetchData();
    }
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

  const [showViewParcelDialog, setShowViewParcelDialog] = useState(false);
  const [selectedParcelToView, setSelectedParcelToView] = useState(undefined);
  const showThisParcel = (parcel) => {
    setShowViewParcelDialog(true);
    setSelectedParcelToView(parcel)
  }
  const handleShowViewParcelDialog = (e) => {
    if (e === false) {
      setShowViewParcelDialog(false);
      setSelectedParcelToView(undefined)
    }
  }

  const [showEditParcelDialog, setShowEditParcelDialog] = useState(false);
  const [selectedParcelToEdit, setSelectedParcelToEdit] = useState(undefined);
  const editThisParcel = (parcel) => {
    console.log('parcel: ', parcel);
    setShowEditParcelDialog(true);
    setSelectedParcelToEdit(parcel)
  }
  const handleShowEditParcelDialog = (e) => {
    if (e === false) {
      setShowEditParcelDialog(false);
      setSelectedParcelToEdit(undefined)
    }
  }

  const handleUpdateParcel = async (updatedParcel: any) => {
    console.log('handleOnUpdateParcel: ', updatedParcel);
    setData((prevData) =>
      prevData.map((parcel) =>
        parcel.id === updatedParcel.id ? { ...parcel, ...updatedParcel } : parcel,
      ),
    );
  }

  const selectedParcels = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  const handlePrint = () => {
    if (selectedParcels.length === 0) {
      alert("No parcels selected for printing."); // Or use a toast notification
      return;
    }
    // Implement your printing logic here
    console.log("Printing parcels:", selectedParcels);
    // Example: Extract tracking numbers for printing
    const parcelsToPrint = selectedParcels.map((parcel) => parcel.label);
    console.log("Tracking numbers to print:", parcelsToPrint);
    // Call your printing API or service with the tracking numbers
    // printLabels(trackingNumbers);
  }


  const value = {
    table, totalPages,
    totalCount, setCurrentPage, currentPage,
    wilayaFilter, setWilayaFilter,
    communeFilter, setCommuneFilter,
    isStopdeskFilter, setIsStopdeskFilter,
    statusFilter, setStatusFilter,
    doInsuranceFilter, setDoInsuranceFilter,
    isLoadingData,
    showThisParcel, editThisParcel,
    handlePrint
  };

  return (
    <ListOrdersContext.Provider value={value}>
      {children}
      {showViewParcelDialog && <ViewParcelDialog parcel={selectedParcelToView} open={showViewParcelDialog} onOpenChange={handleShowViewParcelDialog} />}
      {showEditParcelDialog
        && <EditParcelDialog
          parcel={selectedParcelToEdit}
          open={showEditParcelDialog}
          onOpenChange={handleShowEditParcelDialog}
          handleOnUpdateParcel={(e) => handleUpdateParcel(e)}
        />}

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


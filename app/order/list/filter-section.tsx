'use client'
import React, { useEffect, useState } from 'react';
import { SelectDropdownComponent } from './components/SelectDropdownComponent';
import { wilayas } from '@/database/wilayas';
import { useListOrders } from './list-orders-provider';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';

export const FilterSection = () => {
  const {
    wilayaFilter, setWilayaFilter, 
    communeFilter, setCommuneFilter, 
    isStopdeskFilter, setIsStopdeskFilter, 
    statusFilter, setStatusFilter, 
    doInsuranceFilter, setDoInsuranceFilter
  } = useListOrders();

  const [wilayaId, setWilayaId] = useState(undefined);
  const [communes, setCommunes] = useState([]);

  useEffect(() => {
    setCommuneFilter(''); // eslint-disable-line no-use-before-define
    setCommunes([])
    if (wilayaId === undefined) return undefined;
    if (wilayaId === 0) return undefined;
    axios.get('/api/location/communes', {
      params: { wilaya_id: wilayaId, has_stop_desk: isStopdeskFilter }
    }).then(response => {
      setCommunes(response.data);
    });
  }, [wilayaId, isStopdeskFilter]) 

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 py-4">
        <SelectDropdownComponent
          placeholder={'Filter by Wilayas'}
          values={[{ id: 0, name: 'all'}, ...wilayas]}
          handleOnValueChange={(e) => {
            if(e.id === 0) {
              setWilayaFilter(undefined)
              setWilayaId(undefined)
            } else {
              setWilayaFilter(e.name)
              setWilayaId(e.id)
            }
          }}
          error={null}
        />
        <SelectDropdownComponent
          placeholder={'Filter by Commune'}
          values={[{ id: 0, name: 'all'}, ...communes]}
          handleOnValueChange={(e) => {
            if(e.id === 0) {
              setCommuneFilter(undefined)
            } else {
              setCommuneFilter(e.name)
            }
          }}
          error={null}
        />
        <SelectDropdownComponent
          placeholder={'Stop Desk'}
          values={[{ id: 0, name: 'all', value: undefined}, { id: 1, name: 'Commune', value: false }, { id: 2, name: 'Stopdesk', value: true }]}
          handleOnValueChange={(e) => setIsStopdeskFilter(e.value)}
          error={null}
        />
        <SelectDropdownComponent
          placeholder={'Filter by Status'}
          values={[{ id: 1, name: 'Pending' }, { id: 2, name: 'Delivered' }]}
          handleOnValueChange={(e) => setStatusFilter(e.target.value)}
          error={null}
        />
        <SelectDropdownComponent
          placeholder={'Do Insurance'}
          values={['with insurance', 'no insurance']}
          handleOnValueChange={(e) => setStatusFilter(e.target.value)}
          error={null}
        />
        <FilterShownColumnComponent />
      </div>
    </>
  );
};


export const FilterShownColumnComponent = () => {
  const { table } = useListOrders();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9.5">
          Columns <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) =>
                  column.toggleVisibility(!!value)
                }
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
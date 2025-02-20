'use client'
import React, { useEffect, useState } from 'react';
import { SelectDropdownComponent } from './components/SelectDropdownComponent';
import { wilayas } from '@/database/wilayas';
import { useListOrders } from './list-orders-provider';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, PrinterIcon } from 'lucide-react';
import axios from 'axios';
import { useTranslation } from '@/provider/language-provider';

export const FilterSection = () => {
  const doTranslate = useTranslation(translations);
  const {
    wilayaFilter, setWilayaFilter,
    communeFilter, setCommuneFilter,
    isStopdeskFilter, setIsStopdeskFilter,
    statusFilter, setStatusFilter,
    doInsuranceFilter, setDoInsuranceFilter,
    handlePrint
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
          placeholder={doTranslate('Filter by Wilayas')}
          values={[{ id: 0, name: doTranslate('all') }, ...wilayas]}
          handleOnValueChange={(e) => {
            if (e.id === 0) {
              setWilayaFilter(undefined)
              setWilayaId(undefined)
            } else {
              setWilayaFilter(e.name)
              setWilayaId(e.id)
            }
          }}
          isWilaya={true}
          error={null}
        />
        <SelectDropdownComponent
          placeholder={doTranslate('Filter by Commune')}
          values={[{ id: 0, name: doTranslate('all'), value: 'all' }, ...communes]}
          handleOnValueChange={(e) => {
            if (e.id === 0) {
              setCommuneFilter(undefined)
            } else {
              setCommuneFilter(e.name)
            }
          }}
          error={null}
        />
        <SelectDropdownComponent
          placeholder={doTranslate('Stop Desk')}
          values={[{ id: 0, name: doTranslate('all'), value: undefined }, { id: 1, name: doTranslate('Commune'), value: false }, { id: 2, name: doTranslate('Stopdesk'), value: true }]}
          handleOnValueChange={(e) => setIsStopdeskFilter(e.value)}
          error={null}
        />
        <SelectDropdownComponent
          placeholder={doTranslate('Filter by Status')}
          values={[{ id: 0, name: doTranslate('coming soon'), value: undefined }]}
          handleOnValueChange={(e) => { }}
          error={null}
        />
        <SelectDropdownComponent
          placeholder={doTranslate('Do Insurance')}
          values={[{ id: 0, name: doTranslate('coming soon'), value: undefined }]}
          handleOnValueChange={(e) => { }}
          error={null}
        />
        <FilterShownColumnComponent />
      </div>
    </>
  );
};


export const FilterShownColumnComponent = () => {
  const doTranslate = useTranslation(translations);
  const { table } = useListOrders();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9.5">
          {doTranslate('Columns')} <ChevronDown />
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

const translations = {
  "Filter by Wilayas": {
    "English": "Filter by Wilayas",
    "French": "Filtrer par wilayas",
    "Arabic": "تصفية حسب الولايات"
  },
  "all": {
    "English": "all",
    "French": "tous",
    "Arabic": "الكل"
  },
  "Filter by Commune": {
    "English": "Filter by Commune",
    "French": "Filtrer par commune",
    "Arabic": "تصفية حسب البلدية"
  },
  "Stop Desk": {
    "English": "Stop Desk",
    "French": "Point de dépôt",
    "Arabic": "مكتب التوقف"
  },
  "Commune": {
    "English": "Commune",
    "French": "Commune",
    "Arabic": "بلدية"
  },
  "Stopdesk": {
    "English": "Stopdesk",
    "French": "Point de dépôt",
    "Arabic": "مكتب التوقف"
  },
  "Filter by Status": {
    "English": "Filter by Status",
    "French": "Filtrer par statut",
    "Arabic": "تصفية حسب الحالة"
  },
  "coming soon": {
    "English": "coming soon",
    "French": "bientôt disponible",
    "Arabic": "قريباً"
  },
  "Do Insurance": {
    "English": "Do Insurance",
    "French": "Assurer",
    "Arabic": "تأمين"
  },
  "Columns": {
    "English": "Columns",
    "French": "Colonnes",
    "Arabic": "أعمدة"
  },

}

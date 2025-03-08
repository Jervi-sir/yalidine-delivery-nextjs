'use client';
import useHeadbarInsetStore from "@/zustand/headbarInsetStore";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreateOrderProvider, useCreateOrder } from "./create-order-context";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/provider/language-provider";
import { ParcelRow } from "./row";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import { ParcelSuccessModal } from "./parcel-success-modal";

export default function Page() {
  const setHeaderTitles = useHeadbarInsetStore((state: any) => state.setHeaderTitles);
  setHeaderTitles(['Parcel', 'Create Bulk']);

  return (
    <CreateOrderProvider>
      <OrderCreateTable />
    </CreateOrderProvider>
  );
}

const OrderCreateTable = () => {
  const { state } = useSidebar();
  const doTranslate = useTranslation(translations);
  const { 
    handleSubmit, processing, parcels, wilayas, errors, parcel, 
    addParcel, setIsModalOpen, isModalOpen, submittedParcels
  } = useCreateOrder();

  return (
    <div className={`${state === 'collapsed' ? "md:w-[calc(100vw-7rem)]" : "md:w-[calc(100vw-14rem)]"} p-4 border rounded-lg shadow-md"`}>
      <form action="" onSubmit={handleSubmit} >

        <ScrollArea className="whitespace-nowrap rounded-md border pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]" colSpan={1}>{''}</TableHead>
                <TableHead className="w-[120px]" colSpan={1}>{doTranslate('Sender')}</TableHead>
                <TableHead className="w-[120px]" colSpan={3}>{doTranslate('Recipient')}</TableHead>
                <TableHead className="w-[120px]" colSpan={5}>{doTranslate('Delivery')}</TableHead>
                <TableHead className="w-[120px]" colSpan={3}>{doTranslate('The parcel')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Dimensions & weight')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">{''}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Wilaya départ')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Nom')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Prénom')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Téléphone')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Delivery Type')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('To Wilaya')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Commune')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Center')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Address')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Product Name')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Prix')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Livraison gratuite?')}</TableHead>
                <TableHead className="w-[50px]">{doTranslate('> 5kg?')}</TableHead>
                <TableHead className="w-[120px]">{doTranslate('Dimensions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parcels.map((parcelData, index) => (
                <ParcelRow
                  key={index}
                  index={index} // Pass the index to identify which parcel to update
                  wilayas={wilayas}
                  errors={errors[index] || {}} // Pass errors specific to this parcel
                  parcel={parcel} // Existing parcel if editing
                />
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="flex gap-4 mt-4">
          <Button variant="outline" type="button" onClick={addParcel} disabled={processing}>
            {doTranslate('Add Parcel')}
          </Button>
          <Button className="w-full" type="submit" disabled={processing || parcels?.length === 0}>
            {processing ? doTranslate('Creating...') : doTranslate('Submit Parcels')}
          </Button>
        </div>
      </form>
    </div>
  );
};

const translations = {};
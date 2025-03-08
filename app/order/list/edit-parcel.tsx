import { Button } from "@/components/ui/button";

import { Parcel } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { CreateOrderProvider, useCreateOrder } from "../create/createOrderContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "@/provider/language-provider";
import { ColiSection, DestinataireSection, ExpediteurSection, LivraisonSection, WeightSection } from "../create/page";

export function EditParcelDialog({ parcel, open, onOpenChange, handleOnUpdateParcel }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CreateOrderProvider parcel={parcel}>
        <FormBody parcel={parcel} onOpenChange={onOpenChange} handleOnUpdateParcel={handleOnUpdateParcel} />
      </CreateOrderProvider>
    </Dialog>
  );
}

const FormBody = ({ parcel, onOpenChange, handleOnUpdateParcel }) => {
  const doTranslate = useTranslation(translations);
  const { data, setData, wilayas, handleSubmit, processing, errors } = useCreateOrder();
  return (
    <>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Parcel Details ID: {parcel.tracking}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-72 rounded-md pr-3">
          {/*--- Expéditeur ---*/}
          <ExpediteurSection data={data} setData={setData} wilayas={wilayas} />
          <Separator className='my-4' />
          {/*--- Destinataire ---*/}
          <DestinataireSection data={data} setData={setData} errors={errors} />
          <Separator className='my-4' />
          {/*--- Livraison ---*/}
          <LivraisonSection data={data} setData={setData} wilayas={wilayas} parcel={parcel} errors={errors} />
          <Separator className='my-4' />
          {/*--- Coli ---*/}
          <ColiSection data={data} setData={setData} errors={errors} />
          <Separator className='my-4' />
          {/*--- Dimension & poids ---*/}
          <WeightSection data={data} setData={setData} errors={errors} />
          <Separator className='my-4' />
        </ScrollArea>
        <DialogFooter>
          <Button
            className="w-full"
            onClick={async (e) => {
              const updatedParcel = await handleSubmit(e);
              handleOnUpdateParcel(updatedParcel);
              onOpenChange(false);
            }}
            disabled={processing}
          >
            {processing ? doTranslate('Updating...') : doTranslate('Submit an Update')}
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {doTranslate('Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  )
}

const translations = {
  "Updating...": {
    "English": "Updating...",
    "French": "Mise à jour en cours...",
    "Arabic": "جاري التحديث..."
  },
  "Submit an Update": {
    "English": "Submit an Update",
    "French": "Soumettre une mise à jour",
    "Arabic": "إرسال تحديث"
  },
  "Close": {
    "English": "Close",
    "French": "Fermer",
    "Arabic": "إغلاق"
  },

}
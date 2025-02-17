import { Button } from "@/components/ui/button";

import { Parcel } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { ExpediteurSection } from "../create/sections/ExpediteurSection";
import { DestinataireSection } from "../create/sections/DestinataireSection";
import { LivraisonSection } from "../create/sections/LivraisonSection";
import { CreateOrderProvider, useCreateOrder } from "../create/createOrderContext";
import { ColiSection } from "../create/sections/ColiSection";
import { WeightSection } from "../create/sections/WeightSection";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const {
    handleSubmit, processing
  } = useCreateOrder();
  return (
    <>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Parcel Details ID: {parcel.tracking}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-72 rounded-md pr-3">
          {/*--- Expéditeur ---*/}
          <ExpediteurSection />
          <Separator className='my-4' />
          {/*--- Destinataire ---*/}
          <DestinataireSection />
          <Separator className='my-4' />
          {/*--- Livraison ---*/}
          <LivraisonSection />
          <Separator className='my-4' />
          {/*--- Coli ---*/}
          <ColiSection />
          <Separator className='my-4' />
          {/*--- Dimension & poids ---*/}
          <WeightSection />
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
            {processing ? 'Updating...' : 'Submit an Update'}
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </>
  )
}
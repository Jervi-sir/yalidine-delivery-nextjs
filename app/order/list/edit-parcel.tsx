import { Button } from "@/components/ui/button";

import { Parcel } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import * as React from "react";
import { Separator } from "@/components/ui/separator";
import { ExpediteurSection } from "../create/sections/ExpediteurSection";
import { DestinataireSection } from "../create/sections/DestinataireSection";
import { LivraisonSection } from "../create/sections/LivraisonSection";
import { CreateOrderProvider } from "../create/createOrderContext";
import { ColiSection } from "../create/sections/ColiSection";
import { WeightSection } from "../create/sections/WeightSection";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ViewParcelDialogProps {
  parcel: Parcel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditParcelDialog({ parcel, open, onOpenChange }: ViewParcelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Parcel Details ID: {parcel.tracking}</DialogTitle>
        </DialogHeader>
        <CreateOrderProvider parcel={parcel}>
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
        </CreateOrderProvider>
        <DialogFooter>
          <Button className="w-full" onClick={() => { }} disabled={false}>
            {'Submit Parcel'}
          </Button>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

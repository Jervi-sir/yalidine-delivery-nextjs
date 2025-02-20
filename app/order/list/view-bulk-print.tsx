import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { useTranslation } from "@/provider/language-provider";
import Link from "next/link";
import * as React from "react";

export function ViewBlukPrint({ parcel, open, onOpenChange }) {
  const doTranslate = useTranslation(translations);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{doTranslate('Print in bulk')}</DialogTitle>
          <DialogDescription>
            {doTranslate('this will be a grouped print for the following tracked parcels')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {
              parcel.grouped_tracking?.split(',').map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))
            }
          </div>
          <div className="grid items-center gap-4">
            <Button variant="outline">
              <Link href={parcel.labels} target="_blank"> {doTranslate('Print these parcels')} </Link>
            </Button>
          </div>
          {/* Add more fields as needed */}
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            {doTranslate('Close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const translations = {
  "Print in bulk": {
    "English": "Print in bulk",
    "French": "Imprimer en masse",
    "Arabic": "الطباعة بالجملة"
  },
  "this will be a grouped print for the following tracked ": {
    "English": "this will be a grouped print for the following tracked ",
    "French": "ce sera une impression groupée pour les suivis suivants",
    "Arabic": "ستكون هذه طباعة مجمعة للطرد (الطرود) التي تم تتبعها التالية"
  },
  "Print these parcels": {
    "English": "Print these parcels",
    "French": "Imprimer ces colis",
    "Arabic": "اطبع هذه الطرود"
  },
  "Close": {
    "English": "Close",
    "French": "Fermer",
    "Arabic": "إغلاق"
  },
}
import { Button } from "@/components/ui/button";

import { Parcel } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";
import { useTranslation } from "@/provider/language-provider";

interface ViewParcelDialogProps {
  parcel: Parcel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewParcelDialog({ parcel, open, onOpenChange }: ViewParcelDialogProps) {
  const doTranslate = useTranslation(translations);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{doTranslate('Parcel Details')}</DialogTitle>
          <DialogDescription>
            {doTranslate('View details for parcel with tracking ID:')} {parcel.tracking}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="firstname">
              {doTranslate('First Name:')} {parcel.firstname}
            </Label>
            <Label htmlFor="firstname">
              {doTranslate('Family Name:')} {parcel.familyname}
            </Label>
            <Label htmlFor="firstname">
              {doTranslate('contact_phone:')} {parcel.contact_phone}
            </Label>
            <Label htmlFor="firstname">
              {doTranslate('Tracking:')} {parcel.tracking || "N/A"}
            </Label>
            <Label htmlFor="firstname">
              {doTranslate('Commune:')} {parcel.to_commune_name}
            </Label>
            <Label htmlFor="firstname">
              {doTranslate('Wilaya:')} {parcel.to_wilaya_name}
            </Label>
            {parcel.stopdesk_name
              && <Label htmlFor="firstname">
                {doTranslate('Stopdesk:')} {parcel.stopdesk_name}
              </Label>
            }
            {parcel.address
              && <Label htmlFor="address">
                {doTranslate('Address:')} {parcel.address}
              </Label>
            }
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="firstname">
              {doTranslate('price:')} {parcel.price}
            </Label>
            <Label htmlFor="firstname">
              {doTranslate('delivery_fee:')} {parcel.delivery_fee}
            </Label>
            <Label htmlFor="firstname">
              {doTranslate('parcel_type:')} {parcel.parcel_type || "N/A"}
            </Label>
            <Label htmlFor="firstname">
              {doTranslate('status:')} {parcel.status}
            </Label>
            <Label htmlFor="firstname">
              {doTranslate('freeshipping:')} {parcel.freeshipping ? doTranslate('Yes') : doTranslate('No')}
            </Label>
            <Label htmlFor="firstname">
              {doTranslate('payment_status:')} {parcel.payment_status || "N/A"}
            </Label>
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
  "Parcel Details": {
    "English": "Parcel Details",
    "French": "Détails du colis",
    "Arabic": "تفاصيل الطرد"
  },
  "View details for parcel with tracking ID:": {
    "English": "View details for parcel with tracking ID:",
    "French": "Afficher les détails du colis avec l'identifiant de suivi :",
    "Arabic": "عرض تفاصيل الطرد مع رقم التتبع:"
  },
  "First Name:": {
    "English": "First Name:",
    "French": "Prénom :",
    "Arabic": "الاسم الأول:"
  },
  "Family Name:": {
    "English": "Family Name:",
    "French": "Nom de famille :",
    "Arabic": "اسم العائلة:"
  },
  "contact_phone:": {
    "English": "Contact Phone :",
    "French": "téléphone :",
    "Arabic": "رقم الهاتف:"
  },
  "Tracking:": {
    "English": "Tracking:",
    "French": "Suivi :",
    "Arabic": "التتبع:"
  },
  "Commune:": {
    "English": "Commune:",
    "French": "Commune :",
    "Arabic": "البلدية:"
  },
  "Wilaya:": {
    "English": "Wilaya:",
    "French": "Wilaya :",
    "Arabic": "الولاية:"
  },
  "Stopdesk:": {
    "English": "Stopdesk:",
    "French": "Point de dépôt :",
    "Arabic": "مكتب التوقف:"
  },
  "Address:": {
    "English": "Address:",
    "French": "Adresse :",
    "Arabic": "العنوان:"
  },
  "price:": {
    "English": "price:",
    "French": "prix :",
    "Arabic": "السعر:"
  },
  "delivery_fee:": {
    "English": "delivery fee:",
    "French": "frais de livraison :",
    "Arabic": "رسوم التوصيل:"
  },
  "parcel_type:": {
    "English": "parcel type:",
    "French": "type de colis :",
    "Arabic": "نوع الطرد:"
  },
  "status:": {
    "English": "Status :",
    "French": "Statut :",
    "Arabic": "الحالة:"
  },
  "freeshipping:": {
    "English": "Freeshipping :",
    "French": "livraison gratuite :",
    "Arabic": "توصيل مجاني:"
  },
  "payment_status:": {
    "English": "Payment Status :",
    "French": "statut du paiement :",
    "Arabic": "حالة الدفع:"
  },
  "Yes": {
    "English": "Yes",
    "French": "Oui",
    "Arabic": "نعم"
  },
  "No": {
    "English": "No",
    "French": "Non",
    "Arabic": "لا"
  },

}
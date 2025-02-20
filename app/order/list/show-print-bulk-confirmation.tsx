import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "@/provider/language-provider";
import { Loader2Icon, LoaderIcon } from "lucide-react";
import * as React from "react";

export function ShowPrintBulkConfirmation({ parcels, open, onOpenChange, handleOnConfirm }) {
  const doTranslate = useTranslation(translations);
  const [fetching, setFetching] = React.useState(false);
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
          <ScrollArea className="max-h-72 rounded-md border flex flex-wrap items-center gap-4">
            {parcels?.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b-1 ">
                <div className="flex flex-1 flex-col py-1 px-2">
                  <span className="truncate font-semibold">{item.firstname} - {item.familyname}</span>
                  <span className="truncate text-xs">{item.contact_phone}</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex flex-1 flex-col py-1 px-2">
                  <span className="truncate font-semibold text-right">{item.to_wilaya_name}</span>
                  <span className="truncate text-xs text-right">{item.to_commune_name}</span>
                </div>

              </div>
            ))
            }
          </ScrollArea>
          <div className="grid items-center gap-4">
            <Button disabled={fetching} variant="outline" onClick={() => {
              if (fetching) return null;
              setFetching(true)
              handleOnConfirm().then(() => setFetching(false));
            }}>
              {fetching && <Loader2Icon className="animate-spin" />}
              {fetching ? doTranslate('Processing...') : doTranslate('Print them all')}
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
  "parcels": {
    "English": "parcels",
    "French": "colis",
    "Arabic": "الطرود"
  },
  "Processing...": {
    "English": "Processing...",
    "French": "Traitement en cours...",
    "Arabic": "جاري المعالجة..."
  },
  "Print them all": {
    "English": "Print them all",
    "French": "Imprimer tout",
    "Arabic": "اطبعهم كلهم"
  },
  "Close": {
    "English": "Close",
    "French": "Fermer",
    "Arabic": "إغلاق"
  },

}
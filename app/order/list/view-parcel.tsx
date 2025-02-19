import { Button } from "@/components/ui/button";

import { Parcel } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as React from "react";

interface ViewParcelDialogProps {
  parcel: Parcel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewParcelDialog({ parcel, open, onOpenChange }: ViewParcelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Parcel Details</DialogTitle>
          <DialogDescription>
            View details for parcel with tracking ID: {parcel.tracking}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Label htmlFor="firstname">
              First Name: {parcel.firstname}
            </Label>
            <Label htmlFor="firstname">
              Family Name: {parcel.familyname}
            </Label>
            <Label htmlFor="firstname">
              contact_phone: {parcel.contact_phone}
            </Label>
            <Label htmlFor="firstname">
              Tracking: {parcel.tracking || "N/A"}
            </Label>
            <Label htmlFor="firstname">
              Commune: {parcel.to_commune_name}
            </Label>
            <Label htmlFor="firstname">
              Wilaya: {parcel.to_wilaya_name}
            </Label>
            { parcel.stopdesk_name
              && <Label htmlFor="firstname">
                Stopdesk: {parcel.stopdesk_name}
              </Label>
            }
            { parcel.address
              && <Label htmlFor="address">
                Address: {parcel.address}
              </Label>
            }
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="firstname">
              price: {parcel.price}
            </Label>
            <Label htmlFor="firstname">
              delivery_fee: {parcel.delivery_fee}
            </Label>
            <Label htmlFor="firstname">
              parcel_type: {parcel.parcel_type || "N/A"}
            </Label>
            <Label htmlFor="firstname">
              status: {parcel.status}
            </Label>
            <Label htmlFor="firstname">
              freeshipping: {parcel.freeshipping ? 'Yes' : 'No'}
            </Label>
            <Label htmlFor="firstname">
              payment_status: {parcel.payment_status || "N/A"}
            </Label>
          </div>
          {/* Add more fields as needed */}
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

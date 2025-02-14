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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="firstname" className="text-right">
              First Name
            </Label>
            <Input
              id="firstname"
              value={parcel.firstname}
              className="col-span-2"
              readOnly
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="familyname" className="text-right">
              Family Name
            </Label>
            <Input
              id="familyname"
              value={parcel.familyname}
              className="col-span-2"
              readOnly
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="tracking" className="text-right">
              Tracking
            </Label>
            <Input
              id="tracking"
              value={parcel.tracking || "N/A"}
              className="col-span-2"
              readOnly
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="commune" className="text-right">
              Commune
            </Label>
            <Input
              id="commune"
              value={parcel.to_commune_name}
              className="col-span-2"
              readOnly
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="wilaya" className="text-right">
              Wilaya
            </Label>
            <Input
              id="wilaya"
              value={parcel.to_wilaya_name}
              className="col-span-2"
              readOnly
            />
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

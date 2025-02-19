import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import Link from "next/link";
import * as React from "react";

export function ViewBlukPrint({ parcel, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Print in bulk</DialogTitle>
          <DialogDescription>
            this will be a grouped print for the following tracked parcels
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
              <Link href={ parcel.labels } target="_blank"> Print these parcels </Link>
            </Button>
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

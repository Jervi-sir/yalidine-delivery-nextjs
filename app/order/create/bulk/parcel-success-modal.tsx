// components/ParcelSuccessModal.tsx
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Parcel } from "@prisma/client";
import Link from "next/link";

interface ParcelSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcels: Parcel[];
}

export function ParcelSuccessModal({ isOpen, onClose, parcels }: ParcelSuccessModalProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-xl max-h-[80vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Parcels Successfully Submitted</AlertDialogTitle>
          <AlertDialogDescription>
            Your parcels have been successfully submitted to Guepex. Here are the details:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="max-w-xl rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Tracking</TableHead>
                <TableHead>Wilaya</TableHead>
                <TableHead>Stopdesk</TableHead>
                <TableHead>Commune</TableHead>
                <TableHead>Center</TableHead>
                <TableHead>Label</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parcels.map((parcel) => (
                <TableRow key={parcel.id}>
                  <TableCell className="font-medium">{parcel.tracking}</TableCell>
                  <TableCell>{parcel.to_wilaya_name}</TableCell>
                  <TableCell>{parcel.is_stopdesk ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{parcel.to_commune_name || 'N/A'}</TableCell>
                  <TableCell>{parcel.to_center_name || 'N/A'}</TableCell>
                  <TableCell>
                    <a
                      href={parcel.label || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Label
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        {parcels.length > 0 && parcels[0].labels && (
        <TableFooter className="rounded border-none">
          <TableRow className="flex flex-row justify-between border-none">
            <TableCell colSpan={3}>Bulk Labels:</TableCell>
            <TableCell className="text-right">
              <Link
                href={parcels[0].labels}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline "
              >
                Download All Labels
              </Link>
            </TableCell>
          </TableRow>
        </TableFooter>
        )}

        <AlertDialogFooter>
          <Button onClick={onClose}>Close</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Parcel } from "@prisma/client";
import Link from "next/link";

interface ParcelSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  parcel: Parcel;
}

export function ParcelSuccessModal({ isOpen, onClose, parcel }: ParcelSuccessModalProps) {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Parcel Successfully Submitted</AlertDialogTitle>
          <AlertDialogDescription>
            Your parcel has been successfully submitted. Here are the details:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking</TableHead>
              <TableHead>Wilaya</TableHead>
              <TableHead>Stopdesk</TableHead>
              <TableHead>Commune</TableHead>
              <TableHead>Center</TableHead>
              <TableHead>Label</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{parcel?.tracking}</TableCell>
              <TableCell>{parcel?.to_wilaya_name}</TableCell>
              <TableCell>{parcel?.is_stopdesk ? 'Yes' : 'No'}</TableCell>
              <TableCell>{parcel?.to_commune_name || 'N/A'}</TableCell>
              <TableCell>{parcel?.to_center_name || 'N/A'}</TableCell>
              <TableCell>
                <Link
                  href={parcel?.label || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Label
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <AlertDialogFooter>
          <Button onClick={onClose}>Close</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslation } from "@/provider/language-provider";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number | string) => void;
}

export function PaginationWrapper({
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) {
  const maxButtons = 5;
  const doTranslate = useTranslation(translations);

  const getPageButtons = () => {
    const buttons: (number | null)[] = [];

    if (totalPages <= maxButtons) {
      // Show all buttons if total pages is less than or equal to max buttons
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Calculate the range of buttons to display
      let startPage = Math.max(1, currentPage - Math.floor((maxButtons - 3) / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 3);

      // Adjust the start and end pages if they are too close to the edges
      if (startPage === 1) {
        endPage = Math.min(totalPages, maxButtons - 2);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxButtons + 3);
      }

      // Add the first page button
      buttons.push(1);

      // Add the ellipsis if necessary
      if (startPage > 2) {
        buttons.push(null); // Use null to represent ellipsis
      }

      // Add the middle page buttons
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(i);
      }

      // Add the ellipsis if necessary
      if (endPage < totalPages - 1) {
        buttons.push(null); // Use null to represent ellipsis
      }

      // Add the last page button
      buttons.push(totalPages);
    }

    return buttons;
  };

  const pageButtons = getPageButtons();

  return (
    <div className="flex items-center justify-center space-x-2 py-4 gap-4">
      <div className="px-2">
        <Label className="text-nowrap">
          {doTranslate('Page')} {currentPage} {doTranslate('of')} {totalPages}
        </Label>
      </div>
      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(Math.max(currentPage - 1, 1));
              }}
              disabled={currentPage === 1}
            />
          </PaginationItem>

          {pageButtons.map((page, index) =>
            page === null ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(Math.min(currentPage + 1, totalPages));
              }}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* <div>
        <Input
          value={currentPage}
          onChange={(e) => setCurrentPage(e.target.value)}
          className="w-sm"
          type="number"
          min={1}
          max={totalPages}
          style={{ width: 100 }}
        />
      </div> */}


    </div>
  );
}


const translations = {
  "Page": {
    "English": "Page",
    "French": "Page",
    "Arabic": "صفحة"
  },
  "of": {
    "English": "of",
    "French": "de",
    "Arabic": "من"
  },
}

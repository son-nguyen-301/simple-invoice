// components/invoices/invoices-pagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { PAGE_SIZE } from "@/hooks/use-invoice-filters";
import { cn } from "@/lib/utils";

type InvoicesPaginationProps = {
  pageNum: number;
  total: number;
  onPageChange: (page: number) => void;
};

export function InvoicesPagination({
  pageNum,
  total,
  onPageChange,
}: InvoicesPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = total === 0 ? 0 : (pageNum - 1) * PAGE_SIZE + 1;
  const end = Math.min(pageNum * PAGE_SIZE, total);
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  const navButton =
    "flex h-[34px] min-w-[34px] items-center justify-center rounded-lg border px-2 text-[13.5px] font-semibold disabled:opacity-40";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-muted-foreground text-[13px] font-medium">
        Showing{" "}
        <strong className="text-foreground">
          {start}-{end}
        </strong>{" "}
        of <strong className="text-foreground">{total}</strong>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          data-testid="invoices-pagination-prev"
          className={cn(navButton, "border-input bg-card")}
          disabled={pageNum <= 1}
          onClick={() => onPageChange(pageNum - 1)}
        >
          <ChevronLeft className="size-4" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            data-testid={`invoices-pagination-page-${page}`}
            className={cn(
              navButton,
              page === pageNum
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-card text-muted-foreground",
            )}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          aria-label="Next page"
          data-testid="invoices-pagination-next"
          className={cn(navButton, "border-input bg-card")}
          disabled={pageNum >= pageCount}
          onClick={() => onPageChange(pageNum + 1)}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}

// components/invoices/invoice-list.tsx
"use client";

import { Plus } from "lucide-react";
import Link from "next/link";

import { InvoiceCardList } from "@/components/invoices/invoice-card-list";
import { InvoiceTable } from "@/components/invoices/invoice-table";
import { InvoiceToolbar } from "@/components/invoices/invoice-toolbar";
import { InvoicesPagination } from "@/components/invoices/invoices-pagination";
import { ListEmpty } from "@/components/invoices/list-empty";
import { ListError } from "@/components/invoices/list-error";
import { ListLoadingOverlay } from "@/components/invoices/list-loading-overlay";
import { ListSkeleton } from "@/components/invoices/list-skeleton";
import { Button } from "@/components/ui/button";
import { useInvoiceFilters } from "@/hooks/use-invoice-filters";
import { useInvoices } from "@/hooks/use-invoices";

export function InvoiceList() {
  const { filters, setKeyword, setStatus, setSort, setPage, clearFilters } =
    useInvoiceFilters();
  const { data, isLoading, isError, isPlaceholderData, refetch } =
    useInvoices(filters);

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const hasResults = rows.length > 0;

  return (
    <div className="flex-1 px-5 py-7 min-[881px]:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-foreground text-[26px] font-extrabold tracking-tight">
            Invoices
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">{total} invoices</p>
        </div>
        <Button asChild className="h-11 max-[880px]:hidden">
          <Link href="/create">
            <Plus className="size-4" />
            New invoice
          </Link>
        </Button>
      </div>

      <div className="bg-card border-border rounded-t-xl border p-4">
        <InvoiceToolbar
          keyword={filters.keyword}
          status={filters.status}
          sort={filters.sort}
          onKeywordChange={setKeyword}
          onStatusChange={setStatus}
          onSortChange={setSort}
        />
      </div>

      <div
        aria-busy={isPlaceholderData}
        className="bg-card border-border relative overflow-hidden border-x"
      >
        {isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <ListError onRetry={() => refetch()} />
        ) : hasResults ? (
          <>
            <div className="max-[880px]:hidden">
              <InvoiceTable rows={rows} />
            </div>
            <div className="p-4 min-[881px]:hidden">
              <InvoiceCardList rows={rows} />
            </div>
          </>
        ) : (
          <ListEmpty onClearFilters={clearFilters} />
        )}

        {isPlaceholderData ? <ListLoadingOverlay /> : null}
      </div>

      <div className="bg-card border-border rounded-b-xl border p-4">
        <InvoicesPagination
          pageNum={filters.pageNum}
          total={total}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

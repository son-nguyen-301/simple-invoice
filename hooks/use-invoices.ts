// hooks/use-invoices.ts
"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchInvoices } from "@/lib/api/invoices";
import { PAGE_SIZE } from "@/hooks/use-invoice-filters";
import type { InvoiceFilters, InvoiceListParams } from "@/types/invoice-list";

export function useInvoices(filters: InvoiceFilters) {
  const params: InvoiceListParams = {
    keyword: filters.keyword || undefined,
    status: filters.status !== "All" ? filters.status : undefined,
    ordering: filters.sort === "oldest" ? "ASCENDING" : "DESCENDING",
    pageNum: filters.pageNum,
    pageSize: PAGE_SIZE,
  };

  return useQuery({
    queryKey: ["invoices", params],
    queryFn: () => fetchInvoices(params),
    placeholderData: keepPreviousData,
  });
}

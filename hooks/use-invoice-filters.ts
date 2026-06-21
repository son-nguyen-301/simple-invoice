// hooks/use-invoice-filters.ts
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import type { InvoiceFilters, SortOption } from "@/types/invoice-list";

export const PAGE_SIZE = 10;

function toSort(value: string | null): SortOption {
  return value === "oldest" ? "oldest" : "newest";
}

function setOrDelete(
  params: URLSearchParams,
  key: string,
  value: string,
  fallback: string,
): void {
  if (value && value !== fallback) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

export function useInvoiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters: InvoiceFilters = {
    keyword: searchParams.get("keyword") ?? "",
    status: searchParams.get("status") ?? "All",
    sort: toSort(searchParams.get("sort")),
    pageNum: Number(searchParams.get("page") ?? "1") || 1,
  };

  const apply = useCallback(
    (changes: Partial<InvoiceFilters>, resetPage = true) => {
      const current: InvoiceFilters = {
        keyword: searchParams.get("keyword") ?? "",
        status: searchParams.get("status") ?? "All",
        sort: toSort(searchParams.get("sort")),
        pageNum: Number(searchParams.get("page") ?? "1") || 1,
      };
      const merged = { ...current, ...changes };
      const next = new URLSearchParams(searchParams.toString());

      setOrDelete(next, "keyword", merged.keyword, "");
      setOrDelete(next, "status", merged.status, "All");
      setOrDelete(next, "sort", merged.sort, "newest");

      const page = resetPage && !("pageNum" in changes) ? 1 : merged.pageNum;

      setOrDelete(next, "page", String(page), "1");

      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const actions = useMemo(
    () => ({
      setKeyword: (value: string) => apply({ keyword: value }),
      setStatus: (value: string) => apply({ status: value }),
      setSort: (value: SortOption) => apply({ sort: value }),
      setPage: (value: number) => apply({ pageNum: value }, false),
      clearFilters: () => apply({ keyword: "", status: "All" }),
    }),
    [apply],
  );

  return { filters, ...actions };
}

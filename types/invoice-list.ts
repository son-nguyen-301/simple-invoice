// Invoice list/filter domain types. Runtime values (fetcher, schemas, filter
// hook, PAGE_SIZE) live in lib/ and hooks/; these are the pure type definitions.

export type SortOption = "newest" | "oldest";

export type InvoiceListParams = {
  keyword?: string;
  status?: string;
  ordering: "ASCENDING" | "DESCENDING";
  pageNum: number;
  pageSize: number;
};

export type InvoiceRow = {
  id: string;
  number: string;
  customerName: string;
  email: string;
  issued: string;
  due: string;
  amount: number;
  currency: string;
  status: string;
};

export type InvoiceListResult = {
  rows: InvoiceRow[];
  total: number;
};

export type InvoiceFilters = {
  keyword: string;
  status: string;
  sort: SortOption;
  pageNum: number;
};

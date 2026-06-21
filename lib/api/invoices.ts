// Schema verified against the live proxied response on 2026-06-21. The list
// endpoint returns { data: Invoice[], paging: { totalRecords } }; each invoice
// carries `status` as an array of { key, value } (the active one has value:true),
// the amount as top-level `totalAmount`, and a `customer` that may have
// firstName/lastName, a single `name`, or be absent. The list response carries
// NO email. The schema stays tolerant (.loose(), optional fields) so an upstream
// shape change degrades to an empty list rather than throwing.
import { z } from "zod";

import { apiClient } from "@/lib/api/client";
import { INVOICES_PATH } from "@/lib/api/endpoints";
import type {
  InvoiceListParams,
  InvoiceListResult,
  InvoiceRow,
} from "@/types/invoice-list";

const StatusEntrySchema = z
  .object({ key: z.string(), value: z.boolean().optional() })
  .loose();

const CustomerSchema = z
  .object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    name: z.string().optional(),
  })
  .loose();

const InvoiceSchema = z
  .object({
    invoiceId: z.string().optional(),
    invoiceNumber: z.string().optional(),
    currency: z.string().optional(),
    invoiceDate: z.string().optional(),
    dueDate: z.string().optional(),
    totalAmount: z.number().optional(),
    status: z.array(StatusEntrySchema).optional(),
    customer: CustomerSchema.optional(),
  })
  .loose();

const PagingSchema = z
  .object({
    total: z.number().optional(),
    totalRecords: z.number().optional(),
  })
  .loose();

const EnvelopeSchema = z
  .object({
    data: z
      .union([
        z.array(InvoiceSchema),
        z.object({ invoices: z.array(InvoiceSchema).optional() }).loose(),
      ])
      .optional(),
    invoices: z.array(InvoiceSchema).optional(),
    paging: PagingSchema.optional(),
  })
  .loose();

type RawInvoice = z.infer<typeof InvoiceSchema>;

/** The active status is the first entry with value:true, else the first entry. */
function activeStatus(invoice: RawInvoice): string {
  const entries = invoice.status ?? [];
  const active = entries.find((entry) => entry.value) ?? entries[0];

  return active?.key ?? "-";
}

function customerName(invoice: RawInvoice): string {
  const customer = invoice.customer;

  if (!customer) {
    return "-";
  }

  const full = [customer.firstName, customer.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return full || customer.name || "-";
}

function toRow(invoice: RawInvoice): InvoiceRow {
  const number = invoice.invoiceNumber ?? invoice.invoiceId ?? "-";

  return {
    id: invoice.invoiceId ?? number,
    number,
    customerName: customerName(invoice),
    email: "",
    issued: invoice.invoiceDate ?? "",
    due: invoice.dueDate ?? "",
    amount: invoice.totalAmount ?? 0,
    currency: invoice.currency ?? "GBP",
    status: activeStatus(invoice),
  };
}

export function normalizeInvoices(raw: unknown): InvoiceListResult {
  const parsed = EnvelopeSchema.safeParse(raw);

  if (!parsed.success) {
    return { rows: [], total: 0 };
  }

  const env = parsed.data;
  const list = Array.isArray(env.data)
    ? env.data
    : (env.data?.invoices ?? env.invoices ?? []);
  const rows = list.map(toRow);
  const total = env.paging?.total ?? env.paging?.totalRecords ?? rows.length;

  return { rows, total };
}

export async function fetchInvoices(
  params: InvoiceListParams,
): Promise<InvoiceListResult> {
  const query: Record<string, string | number> = {
    sortBy: "CREATED_DATE",
    ordering: params.ordering,
    pageNum: params.pageNum,
    pageSize: params.pageSize,
  };

  if (params.keyword) {
    query.keyword = params.keyword;
  }

  if (params.status) {
    query.status = params.status;
  }

  const response = await apiClient.get(INVOICES_PATH, { params: query });

  return normalizeInvoices(response.data);
}

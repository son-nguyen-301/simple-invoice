import { z } from "zod";

import type { Currency, FieldErrors, InvoiceFormValues } from "@/types/invoice";

export const CURRENCIES = [
  "GBP",
  "USD",
  "EUR",
] as const satisfies readonly Currency[];

export const EMPTY_FORM: InvoiceFormValues = {
  invoiceNumber: "",
  invoiceReference: "",
  currency: "GBP",
  invoiceDate: "",
  dueDate: "",
  description: "",
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  premise: "",
  city: "",
  county: "",
  postcode: "",
  countryCode: "",
  accountName: "",
  accountNumber: "",
  sortCode: "",
  itemName: "",
  itemReference: "",
  itemDescription: "",
  quantity: "1",
  rate: "",
  itemUOM: "",
  taxRate: "",
  discountValue: "",
};

const requiredText = (message: string) => z.string().trim().min(1, message);

export const createInvoiceSchema = z
  .object({
    invoiceNumber: requiredText("Invoice number is required"),
    currency: z.enum(CURRENCIES),
    invoiceDate: requiredText("Invoice date is required"),
    dueDate: requiredText("Due date is required"),
    firstName: requiredText("First name is required"),
    lastName: requiredText("Last name is required"),
    email: requiredText("Email is required").pipe(
      z.email("Enter a valid email address"),
    ),
    itemName: requiredText("Item name is required"),
    itemReference: requiredText("Item reference is required"),
    quantity: z
      .string()
      .refine((value) => parseFloat(value) > 0, "Must be greater than 0"),
    rate: z
      .string()
      .refine(
        (value) => value.trim() !== "" && parseFloat(value) >= 0,
        "Enter a valid rate",
      ),
  })
  // dueDate/invoiceDate come from <input type="date"> -> always YYYY-MM-DD, so string < is chronological.
  .refine(
    (data) =>
      !(data.dueDate && data.invoiceDate && data.dueDate < data.invoiceDate),
    { path: ["dueDate"], message: "Due date is before invoice date" },
  );

export function computeErrors(form: InvoiceFormValues): FieldErrors {
  const result = createInvoiceSchema.safeParse(form);

  if (result.success) {
    return {};
  }

  const { fieldErrors } = z.flattenError(result.error);

  return Object.fromEntries(
    Object.entries(fieldErrors).flatMap(([key, messages]) =>
      messages && messages.length > 0 ? [[key, messages[0]]] : [],
    ),
  );
}

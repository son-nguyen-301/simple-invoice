import { z } from "zod";

import { COUNTRIES } from "@/lib/invoices/countries";
import { CURRENCIES } from "@/lib/invoices/create-schema";

const COUNTRY_CODES = new Set(COUNTRIES.map((country) => country.code));

const requiredText = (message: string) => z.string().trim().min(1, message);

const itemSchema = z.object({
  itemName: requiredText("Item name is required"),
  itemReference: requiredText("Item reference is required"),
  quantity: z.number().positive("Quantity must be greater than 0"),
  rate: z.number().min(0, "Rate must be zero or greater"),
  description: z.string().optional(),
  itemUOM: z.string().optional(),
});

const addressSchema = z.object({
  premise: z.string(),
  city: z.string(),
  county: z.string(),
  postcode: z.string(),
  countryCode: z
    .string()
    .refine(
      (code) => code === "" || COUNTRY_CODES.has(code),
      "Invalid ISO2 country code",
    ),
  addressType: z.literal("BILLING"),
});

const customerSchema = z.object({
  firstName: requiredText("First name is required"),
  lastName: requiredText("Last name is required"),
  contact: z.object({
    email: z.email("Enter a valid email address"),
    mobileNumber: z.string().optional(),
  }),
  addresses: z.array(addressSchema).optional(),
});

const invoiceSchema = z
  .object({
    invoiceNumber: requiredText("Invoice number is required"),
    currency: z.enum(CURRENCIES),
    invoiceDate: requiredText("Invoice date is required"),
    dueDate: requiredText("Due date is required"),
    customer: customerSchema,
    items: z.array(itemSchema).min(1, "At least one line item is required"),
    invoiceReference: z.string().optional(),
    description: z.string().optional(),
    bankAccount: z
      .object({
        accountName: z.string(),
        accountNumber: z.string(),
        sortCode: z.string(),
      })
      .optional(),
    extensions: z
      .array(
        z.object({
          addDeduct: z.enum(["ADD", "DEDUCT"]),
          type: z.enum(["PERCENTAGE", "FIXED_VALUE"]),
          value: z.number(),
          name: z.string(),
        }),
      )
      .optional(),
  })
  // Dates are YYYY-MM-DD strings, so lexical < is chronological.
  .refine((data) => data.dueDate >= data.invoiceDate, {
    path: ["dueDate"],
    message: "Due date is before invoice date",
  });

export const createInvoicePayloadSchema = z.object({
  invoices: z.array(invoiceSchema).min(1, "At least one invoice is required"),
});

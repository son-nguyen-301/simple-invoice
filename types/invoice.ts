// Create-invoice domain types. Runtime values (schema, totals, payload builder,
// country/currency lists) live in lib/; these are the pure type definitions.

export type Currency = "GBP" | "USD" | "EUR";

export type InvoiceFormValues = {
  invoiceNumber: string;
  invoiceReference: string;
  currency: Currency;
  invoiceDate: string;
  dueDate: string;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  premise: string;
  city: string;
  county: string;
  postcode: string;
  countryCode: string;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  itemName: string;
  itemReference: string;
  itemDescription: string;
  quantity: string;
  rate: string;
  itemUOM: string;
  taxRate: string;
  discountValue: string;
};

export type FieldErrors = Partial<Record<keyof InvoiceFormValues, string>>;

export type InvoiceTotals = {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
};

export type Country = {
  code: string;
  name: string;
};

export type InvoiceItemInput = {
  itemName: string;
  itemReference: string;
  quantity: number;
  rate: number;
  description?: string;
  itemUOM?: string;
};

export type InvoiceExtensionInput = {
  addDeduct: "ADD" | "DEDUCT";
  type: "PERCENTAGE" | "FIXED_VALUE";
  value: number;
  name: string;
};

export type InvoiceAddressInput = {
  premise: string;
  city: string;
  county: string;
  postcode: string;
  countryCode: string;
  addressType: "BILLING";
};

export type InvoiceCustomerInput = {
  firstName: string;
  lastName: string;
  contact: { email: string; mobileNumber?: string };
  addresses?: InvoiceAddressInput[];
};

export type InvoiceInput = {
  invoiceNumber: string;
  currency: Currency;
  invoiceDate: string;
  dueDate: string;
  customer: InvoiceCustomerInput;
  items: InvoiceItemInput[];
  invoiceReference?: string;
  description?: string;
  bankAccount?: {
    accountName: string;
    accountNumber: string;
    sortCode: string;
  };
  extensions?: InvoiceExtensionInput[];
};

export type CreateInvoicePayload = {
  invoices: InvoiceInput[];
};

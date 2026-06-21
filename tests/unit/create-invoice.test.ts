import { describe, expect, it } from "vitest";

import { buildCreateInvoicePayload } from "@/lib/api/create-invoice";
import { computeErrors, EMPTY_FORM } from "@/lib/invoices/create-schema";
import { computeTotals } from "@/lib/invoices/totals";

const fullForm = {
  ...EMPTY_FORM,
  invoiceNumber: "INV0001",
  invoiceReference: "#123",
  currency: "GBP" as const,
  invoiceDate: "2026-06-21",
  dueDate: "2026-06-28",
  description: "Test invoice",
  firstName: "Nguyen",
  lastName: "Dung",
  email: "nguyen@example.com",
  mobile: "+6597594971",
  premise: "CT11",
  city: "Hanoi",
  county: "Hoang Mai",
  postcode: "1000",
  countryCode: "VN",
  accountName: "John Terry",
  accountNumber: "12345678",
  sortCode: "09-01-01",
  itemName: "Honda Motor",
  itemReference: "itemRef",
  itemDescription: "Honda RC150",
  quantity: "2",
  rate: "1000",
  itemUOM: "KG",
  taxRate: "10",
  discountValue: "50",
};

describe("buildCreateInvoicePayload", () => {
  it("wraps a single invoice with exactly one line item", () => {
    const payload = buildCreateInvoicePayload(fullForm);

    expect(payload.invoices).toHaveLength(1);
    expect(payload.invoices[0].items).toHaveLength(1);
  });

  it("coerces quantity and rate to numbers", () => {
    const item = buildCreateInvoicePayload(fullForm).invoices[0].items[0];

    expect(item.quantity).toBe(2);
    expect(item.rate).toBe(1000);
  });

  it("always includes the required itemReference on the line item", () => {
    const item = buildCreateInvoicePayload(fullForm).invoices[0].items[0];

    expect(item.itemReference).toBe("itemRef");
  });

  it("maps tax and discount to invoice-level extensions", () => {
    const extensions =
      buildCreateInvoicePayload(fullForm).invoices[0].extensions;

    expect(extensions).toContainEqual({
      addDeduct: "ADD",
      type: "PERCENTAGE",
      value: 10,
      name: "tax",
    });
    expect(extensions).toContainEqual({
      addDeduct: "DEDUCT",
      type: "FIXED_VALUE",
      value: 50,
      name: "discount",
    });
  });

  it("includes address and bank account when provided", () => {
    const invoice = buildCreateInvoicePayload(fullForm).invoices[0];
    const customer = invoice.customer;

    expect(customer.addresses).toHaveLength(1);
    expect(invoice.bankAccount).toBeDefined();
  });

  it("omits address, bank, and extensions when those fields are empty", () => {
    const lean = {
      ...EMPTY_FORM,
      invoiceNumber: "INV2",
      invoiceDate: "2026-06-21",
      dueDate: "2026-06-22",
      firstName: "A",
      lastName: "B",
      email: "a@b.com",
      itemName: "Item",
      quantity: "1",
      rate: "10",
    };
    const invoice = buildCreateInvoicePayload(lean).invoices[0];
    const customer = invoice.customer;

    expect(customer.addresses).toBeUndefined();
    expect(invoice.bankAccount).toBeUndefined();
    expect(invoice.extensions).toBeUndefined();
  });
});

describe("computeErrors", () => {
  it("flags every required field on an empty form", () => {
    const errors = computeErrors(EMPTY_FORM);

    expect(errors.invoiceNumber).toBe("Invoice number is required");
    expect(errors.invoiceDate).toBe("Invoice date is required");
    expect(errors.dueDate).toBe("Due date is required");
    expect(errors.firstName).toBe("First name is required");
    expect(errors.email).toBe("Email is required");
    expect(errors.itemName).toBe("Item name is required");
    expect(errors.itemReference).toBe("Item reference is required");
    expect(errors.rate).toBe("Enter a valid rate");
  });

  it("returns no errors for a valid form", () => {
    expect(computeErrors(fullForm)).toEqual({});
  });

  it("rejects an invalid email", () => {
    expect(computeErrors({ ...fullForm, email: "not-an-email" }).email).toBe(
      "Enter a valid email address",
    );
  });

  it("rejects a non-positive quantity", () => {
    expect(computeErrors({ ...fullForm, quantity: "0" }).quantity).toBe(
      "Must be greater than 0",
    );
  });

  it("rejects a due date before the invoice date", () => {
    expect(computeErrors({ ...fullForm, dueDate: "2026-06-01" }).dueDate).toBe(
      "Due date is before invoice date",
    );
  });

  it("rejects a negative tax rate", () => {
    expect(computeErrors({ ...fullForm, taxRate: "-5" }).taxRate).toBe(
      "Tax must be between 0 and 100",
    );
  });

  it("rejects a tax rate above 100", () => {
    expect(computeErrors({ ...fullForm, taxRate: "150" }).taxRate).toBe(
      "Tax must be between 0 and 100",
    );
  });

  it("rejects a negative discount", () => {
    expect(
      computeErrors({ ...fullForm, discountValue: "-10" }).discountValue,
    ).toBe("Discount can't be negative");
  });

  it("rejects a discount that exceeds the subtotal", () => {
    // subtotal = quantity 2 * rate 1000 = 2000
    expect(
      computeErrors({ ...fullForm, discountValue: "2500" }).discountValue,
    ).toBe("Discount can't exceed the subtotal");
  });
});

describe("computeTotals", () => {
  it("computes subtotal, discount and tax on the post-discount amount", () => {
    const totals = computeTotals(fullForm);

    // subtotal 2000, discount 50 -> taxable 1950, tax 10% = 195
    expect(totals.subtotal).toBe(2000);
    expect(totals.discount).toBe(50);
    expect(totals.tax).toBe(195);
    expect(totals.total).toBe(2145);
  });
});

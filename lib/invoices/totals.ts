import type { InvoiceFormValues, InvoiceTotals } from "@/types/invoice";

export function computeTotals(form: InvoiceFormValues): InvoiceTotals {
  const quantity = parseFloat(form.quantity) || 0;
  const rate = parseFloat(form.rate) || 0;
  const subtotal = quantity * rate;
  const discount = parseFloat(form.discountValue) || 0;
  // Tax applies to the subtotal after the discount is deducted.
  const taxable = Math.max(0, subtotal - discount);
  const tax = (taxable * (parseFloat(form.taxRate) || 0)) / 100;

  return { subtotal, tax, discount, total: taxable + tax };
}

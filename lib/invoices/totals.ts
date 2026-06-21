import type { InvoiceFormValues, InvoiceTotals } from "@/types/invoice";

export function computeTotals(form: InvoiceFormValues): InvoiceTotals {
  const quantity = parseFloat(form.quantity) || 0;
  const rate = parseFloat(form.rate) || 0;
  const subtotal = quantity * rate;
  const tax = (subtotal * (parseFloat(form.taxRate) || 0)) / 100;
  const discount = parseFloat(form.discountValue) || 0;

  return { subtotal, tax, discount, total: subtotal + tax - discount };
}

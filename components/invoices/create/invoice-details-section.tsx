import type { ChangeEvent } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/invoices/create/field";
import { SectionCard } from "@/components/invoices/create/section-card";
import { CURRENCIES } from "@/lib/invoices/create-schema";
import type { Currency, FieldErrors, InvoiceFormValues } from "@/types/invoice";

const CURRENCY_LABELS: Record<Currency, string> = {
  GBP: "GBP - British Pound",
  USD: "USD - US Dollar",
  EUR: "EUR - Euro",
};

const INPUT = "h-11 rounded-lg bg-card";

export function InvoiceDetailsSection({
  form,
  errors,
  onField,
  onCurrency,
}: {
  form: InvoiceFormValues;
  errors: FieldErrors;
  onField: (
    key: keyof InvoiceFormValues,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCurrency: (value: Currency) => void;
}) {
  return (
    <SectionCard step={1} title="Invoice details">
      <div className="grid grid-cols-1 gap-4 min-[881px]:grid-cols-3">
        <Field
          htmlFor="invoiceNumber"
          label="Invoice number"
          required
          error={errors.invoiceNumber}
          errorTestId="invoice-details-section-invoice-number-error"
        >
          <Input
            id="invoiceNumber"
            data-testid="invoice-details-section-invoice-number"
            value={form.invoiceNumber}
            onChange={onField("invoiceNumber")}
            placeholder="INV0001"
            className={`${INPUT} font-mono`}
            aria-invalid={Boolean(errors.invoiceNumber)}
          />
        </Field>

        <Field htmlFor="invoiceReference" label="Reference">
          <Input
            id="invoiceReference"
            data-testid="invoice-details-section-invoice-reference"
            value={form.invoiceReference}
            onChange={onField("invoiceReference")}
            placeholder="#123456"
            className={INPUT}
          />
        </Field>

        <Field htmlFor="currency" label="Currency" required>
          <Select value={form.currency} onValueChange={onCurrency}>
            {/* prettier-ignore */}
            <SelectTrigger
              id="currency"
              data-testid="invoice-details-section-currency"
              className="bg-card data-[size=default]:h-11 w-full rounded-lg"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((code) => (
                <SelectItem key={code} value={code}>
                  {CURRENCY_LABELS[code]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          htmlFor="invoiceDate"
          label="Invoice date"
          required
          error={errors.invoiceDate}
          errorTestId="invoice-details-section-invoice-date-error"
        >
          <Input
            id="invoiceDate"
            data-testid="invoice-details-section-invoice-date"
            type="date"
            value={form.invoiceDate}
            onChange={onField("invoiceDate")}
            className={INPUT}
            aria-invalid={Boolean(errors.invoiceDate)}
          />
        </Field>

        <Field
          htmlFor="dueDate"
          label="Due date"
          required
          error={errors.dueDate}
          errorTestId="invoice-details-section-due-date-error"
        >
          <Input
            id="dueDate"
            data-testid="invoice-details-section-due-date"
            type="date"
            value={form.dueDate}
            onChange={onField("dueDate")}
            className={INPUT}
            aria-invalid={Boolean(errors.dueDate)}
          />
        </Field>

        <div className="hidden min-[881px]:block" />
      </div>

      <div className="mt-4">
        <Field htmlFor="description" label="Description">
          <textarea
            id="description"
            data-testid="invoice-details-section-description"
            value={form.description}
            onChange={onField("description")}
            placeholder="What is this invoice for?"
            rows={2}
            className="border-input bg-card focus-visible:border-ring focus-visible:ring-ring/50 w-full resize-y rounded-lg border px-3.5 py-2.5 text-sm outline-none focus-visible:ring-3"
          />
        </Field>
      </div>
    </SectionCard>
  );
}

import type { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Field } from "@/components/invoices/create/field";
import { SectionCard } from "@/components/invoices/create/section-card";
import { currencySymbol, formatMoney } from "@/lib/format";
import type {
  FieldErrors,
  InvoiceFormValues,
  InvoiceTotals,
} from "@/types/invoice";

const INPUT = "h-11 rounded-lg bg-card";

export function LineItemSection({
  form,
  errors,
  onField,
  totals,
}: {
  form: InvoiceFormValues;
  errors: FieldErrors;
  onField: (
    key: keyof InvoiceFormValues,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  totals: InvoiceTotals;
}) {
  const symbol = currencySymbol(form.currency);

  return (
    <SectionCard
      step={4}
      title="Line item"
      action={
        <span className="text-muted-foreground bg-muted rounded-md px-2.5 py-1 text-xs font-semibold">
          Single item
        </span>
      }
    >
      <div className="mb-4 grid grid-cols-1 gap-4 min-[881px]:grid-cols-2">
        <Field
          htmlFor="itemName"
          label="Item name"
          required
          error={errors.itemName}
          errorTestId="line-item-section-item-name-error"
        >
          <Input
            id="itemName"
            data-testid="line-item-section-item-name"
            value={form.itemName}
            onChange={onField("itemName")}
            placeholder="Honda Motor"
            className={INPUT}
            aria-invalid={Boolean(errors.itemName)}
          />
        </Field>

        <Field
          htmlFor="itemReference"
          label="Item reference"
          required
          error={errors.itemReference}
          errorTestId="line-item-section-item-reference-error"
        >
          <Input
            id="itemReference"
            data-testid="line-item-section-item-reference"
            value={form.itemReference}
            onChange={onField("itemReference")}
            placeholder="itemRef"
            className={INPUT}
            aria-invalid={Boolean(errors.itemReference)}
          />
        </Field>
      </div>

      <div className="mb-4">
        <Field htmlFor="itemDescription" label="Item description">
          <Input
            id="itemDescription"
            data-testid="line-item-section-item-description"
            value={form.itemDescription}
            onChange={onField("itemDescription")}
            placeholder="Honda RC150"
            className={INPUT}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 min-[881px]:grid-cols-[1fr_1fr_1.2fr_1fr]">
        <Field
          htmlFor="quantity"
          label="Quantity"
          required
          error={errors.quantity}
          errorTestId="line-item-section-quantity-error"
        >
          <Input
            id="quantity"
            data-testid="line-item-section-quantity"
            type="number"
            value={form.quantity}
            onChange={onField("quantity")}
            placeholder="1"
            className={`${INPUT} font-mono`}
            aria-invalid={Boolean(errors.quantity)}
          />
        </Field>

        <Field
          htmlFor="rate"
          label="Rate"
          required
          error={errors.rate}
          errorTestId="line-item-section-rate-error"
        >
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-semibold">
              {symbol}
            </span>
            <Input
              id="rate"
              data-testid="line-item-section-rate"
              type="number"
              value={form.rate}
              onChange={onField("rate")}
              placeholder="1000"
              className={`${INPUT} pl-7 font-mono`}
              aria-invalid={Boolean(errors.rate)}
            />
          </div>
        </Field>

        <Field htmlFor="itemUOM" label="Unit of measure">
          <Input
            id="itemUOM"
            data-testid="line-item-section-item-uom"
            value={form.itemUOM}
            onChange={onField("itemUOM")}
            placeholder="KG"
            className={INPUT}
          />
        </Field>

        <Field htmlFor="lineTotal" label="Line total">
          <div
            id="lineTotal"
            data-testid="line-item-section-line-total"
            className="border-input bg-muted text-foreground flex h-11 items-center rounded-lg border px-3.5 font-mono text-sm font-bold"
          >
            {formatMoney(totals.subtotal, form.currency)}
          </div>
        </Field>
      </div>
    </SectionCard>
  );
}

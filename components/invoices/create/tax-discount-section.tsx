import type { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Field } from "@/components/invoices/create/field";
import { SectionCard } from "@/components/invoices/create/section-card";
import { currencySymbol } from "@/lib/format";
import type { InvoiceFormValues } from "@/types/invoice";

const INPUT = "h-11 rounded-lg bg-card font-mono";

export function TaxDiscountSection({
  form,
  onField,
}: {
  form: InvoiceFormValues;
  onField: (
    key: keyof InvoiceFormValues,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  const symbol = currencySymbol(form.currency);

  return (
    <SectionCard step={5} title="Tax & discount">
      <div className="grid grid-cols-1 gap-4 min-[881px]:grid-cols-2">
        <Field htmlFor="taxRate" label="Tax (added)">
          <div className="relative">
            <Input
              id="taxRate"
              type="number"
              value={form.taxRate}
              onChange={onField("taxRate")}
              placeholder="10"
              className={`${INPUT} pr-9`}
            />
            <span className="text-muted-foreground absolute top-1/2 right-3.5 -translate-y-1/2 text-sm font-semibold">
              %
            </span>
          </div>
        </Field>

        <Field htmlFor="discountValue" label="Discount (deducted)">
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-3.5 -translate-y-1/2 text-sm font-semibold">
              {symbol}
            </span>
            <Input
              id="discountValue"
              type="number"
              value={form.discountValue}
              onChange={onField("discountValue")}
              placeholder="10"
              className={`${INPUT} pl-7`}
            />
          </div>
        </Field>
      </div>
    </SectionCard>
  );
}

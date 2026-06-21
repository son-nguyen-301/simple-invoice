import type { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Field } from "@/components/invoices/create/field";
import { SectionCard } from "@/components/invoices/create/section-card";
import type { InvoiceFormValues } from "@/types/invoice";

const INPUT = "h-11 rounded-lg bg-card";

export function BankAccountSection({
  form,
  onField,
}: {
  form: InvoiceFormValues;
  onField: (
    key: keyof InvoiceFormValues,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <SectionCard step={3} title="Bank account">
      <div className="grid grid-cols-1 gap-4 min-[881px]:grid-cols-3">
        <Field htmlFor="accountName" label="Account name">
          <Input
            id="accountName"
            data-testid="bank-account-section-account-name"
            value={form.accountName}
            onChange={onField("accountName")}
            placeholder="John Terry"
            className={INPUT}
          />
        </Field>

        <Field htmlFor="accountNumber" label="Account number">
          <Input
            id="accountNumber"
            data-testid="bank-account-section-account-number"
            value={form.accountNumber}
            onChange={onField("accountNumber")}
            placeholder="12345678"
            className={`${INPUT} font-mono`}
          />
        </Field>

        <Field htmlFor="sortCode" label="Sort code">
          <Input
            id="sortCode"
            data-testid="bank-account-section-sort-code"
            value={form.sortCode}
            onChange={onField("sortCode")}
            placeholder="09-01-01"
            className={`${INPUT} font-mono`}
          />
        </Field>
      </div>
    </SectionCard>
  );
}

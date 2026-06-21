"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type SyntheticEvent } from "react";

import { BankAccountSection } from "@/components/invoices/create/bank-account-section";
import { CustomerSection } from "@/components/invoices/create/customer-section";
import { InvoiceDetailsSection } from "@/components/invoices/create/invoice-details-section";
import { InvoiceSummary } from "@/components/invoices/create/invoice-summary";
import { LineItemSection } from "@/components/invoices/create/line-item-section";
import { TaxDiscountSection } from "@/components/invoices/create/tax-discount-section";
import { useCreateInvoice } from "@/hooks/use-create-invoice";
import { computeErrors, EMPTY_FORM } from "@/lib/invoices/create-schema";
import { computeTotals } from "@/lib/invoices/totals";
import type { Currency, InvoiceFormValues } from "@/types/invoice";

export function CreateInvoiceForm() {
  const router = useRouter();
  const mutation = useCreateInvoice();
  const [form, setForm] = useState<InvoiceFormValues>(EMPTY_FORM);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const errors = submitAttempted ? computeErrors(form) : {};
  const totals = computeTotals(form);
  const hasErrors = submitAttempted && Object.keys(errors).length > 0;

  const onField =
    (key: keyof InvoiceFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;

      setForm((current) => ({ ...current, [key]: value }));
    };

  const onCurrency = (value: Currency) => {
    setForm((current) => ({ ...current, currency: value }));
  };

  const onCountry = (value: string) => {
    setForm((current) => ({ ...current, countryCode: value }));
  };

  const onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    setSubmitAttempted(true);

    const found = computeErrors(form);

    if (Object.keys(found).length > 0) {
      return;
    }

    mutation.mutate(form);
  };

  const onCancel = () => {
    router.push("/");
  };

  return (
    <div className="flex-1 px-5 py-7 min-[881px]:px-8">
      <div className="text-subtle-foreground mb-3.5 flex items-center gap-2 text-[13px] font-semibold">
        <button
          type="button"
          onClick={onCancel}
          className="hover:text-primary cursor-pointer"
        >
          Invoices
        </button>
        <ChevronRight className="text-muted-foreground size-3.5" />
        <span className="text-foreground">New invoice</span>
      </div>

      <div className="mb-6">
        <h1 className="text-foreground text-[25px] font-extrabold tracking-tight">
          Create invoice
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Fill in the details below. Fields marked{" "}
          <span className="text-destructive">*</span> are required.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        noValidate
        className="grid grid-cols-1 items-start gap-6 min-[1101px]:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="flex min-w-0 flex-col gap-[18px]">
          <InvoiceDetailsSection
            form={form}
            errors={errors}
            onField={onField}
            onCurrency={onCurrency}
          />
          <CustomerSection
            form={form}
            errors={errors}
            onField={onField}
            onCountry={onCountry}
          />
          <BankAccountSection form={form} onField={onField} />
          <LineItemSection
            form={form}
            errors={errors}
            onField={onField}
            totals={totals}
          />
          <TaxDiscountSection form={form} onField={onField} />
        </div>

        <InvoiceSummary
          form={form}
          totals={totals}
          hasErrors={hasErrors}
          pending={mutation.isPending}
          onCancel={onCancel}
        />
      </form>
    </div>
  );
}

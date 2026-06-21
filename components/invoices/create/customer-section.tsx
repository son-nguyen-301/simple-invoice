import type { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { CountrySelect } from "@/components/invoices/create/country-select";
import { Field } from "@/components/invoices/create/field";
import { SectionCard } from "@/components/invoices/create/section-card";
import type { FieldErrors, InvoiceFormValues } from "@/types/invoice";

const INPUT = "h-11 rounded-lg bg-card";

export function CustomerSection({
  form,
  errors,
  onField,
  onCountry,
}: {
  form: InvoiceFormValues;
  errors: FieldErrors;
  onField: (
    key: keyof InvoiceFormValues,
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onCountry: (value: string) => void;
}) {
  return (
    <SectionCard step={2} title="Customer">
      <div className="grid grid-cols-1 gap-4 min-[881px]:grid-cols-2">
        <Field
          htmlFor="firstName"
          label="First name"
          required
          error={errors.firstName}
        >
          <Input
            id="firstName"
            value={form.firstName}
            onChange={onField("firstName")}
            placeholder="Nguyen"
            className={INPUT}
            aria-invalid={Boolean(errors.firstName)}
          />
        </Field>

        <Field
          htmlFor="lastName"
          label="Last name"
          required
          error={errors.lastName}
        >
          <Input
            id="lastName"
            value={form.lastName}
            onChange={onField("lastName")}
            placeholder="Dung"
            className={INPUT}
            aria-invalid={Boolean(errors.lastName)}
          />
        </Field>

        <Field htmlFor="email" label="Email" required error={errors.email}>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={onField("email")}
            placeholder="name@company.com"
            className={INPUT}
            aria-invalid={Boolean(errors.email)}
          />
        </Field>

        <Field
          htmlFor="mobile"
          label="Mobile number"
          required
          error={errors.mobile}
        >
          <Input
            id="mobile"
            value={form.mobile}
            onChange={onField("mobile")}
            placeholder="+6597594971"
            className={INPUT}
            aria-invalid={Boolean(errors.mobile)}
          />
        </Field>
      </div>

      <div className="bg-border/70 my-5 h-px" />
      <div className="text-muted-foreground mb-3.5 text-[12px] font-bold tracking-[0.05em] uppercase">
        Billing address
      </div>

      <div className="grid grid-cols-1 gap-4 min-[881px]:grid-cols-2">
        <Field htmlFor="premise" label="Premise">
          <Input
            id="premise"
            value={form.premise}
            onChange={onField("premise")}
            placeholder="CT11"
            className={INPUT}
          />
        </Field>

        <Field htmlFor="city" label="City">
          <Input
            id="city"
            value={form.city}
            onChange={onField("city")}
            placeholder="Hanoi"
            className={INPUT}
          />
        </Field>

        <Field htmlFor="county" label="County">
          <Input
            id="county"
            value={form.county}
            onChange={onField("county")}
            placeholder="Hoang Mai"
            className={INPUT}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field htmlFor="postcode" label="Postcode">
            <Input
              id="postcode"
              value={form.postcode}
              onChange={onField("postcode")}
              placeholder="1000"
              className={INPUT}
            />
          </Field>

          <Field htmlFor="countryCode" label="Country">
            <CountrySelect
              id="countryCode"
              value={form.countryCode}
              onChange={onCountry}
            />
          </Field>
        </div>
      </div>
    </SectionCard>
  );
}

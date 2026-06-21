import { AlertCircle, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/format";
import type { InvoiceFormValues, InvoiceTotals } from "@/types/invoice";

export function InvoiceSummary({
  form,
  totals,
  hasErrors,
  pending,
  onCancel,
}: {
  form: InvoiceFormValues;
  totals: InvoiceTotals;
  hasErrors: boolean;
  pending: boolean;
  onCancel: () => void;
}) {
  const quantity = parseFloat(form.quantity) || 0;
  const rate = parseFloat(form.rate) || 0;

  return (
    <div className="flex flex-col gap-4 min-[1101px]:sticky min-[1101px]:top-6">
      <div className="bg-ink shadow-panel rounded-2xl p-6 text-white">
        <div className="text-on-ink-accent mb-[18px] text-[12px] font-bold tracking-[0.1em] uppercase">
          Invoice summary
        </div>

        <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
          <div className="min-w-0">
            <div className="truncate text-[15px] font-bold text-white">
              {form.itemName || "Line item"}
            </div>
            <div className="text-on-ink-muted mt-0.5 text-[12.5px] font-medium">
              {quantity} x {formatMoney(rate, form.currency)}
            </div>
          </div>
          <div className="font-mono text-[14.5px] font-bold whitespace-nowrap text-white">
            {formatMoney(totals.subtotal, form.currency)}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-b border-white/10 py-4">
          <div className="flex justify-between text-[13.5px] font-medium">
            <span className="text-on-ink-muted">Subtotal</span>
            <span className="font-mono text-white/90">
              {formatMoney(totals.subtotal, form.currency)}
            </span>
          </div>
          <div className="flex justify-between text-[13.5px] font-medium">
            <span className="text-on-ink-muted">Discount</span>
            <span className="text-on-ink-neg font-mono">
              - {formatMoney(totals.discount, form.currency)}
            </span>
          </div>
          <div className="flex justify-between text-[13.5px] font-medium">
            <span className="text-on-ink-muted">
              Tax ({parseFloat(form.taxRate) || 0}%)
            </span>
            <span className="text-on-ink-pos font-mono">
              + {formatMoney(totals.tax, form.currency)}
            </span>
          </div>
        </div>

        <div className="flex items-baseline justify-between pt-4">
          <span className="text-[15px] font-bold text-white">Total due</span>
          <span className="font-mono text-[26px] font-extrabold tracking-tight text-white">
            {formatMoney(totals.total, form.currency)}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="bg-primary hover:bg-primary-hover h-[50px] w-full rounded-xl text-[15.5px] font-bold text-white"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Creating...
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            Create invoice
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="h-[46px] w-full rounded-xl text-[14.5px] font-bold"
      >
        Cancel
      </Button>

      {hasErrors ? (
        <div className="bg-destructive/10 border-destructive/30 flex items-start gap-2.5 rounded-xl border p-3.5">
          <AlertCircle
            className="text-destructive mt-0.5 size-4 flex-none"
            aria-hidden="true"
          />
          <div className="text-destructive text-[13px] font-semibold">
            Please fix the highlighted fields before submitting.
          </div>
        </div>
      ) : null}
    </div>
  );
}

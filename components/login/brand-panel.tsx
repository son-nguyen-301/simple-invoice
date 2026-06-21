import { Check } from "lucide-react";

const FEATURES = [
  "Secure server-side token handling",
  "Search, filter & sort across all invoices",
  "Live totals with tax & discounts",
];

export function BrandPanel() {
  return (
    <aside className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,#0e1a2b_0%,#13294a_60%,#1d3a6b_100%)] p-14 text-white min-[881px]:flex">
      <div className="pointer-events-none absolute -top-[120px] -right-[120px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,.28),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-[100px] -left-[80px] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,.2),transparent_70%)]" />

      <div className="relative flex items-center gap-3">
        <div className="shadow-btn flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-[linear-gradient(135deg,#2563eb,#3b82f6)]">
          <div className="h-[18px] w-[15px] rounded-[2px] bg-white" />
        </div>
        <span className="text-[19px] font-extrabold tracking-tight">
          SimpleInvoice
        </span>
      </div>

      <div className="relative">
        <div className="text-on-ink-accent mb-5 text-[13px] font-bold tracking-[0.14em] uppercase">
          Invoicing, simplified
        </div>
        <p className="mb-[18px] max-w-[460px] text-[40px] leading-[1.1] font-extrabold tracking-tight">
          Create, send and track invoices in one place.
        </p>
        <p className="text-on-ink-muted max-w-[400px] text-base leading-relaxed">
          Issue professional invoices in seconds, manage your customers, and
          keep every payment organised - built for modern teams.
        </p>
        <ul className="mt-[34px] flex flex-col gap-[14px]">
          {FEATURES.map((feature) => (
            <li
              key={feature}
              className="text-on-ink-muted flex items-center gap-3 text-[15px]"
            >
              <span className="inline-flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[rgba(59,130,246,.22)]">
                <Check className="text-on-ink-accent h-3 w-3" strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-sidebar-foreground relative text-[13px]">
        (c) 2026 SimpleInvoice | 101 Digital
      </div>
    </aside>
  );
}

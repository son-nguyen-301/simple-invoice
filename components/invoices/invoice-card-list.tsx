// components/invoices/invoice-card-list.tsx
import { CustomerCell } from "@/components/invoices/customer-cell";
import { StatusPill } from "@/components/invoices/status-pill";
import { Card, CardContent } from "@/components/ui/card";
import type { InvoiceRow } from "@/types/invoice-list";
import { formatDate, formatMoney } from "@/lib/format";

export function InvoiceCardList({ rows }: { rows: InvoiceRow[] }) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <Card key={row.id} className="rounded-xl">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span
                data-testid={`invoice-row-${row.number}`}
                className="text-primary font-mono text-[13px] font-semibold tabular-nums"
              >
                {row.number}
              </span>
              <StatusPill status={row.status} />
            </div>
            <div className="mb-3.5">
              <CustomerCell name={row.customerName} email={row.email} />
            </div>
            <div className="border-divider flex items-end justify-between border-t pt-3">
              <div className="text-subtle-foreground text-[11.5px] font-medium">
                <div className="mb-0.5">Due {formatDate(row.due)}</div>
                <div>Issued {formatDate(row.issued)}</div>
              </div>
              <div className="text-foreground font-mono text-lg font-extrabold tabular-nums">
                {formatMoney(row.amount, row.currency)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

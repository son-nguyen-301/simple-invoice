// components/invoices/invoice-table.tsx
import { CustomerCell } from "@/components/invoices/customer-cell";
import { StatusPill } from "@/components/invoices/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InvoiceRow } from "@/types/invoice-list";
import { formatDate, formatMoney } from "@/lib/format";

const HEAD_CLASS =
  "text-subtle-foreground text-[11.5px] font-bold tracking-[0.06em] uppercase";

export function InvoiceTable({ rows }: { rows: InvoiceRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted hover:bg-muted">
          <TableHead className={HEAD_CLASS}>Invoice</TableHead>
          <TableHead className={HEAD_CLASS}>Customer</TableHead>
          <TableHead className={HEAD_CLASS}>Issued</TableHead>
          <TableHead className={HEAD_CLASS}>Due</TableHead>
          <TableHead className={`${HEAD_CLASS} text-right`}>Amount</TableHead>
          <TableHead className={`${HEAD_CLASS} text-center`}>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} className="hover:bg-muted/60">
            <TableCell
              data-testid={`invoice-row-${row.number}`}
              className="text-primary font-mono text-[13.5px] font-semibold tabular-nums"
            >
              {row.number}
            </TableCell>
            <TableCell>
              <CustomerCell name={row.customerName} email={row.email} />
            </TableCell>
            <TableCell className="text-muted-foreground text-[13.5px]">
              {formatDate(row.issued)}
            </TableCell>
            <TableCell className="text-muted-foreground text-[13.5px]">
              {formatDate(row.due)}
            </TableCell>
            <TableCell className="text-foreground text-right font-mono text-sm font-bold tabular-nums">
              {formatMoney(row.amount, row.currency)}
            </TableCell>
            <TableCell className="text-center">
              <StatusPill status={row.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

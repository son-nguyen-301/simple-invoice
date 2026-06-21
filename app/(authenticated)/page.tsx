import { Suspense } from "react";

import { InvoiceList } from "@/components/invoices/invoice-list";
import { ListSkeleton } from "@/components/invoices/list-skeleton";

export default function Home() {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <InvoiceList />
    </Suspense>
  );
}

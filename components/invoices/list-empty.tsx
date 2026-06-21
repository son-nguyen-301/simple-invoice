import { Search } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function ListEmpty({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="flex flex-col items-center gap-5 px-6 py-[72px] text-center">
      <div className="bg-accent flex size-16 items-center justify-center rounded-2xl">
        <Search className="text-primary size-7" />
      </div>
      <div>
        <h3 className="text-foreground text-lg font-extrabold">
          No invoices found
        </h3>
        <p className="text-muted-foreground mx-auto mt-2 max-w-[340px] text-sm leading-relaxed">
          We couldn&apos;t find any invoices matching your search and filters.
          Try adjusting them, or create a new invoice.
        </p>
      </div>
      <div className="flex gap-2.5">
        <Button variant="outline" onClick={onClearFilters}>
          Clear filters
        </Button>
        <Button asChild>
          <Link href="/create">Create invoice</Link>
        </Button>
      </div>
    </div>
  );
}

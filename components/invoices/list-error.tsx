import { TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ListError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
      <div className="bg-destructive-muted flex size-16 items-center justify-center rounded-2xl">
        <TriangleAlert className="text-destructive size-7" />
      </div>
      <div>
        <h3 className="text-foreground text-lg font-extrabold">
          Something went wrong
        </h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          We couldn&apos;t load your invoices. Please try again.
        </p>
      </div>
      <Button onClick={onRetry}>Try again</Button>
    </div>
  );
}

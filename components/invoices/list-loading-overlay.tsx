import { Loader2 } from "lucide-react";

export function ListLoadingOverlay() {
  return (
    <div
      role="status"
      data-testid="list-loading-overlay"
      className="bg-card/60 absolute inset-0 flex items-center justify-center"
    >
      <Loader2 className="text-primary size-6 motion-safe:animate-spin" />
      <span className="sr-only">Loading invoices</span>
    </div>
  );
}

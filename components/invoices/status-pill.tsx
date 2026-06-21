import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-status-paid-bg text-status-paid",
  due: "bg-status-pending-bg text-status-pending",
  overdue: "bg-status-overdue-bg text-status-overdue",
  cancelled: "bg-status-draft-bg text-status-draft",
  rejected: "bg-status-overdue-bg text-status-overdue",
  draft: "bg-status-draft-bg text-status-draft",
};

export function StatusPill({ status }: { status: string }) {
  const key = status.toLowerCase();
  const styles = STATUS_STYLES[key] ?? STATUS_STYLES.draft;
  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <Badge
      className={cn(
        "gap-1.5 rounded-full border-0 px-2.5 py-1 text-[11.5px] font-bold",
        styles,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </Badge>
  );
}

// components/app-shell/nav-item.tsx
import Link from "next/link";
import type { ComponentType } from "react";

import { cn } from "@/lib/utils";

type NavItemProps = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active?: boolean;
  disabled?: boolean;
};

export function NavItem({
  href,
  label,
  icon: Icon,
  active = false,
  disabled = false,
}: NavItemProps) {
  const base =
    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14.5px]";

  if (disabled) {
    return (
      <div
        aria-disabled="true"
        className={cn(base, "text-sidebar-foreground/70 cursor-not-allowed")}
      >
        <Icon className="size-[18px]" />
        {label}
      </div>
    );
  }

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        base,
        active
          ? "bg-sidebar-accent font-bold text-white"
          : "text-sidebar-foreground font-medium hover:bg-white/5 hover:text-white",
      )}
    >
      {active ? (
        <span className="bg-sidebar-ring absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-full" />
      ) : null}
      <Icon className="size-[18px]" />
      {label}
    </Link>
  );
}

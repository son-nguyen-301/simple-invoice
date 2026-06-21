// components/app-shell/sidebar.tsx
"use client";

import { FileText, LayoutGrid, Plus, SquarePen, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/app-shell/logout-button";
import { NavItem } from "@/components/app-shell/nav-item";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-sidebar sticky top-0 hidden h-screen w-[248px] flex-none flex-col text-white min-[881px]:flex">
      <div className="flex items-center gap-2.5 border-b border-white/[0.07] px-5 py-5">
        <div className="from-primary flex size-[34px] flex-none items-center justify-center rounded-[9px] bg-gradient-to-br to-blue-500">
          <div className="h-4 w-[13px] rounded-[2px] bg-white" />
        </div>
        <span className="text-[17px] font-extrabold tracking-tight">
          SimpleInvoice
        </span>
      </div>

      <div className="flex-1 p-3.5">
        <Link
          href="/create"
          className="bg-primary hover:bg-primary-hover mb-5 flex h-[42px] items-center justify-center gap-2 rounded-[9px] text-sm font-bold text-white"
        >
          <Plus className="size-4" />
          New invoice
        </Link>

        <div className="text-sidebar-foreground/80 px-2.5 pb-2 text-[11px] font-bold tracking-[0.13em] uppercase">
          Workspace
        </div>

        <div className="flex flex-col gap-0.5">
          <NavItem href="#" label="Overview" icon={LayoutGrid} disabled />
          <NavItem
            href="/"
            label="Invoices"
            icon={FileText}
            active={pathname === "/"}
          />
          <NavItem
            href="/create"
            label="Create invoice"
            icon={SquarePen}
            active={pathname === "/create"}
          />
          <NavItem href="#" label="Customers" icon={Users} disabled />
        </div>
      </div>

      <div className="border-t border-white/[0.07] p-3.5">
        <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
          <div className="flex size-[34px] flex-none items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-400 text-[13px] font-bold text-white">
            SI
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13.5px] font-bold text-white">
              SimpleInvoice
            </div>
            <div className="text-sidebar-foreground text-xs font-medium">
              Workspace
            </div>
          </div>
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}

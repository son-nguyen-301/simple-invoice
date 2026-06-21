// components/app-shell/mobile-topbar.tsx
import Link from "next/link";

export function MobileTopbar() {
  return (
    <div className="bg-sidebar flex items-center justify-between px-4 py-3.5 text-white min-[881px]:hidden">
      <div className="flex items-center gap-2.5">
        <div className="from-primary flex size-[30px] items-center justify-center rounded-lg bg-gradient-to-br to-blue-500">
          <div className="h-3.5 w-3 rounded-[2px] bg-white" />
        </div>
        <span className="text-base font-extrabold">SimpleInvoice</span>
      </div>
      <Link
        href="/create"
        className="bg-primary flex h-[34px] items-center rounded-lg px-3 text-[13px] font-bold text-white"
      >
        + New
      </Link>
    </div>
  );
}

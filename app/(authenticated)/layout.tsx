// app/(authenticated)/layout.tsx
import { MobileTopbar } from "@/components/app-shell/mobile-topbar";
import { Sidebar } from "@/components/app-shell/sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar />
        {children}
      </main>
    </div>
  );
}

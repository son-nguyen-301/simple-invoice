// components/app-shell/logout-button.tsx
"use client";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.assign("/login");
  }

  return (
    <button
      type="button"
      aria-label="Log out"
      onClick={handleLogout}
      className="text-sidebar-foreground hover:text-white"
    >
      <LogOut className="size-[17px]" />
    </button>
  );
}

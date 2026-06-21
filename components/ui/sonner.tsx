"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "!bg-card !text-foreground !border !border-border !rounded-[13px] !shadow-panel !font-sans",
          title: "!font-extrabold !text-[14.5px]",
          description: "!text-muted-foreground !text-[13px]",
          success: "[&_[data-icon]]:!text-status-paid",
          error: "[&_[data-icon]]:!text-destructive",
        },
      }}
      {...props}
    />
  );
}

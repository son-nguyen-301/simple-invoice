import { AlertCircle } from "lucide-react";

export function ErrorText({ message }: { message: string }) {
  return (
    <p className="text-destructive mt-[7px] flex items-center gap-1.5 text-[12.5px] font-semibold">
      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
      {message}
    </p>
  );
}

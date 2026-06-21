import { Label } from "@/components/ui/label";
import { ErrorText } from "@/components/forms/error-text";

export function Field({
  htmlFor,
  label,
  required,
  error,
  children,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label
        htmlFor={htmlFor}
        className="text-subtle-foreground mb-[7px] block text-[13px] font-semibold"
      >
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? <ErrorText message={error} /> : null}
    </div>
  );
}

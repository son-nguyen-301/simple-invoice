import { BrandPanel } from "@/components/login/brand-panel";
import { LoginForm } from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen">
      <BrandPanel />

      <div className="flex flex-1 items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-full min-[881px]:w-[400px]">
          <div className="mb-7 min-[881px]:hidden">
            <div className="inline-flex items-center gap-[11px]">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#2563eb,#3b82f6)]">
                <div className="h-[17px] w-[14px] rounded-[2px] bg-white" />
              </div>
              <span className="text-ink text-[18px] font-extrabold">
                SimpleInvoice
              </span>
            </div>
          </div>

          <h1 className="text-ink text-[27px] font-extrabold tracking-tight">
            Sign in
          </h1>
          <p className="text-muted-foreground mt-2 mb-7 text-[15px]">
            Welcome back. Enter your credentials to continue.
          </p>

          <LoginForm />

          <p className="text-subtle-foreground mt-[22px] text-center text-[13.5px] font-medium">
            Sandbox environment | credentials handled server-side
          </p>
        </div>
      </div>
    </div>
  );
}

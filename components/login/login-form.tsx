"use client";

import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { z } from "zod";

import { loginSchema } from "@/lib/auth/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorText } from "@/components/forms/error-text";

type FieldErrors = { username?: string; password?: string };

const GENERIC_ERROR = "Something went wrong. Please try again.";

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setFormError(null);

    const parsed = loginSchema.safeParse({ username, password });

    if (!parsed.success) {
      const flat = z.flattenError(parsed.error).fieldErrors;

      setFieldErrors({
        username: flat.username?.length ? "Username is required" : undefined,
        password: flat.password?.length ? "Password is required" : undefined,
      });

      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, remember }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();

        return;
      }

      setFormError(
        res.status === 401 ? "Invalid username or password." : GENERIC_ERROR,
      );
    } catch {
      setFormError(GENERIC_ERROR);
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div>
        <Label
          htmlFor="username"
          className="text-foreground mb-[7px] block text-[13px] font-semibold"
        >
          Username
        </Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setFormError(null);
            setFieldErrors((prev) => ({ ...prev, username: undefined }));
          }}
          placeholder="e.g. 94756921275"
          autoComplete="username"
          disabled={isSubmitting}
          aria-invalid={Boolean(fieldErrors.username)}
          className="bg-card h-11 rounded-lg"
        />
        {fieldErrors.username && <ErrorText message={fieldErrors.username} />}
      </div>

      <div className="mt-[18px]">
        <Label
          htmlFor="password"
          className="text-foreground mb-[7px] block text-[13px] font-semibold"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setFormError(null);
            setFieldErrors((prev) => ({ ...prev, password: undefined }));
          }}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isSubmitting}
          aria-invalid={Boolean(fieldErrors.password)}
          className="bg-card h-11 rounded-lg"
        />
        {fieldErrors.password && <ErrorText message={fieldErrors.password} />}
      </div>

      <div className="mt-4 mb-6 flex items-center justify-between">
        <label className="text-foreground flex cursor-pointer items-center gap-2 text-[13.5px] font-medium">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(value) => setRemember(value === true)}
          />
          Remember me
        </label>
        <a href="#" className="text-primary text-[13.5px] font-semibold">
          Forgot password?
        </a>
      </div>

      {formError && (
        <div className="mb-3">
          <ErrorText message={formError} />
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-primary-foreground shadow-btn hover:bg-primary-hover h-12 w-full rounded-lg text-[15.5px] font-bold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>
    </form>
  );
}

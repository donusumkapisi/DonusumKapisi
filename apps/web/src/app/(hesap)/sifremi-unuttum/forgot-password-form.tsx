"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { GlowInput } from "@/components/ui/glow-input";
import { Label } from "@/components/ui/label";
import { ShineButton } from "@/components/ui/shine-button";
import { forgotPasswordAction } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("auth");
  return (
    <ShineButton type="submit" disabled={pending}>
      {pending ? t("forgotButtonPending") : t("forgotButton")}
    </ShineButton>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, null);
  const t = useTranslations("auth");

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs font-medium tracking-wide text-ink-muted">
          {t("emailLabel")}
        </Label>
        <GlowInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t("emailPlaceholder")}
        />
      </div>

      {state?.error ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/25 bg-danger/8 px-3.5 py-3 text-sm text-danger"
        >
          {state.error}
        </div>
      ) : null}

      {state?.success ? (
        <div
          role="status"
          className="rounded-xl border border-clay/25 bg-clay/8 px-3.5 py-3 text-sm text-ink"
        >
          {state.success}{" "}
          <Link
            href="/sifre-sifirla"
            className="font-medium text-clay underline-offset-4 hover:underline"
          >
            {t("resetTitle")}
          </Link>
        </div>
      ) : null}

      <div className="pt-1">
        <SubmitButton />
      </div>
    </form>
  );
}

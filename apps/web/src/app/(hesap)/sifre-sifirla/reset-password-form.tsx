"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { GlowInput } from "@/components/ui/glow-input";
import { Label } from "@/components/ui/label";
import { ShineButton } from "@/components/ui/shine-button";
import { resetPasswordAction } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("auth");
  return (
    <ShineButton type="submit" disabled={pending}>
      {pending ? t("resetButtonPending") : t("resetButton")}
    </ShineButton>
  );
}

export function ResetPasswordForm() {
  const [state, formAction] = useActionState(resetPasswordAction, null);
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

      <div className="space-y-2">
        <Label htmlFor="code" className="text-xs font-medium tracking-wide text-ink-muted">
          {t("resetCodeLabel")}
        </Label>
        <GlowInput
          id="code"
          name="code"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={6}
          placeholder="000000"
          className="tracking-[0.35em]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-xs font-medium tracking-wide text-ink-muted">
          {t("resetPasswordLabel")}
        </Label>
        <GlowInput
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="••••••••"
        />
        <p className="text-[0.7rem] leading-relaxed text-ink-muted/75">{t("passwordHint")}</p>
      </div>

      {state?.error ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/25 bg-danger/8 px-3.5 py-3 text-sm text-danger"
        >
          {state.error}
        </div>
      ) : null}

      <div className="pt-1">
        <SubmitButton />
      </div>
    </form>
  );
}

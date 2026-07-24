"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { GlowInput } from "@/components/ui/glow-input";
import { Label } from "@/components/ui/label";
import { ShineButton } from "@/components/ui/shine-button";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { logInAction } from "@/lib/actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("auth");
  return (
    <ShineButton type="submit" disabled={pending}>
      {pending ? t("loginButtonPending") : t("loginButton")}
    </ShineButton>
  );
}

export function LogInForm({
  googleClientId,
  appleClientId,
}: {
  googleClientId?: string;
  appleClientId?: string;
}) {
  const [state, formAction] = useActionState(logInAction, null);
  const [socialError, setSocialError] = useState("");
  const t = useTranslations("auth");
  const error = socialError || state?.error;

  return (
    <div>
      <SocialAuthButtons
        mode="login"
        googleClientId={googleClientId}
        appleClientId={appleClientId}
        onError={setSocialError}
      />

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
            placeholder="ornek@email.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password" className="text-xs font-medium tracking-wide text-ink-muted">
              {t("passwordLabel")}
            </Label>
            <Link
              href="/sifremi-unuttum"
              className="text-xs font-medium text-clay underline-offset-4 hover:underline"
            >
              {t("forgotLink")}
            </Link>
          </div>
          <GlowInput
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-xl border border-danger/25 bg-danger/8 px-3.5 py-3 text-sm text-danger"
          >
            {error}
          </div>
        ) : null}

        <div className="pt-1">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

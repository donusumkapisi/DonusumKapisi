"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { Building2, Handshake, Check } from "lucide-react";
import { GlowInput } from "@/components/ui/glow-input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShineButton } from "@/components/ui/shine-button";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { cn } from "@/lib/utils";
import { signUpAction } from "@/lib/actions/auth";

type Role = "HOMEOWNER" | "CONTRACTOR";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("auth");
  return (
    <ShineButton type="submit" disabled={pending}>
      {pending ? t("signUpButtonPending") : t("signUpButton")}
    </ShineButton>
  );
}

export function SignUpForm({
  defaultRole,
  googleClientId,
  appleClientId,
}: {
  defaultRole: Role;
  googleClientId?: string;
  appleClientId?: string;
}) {
  const [state, formAction] = useActionState(signUpAction, null);
  const [role, setRole] = useState<Role>(defaultRole);
  const [socialError, setSocialError] = useState("");
  const t = useTranslations("auth");
  const error = socialError || state?.error;

  const roleOptions: {
    value: Role;
    title: string;
    body: string;
    icon: typeof Building2;
  }[] = [
    {
      value: "HOMEOWNER",
      title: t("roleHomeownerTitle"),
      body: t("roleHomeownerBody"),
      icon: Building2,
    },
    {
      value: "CONTRACTOR",
      title: t("roleContractorTitle"),
      body: t("roleContractorBody"),
      icon: Handshake,
    },
  ];

  return (
    <div>
      <div className="mb-5 space-y-2.5">
        <Label className="text-xs font-medium tracking-wide text-ink-muted">
          {t("accountTypeLabel")}
        </Label>
        <RadioGroup
          name="role-ui"
          value={role}
          onValueChange={(value) => setRole(value as Role)}
          className="grid gap-2.5"
        >
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const selected = role === option.value;
            return (
              <label
                key={option.value}
                htmlFor={`role-${option.value}`}
                className={cn(
                  "relative flex cursor-pointer items-start gap-3.5 rounded-xl border p-3.5 transition-all",
                  selected
                    ? "border-clay/50 bg-clay/[0.06] shadow-[0_0_0_1px_color-mix(in_oklch,var(--clay)_20%,transparent)]"
                    : "border-hairline bg-surface/40 hover:border-clay/30 hover:bg-surface/70"
                )}
              >
                <RadioGroupItem
                  id={`role-${option.value}`}
                  value={option.value}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                    selected ? "bg-clay text-white" : "bg-paper text-ink-muted"
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">{option.title}</span>
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full border transition-colors",
                        selected
                          ? "border-clay bg-clay text-white"
                          : "border-hairline bg-paper"
                      )}
                    >
                      {selected ? <Check className="size-3" strokeWidth={3} /> : null}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-muted">
                    {option.body}
                  </span>
                </span>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      <SocialAuthButtons
        mode="signup"
        role={role}
        googleClientId={googleClientId}
        appleClientId={appleClientId}
        onError={setSocialError}
      />

      <form action={formAction} className="mt-5 space-y-5">
        <input type="hidden" name="role" value={role} />

        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs font-medium tracking-wide text-ink-muted">
            {t("nameLabel")}
          </Label>
          <GlowInput
            id="name"
            name="name"
            autoComplete="name"
            required
            placeholder={t("namePlaceholder")}
          />
        </div>

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
          <Label htmlFor="password" className="text-xs font-medium tracking-wide text-ink-muted">
            {t("passwordLabel")}
          </Label>
          <GlowInput
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="••••••••"
          />
          <p className="text-[0.7rem] leading-relaxed text-ink-muted/75">{t("passwordHint")}</p>
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

        <p className="text-center text-[0.7rem] leading-relaxed text-ink-muted/70">
          {t("signUpLegal")}
        </p>
      </form>
    </div>
  );
}

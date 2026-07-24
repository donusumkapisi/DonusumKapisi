"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import { BellRing } from "lucide-react";
import type { NotificationPreferencesDTO } from "@donusum-kapisi/shared";
import { Button } from "@/components/ui/button";
import {
  updateNotificationPreferencesAction,
  type NotificationPreferencesActionState,
} from "@/lib/actions/notification-preferences";

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("common");
  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending}>
      {pending ? t("saving") : t("save")}
    </Button>
  );
}

export function NotificationPreferencesForm({
  preferences,
}: {
  preferences: NotificationPreferencesDTO;
}) {
  const [state, formAction] = useActionState<NotificationPreferencesActionState, FormData>(
    updateNotificationPreferencesAction,
    null
  );
  const t = useTranslations("panel");

  const options: { key: keyof NotificationPreferencesDTO; label: string }[] = [
    { key: "notifyListingStatus", label: t("notificationPrefListingStatus") },
    { key: "notifyOffers", label: t("notificationPrefOffers") },
    { key: "notifyAppointments", label: t("notificationPrefAppointments") },
    { key: "notifySavedSearch", label: t("notificationPrefSavedSearch") },
  ];

  return (
    <form
      action={formAction}
      className="space-y-1.5 rounded-2xl border border-hairline bg-paper p-4 shadow-[0_1px_2px_rgb(22_52_73_/_0.04)]"
    >
      {options.map((option) => (
        <label
          key={option.key}
          className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-surface/50"
        >
          <span className="flex items-center gap-2.5 text-sm text-ink">
            <BellRing className="size-4 shrink-0 text-ink-muted" />
            {option.label}
          </span>
          <span className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-hairline transition-colors has-[:checked]:bg-clay">
            <input
              type="checkbox"
              name={option.key}
              defaultChecked={preferences[option.key]}
              className="peer sr-only"
            />
            <span className="pointer-events-none absolute left-1 size-4 rounded-full bg-paper shadow-sm transition-transform peer-checked:translate-x-5" />
          </span>
        </label>
      ))}

      <div className="flex items-center justify-between gap-3 pt-2">
        {state && "success" in state && <p className="text-xs text-clay">{t("notificationPrefsSuccess")}</p>}
        {state && "error" in state && <p className="text-xs text-danger">{state.error}</p>}
        <SubmitButton />
      </div>
    </form>
  );
}

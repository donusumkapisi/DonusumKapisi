"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarPlus } from "lucide-react";
import { proposeAppointmentAction, type AppointmentActionState } from "@/lib/actions/appointment";
import { Button } from "@/components/ui/button";

export function ProposeAppointmentForm({ offerId }: { offerId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<AppointmentActionState, FormData>(
    proposeAppointmentAction.bind(null, offerId),
    null
  );
  const t = useTranslations("panel");

  if (state && "success" in state) {
    return <p className="text-xs text-clay">{t("proposeAppointmentSuccess")}</p>;
  }

  if (!isOpen) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        <CalendarPlus className="size-3.5" /> {t("proposeAppointmentButton")}
      </Button>
    );
  }

  return (
    <form action={formAction} className="flex w-full flex-wrap items-center gap-2 rounded-xl bg-surface/60 p-2">
      <input
        type="datetime-local"
        name="scheduledAt"
        required
        className="rounded-lg border border-hairline bg-paper px-2 py-1.5 text-xs text-ink outline-none"
      />
      <input
        type="text"
        name="location"
        placeholder={t("proposeAppointmentLocationPlaceholder")}
        className="min-w-0 flex-1 rounded-lg border border-hairline bg-paper px-2 py-1.5 text-xs text-ink outline-none placeholder:text-ink-muted/60"
      />
      <Button type="submit" variant="cta" size="sm" disabled={isPending}>
        {t("proposeAppointmentSubmit")}
      </Button>
      {state && "error" in state && <p className="w-full text-xs text-danger">{state.error}</p>}
    </form>
  );
}

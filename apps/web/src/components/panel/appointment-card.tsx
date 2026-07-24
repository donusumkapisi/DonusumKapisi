"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Appointment } from "@donusum-kapisi/db";
import { CalendarClock, CalendarPlus } from "lucide-react";
import { AppointmentActions } from "@/components/panel/appointment-actions";

const INTL_LOCALES: Record<string, string> = {
  tr: "tr-TR",
  en: "en-US",
  ar: "ar-SA",
  ru: "ru-RU",
};

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const locale = useLocale();
  const t = useTranslations("panel");

  const statusLabels: Record<string, { label: string; className: string }> = {
    PROPOSED: { label: t("appointmentStatusProposed"), className: "bg-warning/10 text-warning" },
    CONFIRMED: { label: t("appointmentStatusConfirmed"), className: "bg-clay/10 text-clay" },
    CANCELLED: { label: t("appointmentStatusCancelled"), className: "bg-surface text-ink-muted" },
  };
  const status = statusLabels[appointment.status];
  const formatted = new Date(appointment.scheduledAt).toLocaleString(INTL_LOCALES[locale] ?? "tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface/60 p-3">
      <div className="flex items-center gap-2 text-sm text-ink">
        <CalendarClock className="size-4 shrink-0 text-clay" />
        <div>
          <p className="font-medium">
            {t("appointmentDiscoveryLabel", { datetime: formatted })}
            {appointment.location ? ` · ${appointment.location}` : ""}
          </p>
          <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}>
            {status.label}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {appointment.status !== "CANCELLED" && (
          <a
            href={`/api/panel/appointments/${appointment.id}/ics`}
            className="inline-flex items-center gap-1 text-xs font-medium text-clay hover:underline"
          >
            <CalendarPlus className="size-3.5" /> {t("addToCalendar")}
          </a>
        )}
        {appointment.status === "PROPOSED" && <AppointmentActions appointmentId={appointment.id} />}
      </div>
    </div>
  );
}

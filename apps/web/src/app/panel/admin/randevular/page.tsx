import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import type { AppointmentStatus } from "@donusum-kapisi/db";
import { CalendarClock, MapPin } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { AdminCard, AdminPageHeader, FilterTabs, StatusPill, type FilterTab } from "@/components/admin/admin-ui";
import { CancelAppointmentButton } from "@/components/admin/cancel-appointment-button";
import { appointmentStatusTone } from "@/components/admin/status-tones";
import { getAdminAppointments, getAppointmentStatusCounts } from "@/lib/admin";

const STATUSES = ["PROPOSED", "CONFIRMED", "CANCELLED"] as const;

function parseStatus(value: string | undefined): AppointmentStatus | undefined {
  return STATUSES.find((status) => status === value);
}

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ durum?: string }>;
}) {
  const { durum } = await searchParams;
  const status = parseStatus(durum);

  const [appointments, counts, t, format] = await Promise.all([
    getAdminAppointments(status),
    getAppointmentStatusCounts(),
    getTranslations("panelAdmin"),
    getFormatter(),
  ]);

  const tabs: FilterTab[] = [
    { value: "ALL", label: t("filterAll"), count: counts.ALL, href: "/panel/admin/randevular" },
    ...STATUSES.map((value) => ({
      value,
      label: t(`appointmentStatus.${value}`),
      count: counts[value],
      href: `/panel/admin/randevular?durum=${value}`,
    })),
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <AdminPageHeader title={t("appointmentsTitle")} description={t("appointmentsSubtitle")} />
      </FadeIn>

      <FadeIn delay={0.05}>
        <FilterTabs tabs={tabs} active={status ?? "ALL"} />
      </FadeIn>

      {appointments.length === 0 ? (
        <PanelEmptyState
          icon={CalendarClock}
          title={t("appointmentsEmptyTitle")}
          subtitle={t("appointmentsEmptySubtitle")}
        />
      ) : (
        <div className="space-y-3">
          {appointments.map((appointment, index) => (
            <FadeIn key={appointment.id} delay={Math.min(index * 0.03, 0.24)}>
              <AdminCard className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-display text-base text-ink">
                    <CalendarClock className="size-4 shrink-0 text-clay" />
                    {format.dateTime(appointment.scheduledAt, {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </p>
                  <Link
                    href={`/panel/admin/ilanlar/${appointment.offer.listing.listingNumber}`}
                    className="mt-1 block truncate text-sm text-ink-muted hover:text-clay"
                  >
                    #{appointment.offer.listing.listingNumber} · {appointment.offer.listing.title}
                  </Link>
                  <p className="mt-1 text-xs text-ink-muted">
                    {t("partiesLabel", {
                      owner: appointment.offer.listing.owner.name ?? "—",
                      contractor: appointment.offer.contractor.name ?? "—",
                    })}
                  </p>
                  {appointment.location && (
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-ink-muted">
                      <MapPin className="size-3" />
                      {appointment.location}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone={appointmentStatusTone[appointment.status]}>
                    {t(`appointmentStatus.${appointment.status}`)}
                  </StatusPill>
                  {appointment.status !== "CANCELLED" && (
                    <CancelAppointmentButton appointmentId={appointment.id} />
                  )}
                </div>
              </AdminCard>
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}

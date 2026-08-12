import { getTranslations } from "next-intl/server";
import { Wrench } from "lucide-react";
import { AdminPageHeader, StatusPill } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { setMaintenanceModeAction } from "@/lib/actions/site-settings";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminMaintenancePage() {
  const [settings, t] = await Promise.all([
    getSiteSettings(),
    getTranslations("panelMaintenanceAdmin"),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader title={t("title")} description={t("description")} />

      <div className="rounded-2xl border border-hairline bg-paper p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <Wrench className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-lg text-ink">{t("statusLabel")}</p>
              <p className="mt-1 text-sm text-ink-muted">{t("statusHint")}</p>
            </div>
          </div>
          <StatusPill tone={settings.maintenanceMode ? "pending" : "success"}>
            {settings.maintenanceMode ? t("statusOn") : t("statusOff")}
          </StatusPill>
        </div>

        <form action={setMaintenanceModeAction} className="mt-6 space-y-4">
          <input type="hidden" name="enabled" value={settings.maintenanceMode ? "false" : "true"} />
          <div>
            <label htmlFor="message" className="text-sm font-medium text-ink">
              {t("messageLabel")}
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              defaultValue={settings.maintenanceMessage}
              placeholder={t("messagePlaceholder")}
              className="mt-1.5 w-full rounded-xl border border-hairline bg-surface px-3 py-2.5 text-sm text-ink outline-none focus:border-clay/40"
            />
            <p className="mt-1.5 text-xs text-ink-muted">{t("messageHelp")}</p>
          </div>

          <Button type="submit" variant={settings.maintenanceMode ? "outline" : "cta"} size="sm">
            {settings.maintenanceMode ? t("turnOff") : t("turnOn")}
          </Button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { updateAppointmentStatusAction } from "@/lib/actions/appointment";

export function AppointmentActions({ appointmentId }: { appointmentId: string }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("panel");

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="cta"
        size="sm"
        disabled={isPending}
        onClick={() => startTransition(() => updateAppointmentStatusAction(appointmentId, "CONFIRMED"))}
      >
        {t("appointmentConfirm")}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => startTransition(() => updateAppointmentStatusAction(appointmentId, "CANCELLED"))}
      >
        {t("appointmentCancel")}
      </Button>
    </div>
  );
}

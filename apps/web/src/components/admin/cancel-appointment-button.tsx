"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cancelAppointmentAsAdminAction } from "@/lib/actions/admin";

export function CancelAppointmentButton({ appointmentId }: { appointmentId: string }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("panelAdmin");

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={isPending}
      onClick={() => startTransition(() => cancelAppointmentAsAdminAction(appointmentId))}
    >
      <CalendarX className="size-3.5" />
      {t("appointmentCancel")}
    </Button>
  );
}

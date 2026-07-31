"use client";

import { useTranslations } from "next-intl";
import { BadgeCheck, CircleAlert, Clock, FileWarning } from "lucide-react";
import type { ContractorVerificationStatus } from "@donusum-kapisi/db";
import { cn } from "@/lib/utils";

const styles: Record<
  ContractorVerificationStatus,
  { icon: typeof BadgeCheck; className: string }
> = {
  INCOMPLETE: { icon: FileWarning, className: "border-hairline bg-surface/60 text-ink-muted" },
  PENDING: { icon: Clock, className: "border-warning/30 bg-warning/8 text-warning" },
  APPROVED: { icon: BadgeCheck, className: "border-clay/30 bg-clay/8 text-clay" },
  REJECTED: { icon: CircleAlert, className: "border-danger/30 bg-danger/8 text-danger" },
};

export function VerificationStatusBanner({
  status,
  note,
  className,
}: {
  status: ContractorVerificationStatus;
  note?: string | null;
  className?: string;
}) {
  const t = useTranslations("contractorDocs");
  const { icon: Icon, className: tone } = styles[status];

  return (
    <div className={cn("rounded-xl border px-4 py-3.5", tone, className)}>
      <p className="flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4 shrink-0" />
        {t(`bannerTitle.${status}`)}
      </p>
      <p className="mt-1 text-xs leading-relaxed opacity-85">{t(`bannerBody.${status}`)}</p>
      {note && <p className="mt-2 text-xs leading-relaxed font-medium">{note}</p>}
    </div>
  );
}

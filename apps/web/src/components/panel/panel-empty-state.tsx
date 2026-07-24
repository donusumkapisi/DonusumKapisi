import type { LucideIcon } from "lucide-react";

export function PanelEmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-hairline bg-surface/40 px-6 py-12 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-paper shadow-[0_1px_2px_rgb(22_52_73_/_0.06)]">
        <Icon className="size-6 text-clay" />
      </div>
      <p className="font-display text-base text-ink">{title}</p>
      <p className="max-w-xs text-sm text-ink-muted">{subtitle}</p>
      {action}
    </div>
  );
}

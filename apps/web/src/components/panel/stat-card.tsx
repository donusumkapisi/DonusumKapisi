import type { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-hairline bg-paper p-4 shadow-[0_1px_2px_rgb(22_52_73_/_0.04)]">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-clay/10">
        <Icon className="size-4.5 text-clay" />
      </div>
      <div className="min-w-0">
        <p className="font-display text-xl text-ink">{value}</p>
        <p className="truncate text-xs text-ink-muted">{label}</p>
      </div>
    </div>
  );
}

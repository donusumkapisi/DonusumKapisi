import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-display text-xl text-ink">{title}</h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export type PillTone = "pending" | "success" | "danger" | "muted" | "info";

const pillTones: Record<PillTone, string> = {
  pending: "bg-warning/10 text-warning",
  success: "bg-clay/10 text-clay",
  danger: "bg-danger/10 text-danger",
  muted: "bg-surface text-ink-muted",
  info: "bg-info/10 text-info",
};

export function StatusPill({
  tone,
  children,
  className,
}: {
  tone: PillTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        pillTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export type FilterTab = { value: string; label: string; count?: number; href: string };

/**
 * Plain links rather than a client-side control: the list they filter is
 * server-rendered anyway, so this keeps the page free of extra JavaScript.
 */
export function FilterTabs({ tabs, active }: { tabs: FilterTab[]; active: string }) {
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => {
        const isActive = tab.value === active;
        return (
          <Link
            key={tab.value}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "border-clay/30 bg-clay/10 text-clay"
                : "border-hairline bg-paper text-ink-muted hover:border-clay/25 hover:text-ink"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn("font-mono text-[0.65rem]", isActive ? "text-clay/70" : "text-ink-muted/70")}>
                {tab.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

/** A GET form so the query lands in the URL and the results stay shareable. */
export function SearchField({
  action,
  placeholder,
  defaultValue,
  hidden = {},
}: {
  action: string;
  placeholder: string;
  defaultValue?: string;
  hidden?: Record<string, string | undefined>;
}) {
  return (
    <form action={action} className="relative w-full sm:max-w-xs">
      {Object.entries(hidden).map(([name, value]) =>
        value ? <input key={name} type="hidden" name={name} value={value} /> : null
      )}
      <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-ink-muted" />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-hairline bg-paper pr-3 pl-8.5 text-sm text-ink outline-none placeholder:text-ink-muted/60 focus-visible:border-clay/40 focus-visible:ring-3 focus-visible:ring-clay/15"
      />
    </form>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-hairline bg-paper p-4 shadow-[0_1px_2px_rgb(22_52_73_/_0.04)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline py-2 last:border-0">
      <span className="text-xs text-ink-muted">{label}</span>
      <span className="min-w-0 text-right text-sm text-ink">{children}</span>
    </div>
  );
}

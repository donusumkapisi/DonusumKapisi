"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Building2,
  CalendarClock,
  ChartColumn,
  HardHat,
  LayoutDashboard,
  Megaphone,
  MessagesSquare,
  Newspaper,
  ShieldCheck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminQueueCounts = { listings: number; messages: number; verifications: number };

type NavItem = { href: string; labelKey: string; icon: LucideIcon; badge?: keyof AdminQueueCounts };
type NavGroup = { titleKey: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    titleKey: "nav.groupOperations",
    items: [
      { href: "/panel/admin", labelKey: "nav.overview", icon: LayoutDashboard },
      { href: "/panel/admin/ilanlar", labelKey: "nav.listings", icon: Building2, badge: "listings" },
      { href: "/panel/admin/mesajlar", labelKey: "nav.messages", icon: MessagesSquare, badge: "messages" },
      { href: "/panel/admin/randevular", labelKey: "nav.appointments", icon: CalendarClock },
    ],
  },
  {
    titleKey: "nav.groupAccounts",
    items: [
      { href: "/panel/admin/muteahhitler", labelKey: "nav.contractors", icon: HardHat },
      { href: "/panel/admin/dogrulama", labelKey: "nav.verifications", icon: ShieldCheck, badge: "verifications" },
      { href: "/panel/admin/kullanicilar", labelKey: "nav.users", icon: Users },
    ],
  },
  {
    titleKey: "nav.groupContent",
    items: [
      { href: "/panel/admin/analitik", labelKey: "nav.analytics", icon: ChartColumn },
      { href: "/panel/admin/blog", labelKey: "nav.blog", icon: Newspaper },
      { href: "/panel/admin/duyurular", labelKey: "nav.announcements", icon: Megaphone },
      { href: "/panel/admin/bakim", labelKey: "nav.maintenance", icon: Wrench },
    ],
  },
];

/** The overview lives at the section root, so only it may match exactly. */
function isActive(pathname: string, href: string) {
  return href === "/panel/admin" ? pathname === href : pathname.startsWith(href);
}

function Badge({ value, active }: { value: number; active: boolean }) {
  if (value === 0) return null;

  return (
    <span
      className={cn(
        "ml-auto shrink-0 rounded-full px-1.5 py-0.5 font-mono text-[0.65rem] leading-none",
        active ? "bg-clay/20 text-clay" : "bg-warning/15 text-warning"
      )}
    >
      {value}
    </span>
  );
}

export function AdminNav({ counts }: { counts: AdminQueueCounts }) {
  const pathname = usePathname();
  const t = useTranslations("panelAdmin");

  return (
    <nav className="lg:w-56 lg:shrink-0">
      {/* Mobile: one scrollable row of pills, so the shell never eats the screen. */}
      <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {GROUPS.flatMap((group) => group.items).map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                active
                  ? "border-clay/30 bg-clay/10 text-clay"
                  : "border-hairline bg-paper text-ink-muted hover:border-clay/25 hover:text-ink"
              )}
            >
              <item.icon className="size-3.5" />
              {t(item.labelKey)}
              {item.badge && <Badge value={counts[item.badge]} active={active} />}
            </Link>
          );
        })}
      </div>

      <div className="hidden lg:sticky lg:top-24 lg:block lg:space-y-6">
        {GROUPS.map((group) => (
          <div key={group.titleKey}>
            <p className="px-3 font-mono text-[0.65rem] tracking-[0.18em] text-ink-muted/70 uppercase">
              {t(group.titleKey)}
            </p>
            <ul className="mt-2 space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-clay/10 font-medium text-clay"
                          : "text-ink-muted hover:bg-surface hover:text-ink"
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      <span className="min-w-0 truncate">{t(item.labelKey)}</span>
                      {item.badge && <Badge value={counts[item.badge]} active={active} />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}

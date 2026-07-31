import { getFormatter, getTranslations } from "next-intl/server";
import type { UserRole } from "@donusum-kapisi/db";
import { Users } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { AdminCard, AdminPageHeader, FilterTabs, SearchField, StatusPill, type FilterTab } from "@/components/admin/admin-ui";
import { UserRoleSelect } from "@/components/admin/user-role-select";
import { roleTone } from "@/components/admin/status-tones";
import { getAdminUsers, getUserRoleCounts, requireAdmin } from "@/lib/admin";

const ROLES = ["HOMEOWNER", "CONTRACTOR", "ADMIN"] as const;

function parseRole(value: string | undefined): UserRole | undefined {
  return ROLES.find((role) => role === value);
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ rol?: string; q?: string }>;
}) {
  const { rol, q } = await searchParams;
  const role = parseRole(rol);
  const query = q?.trim() || undefined;

  const [session, users, counts, t, format] = await Promise.all([
    requireAdmin(),
    getAdminUsers({ role, q: query }),
    getUserRoleCounts(),
    getTranslations("panelAdmin"),
    getFormatter(),
  ]);

  const tabs: FilterTab[] = [
    { value: "ALL", label: t("filterAll"), count: counts.ALL, href: "/panel/admin/kullanicilar" },
    ...ROLES.map((value) => ({
      value,
      label: t(`role.${value}`),
      count: counts[value],
      href: `/panel/admin/kullanicilar?rol=${value}`,
    })),
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <AdminPageHeader title={t("usersTitle")} description={t("usersSubtitle")} />
      </FadeIn>

      <FadeIn delay={0.05} className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs tabs={tabs} active={role ?? "ALL"} />
        <SearchField
          action="/panel/admin/kullanicilar"
          placeholder={t("usersSearchPlaceholder")}
          defaultValue={query}
          hidden={{ rol: role }}
        />
      </FadeIn>

      {users.length === 0 ? (
        <PanelEmptyState
          icon={Users}
          title={t("usersEmptyTitle")}
          subtitle={query ? t("noSearchResults", { q: query }) : t("usersEmptySubtitle")}
        />
      ) : (
        <div className="space-y-2">
          {users.map((user, index) => {
            const isSelf = user.id === session.user.id;

            return (
              <FadeIn key={user.id} delay={Math.min(index * 0.02, 0.2)}>
                <AdminCard className="flex flex-wrap items-center justify-between gap-3 p-3.5">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-ink">
                      {user.name ?? t("unnamedUser")}
                      <StatusPill tone={roleTone[user.role]}>{t(`role.${user.role}`)}</StatusPill>
                      {isSelf && <StatusPill tone="muted">{t("youBadge")}</StatusPill>}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-ink-muted">
                      {user.email}
                      {user.phone ? ` · ${user.phone}` : ""}
                    </p>
                    <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-ink-muted">
                      <span>{t("listingCount", { count: user._count.listings })}</span>
                      <span>{t("offerCount", { count: user._count.offers })}</span>
                      <span>
                        {t("joinedAt", {
                          date: format.dateTime(user.createdAt, { dateStyle: "medium" }),
                        })}
                      </span>
                    </p>
                  </div>

                  <UserRoleSelect userId={user.id} role={user.role} disabled={isSelf} />
                </AdminCard>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
}

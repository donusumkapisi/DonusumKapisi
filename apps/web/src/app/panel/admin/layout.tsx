import { getTranslations } from "next-intl/server";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { AdminNav } from "@/components/admin/admin-nav";
import { getAdminQueueCounts, requireAdmin } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const [counts, t] = await Promise.all([getAdminQueueCounts(), getTranslations("panelAdmin")]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:py-12">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline pb-6">
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">{t("eyebrow")}</p>
          <h1 className="mt-2 font-display text-2xl text-ink sm:text-3xl">{t("title")}</h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden text-right text-xs leading-tight text-ink-muted sm:block">
            {session.user.name ?? t("adminFallbackName")}
            <span className="block text-ink-muted/70">{session.user.email}</span>
          </p>
          <SignOutButton className="h-9 px-4" />
        </div>
      </header>

      <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:gap-10">
        <AdminNav counts={counts} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { CONTRACTOR_DOCUMENT_TYPES } from "@donusum-kapisi/shared";
import { ExternalLink, HardHat, Star } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { Button } from "@/components/ui/button";
import { AdminCard, AdminPageHeader, SearchField, StatusPill } from "@/components/admin/admin-ui";
import { verificationStatusTone } from "@/components/admin/status-tones";
import { getAdminContractors } from "@/lib/admin";

export default async function AdminContractorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || undefined;

  const [contractors, t, tDocs, format] = await Promise.all([
    getAdminContractors(query),
    getTranslations("panelAdmin"),
    getTranslations("contractorDocs"),
    getFormatter(),
  ]);

  return (
    <div className="space-y-6">
      <FadeIn>
        <AdminPageHeader
          title={t("contractorsTitle")}
          description={t("contractorsSubtitle")}
          action={
            <Button asChild variant="outline" size="sm">
              <Link href="/panel/admin/dogrulama">{t("verificationsReviewButton")}</Link>
            </Button>
          }
        />
      </FadeIn>

      <FadeIn delay={0.05}>
        <SearchField
          action="/panel/admin/muteahhitler"
          placeholder={t("contractorsSearchPlaceholder")}
          defaultValue={query}
        />
      </FadeIn>

      {contractors.length === 0 ? (
        <PanelEmptyState
          icon={HardHat}
          title={t("contractorsEmptyTitle")}
          subtitle={query ? t("noSearchResults", { q: query }) : t("contractorsEmptySubtitle")}
        />
      ) : (
        <div className="space-y-3">
          {contractors.map((contractor, index) => {
            const profile = contractor.contractorProfile;
            const status = profile?.verificationStatus ?? "INCOMPLETE";

            return (
              <FadeIn key={contractor.id} delay={Math.min(index * 0.03, 0.24)}>
                <AdminCard className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-display text-base text-ink">
                      <Link href={`/muteahhitler/${contractor.id}`} className="hover:text-clay">
                        {profile?.companyName ?? contractor.name ?? contractor.email}
                      </Link>
                      {contractor.reviewCount > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                          <Star className="size-3.5 fill-highlight text-highlight" />
                          {contractor.averageRating?.toFixed(1)} ({contractor.reviewCount})
                        </span>
                      )}
                    </p>
                    <p className="mt-1 truncate text-xs text-ink-muted">
                      {contractor.email}
                      {contractor.phone ? ` · ${contractor.phone}` : ""}
                    </p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                      <span>{t("offerCount", { count: contractor._count.offers })}</span>
                      <span>
                        {tDocs("uploadedCount", {
                          done: profile?._count.documents ?? 0,
                          total: CONTRACTOR_DOCUMENT_TYPES.length,
                        })}
                      </span>
                      <span>
                        {t("joinedAt", {
                          date: format.dateTime(contractor.createdAt, { dateStyle: "medium" }),
                        })}
                      </span>
                    </p>
                    {profile?.mybn && (
                      <p className="mt-2 inline-flex items-center gap-2 text-xs text-ink-muted">
                        {tDocs("mybnShort")}
                        <span className="rounded-md bg-surface px-2 py-0.5 font-mono text-ink">
                          {profile.mybn}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill tone={verificationStatusTone[status]}>
                      {tDocs(`status.${status}`)}
                    </StatusPill>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/panel/admin/dogrulama">
                        {tDocs("panelReview")}
                        <ExternalLink className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </AdminCard>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
}

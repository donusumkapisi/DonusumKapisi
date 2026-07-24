import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";
import { prisma } from "@donusum-kapisi/db";
import { getContractorRatingSummary, getContractorReviews } from "@/lib/reviews";
import { listPortfolioItems } from "@/lib/portfolio";
import { FadeIn } from "@/components/motion/fade-in";
import { SpotlightCard } from "@/components/motion/spotlight-card";

type Props = { params: Promise<{ userId: string }> };

async function getContractor(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, role: true } });
  if (!user || user.role !== "CONTRACTOR") return null;

  const [profile, ratingSummary, reviews, portfolio] = await Promise.all([
    prisma.contractorProfile.findUnique({ where: { userId } }),
    getContractorRatingSummary(userId),
    getContractorReviews(userId),
    listPortfolioItems(userId),
  ]);

  return { name: user.name, profile, ratingSummary, reviews, portfolio };
}

function getInitials(value: string) {
  const initials = value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return initials || "?";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const [contractor, t] = await Promise.all([
    getContractor(userId),
    getTranslations("contractorProfile"),
  ]);
  return { title: contractor ? contractor.profile?.companyName || contractor.name || t("unnamedContractor") : t("notFoundTitle") };
}

export default async function ContractorProfilePage({ params }: Props) {
  const { userId } = await params;
  const [contractor, t] = await Promise.all([
    getContractor(userId),
    getTranslations("contractorProfile"),
  ]);
  if (!contractor) notFound();

  const { name, profile, ratingSummary, reviews, portfolio } = contractor;
  const displayName = profile?.companyName || name || t("unnamedContractor");

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 size-[26rem] rounded-full bg-clay/[0.07] blur-[110px]"
      />

      <div className="relative mx-auto max-w-2xl px-6 py-16">
        <FadeIn className="flex flex-wrap items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-surface-strong font-display text-xl text-on-strong">
            {getInitials(displayName)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl text-ink">{displayName}</h1>
              {profile?.verified && (
                <span className="flex items-center gap-1 rounded-full bg-clay/10 px-3 py-1 text-xs font-medium text-clay">
                  <BadgeCheck className="size-3.5" /> {t("documentsVerifiedBadge")}
                </span>
              )}
            </div>
            {ratingSummary.reviewCount > 0 ? (
              <div className="mt-1.5 flex items-center gap-1.5">
                <Star className="size-4 fill-highlight text-highlight" />
                <span className="text-sm font-medium text-ink">
                  {ratingSummary.averageRating?.toFixed(1)}
                </span>
                <span className="text-sm text-ink-muted">
                  {t("reviewCountLabel", { count: ratingSummary.reviewCount })}
                </span>
              </div>
            ) : (
              <p className="mt-1.5 text-sm text-ink-muted">{t("noReviewsYet")}</p>
            )}
          </div>
        </FadeIn>

        {profile?.about && (
          <FadeIn delay={0.05}>
            <p className="mt-6 text-sm leading-relaxed text-ink-muted">{profile.about}</p>
          </FadeIn>
        )}

        {portfolio.length > 0 && (
          <FadeIn delay={0.1} className="mt-12">
            <h2 className="font-display text-lg text-ink">{t("completedProjectsTitle")}</h2>
            <div className="mt-4 space-y-4">
              {portfolio.map((item) => (
                <SpotlightCard key={item.id} className="p-4">
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  {item.description && (
                    <p className="mt-1 text-sm text-ink-muted">{item.description}</p>
                  )}
                  {(item.beforeImageUrl || item.afterImageUrl) && (
                    <div className="mt-3 flex items-center gap-2">
                      {item.beforeImageUrl && (
                        <div className="min-w-0 flex-1">
                          <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                            <Image
                              src={item.beforeImageUrl}
                              alt={t("beforeAlt", { title: item.title })}
                              fill
                              sizes="200px"
                              className="object-cover"
                            />
                          </div>
                          <span className="mt-1.5 block text-center text-xs font-medium text-ink-muted">
                            {t("beforeLabel")}
                          </span>
                        </div>
                      )}
                      {item.beforeImageUrl && item.afterImageUrl && (
                        <ArrowRight className="size-4 shrink-0 text-clay" />
                      )}
                      {item.afterImageUrl && (
                        <div className="min-w-0 flex-1">
                          <div className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                            <Image
                              src={item.afterImageUrl}
                              alt={t("afterAlt", { title: item.title })}
                              fill
                              sizes="200px"
                              className="object-cover"
                            />
                          </div>
                          <span className="mt-1.5 block text-center text-xs font-medium text-ink-muted">
                            {t("afterLabel")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </SpotlightCard>
              ))}
            </div>
          </FadeIn>
        )}

        {reviews.length > 0 && (
          <FadeIn delay={0.15} className="mt-12">
            <h2 className="font-display text-lg text-ink">{t("reviewsTitle")}</h2>
            <div className="mt-4 space-y-3">
              {reviews.map((review) => (
                <SpotlightCard key={review.id} className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < review.rating
                              ? "size-3.5 fill-highlight text-highlight"
                              : "size-3.5 text-hairline"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs text-ink-muted">{review.reviewer.name ?? t("unnamedHomeowner")}</span>
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm text-ink-muted">{review.comment}</p>
                  )}
                </SpotlightCard>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}

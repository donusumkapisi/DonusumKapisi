import { getFormatter, getTranslations } from "next-intl/server";
import { BadgeCheck, Clock, ShieldCheck } from "lucide-react";
import type { ContractorVerificationStatus } from "@donusum-kapisi/db";
import { listContractorVerifications } from "@/lib/contractor-verification";
import { FadeIn } from "@/components/motion/fade-in";
import { StatCard } from "@/components/panel/stat-card";
import { PanelEmptyState } from "@/components/panel/panel-empty-state";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import {
  ContractorReviewCard,
  type ContractorReview,
} from "@/components/panel/contractor-review-card";

/** Waiting applications first, settled ones last. */
const reviewOrder: Record<ContractorVerificationStatus, number> = {
  PENDING: 0,
  REJECTED: 1,
  INCOMPLETE: 2,
  APPROVED: 3,
};

export default async function ContractorVerificationPage() {
  const [profiles, t, format] = await Promise.all([
    listContractorVerifications(),
    getTranslations("panelAdmin"),
    getFormatter(),
  ]);

  const reviews: ContractorReview[] = profiles
    .slice()
    .sort((a, b) => reviewOrder[a.verificationStatus] - reviewOrder[b.verificationStatus])
    .map((profile) => ({
      profileId: profile.id,
      companyName: profile.companyName,
      contactName: profile.user.name,
      email: profile.user.email,
      phone: profile.user.phone,
      mybn: profile.mybn,
      status: profile.verificationStatus,
      verificationNote: profile.verificationNote,
      submittedAt: profile.submittedAt ? format.dateTime(profile.submittedAt) : null,
      documents: profile.documents.map((document) => ({
        id: document.id,
        type: document.type,
        url: document.url,
        fileName: document.fileName,
        size: document.size,
        status: document.status,
        reviewNote: document.reviewNote,
      })),
    }));

  const waiting = reviews.filter((review) => review.status === "PENDING").length;
  const approved = reviews.filter((review) => review.status === "APPROVED").length;

  return (
    <div className="space-y-6">
      <FadeIn>
        <AdminPageHeader title={t("verificationsTitle")} description={t("verificationsSubtitle")} />
      </FadeIn>

      <FadeIn delay={0.05} className="grid grid-cols-3 gap-3">
        <StatCard icon={Clock} label={t("statPendingVerification")} value={waiting} />
        <StatCard icon={BadgeCheck} label={t("statApprovedContractors")} value={approved} />
        <StatCard icon={ShieldCheck} label={t("statTotalContractors")} value={reviews.length} />
      </FadeIn>

      {reviews.length === 0 ? (
        <PanelEmptyState
          icon={ShieldCheck}
          title={t("verificationsEmptyTitle")}
          subtitle={t("verificationsEmptySubtitle")}
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <FadeIn key={review.profileId} delay={Math.min(index * 0.05, 0.3)}>
              <ContractorReviewCard review={review} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}

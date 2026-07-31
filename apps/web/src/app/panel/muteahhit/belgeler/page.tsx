import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/auth";
import { getContractorVerification } from "@/lib/contractor-verification";
import { FadeIn } from "@/components/motion/fade-in";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import {
  ContractorDocumentsForm,
  type ExistingDocument,
} from "@/components/panel/contractor-documents-form";
import { VerificationStatusBanner } from "@/components/panel/verification-status-banner";

export default async function ContractorDocumentsPage() {
  const session = await auth();
  if (!session) redirect("/giris");
  if (session.user.role !== "CONTRACTOR") redirect("/panel");

  const [profile, t] = await Promise.all([
    getContractorVerification(session.user.id),
    getTranslations("contractorDocs"),
  ]);

  const status = profile?.verificationStatus ?? "INCOMPLETE";
  const isOnboarding = !profile?.submittedAt;

  const documents: ExistingDocument[] =
    profile?.documents.map((document) => ({
      type: document.type,
      url: document.url,
      fileName: document.fileName,
      status: document.status,
      reviewNote: document.reviewNote,
    })) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <FadeIn>
        <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
          {isOnboarding ? t("onboardingEyebrow") : t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-3xl text-ink">{t("title")}</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted">{t("subtitle")}</p>
      </FadeIn>

      <FadeIn delay={0.05} className="mt-6">
        <VerificationStatusBanner status={status} note={profile?.verificationNote} />
      </FadeIn>

      <FadeIn delay={0.08} className="mt-6">
        <SpotlightCard className="p-6">
          <ContractorDocumentsForm
            companyName={profile?.companyName ?? null}
            mybn={profile?.mybn ?? null}
            documents={documents}
          />
        </SpotlightCard>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs text-ink-muted">
          <ShieldCheck className="size-3.5 text-clay" />
          {t("privacyNote")}
        </p>
        {!isOnboarding && (
          <Link
            href="/panel/muteahhit"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-clay"
          >
            <ArrowLeft className="size-3.5" />
            {t("backToPanel")}
          </Link>
        )}
      </FadeIn>
    </div>
  );
}

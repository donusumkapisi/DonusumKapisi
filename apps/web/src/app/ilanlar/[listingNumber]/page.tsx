import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@donusum-kapisi/db";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { ShieldCheck, Phone, Mail } from "lucide-react";
import { formatPriceRange, getListingForDetail } from "@/lib/listings";
import { buildCallUrl, buildMailUrl, CONTACT_PHONE, CONTACT_EMAIL } from "@/lib/contact";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { ListingGallery } from "@/components/listings/listing-gallery";
import { OfferForm } from "@/components/listings/offer-form";

type Props = { params: Promise<{ listingNumber: string }> };

async function getListing(listingNumber: string) {
  const listing = await prisma.listing.findUnique({ where: { listingNumber } });
  if (!listing || listing.status !== "APPROVED") return null;
  return listing;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { listingNumber } = await params;
  const [listing, t] = await Promise.all([
    getListing(listingNumber),
    getTranslations("listingDetail"),
  ]);
  return { title: listing ? listing.title : t("notFoundTitle") };
}

export default async function ListingDetailPage({ params }: Props) {
  const { listingNumber } = await params;
  const [listing, t] = await Promise.all([
    getListingForDetail(listingNumber),
    getTranslations("listingDetail"),
  ]);
  if (!listing) notFound();

  const session = await auth();
  const role = session?.user.role;
  const isContractor = role === "CONTRACTOR";
  const existingOffer = isContractor && session
    ? await prisma.offer.findUnique({
        where: {
          listingId_contractorId: { listingId: listing.id, contractorId: session.user.id },
        },
      })
    : null;

  const specs = [
    { label: t("specSquareMeters"), value: t("specSquareMetersValue", { n: listing.squareMeters }) },
    { label: t("specBuildingAge"), value: t("specBuildingAgeValue", { n: listing.buildingAge }) },
    { label: t("specFloorCount"), value: listing.floorCount },
    { label: t("specUnitCount"), value: listing.unitCount },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
      <FadeIn>
        <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
          {t("listingNoLabel", { number: listing.listingNumber })}
        </p>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{listing.title}</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {listing.district}, {listing.province}
        </p>
      </FadeIn>

      <FadeIn delay={0.05} className="mt-8">
        <ListingGallery photos={listing.photos} title={listing.title} />
      </FadeIn>

      <FadeIn delay={0.1}>
        <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-hairline py-6 sm:grid-cols-4">
          {specs.map((spec) => (
            <div key={spec.label}>
              <dt className="font-mono text-[0.65rem] tracking-widest text-ink-muted/70 uppercase">
                {spec.label}
              </dt>
              <dd className="mt-1 text-sm font-medium text-ink">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-lg font-medium text-ink">
          {formatPriceRange(listing.priceMin, listing.priceMax)}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">{listing.description}</p>
      </FadeIn>

      <FadeIn delay={0.15} className="mt-10">
        {isContractor ? (
          <div className="rounded-2xl border border-hairline bg-surface/60 p-6">
            <h2 className="font-display text-lg text-ink">
              {existingOffer ? t("offerFormTitleEdit") : t("offerFormTitleNew")}
            </h2>
            <p className="mt-1 text-sm text-ink-muted">{t("offerFormDescription")}</p>
            <div className="mt-5">
              <OfferForm listingNumber={listing.listingNumber} existingOffer={existingOffer} />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-hairline bg-surface/60 p-6">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-paper">
                <ShieldCheck className="size-4.5 text-clay" />
              </div>
              <div>
                <h2 className="font-display text-lg text-ink">{t("mediationTitle")}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                  {t("mediationBody")}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="cta-blue" className="h-10 px-5">
                <Link href="/giris">{t("ctaContractorLogin")}</Link>
              </Button>
              <Button asChild variant="outline" className="h-10 px-5">
                <Link href="/ilan-ver">{t("ctaHomeownerListing")}</Link>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 border-t border-hairline pt-5">
              <a
                href={buildCallUrl()}
                className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-clay"
              >
                <Phone className="size-4" />
                {CONTACT_PHONE}
              </a>
              <a
                href={buildMailUrl(
                  t("emailSubject", { number: listing.listingNumber }),
                  t("emailBody", { number: listing.listingNumber })
                )}
                className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-clay"
              >
                <Mail className="size-4" />
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        )}
      </FadeIn>
    </div>
  );
}

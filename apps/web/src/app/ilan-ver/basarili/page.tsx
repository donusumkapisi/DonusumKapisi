import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { searchParams: Promise<{ ilanNo?: string }> };

export default async function ListingSuccessPage({ searchParams }: Props) {
  const [{ ilanNo }, t] = await Promise.all([searchParams, getTranslations("listingWizard")]);
  if (!ilanNo) redirect("/ilan-ver");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-clay/10 text-clay">
        <CheckCircle2 className="size-7" />
      </span>
      <p className="mt-6 font-mono text-xs tracking-[0.2em] text-clay uppercase">
        {t("successListingNoLabel", { number: ilanNo })}
      </p>
      <h1 className="mt-3 font-display text-3xl text-ink">
        {t("successTitle")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        {t("successBody")}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="cta" size="lg" className="h-11 px-6 text-[0.95rem]">
          <Link href="/panel/ev-sahibi">{t("successMyListingsButton")}</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 px-6 text-[0.95rem]">
          <Link href="/">{t("successHomeButton")}</Link>
        </Button>
      </div>
    </div>
  );
}

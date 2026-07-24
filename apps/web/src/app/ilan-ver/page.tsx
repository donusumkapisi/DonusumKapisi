import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { ListingWizard } from "@/components/listings/listing-wizard";

export default async function PostListingPage() {
  const session = await auth();

  if (session?.user.role === "CONTRACTOR") redirect("/panel/muteahhit");

  if (session?.user.role === "HOMEOWNER") {
    return <ListingWizard />;
  }

  const t = await getTranslations("listingWizard");

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
        {t("authGateEyebrow")}
      </p>
      <h1 className="mt-3 font-display text-3xl text-ink">
        {t("authGateTitle")}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        {t("authGateBody")}
      </p>
      <Magnetic>
        <Button asChild variant="cta-red" size="lg" className="mt-8 h-11 px-6 text-[0.95rem]">
          <Link href="/kayit?rol=ev-sahibi">{t("authGateButton")}</Link>
        </Button>
      </Magnetic>
    </div>
  );
}

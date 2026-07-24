import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/ui/mini-navbar";
import { auth } from "@/lib/auth";

export async function SiteHeader() {
  const [session, t] = await Promise.all([auth(), getTranslations("nav")]);

  const navLinks = [
    { href: "/ilanlar", label: t("listings") },
    { href: "/ilan-ver", label: t("postListing") },
    { href: "/yatirimcilar", label: t("investors") },
    { href: "/blog", label: t("blog") },
    { href: "/sss", label: t("faq") },
  ];

  return (
    <Navbar
      links={navLinks}
      isAuthenticated={Boolean(session)}
      userName={session?.user.name ?? null}
    />
  );
}

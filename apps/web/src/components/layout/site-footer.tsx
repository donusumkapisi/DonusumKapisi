import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ThresholdMark } from "@/components/brand/threshold-mark";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  const columns = [
    {
      title: t("platformTitle"),
      links: [
        { href: "/ilanlar", label: t("exploreListings") },
        { href: "/blog", label: t("blog") },
        { href: "/ev-sahipleri", label: t("joinAsHomeowner") },
        { href: "/muteahhitler", label: t("joinAsContractor") },
        { href: "/yatirimcilar", label: t("joinAsInvestor") },
      ],
    },
    {
      title: t("corporateTitle"),
      links: [
        { href: "/hakkimizda", label: t("about") },
        { href: "/sss", label: t("faq") },
        { href: "/iletisim", label: t("contact") },
      ],
    },
    {
      title: t("legalTitle"),
      links: [
        { href: "/gizlilik", label: t("privacy") },
        { href: "/kullanim-sartlari", label: t("terms") },
        { href: "/kvkk", label: t("kvkk") },
      ],
    },
  ];

  return (
    <footer className="border-t border-hairline-invert bg-surface-strong">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <ThresholdMark className="text-white" />
              <span className="font-display text-lg text-white tracking-tight">
                DönüşümKapısı
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {t("description")}
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="font-mono text-xs tracking-widest text-white/40 uppercase">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline-invert pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("rightsReserved", { year: new Date().getFullYear() })}</p>
          <p className="font-mono">{t("singleContactPoint")}</p>
        </div>
      </div>
    </footer>
  );
}

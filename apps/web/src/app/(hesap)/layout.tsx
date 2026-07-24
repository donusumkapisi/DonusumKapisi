import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Building2, Handshake, ShieldCheck } from "lucide-react";
import { ThresholdMark } from "@/components/brand/threshold-mark";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("auth");

  const pillars = [
    { icon: ShieldCheck, text: t("sidebarPillar1") },
    { icon: Building2, text: t("sidebarPillar2") },
    { icon: Handshake, text: t("sidebarPillar3") },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
      {/* Form paneli — sol */}
      <section className="relative flex flex-col justify-center bg-surface/40 px-5 py-12 sm:px-8 lg:px-12 xl:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-0 size-[22rem] rounded-full bg-clay/[0.06] blur-[100px] lg:hidden"
        />

        <div className="relative mx-auto w-full max-w-[26rem]">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 lg:hidden"
          >
            <ThresholdMark className="size-5 text-clay" />
            <span className="font-display text-base tracking-tight text-ink">
              Dönüşüm<span className="text-clay">Kapısı</span>
            </span>
          </Link>

          <div className="rounded-2xl border border-hairline bg-paper p-6 shadow-[0_20px_50px_-28px_rgb(14_52_70_/_0.28)] sm:p-8">
            {children}
          </div>
        </div>
      </section>

      {/* Marka paneli — sağ */}
      <aside className="relative hidden overflow-hidden bg-surface-strong lg:flex lg:flex-col lg:justify-between lg:px-12 lg:py-14 xl:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 70% 60% at 70% 40%, black, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-16 size-[28rem] rounded-full bg-clay/[0.18] blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-20%] bottom-[-10%] size-[24rem] rounded-full bg-warning/[0.1] blur-[100px]"
        />

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <ThresholdMark className="size-7 text-white" />
            <span className="font-display text-lg tracking-tight text-white">
              Dönüşüm<span className="text-clay-soft">Kapısı</span>
            </span>
          </Link>
        </div>

        <div className="relative max-w-md">
          <p className="font-mono text-[0.65rem] tracking-[0.22em] text-clay-soft uppercase">
            {t("sidebarEyebrow")}
          </p>
          <h2 className="mt-4 font-display text-3xl leading-[1.15] text-balance text-white xl:text-4xl">
            {t("sidebarHeadline")}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            {t("sidebarBody")}
          </p>

          <ul className="mt-10 space-y-4">
            {pillars.map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-clay/20 text-clay-soft">
                  <Icon className="size-4" />
                </span>
                <span className="text-sm leading-relaxed text-white/75">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-[0.65rem] tracking-wide text-white/35">
          {t("sidebarFooter")}
        </p>
      </aside>
    </div>
  );
}

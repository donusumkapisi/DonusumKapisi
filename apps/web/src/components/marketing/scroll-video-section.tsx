"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/motion/fade-in";

/**
 * Cinematic video block: as the section scrolls through the viewport, the
 * video card eases from slightly-scaled/rounded to full size and back — a
 * quiet "breathing" reveal rather than a hard cut. The source clip is shot
 * portrait, so the card is framed vertically rather than forced into a
 * landscape crop. Disabled for users who prefer reduced motion; the video
 * itself still plays (it's a silent ambient loop, not a parallax effect).
 */
export function ScrollVideoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations("scrollVideo");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.94]);
  const radius = useTransform(scrollYProgress, [0, 0.5, 1], [40, 20, 40]);

  return (
    <section ref={ref} className="bg-paper py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1fr_auto]">
        <FadeIn>
          <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 max-w-md font-display text-3xl text-ink sm:text-4xl">
            {t("titleBefore")} <span className="text-clay">{t("titleAccent")}</span> {t("titleAfter")}
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
            {t("description")}
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <motion.div
            style={prefersReducedMotion ? undefined : { scale, borderRadius: radius }}
            className="relative mx-auto aspect-[9/16] w-full max-w-[19rem] overflow-hidden shadow-2xl shadow-ink/25 sm:max-w-xs"
          >
            <video
              className="size-full object-cover"
              src="/video/kentsel-donusum.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0"
            />
            <div className="pointer-events-none absolute bottom-0 left-0 p-5">
              <p className="font-mono text-[0.65rem] tracking-[0.2em] text-white/70 uppercase">
                DönüşümKapısı
              </p>
              <p className="mt-1 text-sm text-white">
                {t("videoCaption")}
              </p>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}

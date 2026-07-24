import { cn } from "@/lib/utils";

/**
 * Mobil PageHero ile aynı dil: koyu `surface-strong` düzlem, altında hafif
 * kavis — ürün sayfalarının (vitrin, arama, blog) ortak giriş katmanı.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  className,
  actions,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-surface-strong text-on-strong",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 size-[28rem] rounded-full bg-clay/[0.12] blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-20 size-[22rem] rounded-full bg-warning/[0.08] blur-[90px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            {eyebrow ? (
              <p className="font-mono text-xs tracking-[0.22em] text-clay-soft uppercase">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-3 font-display text-3xl leading-[1.12] text-balance text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            {subtitle ? (
              <div className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-[0.95rem]">
                {subtitle}
              </div>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
        {children}
      </div>

      {/* Mobildeki kavisli hero alt kenarı */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-paper"
        style={{
          clipPath: "ellipse(70% 100% at 50% 100%)",
        }}
      />
    </section>
  );
}

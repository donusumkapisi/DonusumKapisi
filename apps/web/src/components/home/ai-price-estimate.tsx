"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";
import {
  Building2,
  Calendar,
  Layers,
  LocateFixed,
  MapPin,
  Ruler,
  Sparkles,
} from "lucide-react";
import { TURKISH_PROVINCES, getDistrictsForProvince } from "@donusum-kapisi/shared";
import { ShineButton } from "@/components/ui/shine-button";
import {
  estimatePriceAction,
  type PriceEstimateActionState,
} from "@/lib/actions/price-estimate";
import { formatPrice, formatPriceRange } from "@/lib/format";
import { cn } from "@/lib/utils";

const fieldShell =
  "group relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 transition-colors focus-within:border-clay/45 focus-within:bg-white/[0.07]";

const selectClassName =
  "w-full appearance-none bg-transparent text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-40 [&_option]:bg-paper [&_option]:text-ink";

const inputClassName =
  "w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35 disabled:opacity-40";

function FieldIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-clay/15 text-clay-soft">
      {children}
    </span>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("priceEstimate");
  return (
    <ShineButton type="submit" disabled={pending} className="h-12 w-full">
      {pending ? t("submitPending") : t("submit")}
    </ShineButton>
  );
}

function PriceBandVisual({
  min,
  max,
  average,
}: {
  min: number;
  max: number;
  average: number;
}) {
  const span = Math.max(max - min, 1);
  const pct = Math.min(100, Math.max(0, ((average - min) / span) * 100));

  return (
    <div className="mt-6">
      <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-clay/40 via-clay to-clay-soft" />
        <div
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-clay shadow-[0_0_16px_var(--clay)] transition-[left] duration-700 ease-out"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3 font-mono text-[0.65rem] tracking-wide text-white/45">
        <span className="max-w-[42%] text-left">{formatPrice(min)}</span>
        <span className="max-w-[42%] text-right">{formatPrice(max)}</span>
      </div>
    </div>
  );
}

function ResultStage({ state }: { state: PriceEstimateActionState }) {
  const t = useTranslations("priceEstimate");
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <div className="flex h-full min-h-[22rem] flex-col justify-center">
        <div className="flex items-center gap-3 text-clay-soft">
          <span className="size-2 animate-pulse rounded-full bg-clay" />
          <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase">
            {t("submitPending")}
          </p>
        </div>
        <div className="mt-8 space-y-3">
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-white/10" />
          <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
          <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="mt-6 flex items-end gap-2 opacity-50">
            {[0.4, 0.7, 1, 0.75, 0.5].map((h, i) => (
              <div
                key={i}
                className="w-full animate-pulse rounded-t-md bg-white/10"
                style={{ height: `${h * 5}rem` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (state?.result) {
    return (
      <div className="flex h-full min-h-[22rem] flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-clay-soft">
            <Sparkles className="size-4" />
            <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase">
              {t("resultEyebrow")}
            </p>
          </div>
          <p className="mt-5 font-display text-4xl leading-none tracking-tight text-white sm:text-5xl">
            {formatPrice(state.result.averagePrice)}
          </p>
          <p className="mt-3 text-sm text-white/55">
            {t("resultRange", {
              range: formatPriceRange(state.result.priceMin, state.result.priceMax),
            })}
          </p>
          <PriceBandVisual
            min={state.result.priceMin}
            max={state.result.priceMax}
            average={state.result.averagePrice}
          />
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-sm leading-relaxed text-white/70">{state.result.explanation}</p>
          <p className="mt-4 font-mono text-[0.6rem] tracking-wide text-white/35 uppercase">
            {state.result.sourceNote ??
              (state.result.source === "openai" ? t("sourceOpenAI") : t("sourceLocal"))}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden">
      <div>
        <p className="font-mono text-[0.65rem] tracking-[0.2em] text-clay-soft uppercase">
          {t("visualEyebrow")}
        </p>
        <p className="mt-4 max-w-sm font-display text-2xl leading-snug text-white/90 sm:text-3xl">
          {t("visualEmptyTitle")}
        </p>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/50">
          {t("visualEmptyBody")}
        </p>
      </div>

      <div aria-hidden className="pointer-events-none mt-10 flex items-end gap-2">
        {[0.42, 0.68, 1, 0.78, 0.55, 0.88, 0.48].map((h, i) => (
          <div
            key={i}
            className={cn(
              "w-full rounded-t-md border border-white/10 bg-gradient-to-t from-clay/25 to-white/[0.04]",
              i === 2 && "border-clay/40 from-clay/45"
            )}
            style={{ height: `${Math.round(h * 7.5)}rem` }}
          />
        ))}
      </div>
    </div>
  );
}

export function AiPriceEstimate() {
  const t = useTranslations("priceEstimate");
  const [state, formAction] = useActionState<PriceEstimateActionState, FormData>(
    estimatePriceAction,
    null
  );
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const districts = useMemo(() => getDistrictsForProvince(province), [province]);

  return (
    <form
      action={formAction}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface-strong shadow-[0_40px_80px_-40px_rgb(0_0_0_/_0.55)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 70% 60% at 30% 40%, black, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[-10%] size-[28rem] rounded-full bg-clay/[0.16] blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-20%] left-[-10%] size-[22rem] rounded-full bg-warning/[0.08] blur-[100px]"
      />

      <div className="relative grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-b border-white/10 p-6 sm:p-8 lg:border-r lg:border-b-0 lg:p-10">
          <p className="font-mono text-[0.65rem] tracking-[0.22em] text-clay-soft uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 max-w-md font-display text-3xl leading-[1.12] text-balance text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">{t("subtitle")}</p>

          <div className="mt-8 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={fieldShell}>
                <FieldIcon>
                  <MapPin className="size-4" />
                </FieldIcon>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.6rem] tracking-[0.14em] text-white/40 uppercase">
                    {t("provinceLabel")}
                  </span>
                  <select
                    name="province"
                    required
                    value={province}
                    onChange={(e) => {
                      setProvince(e.target.value);
                      setDistrict("");
                    }}
                    className={selectClassName}
                  >
                    <option value="" disabled>
                      {t("provincePlaceholder")}
                    </option>
                    {TURKISH_PROVINCES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </span>
              </label>

              <label
                className={cn(fieldShell, (!province || districts.length === 0) && "opacity-60")}
              >
                <FieldIcon>
                  <LocateFixed className="size-4" />
                </FieldIcon>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.6rem] tracking-[0.14em] text-white/40 uppercase">
                    {t("districtLabel")}
                  </span>
                  <select
                    name="district"
                    required
                    value={district}
                    disabled={!province || districts.length === 0}
                    onChange={(e) => setDistrict(e.target.value)}
                    className={selectClassName}
                  >
                    <option value="" disabled>
                      {t("districtPlaceholder")}
                    </option>
                    {districts.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </span>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className={fieldShell}>
                <FieldIcon>
                  <Ruler className="size-4" />
                </FieldIcon>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.6rem] tracking-[0.14em] text-white/40 uppercase">
                    {t("squareMetersLabel")}
                  </span>
                  <input
                    name="squareMeters"
                    type="number"
                    inputMode="numeric"
                    min={50}
                    required
                    placeholder="1200"
                    className={inputClassName}
                  />
                </span>
              </label>

              <label className={fieldShell}>
                <FieldIcon>
                  <Building2 className="size-4" />
                </FieldIcon>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.6rem] tracking-[0.14em] text-white/40 uppercase">
                    {t("unitCountLabel")}
                  </span>
                  <input
                    name="unitCount"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    required
                    placeholder="8"
                    className={inputClassName}
                  />
                </span>
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className={fieldShell}>
                <FieldIcon>
                  <Calendar className="size-4" />
                </FieldIcon>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.6rem] tracking-[0.14em] text-white/40 uppercase">
                    {t("buildingAgeLabel")}
                  </span>
                  <input
                    name="buildingAge"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    required
                    placeholder="35"
                    className={inputClassName}
                  />
                </span>
              </label>

              <label className={fieldShell}>
                <FieldIcon>
                  <Layers className="size-4" />
                </FieldIcon>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[0.6rem] tracking-[0.14em] text-white/40 uppercase">
                    {t("floorCountLabel")}
                  </span>
                  <input
                    name="floorCount"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    required
                    placeholder="5"
                    className={inputClassName}
                  />
                </span>
              </label>
            </div>

            {state?.error ? (
              <div
                role="alert"
                className="rounded-xl border border-danger/30 bg-danger/15 px-3.5 py-3 text-sm text-danger"
              >
                {state.error}
              </div>
            ) : null}

            <div className="pt-2">
              <SubmitButton />
            </div>

            <p className="pt-1 text-[0.7rem] leading-relaxed text-white/35">{t("disclaimer")}</p>
          </div>
        </div>

        <div className="relative bg-black/20 p-6 sm:p-8 lg:p-10">
          <ResultStage state={state} />
        </div>
      </div>
    </form>
  );
}

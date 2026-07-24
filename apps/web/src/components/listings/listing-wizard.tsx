"use client";

import { startTransition, useActionState, useMemo, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "motion/react";
import {
  Banknote,
  Building2,
  Calendar,
  Check,
  ImagePlus,
  Layers,
  MapPin,
  Ruler,
  UploadCloud,
  X,
} from "lucide-react";
import { GlowInput } from "@/components/ui/glow-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShineButton } from "@/components/ui/shine-button";
import { TURKISH_PROVINCES } from "@donusum-kapisi/shared";
import { createListingAction, type CreateListingState } from "@/lib/actions/listing";
import { MAX_PHOTOS } from "@donusum-kapisi/shared";
import { cn } from "@/lib/utils";
import { ListingLivePreview } from "@/components/listings/listing-live-preview";

const LocationPicker = dynamic(
  () => import("@/components/listings/location-picker").then((m) => m.LocationPicker),
  { ssr: false }
);

type FormValues = {
  title: string;
  province: string;
  district: string;
  squareMeters: string;
  buildingAge: string;
  floorCount: string;
  unitCount: string;
  priceMin: string;
  priceMax: string;
  description: string;
  latitude: string;
  longitude: string;
};

const EMPTY_VALUES: FormValues = {
  title: "",
  province: "",
  district: "",
  squareMeters: "",
  buildingAge: "",
  floorCount: "",
  unitCount: "",
  priceMin: "",
  priceMax: "",
  description: "",
  latitude: "",
  longitude: "",
};

export function ListingWizard() {
  const t = useTranslations("listingWizard");
  const stepTitles = [t("step1"), t("step2"), t("step3"), t("step4"), t("step5")];

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [values, setValues] = useState<FormValues>(EMPTY_VALUES);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState<CreateListingState, FormData>(
    createListingAction,
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoPreviews = useMemo(
    () => photos.map((file) => URL.createObjectURL(file)),
    [photos]
  );

  function update<K extends keyof FormValues>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function validateStep(target: number): string | null {
    if (target === 0) {
      if (values.title.trim().length < 10) return t("validationTitleMin");
      if (!values.province) return t("validationProvinceRequired");
      if (values.district.trim().length < 2) return t("validationDistrictRequired");
    }
    if (target === 1) {
      if (!values.squareMeters || Number(values.squareMeters) <= 0) return t("validationSquareMeters");
      if (values.buildingAge === "" || Number(values.buildingAge) < 0) return t("validationBuildingAge");
      if (!values.floorCount || Number(values.floorCount) <= 0) return t("validationFloorCount");
      if (!values.unitCount || Number(values.unitCount) <= 0) return t("validationUnitCount");
      if (!values.priceMin || Number(values.priceMin) <= 0) return t("validationPriceMin");
      if (!values.priceMax || Number(values.priceMax) <= 0) return t("validationPriceMax");
      if (Number(values.priceMax) < Number(values.priceMin))
        return t("validationPriceOrder");
    }
    if (target === 2) {
      if (values.description.trim().length < 30) return t("validationDescriptionMin");
    }
    if (target === 3) {
      if (photos.length === 0) return t("validationPhotosRequired");
    }
    return null;
  }

  function goNext() {
    const error = validateStep(step);
    if (error) {
      setStepError(error);
      return;
    }
    setStepError(null);
    setDirection(1);
    setStep((s) => Math.min(s + 1, stepTitles.length - 1));
  }

  function goBack() {
    setStepError(null);
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function addFiles(fileList: FileList | File[] | null) {
    if (!fileList) return;
    setPhotos((prev) => [...prev, ...Array.from(fileList)].slice(0, MAX_PHOTOS));
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit() {
    const error = validateStep(3);
    if (error) {
      setStepError(error);
      return;
    }
    const fd = new FormData();
    for (const [key, value] of Object.entries(values)) fd.append(key, value);
    for (const file of photos) fd.append("photos", file);
    startTransition(() => {
      formAction(fd);
    });
  }

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[1fr_36rem]">
      {/* Form column */}
      <div className="relative overflow-hidden px-6 py-12 sm:px-12 lg:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -left-24 size-[26rem] rounded-full bg-clay/[0.06] blur-[120px]"
        />

        <div className="relative mx-auto max-w-xl">
          <p className="font-mono text-xs tracking-[0.2em] text-clay uppercase">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-2xl text-ink">
            {t("title")}
          </h1>

          <Stepper current={step} stepTitles={stepTitles} />

          <div className="mt-8 min-h-[22rem]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {step === 0 && (
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="title" className="text-ink-muted">
                        {t("titleFieldLabel")}
                      </Label>
                      <GlowInput
                        id="title"
                        value={values.title}
                        onChange={(e) => update("title", e.target.value)}
                        placeholder={t("titleFieldPlaceholder")}
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label={t("provinceLabel")} htmlFor="province" icon={MapPin}>
                        <select
                          id="province"
                          value={values.province}
                          onChange={(e) => update("province", e.target.value)}
                          className="h-11 w-full rounded-lg border border-hairline bg-surface/60 px-3.5 text-sm text-ink outline-none focus-visible:border-clay/50"
                        >
                          <option value="">{t("provinceSelectPlaceholder")}</option>
                          {TURKISH_PROVINCES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label={t("districtLabel")} htmlFor="district" icon={MapPin}>
                        <GlowInput
                          id="district"
                          value={values.district}
                          onChange={(e) => update("district", e.target.value)}
                          placeholder={t("districtPlaceholder")}
                        />
                      </Field>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-ink-muted">
                        {t("mapLabel")}
                      </Label>
                      <LocationPicker
                        latitude={values.latitude ? Number(values.latitude) : undefined}
                        longitude={values.longitude ? Number(values.longitude) : undefined}
                        onChange={(lat, lng) => {
                          update("latitude", String(lat));
                          update("longitude", String(lng));
                        }}
                      />
                      <p className="text-xs text-ink-muted">
                        {t("mapHint")}
                      </p>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t("squareMetersLabel")} htmlFor="squareMeters" icon={Ruler}>
                      <GlowInput
                        id="squareMeters"
                        type="number"
                        min={1}
                        value={values.squareMeters}
                        onChange={(e) => update("squareMeters", e.target.value)}
                      />
                    </Field>
                    <Field label={t("buildingAgeLabel")} htmlFor="buildingAge" icon={Calendar}>
                      <GlowInput
                        id="buildingAge"
                        type="number"
                        min={0}
                        value={values.buildingAge}
                        onChange={(e) => update("buildingAge", e.target.value)}
                      />
                    </Field>
                    <Field label={t("floorCountLabel")} htmlFor="floorCount" icon={Layers}>
                      <GlowInput
                        id="floorCount"
                        type="number"
                        min={1}
                        value={values.floorCount}
                        onChange={(e) => update("floorCount", e.target.value)}
                      />
                    </Field>
                    <Field label={t("unitCountLabel")} htmlFor="unitCount" icon={Building2}>
                      <GlowInput
                        id="unitCount"
                        type="number"
                        min={1}
                        value={values.unitCount}
                        onChange={(e) => update("unitCount", e.target.value)}
                      />
                    </Field>
                    <Field label={t("priceMinLabel")} htmlFor="priceMin" icon={Banknote}>
                      <GlowInput
                        id="priceMin"
                        type="number"
                        min={1}
                        value={values.priceMin}
                        onChange={(e) => update("priceMin", e.target.value)}
                      />
                    </Field>
                    <Field label={t("priceMaxLabel")} htmlFor="priceMax" icon={Banknote}>
                      <GlowInput
                        id="priceMax"
                        type="number"
                        min={1}
                        value={values.priceMax}
                        onChange={(e) => update("priceMax", e.target.value)}
                      />
                    </Field>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-ink-muted">
                      {t("descriptionLabel")}
                    </Label>
                    <textarea
                      id="description"
                      rows={10}
                      value={values.description}
                      onChange={(e) => update("description", e.target.value)}
                      placeholder={t("descriptionPlaceholder")}
                      className="w-full rounded-lg border border-hairline bg-surface/60 p-3.5 text-sm text-ink outline-none focus-visible:border-clay/50"
                    />
                    <p className="text-xs text-ink-muted">
                      {t("descriptionCounter", { count: values.description.length })}
                    </p>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <p className="text-sm text-ink-muted">
                      {t("photosHint", { max: MAX_PHOTOS })}
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = "";
                      }}
                    />

                    {photos.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          addFiles(e.dataTransfer.files);
                        }}
                        className={cn(
                          "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-16 text-center transition-colors",
                          isDragging
                            ? "border-clay bg-clay/5"
                            : "border-hairline hover:border-clay/40"
                        )}
                      >
                        <span className="flex size-12 items-center justify-center rounded-full bg-surface text-clay">
                          <UploadCloud className="size-6" />
                        </span>
                        <span className="text-sm font-medium text-ink">
                          {t("dropzoneTitle")}
                        </span>
                        <span className="text-xs text-ink-muted">
                          {t("dropzoneSubtitle")}
                        </span>
                      </button>
                    ) : (
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                        {photoPreviews.map((src, i) => (
                          <motion.div
                            key={src}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square overflow-hidden rounded-lg border border-hairline"
                          >
                            <Image src={src} alt={t("photoAlt", { n: i + 1 })} fill className="object-cover" unoptimized />
                            {i === 0 && (
                              <span className="absolute bottom-1 left-1 rounded-full bg-white/90 px-1.5 py-0.5 font-mono text-[0.6rem] text-ink-muted">
                                {t("coverBadge")}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removePhoto(i)}
                              aria-label={t("removePhotoLabel")}
                              className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-ink/70 text-white hover:bg-danger"
                            >
                              <X className="size-3.5" />
                            </button>
                          </motion.div>
                        ))}
                        {photos.length < MAX_PHOTOS && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-hairline text-ink-muted transition-colors hover:border-clay/40 hover:text-clay"
                          >
                            <ImagePlus className="size-5" />
                            <span className="text-xs">{t("addPhotoLabel")}</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <p className="text-sm leading-relaxed whitespace-pre-line text-ink-muted">
                      {values.description}
                    </p>
                    <p className="rounded-xl bg-surface/60 p-4 text-xs text-ink-muted">
                      {t("previewApprovalNote")}
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {(stepError || state?.error) && (
            <p role="alert" className="mt-5 text-sm text-danger">
              {stepError ?? state?.error}
            </p>
          )}

          <div className="mt-8 flex items-center justify-between border-t border-hairline pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              disabled={step === 0}
              className={cn(step === 0 && "invisible")}
            >
              {t("backButton")}
            </Button>

            {step < stepTitles.length - 1 ? (
              <Button type="button" variant="cta" onClick={goNext}>
                {t("nextButton")}
              </Button>
            ) : (
              <ShineButton
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-auto px-7"
              >
                {isPending ? t("submitPending") : t("submitButton")}
              </ShineButton>
            )}
          </div>
        </div>
      </div>

      {/* Live preview column */}
      <div className="relative hidden overflow-hidden bg-surface-strong px-10 py-16 lg:flex lg:flex-col lg:justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/3 right-0 size-[24rem] translate-x-1/3 rounded-full bg-clay/[0.1] blur-[130px]"
        />
        <div className="relative">
          <ListingLivePreview
            title={values.title}
            province={values.province}
            district={values.district}
            squareMeters={values.squareMeters}
            floorCount={values.floorCount}
            unitCount={values.unitCount}
            priceMin={values.priceMin}
            priceMax={values.priceMax}
            photoPreview={photoPreviews[0]}
          />
          <p className="mt-6 text-xs leading-relaxed text-on-strong/45">
            {t("previewSidebarNote")}
          </p>
        </div>
      </div>
    </div>
  );
}

function Stepper({ current, stepTitles }: { current: number; stepTitles: string[] }) {
  return (
    <div className="mt-6 flex items-center">
      {stepTitles.map((title, i) => (
        <div key={title} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-[0.7rem] transition-colors",
                i < current
                  ? "border-clay bg-clay text-white"
                  : i === current
                    ? "border-clay text-clay"
                    : "border-hairline text-ink-muted/50"
              )}
            >
              {i < current ? <Check className="size-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                "hidden font-mono text-[0.6rem] tracking-wide uppercase sm:block",
                i === current ? "text-ink" : "text-ink-muted/50"
              )}
            >
              {title}
            </span>
          </div>
          {i < stepTitles.length - 1 && (
            <div
              className={cn(
                "mx-2 h-px flex-1 transition-colors",
                i < current ? "bg-clay" : "bg-hairline"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  icon: Icon,
  children,
}: {
  label: string;
  htmlFor?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="flex items-center gap-1.5 text-ink-muted">
        {Icon && <Icon className="size-3.5 text-clay" />}
        {label}
      </Label>
      {children}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ListingGallery({ photos, title }: { photos: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const t = useTranslations("listingDetail");

  if (photos.length === 0) {
    return (
      <div className="h-56 rounded-2xl border border-hairline bg-gradient-to-br from-petrol/25 via-surface to-clay/20 sm:h-72" />
    );
  }

  return (
    <div>
      <div className="relative h-56 overflow-hidden rounded-2xl border border-hairline sm:h-96">
        <Image
          src={photos[active]}
          alt={t("photoAlt", { title, n: active + 1 })}
          fill
          sizes="(min-width: 640px) 768px, 100vw"
          priority
          className="object-cover"
        />
      </div>
      {photos.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                i === active ? "border-clay" : "border-transparent hover:border-hairline"
              )}
            >
              <Image src={src} alt={t("thumbnailAlt", { title, n: i + 1 })} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

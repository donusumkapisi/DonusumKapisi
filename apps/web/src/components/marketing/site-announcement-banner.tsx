"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

type AnnouncementData = {
  id: string;
  title: string;
  body: string;
  imageUrl: string | null;
  linkUrl: string | null;
};

const storageKey = (id: string) => `dk-announcement-dismissed:${id}`;

function shouldHideOnPath(pathname: string) {
  return (
    pathname.startsWith("/panel") ||
    pathname.startsWith("/giris") ||
    pathname.startsWith("/kayit") ||
    pathname.startsWith("/sifre") ||
    pathname.startsWith("/oauth")
  );
}

export function SiteAnnouncementBanner({
  announcement,
}: {
  announcement: AnnouncementData;
}) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const titleId = useId();
  const bodyId = useId();
  const t = useTranslations("announcementBanner");

  useEffect(() => {
    if (shouldHideOnPath(pathname)) {
      setVisible(false);
      return;
    }
    try {
      if (localStorage.getItem(storageKey(announcement.id))) {
        setVisible(false);
        return;
      }
    } catch {
      // private mode / blocked storage
    }
    setVisible(true);
  }, [announcement.id, pathname]);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        try {
          localStorage.setItem(storageKey(announcement.id), "1");
        } catch {
          // ignore
        }
        setVisible(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [visible, announcement.id]);

  function dismiss() {
    try {
      localStorage.setItem(storageKey(announcement.id), "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible || shouldHideOnPath(pathname)) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-x-hidden p-4">
      <button
        type="button"
        aria-label={t("dismiss")}
        className="absolute inset-0 bg-surface-strong/75 backdrop-blur-sm"
        onClick={dismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={bodyId}
        className="relative z-10 flex w-full max-w-[22rem] flex-col overflow-hidden rounded-2xl border border-hairline bg-paper shadow-[0_24px_80px_-20px_rgba(0,0,0,0.55)] sm:max-w-sm"
      >
        <div className="h-1 w-full shrink-0 bg-gradient-to-r from-clay via-clay-soft to-clay" />

        <button
          type="button"
          onClick={dismiss}
          aria-label={t("dismiss")}
          className="absolute top-3.5 right-3 z-20 rounded-full border border-hairline bg-paper/95 p-1.5 text-ink-muted transition-colors hover:border-clay/30 hover:text-ink"
        >
          <X className="size-3.5" />
        </button>

        {announcement.imageUrl && (
          <div className="relative aspect-[2/1] w-full shrink-0 overflow-hidden bg-surface">
            <Image
              src={announcement.imageUrl}
              alt={announcement.title}
              fill
              className="object-cover"
              sizes="384px"
              priority
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent"
            />
          </div>
        )}

        <div className="flex min-w-0 flex-col px-5 pt-4 pb-5">
          <div className="flex items-center gap-2 pr-8">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-clay/15 text-clay">
              <Megaphone className="size-3.5" />
            </span>
            <p className="font-mono text-[0.65rem] tracking-[0.2em] text-clay uppercase">
              {t("eyebrow")}
            </p>
          </div>

          <h2
            id={titleId}
            className="mt-3 max-w-full font-display text-xl leading-snug break-words text-ink"
          >
            {announcement.title}
          </h2>

          <p
            id={bodyId}
            className="mt-2 max-h-40 max-w-full overflow-y-auto text-sm leading-relaxed break-words [overflow-wrap:anywhere] text-ink-muted"
          >
            {announcement.body}
          </p>

          <div className="mt-5 flex min-w-0 flex-col gap-2">
            {announcement.linkUrl && (
              <Button asChild variant="cta" className="h-10 w-full">
                <Link href={announcement.linkUrl} target="_blank" rel="noopener noreferrer">
                  {t("openLink")}
                </Link>
              </Button>
            )}
            <Button
              type="button"
              variant={announcement.linkUrl ? "outline" : "cta"}
              className="h-10 w-full"
              onClick={dismiss}
            >
              {t("close")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

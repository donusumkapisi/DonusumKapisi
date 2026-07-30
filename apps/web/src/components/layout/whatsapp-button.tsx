import { getTranslations } from "next-intl/server";
import { buildWhatsAppUrl } from "@/lib/contact";

/** Her ekranda sabit duran platform hattı kısayolu. */
export async function WhatsAppButton() {
  const [common, corporate] = await Promise.all([
    getTranslations("common"),
    getTranslations("corporate"),
  ]);
  const label = common("whatsappCta");

  return (
    <a
      href={buildWhatsAppUrl(corporate("contactWhatsApp"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[0_12px_28px_-8px_rgb(37_211_102_/_0.6)] transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#25d366] focus-visible:ring-offset-2 focus-visible:ring-offset-paper focus-visible:outline-none sm:right-6 sm:bottom-6"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-7" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.18 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
      </svg>
    </a>
  );
}

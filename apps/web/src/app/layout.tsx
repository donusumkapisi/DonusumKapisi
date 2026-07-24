import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { RTL_LOCALES, type Locale } from "@/i18n/locales";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const displayFace = Bricolage_Grotesque({
  variable: "--font-display-face",
  subsets: ["latin", "latin-ext"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DönüşümKapısı — Kentsel Dönüşümde Güvenli Eşleşme",
    template: "%s — DönüşümKapısı",
  },
  description:
    "Ev sahipleri ilan verir, müteahhitler teklif sunar. İletişim yalnızca DönüşümKapısı üzerinden yürür; eşleştirmeyi biz yönetiriz.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const dir = RTL_LOCALES.has(locale) ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${displayFace.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

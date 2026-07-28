"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/theme/language-switcher";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string };

function getInitials(name: string | null | undefined) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  const initials = parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return initials || "?";
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar({
  links,
  isAuthenticated,
  userName,
}: {
  links: NavLink[];
  isAuthenticated: boolean;
  userName: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-paper/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <BrandMark className="size-9 rounded-lg" />
          <span className="font-display text-base tracking-tight text-ink">
            Dönüşüm<span className="text-clay">Kapısı</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-surface text-ink font-medium"
                    : "text-ink-muted hover:bg-surface/70 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="ml-1 flex items-center gap-1 rounded-xl border border-hairline bg-surface/50 p-1 pl-1.5">
              <Link
                href="/panel"
                className="flex items-center gap-2 rounded-lg py-1 pr-2.5 text-sm font-medium text-ink transition-colors hover:text-clay"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-clay text-[0.65rem] font-semibold text-white">
                  {getInitials(userName)}
                </span>
                <span className="max-w-28 truncate">{userName}</span>
              </Link>
              <SignOutButton className="h-7 rounded-lg border-transparent bg-transparent px-2.5 text-xs text-ink-muted hover:bg-paper hover:text-ink" />
            </div>
          ) : (
            <>
              <Link
                href="/giris"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition-colors hover:text-ink"
              >
                {t("login")}
              </Link>
              <Link
                href="/ilan-ver"
                className="rounded-lg bg-clay px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-clay-soft"
              >
                {t("postListing")}
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={isOpen}
          className="flex size-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-surface hover:text-ink md:hidden"
        >
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-hairline md:hidden",
          isOpen ? "block" : "hidden"
        )}
      >
        <div className="mx-auto max-w-6xl space-y-1 px-4 py-3">
          {links.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-surface font-medium text-ink"
                    : "text-ink-muted hover:bg-surface/70 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="flex items-center gap-2 px-1 pt-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          <div className="space-y-2 pt-2">
            {isAuthenticated ? (
              <>
                <Link
                  href="/panel"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg border border-hairline bg-surface/50 px-3 py-2.5 text-center text-sm font-medium text-ink"
                >
                  {userName}
                </Link>
                <SignOutButton className="w-full justify-center" />
              </>
            ) : (
              <>
                <Link
                  href="/giris"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg border border-hairline px-3 py-2.5 text-center text-sm text-ink-muted"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/ilan-ver"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-lg bg-clay px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  {t("postListing")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

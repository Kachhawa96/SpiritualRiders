"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/lib/auth/actions";
import { useState } from "react";

interface AdminNavProps {
  userEmail: string;
  logoUrl?: string | null;
}

const NAV_LINKS = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/riders", label: "Riders" },
  { href: "/admin/onboarding", label: "Onboarding" },
  { href: "/admin/rides", label: "Rides" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Settings" },
];


export function AdminNav({ userEmail, logoUrl }: AdminNavProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal-600 bg-obsidian-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand & Badge */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            {logoUrl ? (
              <div className="relative size-8 shrink-0 overflow-hidden">
                <Image
                  src={logoUrl}
                  alt="Spiritual Riders"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
            ) : null}
            <span className="font-display text-lg font-semibold tracking-[0.2em] text-ivory-100">
              SPIRITUAL RIDERS
            </span>
            <span className="rounded-sm border border-gold-500/40 bg-gold-500/10 px-2 py-0.5 text-[0.62rem] font-medium tracking-[0.22em] text-gold-400">
              ADMIN
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex md:items-center md:gap-1 lg:ml-6">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-sm px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                    active
                      ? "border border-gold-500/30 bg-charcoal-700/60 text-gold-400"
                      : "text-graphite-300 hover:bg-charcoal-700/30 hover:text-ivory-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge, Public Site Link & Sign Out */}
        <div className="hidden items-center gap-4 sm:flex">
          <span className="text-xs text-graphite-300">
            Signed in as{" "}
            <span className="font-medium text-ivory-100">{userEmail}</span>
          </span>

          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs tracking-wider text-graphite-300 transition-colors hover:text-gold-400"
          >
            <span>Public Site</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </Link>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="cursor-pointer rounded-sm border border-charcoal-500 bg-transparent px-3 py-1 text-xs uppercase tracking-[0.18em] text-graphite-300 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
            >
              Sign Out
            </button>
          </form>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="cursor-pointer rounded-sm border border-charcoal-600 p-2 text-graphite-300 hover:text-ivory-100"
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-charcoal-600 bg-obsidian-900 px-4 py-3 sm:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-sm px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] ${
                    active
                      ? "border border-gold-500/30 bg-charcoal-700/60 text-gold-400"
                      : "text-graphite-300 hover:bg-charcoal-700/30 hover:text-ivory-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-3 border-t border-charcoal-700 pt-3">
              <p className="text-xs text-graphite-300">
                Logged in: <span className="text-ivory-100">{userEmail}</span>
              </p>
              <div className="mt-2 flex items-center justify-between">
                <Link
                  href="/"
                  target="_blank"
                  className="text-xs text-gold-400 hover:underline"
                >
                  View Public Site ↗
                </Link>
                <form action={logoutAdmin}>
                  <button
                    type="submit"
                    className="cursor-pointer text-xs uppercase tracking-wider text-red-400"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/config/site";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/layout/BrandMark";
import { PrimaryLink } from "@/components/layout/PrimaryLink";

interface HeaderProps {
  menuOpen: boolean;
  menuId: string;
  onMenuOpen: () => void;
  inert?: boolean;
  logoUrl?: string | null;
}

export function Header({ menuOpen, menuId, onMenuOpen, inert = false, logoUrl }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 8;
      setScrolled((current) => (current === next ? current : next));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      inert={inert ? true : undefined}
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-border-subtle bg-obsidian-950/80 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <BrandMark logoUrl={logoUrl} />

        <nav className="hidden items-center gap-5 lg:flex xl:gap-8" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <PrimaryLink
              key={item.href}
              item={item}
              className="group relative py-2 text-[0.68rem] uppercase tracking-[0.16em] transition-colors duration-300 hover:text-ivory-100 xl:tracking-[0.22em]"
              idleClassName="text-graphite-200"
              activeClassName="text-gold-400"
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold-500 transition-transform duration-300 group-hover:scale-x-100 group-data-[active=true]:scale-x-100 motion-reduce:transition-none motion-reduce:transform-none"
              />
            </PrimaryLink>
          ))}
        </nav>

        <button
          type="button"
          className="grid size-11 cursor-pointer place-items-center border border-border text-foreground lg:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label="Open menu"
          onClick={onMenuOpen}
        >
          <span className="relative block h-3 w-5" aria-hidden="true">
            <span className="absolute top-0 left-0 h-px w-full bg-current" />
            <span className="absolute top-1.5 left-0 h-px w-full bg-current" />
            <span className="absolute top-3 left-0 h-px w-full bg-current" />
          </span>
        </button>
      </div>
    </header>
  );
}

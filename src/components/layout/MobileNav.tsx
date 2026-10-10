"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef } from "react";
import { NAV_ITEMS, SITE_CONFIG } from "@/config/site";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useEscapeKey } from "@/lib/accessibility";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/layout/BrandMark";
import { PrimaryLink } from "@/components/layout/PrimaryLink";

interface MobileNavProps {
  id: string;
  onClose: () => void;
  email?: string;
  tagline?: string;
  logoUrl?: string | null;
}

export function MobileNav({ id, onClose, email, tagline, logoUrl }: MobileNavProps) {
  const titleId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useFocusTrap(true, containerRef);
  useBodyScrollLock(true);
  useEscapeKey(onClose);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 lg:hidden"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: DURATION.normal, ease: EASE_OUT_EXPO }}
    >
      <div
        ref={containerRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex h-full justify-end"
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0 cursor-pointer bg-obsidian-950/75 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <motion.div
          data-motion-reveal
          className="relative z-10 flex h-full w-full flex-col bg-obsidian-950 px-6 py-5 sm:max-w-md sm:border-l sm:border-border-subtle"
          initial={shouldReduceMotion ? false : { x: "100%" }}
          animate={{ x: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { x: "100%" }}
          transition={shouldReduceMotion ? { duration: 0 } : { duration: DURATION.slow, ease: EASE_OUT_EXPO }}
        >
          <h2 id={titleId} className="sr-only">
            Menu
          </h2>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="order-2 grid size-11 cursor-pointer place-items-center border border-border text-foreground transition-colors duration-150 active:scale-[0.98] motion-reduce:transform-none"
            >
              <span aria-hidden="true" className="text-2xl leading-none">
                ×
              </span>
            </button>
            <BrandMark compact logoUrl={logoUrl} className="order-1" onNavigate={onClose} />
          </div>

          <nav className="mt-12 flex-1 overflow-y-auto" aria-label="Mobile">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item, index) => (
                <motion.li
                  key={item.href}
                  data-motion-reveal
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : {
                          duration: DURATION.normal,
                          delay: 0.08 + index * 0.045,
                          ease: EASE_OUT_EXPO,
                        }
                  }
                >
                  <PrimaryLink
                    item={item}
                    onNavigate={onClose}
                    className="group flex items-baseline gap-4 border-b border-border-subtle py-4"
                    idleClassName="text-foreground"
                    activeClassName="text-gold-400"
                  >
                    <span className="w-8 shrink-0 font-sans text-[0.65rem] tracking-[0.2em] text-gold-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-4xl leading-none font-medium">
                        {item.label}
                      </span>
                      {item.description ? (
                        <span
                          className={cn(
                            "mt-2 block max-w-none text-xs tracking-normal normal-case",
                            "text-graphite-300"
                          )}
                        >
                          {item.description}
                        </span>
                      ) : null}
                    </span>
                  </PrimaryLink>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="pt-8">
            <p className="max-w-none text-[0.65rem] uppercase tracking-[0.32em] text-graphite-400">
              {tagline || SITE_CONFIG.tagline}
            </p>
            <a
              href={`mailto:${email || SITE_CONFIG.email}`}
              className="mt-3 inline-block text-sm text-gold-400"
            >
              {email || SITE_CONFIG.email}
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

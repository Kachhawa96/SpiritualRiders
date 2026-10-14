"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SITE_CONFIG } from "@/config/site";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface HeroSplashLoaderProps {
  logoImageUrl?: string | null;
  shouldReduceMotion?: boolean | null;
}

export function HeroSplashLoader({
  logoImageUrl,
  shouldReduceMotion = false,
}: HeroSplashLoaderProps) {
  const effectiveLogo = logoImageUrl || "/Brand-logo-official.png";
  const isSvg = Boolean(
    effectiveLogo &&
      (effectiveLogo.toLowerCase().includes(".svg") ||
        effectiveLogo.toLowerCase().includes("image/svg+xml"))
  );

  return (
    <motion.div
      key="hero-logo-splash"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: {
          duration: shouldReduceMotion ? 0.35 : 0.85,
          ease: EASE_OUT_EXPO,
        },
      }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-obsidian-950 overflow-hidden pointer-events-none select-none"
      role="status"
      aria-live="polite"
      aria-label="Loading Spiritual Riders"
    >
      {/* Background radial gold glow for ambient depth */}
      <motion.div
        className="pointer-events-none absolute h-[34rem] w-[34rem] rounded-full bg-gold-500/8 blur-3xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0.3 : 1.4, ease: "easeOut" }}
      />

      {/* Centered Logo & Brand Group */}
      <div className="relative flex flex-col items-center">
        {/* Soft gold glow effect directly surrounding the logo */}
        <motion.div
          className="pointer-events-none absolute -inset-6 rounded-full bg-gold-500/25 blur-2xl"
          initial={shouldReduceMotion ? { opacity: 0.4 } : { opacity: 0, scale: 0.85 }}
          animate={
            shouldReduceMotion
              ? { opacity: 0.4 }
              : {
                  opacity: [0.3, 0.65, 0.4],
                  scale: [0.92, 1.06, 0.96],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 2.8,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }
          }
        />

        {/* Logo Card with Gentle Zoom-in (0.92 to 1.0) and Fade-in */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{
            duration: shouldReduceMotion ? 0.35 : 1.2,
            ease: EASE_OUT_EXPO,
          }}
          className="relative flex items-center justify-center"
        >
          {effectiveLogo ? (
            <div className="relative size-24 sm:size-28 md:size-32 overflow-hidden rounded-full border border-gold-500/40 bg-obsidian-900/80 p-3 shadow-[0_0_35px_rgba(209,160,84,0.22)] backdrop-blur-md">
              <Image
                src={effectiveLogo}
                alt={SITE_CONFIG.name}
                fill
                priority
                sizes="(min-width: 768px) 128px, 112px"
                className="object-contain p-2"
                unoptimized={isSvg}
              />
            </div>
          ) : (
            <div className="grid size-24 sm:size-28 md:size-32 place-items-center rounded-full border border-gold-500/60 bg-obsidian-900/80 shadow-[0_0_35px_rgba(209,160,84,0.22)] backdrop-blur-md">
              <span className="font-display text-3xl sm:text-4xl font-bold tracking-[0.2em] text-gold-400 pl-1">
                SR
              </span>
            </div>
          )}
        </motion.div>

        {/* Refined Brand Emblem Typography */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{
            delay: shouldReduceMotion ? 0 : 0.25,
            duration: 0.8,
            ease: EASE_OUT_EXPO,
          }}
          className="mt-6 flex flex-col items-center text-center"
        >
          <span className="font-display text-lg sm:text-xl font-bold tracking-[0.28em] uppercase text-ivory-100">
            {SITE_CONFIG.name}
          </span>
          <span className="mt-1 text-[0.62rem] sm:text-[0.68rem] tracking-[0.45em] uppercase text-gold-400 font-mono">
            Brotherhood · Spirit
          </span>
        </motion.div>

        {/* Delicate Golden Shimmer Line */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { width: 0, opacity: 0 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { width: "3.5rem", opacity: 1 }}
          transition={{
            delay: shouldReduceMotion ? 0 : 0.4,
            duration: 0.8,
            ease: EASE_OUT_EXPO,
          }}
          className="mt-4 h-[1.5px] bg-gradient-to-r from-transparent via-gold-500/80 to-transparent"
        />
      </div>
    </motion.div>
  );
}

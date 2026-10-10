"use client";

import { useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/config/site";
import { EASE_OUT_EXPO } from "@/lib/motion";

interface HeroClientProps {
  heroImageUrl: string | null;
}

function subscribeDesktopQuery(callback: () => void) {
  const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function getDesktopServerSnapshot() {
  return false;
}

export function HeroClient({ heroImageUrl }: HeroClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const isDesktop = useSyncExternalStore(
    subscribeDesktopQuery,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );

  // Spring-smoothed mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 120, mass: 0.6 };
  const smoothParallaxX = useSpring(mouseX, springConfig);
  const smoothParallaxY = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isDesktop || shouldReduceMotion) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // Normalize mouse coordinates from -1 to 1 around screen center
      const normX = (clientX / innerWidth - 0.5) * 2;
      const normY = (clientY / innerHeight - 0.5) * 2;
      // Low-intensity offset (max ±12px horizontal, ±10px vertical)
      mouseX.set(normX * -12);
      mouseY.set(normY * -10);
    },
    [isDesktop, shouldReduceMotion, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Motion variants for text settle animation
  const settleVariants = {
    hidden: (custom?: { y?: number }) =>
      shouldReduceMotion
        ? { opacity: 1, y: 0 }
        : { opacity: 0, y: custom?.y ?? 16 },
    visible: (custom?: { delay?: number }) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        delay: custom?.delay ?? 0,
        ease: EASE_OUT_EXPO,
      },
    }),
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative -mt-20 flex min-h-svh flex-col overflow-hidden"
    >
      {/* Background layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {heroImageUrl ? (
          <div className="absolute inset-0">
            {/* Cinematic Background Image with Slow Drift & Subtle Mouse Parallax */}
            <motion.div
              className="absolute -inset-6 sm:-inset-8 will-change-transform"
              style={
                isDesktop && !shouldReduceMotion
                  ? { x: smoothParallaxX, y: smoothParallaxY }
                  : undefined
              }
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.045],
                    }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 20,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatType: "reverse",
                    }
              }
            >
              <Image
                src={heroImageUrl}
                alt="Spiritual Riders brotherhood on the road"
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>

            {/* Dark Vignette & Atmospheric Gradients */}
            {/* 1. Base dark tint to preserve contrast across all screens */}
            <div className="absolute inset-0 bg-obsidian-950/60" />

            {/* 2. Vertical gradient: deeper at the bottom where text and next sections reside */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/75 to-obsidian-950/25" />

            {/* 3. Horizontal gradient: deep from the left to protect the heading & body typography */}
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/90 via-obsidian-950/50 to-transparent" />

            {/* 4. Top radial gold glow for brotherhood warmth */}
            <div className="absolute -top-24 right-0 h-[36rem] w-[36rem] rounded-full bg-gold-500/10 blur-3xl" />
          </div>
        ) : (
          /* Procedural drift & road SVG fallback when no image is configured */
          <motion.div
            className="hero-drift absolute -inset-6 sm:-inset-8 will-change-transform"
            style={
              isDesktop && !shouldReduceMotion
                ? { x: smoothParallaxX, y: smoothParallaxY }
                : undefined
            }
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    scale: [1, 1.04],
                  }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : {
                    duration: 22,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }
            }
          >
            <div className="absolute inset-0 bg-obsidian-950" />
            <div className="absolute -top-24 right-0 h-[36rem] w-[36rem] rounded-full bg-gold-500/10 blur-3xl" />
            <svg
              className="absolute inset-x-0 bottom-0 h-[70%] w-full"
              viewBox="0 0 800 900"
              preserveAspectRatio="xMidYMax slice"
              fill="none"
            >
              <path d="M400 0 L640 900" stroke="oklch(75% 0.13 80)" strokeOpacity="0.45" />
              <path d="M400 0 L160 900" stroke="oklch(75% 0.13 80)" strokeOpacity="0.45" />
              <path d="M360 280 H440" stroke="oklch(96% 0.01 90)" strokeOpacity="0.2" />
              <path d="M300 520 H500" stroke="oklch(96% 0.01 90)" strokeOpacity="0.12" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/75 to-obsidian-950/25" />
          </motion.div>
        )}

        {/* Signature architectural gold line */}
        <div className="absolute inset-y-0 left-[8%] hidden w-px bg-gradient-to-b from-transparent via-gold-500/40 to-transparent md:block" />
      </div>

      {/* Hero Content with Refined Text Settle Animation */}
      <Container className="relative z-10 mt-auto pt-32 pb-16 md:pb-20">
        {/* Eyebrow */}
        <motion.p
          data-motion-reveal
          variants={settleVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          custom={{ delay: 0.05, y: 12 }}
          className="mb-8 max-w-none text-[0.68rem] uppercase tracking-[0.42em] text-gold-500"
        >
          Est. {SITE_CONFIG.foundedYear} — The Brotherhood
        </motion.p>

        {/* Headline (LCP-safe upward settle with subtle opacity) */}
        <motion.h1
          data-motion-reveal
          variants={settleVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          custom={{ delay: 0.12, y: 16 }}
          className="max-w-5xl font-medium text-foreground text-balance"
        >
          Ride Beyond Roads.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          data-motion-reveal
          variants={settleVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          custom={{ delay: 0.22, y: 14 }}
          className="mt-8 max-w-2xl font-display text-2xl leading-snug font-medium text-ivory-100 italic md:text-3xl"
        >
          More than riders. One spirit.
        </motion.p>

        {/* Description Body */}
        <motion.p
          data-motion-reveal
          variants={settleVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          custom={{ delay: 0.32, y: 12 }}
          className="mt-5 max-w-xl text-graphite-300"
        >
          A crew bound by machines, miles, and the quiet code of the road.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          data-motion-reveal
          variants={settleVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          custom={{ delay: 0.42, y: 12 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Button href="#intro">Enter the chapter</Button>
          <Button href="/riders" variant="outline">
            The brotherhood
          </Button>
        </motion.div>

        {/* Scroll Cue */}
        <motion.div
          data-motion-reveal
          variants={settleVariants}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          custom={{ delay: 0.52, y: 8 }}
        >
          <a
            href="#intro"
            className="group mt-16 inline-flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.38em] text-graphite-300 transition-colors duration-200 hover:text-gold-400"
          >
            <span
              className="h-px w-12 bg-gold-500/80 transition-all duration-300 group-hover:w-16 group-hover:bg-gold-400 motion-reduce:transition-none"
              aria-hidden="true"
            />
            Scroll
          </a>
        </motion.div>
      </Container>
    </section>
  );
}

"use client";

/**
 * Reveal — fade and rise when the block enters the viewport.
 * The headline of a page should stay outside this wrapper so LCP text paints immediately.
 * `data-motion-reveal` is forced visible under reduced motion and without JavaScript.
 */

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      data-motion-reveal
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: DURATION.slower,
        delay,
        ease: EASE_OUT_EXPO,
      }}
    >
      {children}
    </motion.div>
  );
}

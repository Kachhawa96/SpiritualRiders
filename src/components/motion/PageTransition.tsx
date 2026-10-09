"use client";

/**
 * Page enter — a short vertical settle.
 * Opacity stays at 1 so the first paint is not blank.
 * Exit animations are intentionally omitted: the App Router unmounts the
 * previous template immediately, and a frozen router is not worth it here.
 */

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      data-motion-reveal
      initial={{ opacity: 1, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.normal, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

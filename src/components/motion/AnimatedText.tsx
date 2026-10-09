"use client";

/**
 * AnimatedText — word settle. Opacity stays at 1 so the heading can be the LCP element.
 * A mask mode exists for below-fold lines; the hero should use the default settle mode.
 */

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TextTag = "h1" | "h2" | "h3" | "p" | "span";

interface AnimatedTextProps {
  text: string;
  as?: TextTag;
  className?: string;
  delay?: number;
  mode?: "settle" | "mask";
}

const tags = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

export function AnimatedText({
  text,
  as = "span",
  className,
  delay = 0,
  mode = "settle",
}: AnimatedTextProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = as;
    return <Tag className={cn("text-balance", className)}>{text}</Tag>;
  }

  const Tag = tags[as];
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag className={cn("text-balance", className)} data-motion-reveal>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Word
            key={`${word}-${index}`}
            delay={delay + Math.min(index, 12) * 0.055}
            mode={mode}
            spaced={index < words.length - 1}
          >
            {word}
          </Word>
        ))}
      </span>
    </Tag>
  );
}

function Word({
  children,
  delay,
  mode,
  spaced,
}: {
  children: ReactNode;
  delay: number;
  mode: "settle" | "mask";
  spaced: boolean;
}) {
  const masked = mode === "mask";

  return (
    <>
      <span className={cn("inline-block", masked && "overflow-hidden align-bottom")}>
        <motion.span
          className="inline-block"
          initial={masked ? { y: "110%" } : { y: "0.2em" }}
          animate={{ y: "0em" }}
          transition={{
            duration: DURATION.slower,
            delay,
            ease: EASE_OUT_EXPO,
          }}
        >
          {children}
        </motion.span>
      </span>
      {spaced ? " " : null}
    </>
  );
}

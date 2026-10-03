/**
 * Shared motion language for the Spiritual Riders shell.
 * Durations mirror the CSS tokens in globals.css (milliseconds → seconds).
 */

import type { Transition } from "motion/react";

export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.16, 1, 0.3, 1,
];

export const EASE_IN_OUT_EXPO: [number, number, number, number] = [
  0.87, 0, 0.13, 1,
];

export const DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  cinematic: 1.2,
} as const;

export function enterTransition(delay = 0): Transition {
  return {
    duration: DURATION.slower,
    delay,
    ease: EASE_OUT_EXPO,
  };
}

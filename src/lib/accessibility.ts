/**
 * Accessibility utilities for Spiritual Riders.
 *
 * Provides hooks and helpers for:
 * - prefers-reduced-motion detection
 * - focus management
 * - keyboard navigation helpers
 * - ARIA labeling utilities
 */

"use client";

import { useEffect, useState, useCallback } from "react";

// ── prefers-reduced-motion ────────────────────────────────────────────────────

/**
 * Returns true when the user prefers reduced motion.
 * Always returns false on the server (SSR-safe).
 * All animations MUST respect this preference.
 */
export function usePrefersReducedMotion(): boolean {
  // Lazy initializer reads the media query once on mount (no setState in effect body)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(
    () => {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Only subscribe to future changes — initial value already set above
    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

// ── Focus trap ────────────────────────────────────────────────────────────────

/** Selectors for all focusable elements in a container */
const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

/**
 * Returns all focusable elements within the given container.
 */
export function getFocusableElements(
  container: HTMLElement
): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
  );
}

// ── Keyboard navigation ───────────────────────────────────────────────────────

/** Common keyboard key codes */
export const Keys = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
} as const;

// ── useEscapeKey ─────────────────────────────────────────────────────────────

/**
 * Fires `onEscape` callback when the Escape key is pressed.
 * Useful for closing modals, menus, lightboxes.
 */
export function useEscapeKey(onEscape: () => void): void {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === Keys.ESCAPE) {
        onEscape();
      }
    },
    [onEscape]
  );

  useEffect(() => {
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [handler]);
}

// ── ARIA helpers ──────────────────────────────────────────────────────────────

/**
 * Generates a stable unique ID for ARIA relationships.
 * Prefer using React's useId() hook where available.
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

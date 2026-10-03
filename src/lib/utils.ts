/**
 * General utility functions for Spiritual Riders.
 */

// ── Class name merging ────────────────────────────────────────────────────────

/**
 * Lightweight class name joiner.
 * Filters out falsy values (undefined, null, false, "").
 */
export function cn(
  ...classes: (string | undefined | null | false | 0)[]
): string {
  return classes.filter(Boolean).join(" ");
}

// ── String utilities ──────────────────────────────────────────────────────────

/**
 * Converts a string to a URL-friendly slug.
 * Example: "Vikram Rathore" → "vikram-rathore"
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncates a string to a maximum length with an ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1).trimEnd() + "…";
}

/**
 * Capitalizes the first character of a string.
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ── Date utilities ────────────────────────────────────────────────────────────

/**
 * Formats an ISO date string to a human-readable format.
 * Example: "2024-03-15" → "March 15, 2024"
 */
export function formatDate(
  dateStr: string,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };
  return new Date(dateStr).toLocaleDateString("en-IN", defaultOptions);
}

/**
 * Returns the year from an ISO date string.
 */
export function getYear(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

/**
 * Returns years of experience from a starting year.
 * Example: riding since 2015 → "9 years"
 */
export function yearsExperience(since: number): string {
  const years = new Date().getFullYear() - since;
  return `${years} year${years !== 1 ? "s" : ""}`;
}

// ── Number utilities ──────────────────────────────────────────────────────────

/**
 * Formats a number with locale-aware thousands separators.
 * Example: 12500 → "12,500"
 */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

// ── Array utilities ───────────────────────────────────────────────────────────

/**
 * Returns a shuffled copy of an array (Fisher-Yates).
 */
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns n random items from an array.
 */
export function sampleArray<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

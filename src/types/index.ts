/**
 * Core shared types for Spiritual Riders.
 * These are base primitives used across the entire application.
 */

// ── Utility types ─────────────────────────────────────────────────────────────

/** ISO 8601 date string */
export type ISODateString = string;

/** URL-friendly identifier */
export type Slug = string;

/** Social media platforms supported */
export type SocialPlatform = "instagram" | "facebook" | "youtube" | "website";

// ── Navigation ────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

// ── SEO / Metadata ────────────────────────────────────────────────────────────

export interface PageSEO {
  title: string;
  description: string;
  ogImage?: string;
  noIndex?: boolean;
}

// ── Generic API response ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// ── Image ─────────────────────────────────────────────────────────────────────

export interface AppImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataUrl?: string;
}

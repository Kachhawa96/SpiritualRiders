/**
 * Site-wide configuration constants for Spiritual Riders.
 * Import from here — never hardcode these values in components.
 */

import type { NavItem } from "@/types";

// ── Identity ──────────────────────────────────────────────────────────────────

export const SITE_CONFIG = {
  name: "Spiritual Riders",
  tagline: "Riders. Brotherhood. Spirit.",
  description:
    "A premium motorcycle brotherhood built on passion, respect, and the open road.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://spiritualriders.in",
  email: "contact@spiritualriders.in",
  foundedYear: 2020,
} as const;

// ── Navigation ────────────────────────────────────────────────────────────────

/**
 * Routes that currently render a real page.
 * Navigation prefetches only these so later-phase URLs do not 404 in the background.
 * Add a path when its phase ships.
 */
export const LIVE_ROUTES = ["/", "/about", "/riders"] as const;

export function isLiveRoute(href: string): boolean {
  return (LIVE_ROUTES as readonly string[]).includes(href);
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about", description: "Our story and values" },
  {
    label: "The Crew",
    href: "/riders",
    description: "Meet the brotherhood",
  },
  {
    label: "Rides",
    href: "/rides",
    description: "Community rides and events",
  },
  {
    label: "Gallery",
    href: "/gallery",
    description: "Moments from the road",
  },
  { label: "Contact", href: "/contact", description: "Join the brotherhood" },
];

// ── Routes ────────────────────────────────────────────────────────────────────

export const ROUTES = {
  home: "/",
  about: "/about",
  riders: "/riders",
  rider: (slug: string) => `/riders/${slug}`,
  rides: "/rides",
  ride: (slug: string) => `/rides/${slug}`,
  gallery: "/gallery",
  contact: "/contact",
} as const;

// ── Social ────────────────────────────────────────────────────────────────────

export const SOCIAL_LINKS = {
  instagram: null as string | null,
  facebook: null as string | null,
  youtube: null as string | null,
} as const;

// ── Pagination ────────────────────────────────────────────────────────────────

export const PAGINATION = {
  ridersPerPage: 12,
  ridesPerPage: 9,
  galleryPerPage: 24,
} as const;

// ── Image defaults ────────────────────────────────────────────────────────────

export const IMAGE_DEFAULTS = {
  riderPlaceholder: "/images/placeholder-rider.jpg",
  bikePlaceholder: "/images/placeholder-bike.jpg",
  ridePlaceholder: "/images/placeholder-ride.jpg",
} as const;

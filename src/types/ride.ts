/**
 * Ride / Event data model for Spiritual Riders community.
 */

import type { ISODateString, Slug, AppImage } from "./index";

// ── Enumerations ──────────────────────────────────────────────────────────────

export type RideStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export type RideType =
  | "day-ride"
  | "weekend-ride"
  | "tour"
  | "charity"
  | "meetup"
  | "dawn-patrol"
  | "night-ride";

// ── Ride ──────────────────────────────────────────────────────────────────────

export interface Ride {
  id: string;
  slug: Slug;

  title: string;
  tagline: string | null;
  description: string;
  short_description: string;

  cover_image: AppImage | null;
  gallery: AppImage[];

  type: RideType;
  status: RideStatus;

  start_date: ISODateString;
  end_date: ISODateString | null;
  distance_km: number | null;
  route_summary: string | null;
  meeting_point: string | null;

  participant_count: number;
  is_featured: boolean;

  created_at: ISODateString;
  updated_at: ISODateString;
}

/** Compact ride card for listings */
export interface RideCard {
  id: string;
  slug: Slug;
  title: string;
  tagline: string | null;
  short_description: string;
  cover_image: AppImage | null;
  type: RideType;
  status: RideStatus;
  start_date: ISODateString;
  distance_km: number | null;
  participant_count: number;
  is_featured: boolean;
}

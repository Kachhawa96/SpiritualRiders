/**
 * Rider data model for Spiritual Riders community.
 *
 * Privacy flags (show_*) must be respected in UI, API responses,
 * metadata, and structured data — never expose private fields.
 */

import type { ISODateString, Slug, AppImage } from "./index";

// ── Enumerations ──────────────────────────────────────────────────────────────

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type RidingStyle =
  | "touring"
  | "adventure"
  | "cruiser"
  | "sport"
  | "naked"
  | "offroad"
  | "commuter";

export type CommunityPosition =
  | "founder"
  | "co-founder"
  | "president"
  | "vice-president"
  | "secretary"
  | "treasurer"
  | "captain"
  | "co-captain"
  | "member"
  | "prospect";

// ── Rider ─────────────────────────────────────────────────────────────────────

export interface Rider {
  id: string;
  slug: Slug;

  // Identity
  full_name: string;
  display_name: string;
  profile_image: AppImage | null;
  cover_image: AppImage | null;

  // Personal (privacy-controlled)
  age: number | null;
  blood_group: BloodGroup | null;
  city: string | null;

  // Community
  community_position: CommunityPosition;
  bio: string;
  short_bio: string;
  joined_date: ISODateString;

  // Motorcycle
  bike_brand: string;
  bike_model: string;
  bike_variant: string | null;
  bike_year: number;
  bike_color: string | null;
  bike_image: AppImage | null;

  // Riding profile
  riding_since: number | null;
  riding_style: RidingStyle[];
  favorite_route: string | null;

  // Achievements
  achievements: string[];

  // Social links (privacy-controlled)
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  website_url: string | null;

  // Privacy flags — MUST be enforced before exposing any field
  show_age: boolean;
  show_blood_group: boolean;
  show_city: boolean;
  show_social_links: boolean;

  // Status
  is_featured: boolean;
  is_active: boolean;

  // Timestamps
  created_at: ISODateString;
  updated_at: ISODateString;
}

/** Public-safe rider view — privacy flags already applied */
export type PublicRider = Omit<
  Rider,
  | "age"
  | "blood_group"
  | "city"
  | "instagram_url"
  | "facebook_url"
  | "youtube_url"
  | "website_url"
  | "show_age"
  | "show_blood_group"
  | "show_city"
  | "show_social_links"
> & {
  age: number | null;
  blood_group: BloodGroup | null;
  city: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
};

/** Compact rider card representation for listings */
export interface RiderCard {
  id: string;
  slug: Slug;
  display_name: string;
  short_bio: string;
  community_position: CommunityPosition;
  profile_image: AppImage | null;
  bike_brand: string;
  bike_model: string;
  bike_image: AppImage | null;
  city: string | null;
  show_city: boolean;
  is_featured: boolean;
}

/** Public directory row. Private fields are already removed. */
export interface DirectoryRider {
  id: string;
  slug: Slug;
  display_name: string;
  short_bio: string;
  community_position: CommunityPosition;
  position_label: string;
  bike_brand: string;
  bike_model: string;
  bike_year: number;
  riding_style: RidingStyle[];
  city: string | null;
  mark: string;
  tone: "highway" | "machine" | "crew" | "dawn" | "salt" | "rain";
  is_featured: boolean;
  profile_image_url?: string | null;
  cover_image_url?: string | null;
}

/** Public profile. Hidden age, blood group, city, and social links are null. */
export interface RiderNeighbor {
  slug: Slug;
  display_name: string;
}

export interface RiderProfile {
  id: string;
  slug: Slug;
  display_name: string;
  position_label: string;
  bio: string;
  short_bio: string;
  joined_date: ISODateString;
  bike_brand: string;
  bike_model: string;
  bike_variant: string | null;
  bike_year: number;
  bike_color: string | null;
  riding_since: number | null;
  riding_style: RidingStyle[];
  favorite_route: string | null;
  achievements: string[];
  age: number | null;
  blood_group: BloodGroup | null;
  city: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
  mark: string;
  tone: DirectoryRider["tone"];
  is_featured: boolean;
  profile_image_url?: string | null;
  cover_image_url?: string | null;
  bike_image_url?: string | null;
  previous: RiderNeighbor | null;
  next: RiderNeighbor | null;
}

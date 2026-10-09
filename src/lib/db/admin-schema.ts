import { z } from "zod";

export const adminPositionSchema = z.enum([
  "founder",
  "co-founder",
  "president",
  "vice-president",
  "secretary",
  "treasurer",
  "captain",
  "co-captain",
  "member",
  "prospect",
]);

export const adminRidingStyleSchema = z.enum([
  "touring",
  "adventure",
  "cruiser",
  "sport",
  "naked",
  "offroad",
  "commuter",
]);

export const adminBloodSchema = z.enum([
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
]);

export const adminRideTypeSchema = z.enum([
  "day-ride",
  "weekend-ride",
  "tour",
  "charity",
  "meetup",
  "dawn-patrol",
  "night-ride",
]);

export const adminRideStatusSchema = z.enum([
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
]);

export const adminToneSchema = z.enum([
  "highway",
  "machine",
  "crew",
  "dawn",
  "salt",
  "rain",
]);

// ── Rider Schemas ─────────────────────────────────────────────────────────────

export const adminRiderSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  full_name: z.string().min(2, "Full name is required"),
  display_name: z.string().min(2, "Display name is required"),
  community_position: adminPositionSchema,
  bio: z.string().min(1, "Bio is required"),
  short_bio: z.string().min(1, "Short bio is required"),
  date_of_birth: z.string().min(10).nullable().optional(),
  age: z.number().int().min(16).max(100).nullable().optional(),
  blood_group: adminBloodSchema.nullable().optional(),
  city: z.string().nullable().optional(),



  show_age: z.boolean().default(false),
  show_blood_group: z.boolean().default(false),
  show_city: z.boolean().default(false),
  show_social_links: z.boolean().default(false),
  joined_date: z.string().min(10, "Joined date is required (YYYY-MM-DD)"),
  bike_brand: z.string().min(1, "Bike brand is required"),
  bike_model: z.string().min(1, "Bike model is required"),
  bike_variant: z.string().nullable().optional(),
  bike_year: z.number().int().min(1950).max(2030),
  bike_color: z.string().nullable().optional(),
  riding_since: z.number().int().min(1950).max(2030).nullable().optional(),
  riding_style: z.array(adminRidingStyleSchema).default([]),
  favorite_route: z.string().nullable().optional(),
  achievements: z.array(z.string()).default([]),
  instagram_url: z.string().url().nullable().optional().or(z.literal("")),
  facebook_url: z.string().url().nullable().optional().or(z.literal("")),
  youtube_url: z.string().url().nullable().optional().or(z.literal("")),
  website_url: z.string().url().nullable().optional().or(z.literal("")),
  profile_image_url: z.string().nullable().optional(),
  cover_image_url: z.string().nullable().optional(),
  bike_image_url: z.string().nullable().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type AdminRiderRecord = z.infer<typeof adminRiderSchema> & {
  id: string;
};

// ── Ride Schemas ──────────────────────────────────────────────────────────────

export const adminRideSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  title: z.string().min(2, "Title is required"),
  tagline: z.string().nullable().optional(),
  description: z.string().min(1, "Description is required"),
  short_description: z.string().min(1, "Short description is required"),
  ride_type: adminRideTypeSchema,
  status: adminRideStatusSchema,
  start_date: z.string().min(10, "Start date is required"),
  end_date: z.string().nullable().optional(),
  distance_km: z.number().int().min(0).nullable().optional(),
  route_summary: z.string().nullable().optional(),
  meeting_point: z.string().nullable().optional(),
  participant_count: z.number().int().min(0).default(0),
  cover_image_url: z.string().nullable().optional(),
  is_featured: z.boolean().default(false),
  tone: adminToneSchema.default("highway"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type AdminRideRecord = z.infer<typeof adminRideSchema> & {
  id: string;
  participants?: Array<{ id: string; display_name: string; slug: string }>;
};

// ── Gallery Schemas ───────────────────────────────────────────────────────────

export const adminGallerySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2, "Title is required"),
  caption: z.string().min(1, "Caption is required"),
  taken_on: z.string().nullable().optional(),
  tone: adminToneSchema.default("highway"),
  image_url: z.string().nullable().optional(),
  ride_id: z.string().uuid().nullable().optional(),
  rider_id: z.string().uuid().nullable().optional(),
  created_at: z.string().optional(),
});

export type AdminGalleryRecord = z.infer<typeof adminGallerySchema> & {
  id: string;
  ride_title?: string | null;
  ride_slug?: string | null;
  rider_name?: string | null;
  rider_slug?: string | null;
};

// ── Community Settings Schemas ────────────────────────────────────────────────

export const adminCommunitySettingsSchema = z.object({
  name: z.string().min(1, "Community name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  email: z.string().email("Valid email is required"),
  founded_year: z.number().int().min(1900).max(2030),
  instagram_url: z.string().nullable().optional(),
  facebook_url: z.string().nullable().optional(),
  youtube_url: z.string().nullable().optional(),
  hero_image_url: z.string().nullable().optional(),
  onboarding_enabled: z.boolean().default(false),
});

export type AdminCommunitySettings = z.infer<typeof adminCommunitySettingsSchema>;


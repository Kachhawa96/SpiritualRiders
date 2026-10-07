/**
 * Shape of a row from `public.rider_public`.
 * Hidden age, blood group, city, and social links are already null.
 */

import { z } from "zod";

const positionSchema = z.enum([
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

const styleSchema = z.enum([
  "touring",
  "adventure",
  "cruiser",
  "sport",
  "naked",
  "offroad",
  "commuter",
]);

const bloodSchema = z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);

export const publicRiderRowSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  display_name: z.string().min(1),
  community_position: positionSchema,
  bio: z.string(),
  short_bio: z.string(),
  joined_date: z.string().min(1),
  bike_brand: z.string().min(1),
  bike_model: z.string().min(1),
  bike_variant: z.string().nullable(),
  bike_year: z.number().int(),
  bike_color: z.string().nullable(),
  riding_since: z.number().int().nullable(),
  riding_style: z.array(styleSchema),
  favorite_route: z.string().nullable(),
  achievements: z.array(z.string()),
  age: z.number().int().nullable(),
  blood_group: bloodSchema.nullable(),
  city: z.string().nullable(),
  instagram_url: z.string().nullable(),
  facebook_url: z.string().nullable(),
  youtube_url: z.string().nullable(),
  website_url: z.string().nullable(),
  is_featured: z.boolean(),
  is_active: z.boolean(),
  profile_image_url: z.string().nullable().optional(),
  cover_image_url: z.string().nullable().optional(),
  bike_image_url: z.string().nullable().optional(),
});

export type PublicRiderRow = z.infer<typeof publicRiderRowSchema>;

export function parsePublicRiderRows(rows: unknown): PublicRiderRow[] {
  return z.array(publicRiderRowSchema).parse(rows);
}

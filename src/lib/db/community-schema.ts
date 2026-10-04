import { z } from "zod";

const toneSchema = z.enum(["highway", "machine", "crew", "dawn", "salt", "rain"]);
const rideTypeSchema = z.enum([
  "day-ride",
  "weekend-ride",
  "tour",
  "charity",
  "meetup",
  "dawn-patrol",
  "night-ride",
]);
const rideStatusSchema = z.enum(["upcoming", "ongoing", "completed", "cancelled"]);
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

export const publicRideRowSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().nullable(),
  description: z.string(),
  short_description: z.string(),
  ride_type: rideTypeSchema,
  status: rideStatusSchema,
  start_date: z.string().min(1),
  end_date: z.string().nullable(),
  distance_km: z.number().int().nullable(),
  route_summary: z.string().nullable(),
  meeting_point: z.string().nullable(),
  participant_count: z.number().int(),
  is_featured: z.boolean(),
  tone: toneSchema,
});

export const publicParticipantRowSchema = z.object({
  ride_slug: z.string().min(1),
  rider_slug: z.string().min(1),
  rider_name: z.string().min(1),
  community_position: positionSchema,
});

export const publicGalleryRowSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  caption: z.string(),
  taken_on: z.string().nullable(),
  tone: toneSchema,
  ride_slug: z.string().nullable(),
  ride_title: z.string().nullable(),
  rider_slug: z.string().nullable(),
  rider_name: z.string().nullable(),
});

export type PublicRideRow = z.infer<typeof publicRideRowSchema>;
export type PublicParticipantRow = z.infer<typeof publicParticipantRowSchema>;
export type PublicGalleryRow = z.infer<typeof publicGalleryRowSchema>;

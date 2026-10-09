import { z } from "zod";
import {
  adminBloodSchema,
  adminPositionSchema,
  adminRidingStyleSchema,
} from "@/lib/db/admin-schema";

export const submissionStatusSchema = z.enum(["pending", "approved", "rejected"]);
export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;

export const submissionTypeSchema = z.enum(["new", "update"]);
export type SubmissionType = z.infer<typeof submissionTypeSchema>;

/**
 * Pure client-safe slug generator.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


/**
 * Public onboarding form submission schema.
 * Slug is auto-derived if not provided or overridden.
 */
export const onboardingSubmissionInputSchema = z.object({
  rider_id: z.string().uuid().nullable().optional(),
  submission_type: submissionTypeSchema.default("new"),
  slug: z.string().min(2).optional(),
  full_name: z.string().min(2, "Full legal name is required"),
  display_name: z.string().min(2, "Display name is required"),
  community_position: adminPositionSchema.default("member"),
  joined_date: z.string().min(10).optional(),
  bio: z.string().min(10, "A biography is required (min 10 characters)"),
  short_bio: z.string().min(5, "A short bio preview is required (min 5 characters)"),

  // Machine
  bike_brand: z.string().min(1, "Bike brand is required"),
  bike_model: z.string().min(1, "Bike model is required"),
  bike_variant: z.string().nullable().optional(),
  bike_year: z.number().int().min(1950).max(2030),
  bike_color: z.string().nullable().optional(),

  // Personal
  date_of_birth: z.string().min(10).nullable().optional(),
  age: z.number().int().min(16).max(100).nullable().optional(),
  blood_group: adminBloodSchema.nullable().optional(),
  city: z.string().nullable().optional(),

  // Privacy Flags
  show_age: z.boolean().default(false),
  show_blood_group: z.boolean().default(false),
  show_city: z.boolean().default(false),
  show_social_links: z.boolean().default(false),

  // Riding
  riding_since: z.number().int().min(1950).max(2030).nullable().optional(),
  riding_style: z.array(adminRidingStyleSchema).default([]),
  favorite_route: z.string().nullable().optional(),
  achievements: z.array(z.string()).default([]),

  // Social Links
  instagram_url: z.string().url().nullable().optional().or(z.literal("")),
  facebook_url: z.string().url().nullable().optional().or(z.literal("")),
  youtube_url: z.string().url().nullable().optional().or(z.literal("")),
  website_url: z.string().url().nullable().optional().or(z.literal("")),

  // Imagery URLs
  profile_image_url: z.string().nullable().optional(),
  cover_image_url: z.string().nullable().optional(),
  bike_image_url: z.string().nullable().optional(),

  // Contact
  contact_email: z.string().email("A valid contact email is required").nullable().optional(),
  contact_phone: z.string().nullable().optional(),
});

export type OnboardingSubmissionInput = z.infer<typeof onboardingSubmissionInputSchema>;

/**
 * Full record stored in public.rider_profile_submissions
 */
export interface OnboardingSubmissionRecord {
  id: string;
  rider_id: string | null;
  submission_type: SubmissionType;
  status: SubmissionStatus;
  slug: string;
  full_name: string;
  display_name: string;
  community_position: z.infer<typeof adminPositionSchema>;
  bio: string;
  short_bio: string;
  joined_date: string;
  bike_brand: string;
  bike_model: string;
  bike_variant: string | null;
  bike_year: number;
  bike_color: string | null;
  date_of_birth: string | null;
  age: number | null;
  blood_group: z.infer<typeof adminBloodSchema> | null;
  city: string | null;
  show_age: boolean;
  show_blood_group: boolean;
  show_city: boolean;
  show_social_links: boolean;

  riding_since: number | null;
  riding_style: Array<z.infer<typeof adminRidingStyleSchema>>;
  favorite_route: string | null;
  achievements: string[];
  instagram_url: string | null;
  facebook_url: string | null;
  youtube_url: string | null;
  website_url: string | null;
  profile_image_url: string | null;
  cover_image_url: string | null;
  bike_image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  contact_email: string | null;
  contact_phone: string | null;
  submitter_ip: string | null;
  reviewer_email: string | null;
  reviewer_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
}

"use server";

import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import {
  getLiveRiderForPrefill,
  getSubmissionById,
  isOnboardingEnabled,
  searchLiveRidersForOnboarding,
  submitRiderProfile,
  uploadOnboardingImage,
} from "@/lib/db/onboarding";
import { calculateAgeFromDob } from "@/lib/date-utils";

import type {
  adminBloodSchema,
  adminPositionSchema,
  adminRidingStyleSchema,
} from "@/lib/db/admin-schema";
import type { z } from "zod";
import { revalidatePath } from "next/cache";


export interface OnboardingActionResult {
  success: boolean;
  error?: string;
  submissionId?: string;
  slug?: string;
  data?: unknown;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  return fallback;
}

/**
 * Public action: Submit profile for onboarding (New or Existing Rider).
 */
export async function submitOnboardingAction(
  formData: FormData
): Promise<OnboardingActionResult> {
  try {
    // 1. Resolve client IP for rate limiting
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    const realIp = headerList.get("x-real-ip");
    const clientIp = (forwardedFor ? forwardedFor.split(",")[0] : realIp || "127.0.0.1").trim();

    // 2. Rate limit enforcement (10 requests per minute per IP)
    const rateLimit = checkRateLimit(clientIp, 10, 60 * 1000);
    if (!rateLimit.success) {
      return {
        success: false,
        error: `Submission rate limit exceeded. Please wait ${rateLimit.resetSeconds} seconds before trying again.`,
      };
    }

    // 3. Honeypot check for bots
    const honeypot = formData.get("hp_website") as string;
    if (honeypot && honeypot.trim() !== "") {
      // Silently accept without writing to database
      return {
        success: true,
        submissionId: "bot-submission",
      };
    }

    // 4. Feature toggle verification
    const enabled = await isOnboardingEnabled();
    if (!enabled) {
      return {
        success: false,
        error: "Rider profile onboarding is currently closed.",
      };
    }

    // 5. Parse form data
    const rider_id = (formData.get("rider_id") as string)?.trim() || null;
    const submission_type = rider_id ? "update" : "new";

    const display_name = (formData.get("display_name") as string)?.trim();
    const full_name = (formData.get("full_name") as string)?.trim();
    const community_position = (formData.get("community_position") as z.infer<
      typeof adminPositionSchema
    >) || "member";
    const bio = (formData.get("bio") as string)?.trim();
    const short_bio = (formData.get("short_bio") as string)?.trim();
    const joined_date = (formData.get("joined_date") as string)?.trim();

    const bike_brand = (formData.get("bike_brand") as string)?.trim();
    const bike_model = (formData.get("bike_model") as string)?.trim();
    const bike_variant = (formData.get("bike_variant") as string)?.trim() || null;
    const bike_year = Number(formData.get("bike_year")) || new Date().getFullYear();
    const bike_color = (formData.get("bike_color") as string)?.trim() || null;

    const date_of_birth = (formData.get("date_of_birth") as string)?.trim() || null;
    const ageRaw = formData.get("age") as string;
    const age = date_of_birth
      ? calculateAgeFromDob(date_of_birth)
      : (ageRaw ? Number(ageRaw) : null);
    const blood_group = (formData.get("blood_group") as string)
      ? (formData.get("blood_group") as z.infer<typeof adminBloodSchema>)
      : null;
    const city = (formData.get("city") as string)?.trim() || null;


    const show_age = formData.get("show_age") === "on";
    const show_blood_group = formData.get("show_blood_group") === "on";
    const show_city = formData.get("show_city") === "on";
    const show_social_links = formData.get("show_social_links") === "on";

    const riding_sinceRaw = formData.get("riding_since") as string;
    const riding_since = riding_sinceRaw ? Number(riding_sinceRaw) : null;
    const favorite_route = (formData.get("favorite_route") as string)?.trim() || null;

    const riding_style = formData.getAll(
      "riding_style"
    ) as Array<z.infer<typeof adminRidingStyleSchema>>;
    const achievementsRaw = (formData.get("achievements") as string) || "";
    const achievements = achievementsRaw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const instagram_url = (formData.get("instagram_url") as string)?.trim() || null;
    const facebook_url = (formData.get("facebook_url") as string)?.trim() || null;
    const youtube_url = (formData.get("youtube_url") as string)?.trim() || null;
    const website_url = (formData.get("website_url") as string)?.trim() || null;

    const contact_email = (formData.get("contact_email") as string)?.trim() || null;
    const contact_phone = (formData.get("contact_phone") as string)?.trim() || null;

    // Handle Image uploads or fallback URLs
    let profile_image_url = (formData.get("profile_image_url") as string)?.trim() || null;
    let bike_image_url = (formData.get("bike_image_url") as string)?.trim() || null;
    let cover_image_url = (formData.get("cover_image_url") as string)?.trim() || null;

    const profileFile = formData.get("profile_image_file") as File | null;
    if (profileFile && profileFile.size > 0) {
      profile_image_url = await uploadOnboardingImage(profileFile, "profiles");
    }

    const bikeFile = formData.get("bike_image_file") as File | null;
    if (bikeFile && bikeFile.size > 0) {
      bike_image_url = await uploadOnboardingImage(bikeFile, "bikes");
    }

    const coverFile = formData.get("cover_image_file") as File | null;
    if (coverFile && coverFile.size > 0) {
      cover_image_url = await uploadOnboardingImage(coverFile, "covers");
    }

    // 6. Submit to pending table
    const result = await submitRiderProfile(
      {
        rider_id,
        submission_type,
        full_name,
        display_name,
        community_position,
        bio,
        short_bio,
        joined_date,
        bike_brand,
        bike_model,
        bike_variant,
        bike_year,
        bike_color,
        date_of_birth,
        age,
        blood_group,

        city,
        show_age,
        show_blood_group,
        show_city,
        show_social_links,
        riding_since,
        riding_style,
        favorite_route,
        achievements,
        instagram_url,
        facebook_url,
        youtube_url,
        website_url,
        profile_image_url,
        bike_image_url,
        cover_image_url,
        contact_email,
        contact_phone,
      },
      clientIp
    );

    revalidatePath("/admin/onboarding");

    return {
      success: true,
      submissionId: result.id,
      slug: result.slug,
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to submit profile. Please verify your details."),
    };
  }
}

/**
 * Public action: Check status of a submission by ID.
 */
export async function checkSubmissionStatusAction(
  submissionId: string
): Promise<OnboardingActionResult> {
  try {
    const trimmed = submissionId.trim();
    if (!trimmed) {
      return { success: false, error: "Submission ID is required." };
    }

    const submission = await getSubmissionById(trimmed);
    if (!submission) {
      return { success: false, error: "No submission found with this reference ID." };
    }

    return {
      success: true,
      data: {
        id: submission.id,
        display_name: submission.display_name,
        submission_type: submission.submission_type,
        status: submission.status,
        submitted_at: submission.created_at,
        reviewed_at: submission.reviewed_at,
        reviewer_notes: submission.reviewer_notes,
        slug: submission.slug,
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to lookup submission status."),
    };
  }
}

/**
 * Public action: Search active riders for existing member prefill.
 */
export async function searchExistingRidersAction(query: string) {
  try {
    const results = await searchLiveRidersForOnboarding(query);
    return { success: true, results };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Search failed"), results: [] };
  }
}

/**
 * Public action: Fetch live rider data to prefill form.
 */
export async function getExistingRiderPrefillAction(riderId: string) {
  try {
    const data = await getLiveRiderForPrefill(riderId);
    if (!data) {
      return { success: false, error: "Rider profile not found." };
    }
    return { success: true, rider: data };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err, "Failed to load rider details.") };
  }
}

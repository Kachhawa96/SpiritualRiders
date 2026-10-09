"use server";

import { requireAdmin } from "@/lib/auth/server";
import {
  createAdminGalleryItem,
  createAdminRide,
  createAdminRider,
  deleteAdminGalleryItem,
  deleteAdminRide,
  deleteAdminRider,
  toggleRideFeatured,
  toggleRiderActive,
  toggleRiderFeatured,
  updateAdminGalleryItem,
  updateAdminRide,
  updateAdminRider,
  updateCommunitySettings,
  updateContactMessageStatus,
  deleteContactMessage,
  uploadAdminImage,
} from "@/lib/db/admin";
import type {
  adminBloodSchema,
  adminPositionSchema,
  adminRideStatusSchema,
  adminRideTypeSchema,
  adminRidingStyleSchema,
  adminToneSchema,
} from "@/lib/db/admin-schema";
import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { calculateAgeFromDob } from "@/lib/date-utils";

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  return fallback;
}

// ── Image Upload Action ───────────────────────────────────────────────────────

export async function uploadImageAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";
    const maxMb = Number(formData.get("maxMb")) || 5;

    if (!file || file.size === 0) {
      return { success: false, error: "No file provided." };
    }

    const publicUrl = await uploadAdminImage(file, folder, maxMb);
    return { success: true, data: { publicUrl } };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to upload file."),
    };
  }
}

// ── Rider Actions ─────────────────────────────────────────────────────────────

export async function saveRiderAction(
  id: string | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const slug = (formData.get("slug") as string)?.trim();
    const full_name = (formData.get("full_name") as string)?.trim();
    const display_name = (formData.get("display_name") as string)?.trim();
    const community_position = formData.get(
      "community_position"
    ) as z.infer<typeof adminPositionSchema>;
    const joined_date = formData.get("joined_date") as string;
    const bio = (formData.get("bio") as string)?.trim();
    const short_bio = (formData.get("short_bio") as string)?.trim();

    const bike_brand = (formData.get("bike_brand") as string)?.trim();
    const bike_model = (formData.get("bike_model") as string)?.trim();
    const bike_variant = (formData.get("bike_variant") as string)?.trim() || null;
    const bike_year = Number(formData.get("bike_year"));
    const bike_color = (formData.get("bike_color") as string)?.trim() || null;

    const date_of_birth = (formData.get("date_of_birth") as string)?.trim() || null;
    const ageRaw = formData.get("age") as string;
    let age = ageRaw ? Number(ageRaw) : null;
    if (date_of_birth) {
      const calculatedAge = calculateAgeFromDob(date_of_birth);
      if (calculatedAge !== null) {
        age = calculatedAge;
      }
    }
    const blood_group = (formData.get("blood_group") as string)
      ? (formData.get("blood_group") as z.infer<typeof adminBloodSchema>)
      : null;
    const city = (formData.get("city") as string)?.trim() || null;

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

    const show_age = formData.get("show_age") === "on";
    const show_blood_group = formData.get("show_blood_group") === "on";
    const show_city = formData.get("show_city") === "on";
    const show_social_links = formData.get("show_social_links") === "on";

    const instagram_url = (formData.get("instagram_url") as string)?.trim() || null;
    const facebook_url = (formData.get("facebook_url") as string)?.trim() || null;
    const youtube_url = (formData.get("youtube_url") as string)?.trim() || null;
    const website_url = (formData.get("website_url") as string)?.trim() || null;

    let profile_image_url = (formData.get("profile_image_url") as string)?.trim() || null;
    let bike_image_url = (formData.get("bike_image_url") as string)?.trim() || null;
    let cover_image_url = (formData.get("cover_image_url") as string)?.trim() || null;

    // Check if new image files were uploaded directly with the form
    const profileFile = formData.get("profile_image_file") as File | null;
    if (profileFile && profileFile.size > 0) {
      profile_image_url = await uploadAdminImage(profileFile, "riders");
    }

    const bikeFile = formData.get("bike_image_file") as File | null;
    if (bikeFile && bikeFile.size > 0) {
      bike_image_url = await uploadAdminImage(bikeFile, "bikes");
    }

    const coverFile = formData.get("cover_image_file") as File | null;
    if (coverFile && coverFile.size > 0) {
      cover_image_url = await uploadAdminImage(coverFile, "covers");
    }

    const is_featured = formData.get("is_featured") === "on";
    const is_active = formData.get("is_active") === "on";

    const riderInput = {
      slug,
      full_name,
      display_name,
      community_position,
      joined_date,
      bio,
      short_bio,
      bike_brand,
      bike_model,
      bike_variant,
      bike_year,
      bike_color,
      date_of_birth,
      age,
      blood_group,
      city,
      riding_since,
      riding_style,
      favorite_route,
      achievements,
      show_age,
      show_blood_group,
      show_city,
      show_social_links,
      instagram_url,
      facebook_url,
      youtube_url,
      website_url,
      profile_image_url,
      bike_image_url,
      cover_image_url,
      is_featured,
      is_active,
    };

    if (id) {
      await updateAdminRider(id, riderInput);
    } else {
      await createAdminRider(riderInput);
    }

    revalidatePath("/admin", "layout");
    revalidatePath("/riders");
    revalidatePath(`/riders/${slug}`);
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to save rider."),
    };
  }
}

export async function toggleRiderFeaturedAction(
  id: string,
  is_featured: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await toggleRiderFeatured(id, is_featured);
    revalidatePath("/admin/riders");
    revalidatePath("/riders");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to update featured flag."),
    };
  }
}

export async function toggleRiderActiveAction(
  id: string,
  is_active: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await toggleRiderActive(id, is_active);
    revalidatePath("/admin/riders");
    revalidatePath("/riders");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to update active state."),
    };
  }
}

export async function deleteRiderAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await deleteAdminRider(id);
    revalidatePath("/admin/riders");
    revalidatePath("/riders");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to delete rider."),
    };
  }
}

// ── Ride Actions ──────────────────────────────────────────────────────────────

export async function saveRideAction(
  id: string | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const slug = (formData.get("slug") as string)?.trim();
    const title = (formData.get("title") as string)?.trim();
    const tagline = (formData.get("tagline") as string)?.trim() || null;
    const description = (formData.get("description") as string)?.trim();
    const short_description = (formData.get("short_description") as string)?.trim();
    const ride_type = formData.get(
      "ride_type"
    ) as z.infer<typeof adminRideTypeSchema>;
    const status = formData.get(
      "status"
    ) as z.infer<typeof adminRideStatusSchema>;
    const start_date = formData.get("start_date") as string;
    const end_date = (formData.get("end_date") as string) || null;

    const distanceRaw = formData.get("distance_km") as string;
    const distance_km = distanceRaw ? Number(distanceRaw) : null;
    const route_summary = (formData.get("route_summary") as string)?.trim() || null;
    const meeting_point = (formData.get("meeting_point") as string)?.trim() || null;

    const participant_countRaw = formData.get("participant_count") as string;
    const participant_count = participant_countRaw ? Number(participant_countRaw) : 0;

    let cover_image_url = (formData.get("cover_image_url") as string)?.trim() || null;
    const coverFile = formData.get("cover_image_file") as File | null;
    if (coverFile && coverFile.size > 0) {
      cover_image_url = await uploadAdminImage(coverFile, "rides");
    }

    const is_featured = formData.get("is_featured") === "on";
    const tone =
      (formData.get("tone") as z.infer<typeof adminToneSchema>) || "highway";
    const participantIds = formData.getAll("participants") as string[];

    const rideInput = {
      slug,
      title,
      tagline,
      description,
      short_description,
      ride_type,
      status,
      start_date,
      end_date,
      distance_km,
      route_summary,
      meeting_point,
      participant_count,
      cover_image_url,
      is_featured,
      tone,
    };

    if (id) {
      await updateAdminRide(id, rideInput, participantIds);
    } else {
      await createAdminRide(rideInput, participantIds);
    }

    revalidatePath("/admin", "layout");
    revalidatePath("/rides");
    revalidatePath(`/rides/${slug}`);
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to save ride."),
    };
  }
}

export async function toggleRideFeaturedAction(
  id: string,
  is_featured: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await toggleRideFeatured(id, is_featured);
    revalidatePath("/admin/rides");
    revalidatePath("/rides");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to update featured flag."),
    };
  }
}

export async function deleteRideAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await deleteAdminRide(id);
    revalidatePath("/admin/rides");
    revalidatePath("/rides");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to delete ride."),
    };
  }
}

// ── Gallery Actions ───────────────────────────────────────────────────────────

export async function saveGalleryAction(
  id: string | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const title = (formData.get("title") as string)?.trim();
    const caption = (formData.get("caption") as string)?.trim();
    const taken_on = (formData.get("taken_on") as string) || null;
    const tone =
      (formData.get("tone") as z.infer<typeof adminToneSchema>) || "highway";
    const ride_id = (formData.get("ride_id") as string) || null;
    const rider_id = (formData.get("rider_id") as string) || null;

    let image_url = (formData.get("image_url") as string)?.trim() || null;
    const imageFile = formData.get("image_file") as File | null;
    if (imageFile && imageFile.size > 0) {
      image_url = await uploadAdminImage(imageFile, "gallery", 10);
    }

    const itemInput = {
      title,
      caption,
      taken_on,
      tone,
      image_url,
      ride_id: ride_id === "" ? null : ride_id,
      rider_id: rider_id === "" ? null : rider_id,
    };

    if (id) {
      await updateAdminGalleryItem(id, itemInput);
    } else {
      await createAdminGalleryItem(itemInput);
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to save frame."),
    };
  }
}

export async function deleteGalleryAction(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await deleteAdminGalleryItem(id);
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to delete frame."),
    };
  }
}

// ── Settings Actions ──────────────────────────────────────────────────────────

export async function saveSettingsAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const name = (formData.get("name") as string)?.trim();
    const tagline = (formData.get("tagline") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const founded_year = Number(formData.get("founded_year"));
    const instagram_url = (formData.get("instagram_url") as string)?.trim() || "";
    const facebook_url = (formData.get("facebook_url") as string)?.trim() || "";
    const youtube_url = (formData.get("youtube_url") as string)?.trim() || "";
    let hero_image_url = (formData.get("hero_image_url") as string)?.trim() || null;
    let logo_image_url = (formData.get("logo_image_url") as string)?.trim() || null;
    const onboarding_enabled = formData.get("onboarding_enabled") === "on";

    const heroImageFile = formData.get("hero_image_file") as File | null;
    if (heroImageFile && heroImageFile.size > 0) {
      hero_image_url = await uploadAdminImage(heroImageFile, "hero", 5);
    }

    const logoImageFile = formData.get("logo_image_file") as File | null;
    if (logoImageFile && logoImageFile.size > 0) {
      logo_image_url = await uploadAdminImage(logoImageFile, "brand", 5, true);
    }

    await updateCommunitySettings({
      name,
      tagline,
      description,
      email,
      founded_year,
      instagram_url,
      facebook_url,
      youtube_url,
      hero_image_url,
      logo_image_url,
      onboarding_enabled,
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/onboarding");
    revalidatePath("/onboard");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to update settings."),
    };
  }
}

// ── Contact Inquiries Actions ─────────────────────────────────────────────────

export async function updateContactMessageStatusAction(
  id: string,
  status: "unread" | "read" | "archived"
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await updateContactMessageStatus(id, status);
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to update inquiry status."),
    };
  }
}

export async function deleteContactMessageAction(
  id: string
): Promise<ActionResult> {
  try {
    await requireAdmin();
    await deleteContactMessage(id);
    revalidatePath("/admin/messages");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    return {
      success: false,
      error: getErrorMessage(err, "Failed to delete inquiry."),
    };
  }
}


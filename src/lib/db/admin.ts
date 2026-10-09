/**
 * Admin Data Access Layer for Spiritual Riders.
 * Handles CRUD operations, image uploads, and dashboard metrics.
 */

import { getAdminDbClient } from "@/lib/auth/server";
import {
  adminCommunitySettingsSchema,
  adminGallerySchema,
  adminRideSchema,
  adminRiderSchema,
  type AdminCommunitySettings,
  type AdminGalleryRecord,
  type AdminRideRecord,
  type AdminRiderRecord,
} from "@/lib/db/admin-schema";
import { SITE_CONFIG, SOCIAL_LINKS } from "@/config/site";

// ── File Upload Validation & Storage ──────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export function validateImageFile(
  file: File,
  maxMb = 5
): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format (${file.type}). Allowed: JPG, PNG, WEBP, AVIF.`,
    };
  }

  const maxBytes = maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size exceeds the ${maxMb}MB limit (actual: ${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  return { valid: true };
}

export async function uploadAdminImage(
  file: File,
  folder = "uploads",
  maxMb = 5
): Promise<string> {
  const validation = validateImageFile(file, maxMb);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const supabase = await getAdminDbClient();
  if (!supabase) {
    throw new Error("Supabase client could not be initialized.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const sanitizedName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 32);
  const path = `${folder}/${Date.now()}-${sanitizedName}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("rider-media")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("rider-media").getPublicUrl(path);
  return data.publicUrl;
}

// ── Riders Management ─────────────────────────────────────────────────────────

export async function getAdminRiders(): Promise<AdminRiderRecord[]> {
  const supabase = await getAdminDbClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("riders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load riders: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    ...row,
    riding_style: row.riding_style ?? [],
    achievements: row.achievements ?? [],
  }));
}

export async function getAdminRiderById(
  id: string
): Promise<AdminRiderRecord | null> {
  const supabase = await getAdminDbClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("riders")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    ...data,
    riding_style: data.riding_style ?? [],
    achievements: data.achievements ?? [],
  };
}

export async function createAdminRider(
  input: unknown
): Promise<AdminRiderRecord> {
  const parsed = adminRiderSchema.parse(input);
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("riders")
    .insert({
      slug: parsed.slug,
      full_name: parsed.full_name,
      display_name: parsed.display_name,
      community_position: parsed.community_position,
      bio: parsed.bio,
      short_bio: parsed.short_bio,
      date_of_birth: parsed.date_of_birth || null,
      age: parsed.age ?? null,
      blood_group: parsed.blood_group ?? null,
      city: parsed.city ?? null,

      show_age: parsed.show_age,
      show_blood_group: parsed.show_blood_group,
      show_city: parsed.show_city,
      show_social_links: parsed.show_social_links,
      joined_date: parsed.joined_date,
      bike_brand: parsed.bike_brand,
      bike_model: parsed.bike_model,
      bike_variant: parsed.bike_variant ?? null,
      bike_year: parsed.bike_year,
      bike_color: parsed.bike_color ?? null,
      riding_since: parsed.riding_since ?? null,
      riding_style: parsed.riding_style,
      favorite_route: parsed.favorite_route ?? null,
      achievements: parsed.achievements,
      instagram_url: parsed.instagram_url || null,
      facebook_url: parsed.facebook_url || null,
      youtube_url: parsed.youtube_url || null,
      website_url: parsed.website_url || null,
      profile_image_url: parsed.profile_image_url || null,
      cover_image_url: parsed.cover_image_url || null,
      bike_image_url: parsed.bike_image_url || null,
      is_featured: parsed.is_featured,
      is_active: parsed.is_active,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create rider: ${error.message}`);
  }

  return data;
}

export async function updateAdminRider(
  id: string,
  input: unknown
): Promise<AdminRiderRecord> {
  const parsed = adminRiderSchema.partial().parse(input);
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  for (const [key, val] of Object.entries(parsed)) {
    if (val !== undefined && key !== "id") {
      updateData[key] = val === "" ? null : val;
    }
  }

  const { data, error } = await supabase
    .from("riders")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update rider: ${error.message}`);
  }

  return data;
}

export async function toggleRiderFeatured(
  id: string,
  is_featured: boolean
): Promise<void> {
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("riders")
    .update({ is_featured, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update featured flag: ${error.message}`);
  }
}

export async function toggleRiderActive(
  id: string,
  is_active: boolean
): Promise<void> {
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("riders")
    .update({ is_active, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update active state: ${error.message}`);
  }
}

export async function deleteAdminRider(id: string): Promise<void> {
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from("riders").delete().eq("id", id);
  if (error) {
    throw new Error(`Failed to delete rider: ${error.message}`);
  }
}

// ── Rides Management ──────────────────────────────────────────────────────────

export async function getAdminRides(): Promise<AdminRideRecord[]> {
  const supabase = await getAdminDbClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("rides")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error(`Failed to load rides: ${error.message}`);
  }

  return data ?? [];
}

export async function getAdminRideById(
  id: string
): Promise<AdminRideRecord | null> {
  const supabase = await getAdminDbClient();
  if (!supabase) return null;

  const { data: ride, error } = await supabase
    .from("rides")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !ride) return null;

  // Fetch participants
  const { data: links } = await supabase
    .from("ride_riders")
    .select("rider_id, riders(id, display_name, slug)")
    .eq("ride_id", id);

  interface ParticipantLinkRow {
    riders: { id: string; display_name: string; slug: string } | null;
  }

  const participantRows = (links as unknown as ParticipantLinkRow[]) ?? [];
  const participants = participantRows
    .map((item) => item.riders)
    .filter((r): r is { id: string; display_name: string; slug: string } => Boolean(r));

  return {
    ...ride,
    participants,
  };
}

export async function createAdminRide(
  input: unknown,
  participantIds: string[] = []
): Promise<AdminRideRecord> {
  const parsed = adminRideSchema.parse(input);
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("rides")
    .insert({
      slug: parsed.slug,
      title: parsed.title,
      tagline: parsed.tagline || null,
      description: parsed.description,
      short_description: parsed.short_description,
      ride_type: parsed.ride_type,
      status: parsed.status,
      start_date: parsed.start_date,
      end_date: parsed.end_date || null,
      distance_km: parsed.distance_km ?? null,
      route_summary: parsed.route_summary || null,
      meeting_point: parsed.meeting_point || null,
      participant_count:
        parsed.participant_count || (participantIds.length > 0 ? participantIds.length : 0),
      cover_image_url: parsed.cover_image_url || null,
      is_featured: parsed.is_featured,
      tone: parsed.tone,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create ride: ${error.message}`);
  }

  if (participantIds.length > 0) {
    const rows = participantIds.map((rider_id) => ({
      ride_id: data.id,
      rider_id,
    }));
    await supabase.from("ride_riders").insert(rows);
  }

  return data;
}

export async function updateAdminRide(
  id: string,
  input: unknown,
  participantIds?: string[]
): Promise<AdminRideRecord> {
  const parsed = adminRideSchema.partial().parse(input);
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  for (const [key, val] of Object.entries(parsed)) {
    if (val !== undefined && key !== "id") {
      updateData[key] = val === "" ? null : val;
    }
  }

  if (participantIds !== undefined) {
    updateData.participant_count =
      parsed.participant_count ?? (participantIds.length > 0 ? participantIds.length : 0);
  }

  const { data, error } = await supabase
    .from("rides")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update ride: ${error.message}`);
  }

  if (participantIds !== undefined) {
    // Sync participants
    await supabase.from("ride_riders").delete().eq("ride_id", id);
    if (participantIds.length > 0) {
      const rows = participantIds.map((rider_id) => ({
        ride_id: id,
        rider_id,
      }));
      await supabase.from("ride_riders").insert(rows);
    }
  }

  return data;
}

export async function toggleRideFeatured(
  id: string,
  is_featured: boolean
): Promise<void> {
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("rides")
    .update({ is_featured, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to update ride featured state: ${error.message}`);
  }
}

export async function deleteAdminRide(id: string): Promise<void> {
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from("rides").delete().eq("id", id);
  if (error) {
    throw new Error(`Failed to delete ride: ${error.message}`);
  }
}

// ── Gallery Management ────────────────────────────────────────────────────────

export async function getAdminGallery(): Promise<AdminGalleryRecord[]> {
  const supabase = await getAdminDbClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*, rides(title, slug), riders(display_name, slug)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load gallery items: ${error.message}`);
  }

  interface GalleryJoinRow {
    id: string;
    title: string;
    caption: string;
    taken_on: string | null;
    tone: AdminGalleryRecord["tone"];
    image_url: string | null;
    ride_id: string | null;
    rider_id: string | null;
    created_at?: string;
    rides?: { title?: string; slug?: string } | null;
    riders?: { display_name?: string; slug?: string } | null;
  }

  const galleryRows = (data as unknown as GalleryJoinRow[]) ?? [];

  return galleryRows.map((row) => ({
    id: row.id,
    title: row.title,
    caption: row.caption,
    taken_on: row.taken_on,
    tone: row.tone,
    image_url: row.image_url,
    ride_id: row.ride_id,
    rider_id: row.rider_id,
    ride_title: row.rides?.title ?? null,
    ride_slug: row.rides?.slug ?? null,
    rider_name: row.riders?.display_name ?? null,
    rider_slug: row.riders?.slug ?? null,
    created_at: row.created_at,
  }));
}

export async function createAdminGalleryItem(
  input: unknown
): Promise<AdminGalleryRecord> {
  const parsed = adminGallerySchema.parse(input);
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("gallery_items")
    .insert({
      title: parsed.title,
      caption: parsed.caption,
      taken_on: parsed.taken_on || null,
      tone: parsed.tone,
      image_url: parsed.image_url || null,
      ride_id: parsed.ride_id || null,
      rider_id: parsed.rider_id || null,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create gallery item: ${error.message}`);
  }

  return data;
}

export async function updateAdminGalleryItem(
  id: string,
  input: unknown
): Promise<AdminGalleryRecord> {
  const parsed = adminGallerySchema.partial().parse(input);
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const updateData: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(parsed)) {
    if (val !== undefined && key !== "id") {
      updateData[key] = val === "" ? null : val;
    }
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update gallery item: ${error.message}`);
  }

  return data;
}

export async function deleteAdminGalleryItem(id: string): Promise<void> {
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) {
    throw new Error(`Failed to delete gallery item: ${error.message}`);
  }
}

// ── Community Settings ────────────────────────────────────────────────────────

export async function getCommunitySettings(): Promise<AdminCommunitySettings> {
  const defaultSettings: AdminCommunitySettings = {
    name: SITE_CONFIG.name,
    tagline: SITE_CONFIG.tagline,
    description: SITE_CONFIG.description,
    email: SITE_CONFIG.email,
    founded_year: SITE_CONFIG.foundedYear,
    instagram_url: SOCIAL_LINKS.instagram ?? "",
    facebook_url: SOCIAL_LINKS.facebook ?? "",
    youtube_url: SOCIAL_LINKS.youtube ?? "",
    hero_image_url: null,
    onboarding_enabled: false,
  };

  const supabase = await getAdminDbClient();
  if (!supabase) return defaultSettings;

  try {
    const { data, error } = await supabase
      .from("community_settings")
      .select("*")
      .eq("id", "default")
      .single();

    if (error || !data) return defaultSettings;

    return adminCommunitySettingsSchema.parse(data);
  } catch {
    return defaultSettings;
  }
}

export async function updateCommunitySettings(
  input: unknown
): Promise<AdminCommunitySettings> {
  const parsed = adminCommunitySettingsSchema.parse(input);
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("community_settings")
    .upsert({
      id: "default",
      name: parsed.name,
      tagline: parsed.tagline,
      description: parsed.description,
      email: parsed.email,
      founded_year: parsed.founded_year,
      instagram_url: parsed.instagram_url || null,
      facebook_url: parsed.facebook_url || null,
      youtube_url: parsed.youtube_url || null,
      hero_image_url: parsed.hero_image_url || null,
      onboarding_enabled: Boolean(parsed.onboarding_enabled),
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to save settings: ${error.message}`);
  }

  return parsed;
}


// ── Dashboard Metrics ─────────────────────────────────────────────────────────

export interface AdminDashboardStats {
  riders: {
    total: number;
    active: number;
    featured: number;
  };
  rides: {
    total: number;
    upcoming: number;
    completed: number;
  };
  gallery: {
    total: number;
  };
  recentRiders: AdminRiderRecord[];
  recentRides: AdminRideRecord[];
  recentFrames: AdminGalleryRecord[];
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [riders, rides, gallery] = await Promise.all([
    getAdminRiders().catch(() => []),
    getAdminRides().catch(() => []),
    getAdminGallery().catch(() => []),
  ]);

  return {
    riders: {
      total: riders.length,
      active: riders.filter((r) => r.is_active).length,
      featured: riders.filter((r) => r.is_featured).length,
    },
    rides: {
      total: rides.length,
      upcoming: rides.filter((r) => r.status === "upcoming").length,
      completed: rides.filter((r) => r.status === "completed").length,
    },
    gallery: {
      total: gallery.length,
    },
    recentRiders: riders.slice(0, 5),
    recentRides: rides.slice(0, 5),
    recentFrames: gallery.slice(0, 6),
  };
}

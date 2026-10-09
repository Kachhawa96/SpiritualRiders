/**
 * Data Access Layer for Rider Profile Onboarding.
 * Isolated module for submission storage, admin approvals, and public status tracking.
 */

import { createAnonServerClient, hasSupabaseEnv } from "@/lib/db/client";
import { getAdminDbClient } from "@/lib/auth/server";
import { validateImageFile } from "@/lib/db/admin";
import { calculateAgeFromDob } from "@/lib/date-utils";
import {
  onboardingSubmissionInputSchema,
  slugify,
  type OnboardingSubmissionRecord,
  type SubmissionStatus,
} from "@/lib/db/onboarding-schema";
import type { AdminRiderRecord } from "@/lib/db/admin-schema";


// ── Feature Toggle Check ───────────────────────────────────────────────────────

/**
 * Checks if public onboarding is enabled in community_settings.
 */
export async function isOnboardingEnabled(): Promise<boolean> {
  if (!hasSupabaseEnv()) return false;
  const supabase = createAnonServerClient();
  if (!supabase) return false;

  try {
    const { data, error } = await supabase
      .from("community_settings")
      .select("onboarding_enabled")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) return false;
    return Boolean(data.onboarding_enabled);
  } catch {
    return false;
  }
}

// ── Slug Generator ────────────────────────────────────────────────────────────

export { slugify };


/**
 * Generates an auto-slug ensuring no collision with existing live riders.
 */
export async function generateAutoSlug(
  displayName: string,
  existingRiderId?: string | null
): Promise<string> {
  const baseSlug = slugify(displayName) || "rider";
  const supabase = createAnonServerClient();
  if (!supabase) return baseSlug;

  try {
    // Check if base slug is already used by another rider
    const query = supabase
      .from("riders")
      .select("id, slug")
      .eq("slug", baseSlug);

    const { data: existingRiders } = await query;

    if (!existingRiders || existingRiders.length === 0) {
      return baseSlug;
    }

    // If it belongs to the rider being updated, reuse it
    if (existingRiderId && existingRiders.some((r) => r.id === existingRiderId)) {
      return baseSlug;
    }

    // Otherwise append a short number
    let counter = 2;
    let candidate = `${baseSlug}-${counter}`;
    let isAvailable = false;

    while (!isAvailable && counter <= 20) {
      const { data: collision } = await supabase
        .from("riders")
        .select("id")
        .eq("slug", candidate);

      if (!collision || collision.length === 0) {
        isAvailable = true;
      } else {
        counter++;
        candidate = `${baseSlug}-${counter}`;
      }
    }

    return candidate;
  } catch {
    return baseSlug;
  }
}

// ── Public Image Upload for Onboarding ─────────────────────────────────────────

export async function uploadOnboardingImage(
  file: File,
  folder = "onboarding"
): Promise<string> {
  const validation = validateImageFile(file, 5);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Use admin client if available, otherwise anon client
  let supabase = await getAdminDbClient();
  if (!supabase) {
    supabase = createAnonServerClient();
  }
  if (!supabase) {
    throw new Error("Supabase client could not be initialized.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const sanitizedName = file.name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .slice(0, 32);
  const path = `onboarding/${folder}/${Date.now()}-${sanitizedName}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("rider-media")
    .upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload media: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("rider-media").getPublicUrl(path);
  return data.publicUrl;
}

// ── Public Submissions ────────────────────────────────────────────────────────

/**
 * Creates a pending profile submission.
 * Never touches public.riders until explicit admin approval.
 */
export async function submitRiderProfile(
  rawInput: unknown,
  submitterIp?: string
): Promise<OnboardingSubmissionRecord> {
  const parsed = onboardingSubmissionInputSchema.parse(rawInput);

  // Auto-generate slug if not explicitly passed
  const slug = parsed.slug || (await generateAutoSlug(parsed.display_name, parsed.rider_id));

  // Determine submission type
  const submissionType = parsed.rider_id ? "update" : "new";

  // Use admin client if present (service role / auth), else anon client
  let supabase = await getAdminDbClient();
  if (!supabase) {
    supabase = createAnonServerClient();
  }
  if (!supabase) {
    throw new Error("Database client not available.");
  }

  const insertPayload = {
    rider_id: parsed.rider_id || null,
    submission_type: submissionType,
    status: "pending",
    slug,
    full_name: parsed.full_name,
    display_name: parsed.display_name,
    community_position: parsed.community_position,
    bio: parsed.bio,
    short_bio: parsed.short_bio,
    joined_date: parsed.joined_date || new Date().toISOString().slice(0, 10),
    bike_brand: parsed.bike_brand,
    bike_model: parsed.bike_model,
    bike_variant: parsed.bike_variant || null,
    bike_year: parsed.bike_year,
    bike_color: parsed.bike_color || null,
    date_of_birth: parsed.date_of_birth || null,
    age: (parsed.date_of_birth ? calculateAgeFromDob(parsed.date_of_birth) : parsed.age) ?? null,
    blood_group: parsed.blood_group || null,
    city: parsed.city || null,

    show_age: parsed.show_age,
    show_blood_group: parsed.show_blood_group,
    show_city: parsed.show_city,
    show_social_links: parsed.show_social_links,
    riding_since: parsed.riding_since ?? null,
    riding_style: parsed.riding_style,
    favorite_route: parsed.favorite_route || null,
    achievements: parsed.achievements,
    instagram_url: parsed.instagram_url || null,
    facebook_url: parsed.facebook_url || null,
    youtube_url: parsed.youtube_url || null,
    website_url: parsed.website_url || null,
    profile_image_url: parsed.profile_image_url || null,
    cover_image_url: parsed.cover_image_url || null,
    bike_image_url: parsed.bike_image_url || null,
    contact_email: parsed.contact_email || null,
    contact_phone: parsed.contact_phone || null,
    submitter_ip: submitterIp || null,
  };

  const { data, error } = await supabase
    .from("rider_profile_submissions")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to submit profile: ${error.message}`);
  }

  return {
    ...data,
    riding_style: data.riding_style ?? [],
    achievements: data.achievements ?? [],
  };
}

/**
 * Public status lookup for a submitted profile.
 */
export async function getSubmissionById(
  id: string
): Promise<OnboardingSubmissionRecord | null> {
  const supabase = createAnonServerClient() || (await getAdminDbClient());
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("rider_profile_submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      ...data,
      riding_style: data.riding_style ?? [],
      achievements: data.achievements ?? [],
    };
  } catch {
    return null;
  }
}

/**
 * Searches live active riders so existing members can pre-fill their profile.
 */
export async function searchLiveRidersForOnboarding(
  query: string
): Promise<Array<{ id: string; display_name: string; slug: string; bike: string }>> {
  const supabase = createAnonServerClient();
  if (!supabase) return [];

  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const { data, error } = await supabase
      .from("rider_public")
      .select("id, display_name, slug, bike_brand, bike_model")
      .or(`display_name.ilike.%${trimmed}%,slug.ilike.%${trimmed}%`)
      .limit(8);

    if (error || !data) return [];

    return data.map((r) => ({
      id: r.id,
      display_name: r.display_name,
      slug: r.slug,
      bike: `${r.bike_brand} ${r.bike_model}`.trim(),
    }));
  } catch {
    return [];
  }
}

/**
 * Fetches an existing rider's full data for prefilling the onboarding form.
 */
export async function getLiveRiderForPrefill(
  id: string
): Promise<AdminRiderRecord | null> {
  const supabase = createAnonServerClient() || (await getAdminDbClient());
  if (!supabase) return null;

  try {
    // Try public view first
    const { data: pubData, error: pubError } = await supabase
      .from("rider_public")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!pubError && pubData) {
      return {
        id: pubData.id,
        slug: pubData.slug,
        full_name: pubData.display_name, // fallback since full_name is masked in rider_public
        display_name: pubData.display_name,
        community_position: pubData.community_position,
        bio: pubData.bio,
        short_bio: pubData.short_bio,
        joined_date: pubData.joined_date,
        bike_brand: pubData.bike_brand,
        bike_model: pubData.bike_model,
        bike_variant: pubData.bike_variant ?? null,
        bike_year: pubData.bike_year,
        bike_color: pubData.bike_color ?? null,
        date_of_birth: pubData.date_of_birth ?? null,
        age: pubData.age ?? null,
        blood_group: pubData.blood_group ?? null,

        city: pubData.city ?? null,
        show_age: Boolean(pubData.age),
        show_blood_group: Boolean(pubData.blood_group),
        show_city: Boolean(pubData.city),
        show_social_links: Boolean(pubData.instagram_url || pubData.facebook_url),
        riding_since: pubData.riding_since ?? null,
        riding_style: pubData.riding_style ?? [],
        favorite_route: pubData.favorite_route ?? null,
        achievements: pubData.achievements ?? [],
        instagram_url: pubData.instagram_url ?? null,
        facebook_url: pubData.facebook_url ?? null,
        youtube_url: pubData.youtube_url ?? null,
        website_url: pubData.website_url ?? null,
        profile_image_url: pubData.profile_image_url ?? null,
        cover_image_url: pubData.cover_image_url ?? null,
        bike_image_url: pubData.bike_image_url ?? null,
        is_featured: pubData.is_featured ?? false,
        is_active: pubData.is_active ?? true,
      };
    }

    return null;
  } catch {
    return null;
  }
}

// ── Admin Submissions Management ───────────────────────────────────────────────

/**
 * Lists all submissions with optional status filtering.
 */
export async function listAdminSubmissions(
  statusFilter?: SubmissionStatus | "all"
): Promise<OnboardingSubmissionRecord[]> {
  const supabase = await getAdminDbClient();
  if (!supabase) return [];

  let query = supabase
    .from("rider_profile_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to load submissions: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    ...row,
    riding_style: row.riding_style ?? [],
    achievements: row.achievements ?? [],
  }));
}

/**
 * Fetches submission with live rider record (for side-by-side diff).
 */
export async function getAdminSubmissionDetail(id: string): Promise<{
  submission: OnboardingSubmissionRecord | null;
  liveRider: AdminRiderRecord | null;
}> {
  const supabase = await getAdminDbClient();
  if (!supabase) return { submission: null, liveRider: null };

  const { data: subData, error: subError } = await supabase
    .from("rider_profile_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (subError || !subData) {
    return { submission: null, liveRider: null };
  }

  const submission: OnboardingSubmissionRecord = {
    ...subData,
    riding_style: subData.riding_style ?? [],
    achievements: subData.achievements ?? [],
  };

  let liveRider: AdminRiderRecord | null = null;
  if (submission.rider_id) {
    const { data: riderData } = await supabase
      .from("riders")
      .select("*")
      .eq("id", submission.rider_id)
      .single();

    if (riderData) {
      liveRider = {
        ...riderData,
        riding_style: riderData.riding_style ?? [],
        achievements: riderData.achievements ?? [],
      };
    }
  }

  return { submission, liveRider };
}

/**
 * Approves a submission.
 * - If new rider -> inserts into public.riders and makes active
 * - If update -> updates existing rider in public.riders
 * - Sets status = 'approved', records reviewer + timestamp
 */
export async function approveSubmission(
  submissionId: string,
  reviewerEmail: string
): Promise<{ success: boolean; riderId: string }> {
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Admin database client not configured.");

  // 1. Fetch submission
  const { data: sub, error: subError } = await supabase
    .from("rider_profile_submissions")
    .select("*")
    .eq("id", submissionId)
    .single();

  if (subError || !sub) {
    throw new Error("Submission not found.");
  }

  if (sub.status === "approved") {
    throw new Error("This submission has already been approved.");
  }

  let finalRiderId = sub.rider_id;

  const riderPayload = {
    slug: sub.slug,
    full_name: sub.full_name,
    display_name: sub.display_name,
    community_position: sub.community_position,
    bio: sub.bio,
    short_bio: sub.short_bio,
    joined_date: sub.joined_date,
    bike_brand: sub.bike_brand,
    bike_model: sub.bike_model,
    bike_variant: sub.bike_variant || null,
    bike_year: sub.bike_year,
    bike_color: sub.bike_color || null,
    date_of_birth: sub.date_of_birth || null,
    age: (sub.date_of_birth ? calculateAgeFromDob(sub.date_of_birth) : sub.age) ?? null,
    blood_group: sub.blood_group || null,
    city: sub.city || null,

    show_age: sub.show_age,
    show_blood_group: sub.show_blood_group,
    show_city: sub.show_city,
    show_social_links: sub.show_social_links,
    riding_since: sub.riding_since ?? null,
    riding_style: sub.riding_style ?? [],
    favorite_route: sub.favorite_route || null,
    achievements: sub.achievements ?? [],
    instagram_url: sub.instagram_url || null,
    facebook_url: sub.facebook_url || null,
    youtube_url: sub.youtube_url || null,
    website_url: sub.website_url || null,
    profile_image_url: sub.profile_image_url || null,
    cover_image_url: sub.cover_image_url || null,
    bike_image_url: sub.bike_image_url || null,
    is_featured: sub.is_featured ?? false,
    is_active: true, // Approved riders are immediately live & searchable
    updated_at: new Date().toISOString(),
  };

  // 2. Either update existing or insert new rider
  if (sub.rider_id) {
    // Update existing
    const { error: updateError } = await supabase
      .from("riders")
      .update(riderPayload)
      .eq("id", sub.rider_id);

    if (updateError) {
      throw new Error(`Failed to update live rider: ${updateError.message}`);
    }
  } else {
    // Create new rider
    const { data: newRider, error: insertError } = await supabase
      .from("riders")
      .insert(riderPayload)
      .select("id")
      .single();

    if (insertError) {
      throw new Error(`Failed to create live rider: ${insertError.message}`);
    }
    finalRiderId = newRider.id;
  }

  // 3. Mark submission as approved
  const { error: markError } = await supabase
    .from("rider_profile_submissions")
    .update({
      status: "approved",
      rider_id: finalRiderId,
      reviewer_email: reviewerEmail,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (markError) {
    throw new Error(`Failed to update submission status: ${markError.message}`);
  }

  return { success: true, riderId: finalRiderId };
}

/**
 * Rejects a submission with optional administrative notes.
 */
export async function rejectSubmission(
  submissionId: string,
  reviewerEmail: string,
  notes?: string
): Promise<void> {
  const supabase = await getAdminDbClient();
  if (!supabase) throw new Error("Admin database client not configured.");

  const { error } = await supabase
    .from("rider_profile_submissions")
    .update({
      status: "rejected",
      reviewer_email: reviewerEmail,
      reviewer_notes: notes || null,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (error) {
    throw new Error(`Failed to reject submission: ${error.message}`);
  }
}

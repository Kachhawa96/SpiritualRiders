/**
 * Loads public ride and gallery rows.
 * Uses Supabase when the community views exist.
 * Falls back to the fictional seed when env is unset or the views are not applied yet.
 */

import { LOCAL_GALLERY, LOCAL_PARTICIPANTS, LOCAL_RIDES } from "@/data/community";
import { createAnonServerClient, hasSupabaseEnv } from "@/lib/db/client";
import {
  publicGalleryRowSchema,
  publicParticipantRowSchema,
  publicRideRowSchema,
  type PublicGalleryRow,
  type PublicParticipantRow,
  type PublicRideRow,
} from "@/lib/db/community-schema";

type Source = "remote" | "local";

let sourcePromise: Promise<Source> | null = null;

function isMissingRelation(error: { code?: string; message?: string }): boolean {
  return error.code === "PGRST205" || /schema cache/i.test(error.message ?? "");
}

async function source(): Promise<Source> {
  if (!hasSupabaseEnv()) return "local";
  if (!sourcePromise) {
    sourcePromise = (async () => {
      const supabase = createAnonServerClient();
      if (!supabase) return "local";
      const { error } = await supabase.from("ride_public").select("slug").limit(1);
      if (!error) return "remote";
      if (isMissingRelation(error)) return "local";
      throw new Error(`Could not read ride_public: ${error.message}`);
    })();
  }
  return sourcePromise;
}

export async function loadRides(): Promise<PublicRideRow[]> {
  if ((await source()) === "local") return publicRideRowSchema.array().parse(LOCAL_RIDES);
  const supabase = createAnonServerClient();
  if (!supabase) return publicRideRowSchema.array().parse(LOCAL_RIDES);
  const { data, error } = await supabase.from("ride_public").select("*");
  if (error) throw new Error(`Could not read ride_public: ${error.message}`);
  return publicRideRowSchema.array().parse(data ?? []);
}

export async function loadParticipants(): Promise<PublicParticipantRow[]> {
  if ((await source()) === "local") {
    return publicParticipantRowSchema.array().parse(LOCAL_PARTICIPANTS);
  }
  const supabase = createAnonServerClient();
  if (!supabase) return publicParticipantRowSchema.array().parse(LOCAL_PARTICIPANTS);
  const { data, error } = await supabase.from("ride_participant_public").select("*");
  if (error) throw new Error(`Could not read ride_participant_public: ${error.message}`);
  return publicParticipantRowSchema.array().parse(data ?? []);
}

export async function loadGallery(): Promise<PublicGalleryRow[]> {
  if ((await source()) === "local") return publicGalleryRowSchema.array().parse(LOCAL_GALLERY);
  const supabase = createAnonServerClient();
  if (!supabase) return publicGalleryRowSchema.array().parse(LOCAL_GALLERY);
  const { data, error } = await supabase.from("gallery_public").select("*");
  if (error) throw new Error(`Could not read gallery_public: ${error.message}`);
  return publicGalleryRowSchema.array().parse(data ?? []);
}

export async function loadCommunityHeroImage(): Promise<string | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = createAnonServerClient();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("community_settings")
      .select("hero_image_url")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) return null;
    return (data.hero_image_url as string) || null;
  } catch {
    return null;
  }
}

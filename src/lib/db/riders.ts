/**
 * Loads public rider rows.
 * Supabase is used when the public env vars are set.
 * Otherwise the fictional seed is projected through the same privacy rules
 * as the `rider_public` view.
 */

import { MOCK_RIDERS } from "@/data/mock-riders";
import { createAnonServerClient, hasSupabaseEnv } from "@/lib/db/client";
import { parsePublicRiderRows, type PublicRiderRow } from "@/lib/db/public-rider";
import type { Rider } from "@/types/rider";

export async function loadPublicRiderRows(): Promise<PublicRiderRow[]> {
  if (hasSupabaseEnv()) {
    return parsePublicRiderRows(await loadFromSupabase());
  }
  return parsePublicRiderRows(MOCK_RIDERS.filter((rider) => rider.is_active).map(toPublicRow));
}

async function loadFromSupabase(): Promise<unknown> {
  const supabase = createAnonServerClient();
  if (!supabase) {
    throw new Error("Supabase env is set but the anon client could not be created.");
  }

  const { data, error } = await supabase
    .from("rider_public")
    .select("*")
    .eq("is_active", true);

  if (error) {
    throw new Error(`Could not read rider_public: ${error.message}`);
  }

  return data ?? [];
}

/** Mirrors the CASE expressions in supabase/migrations rider_public. */
export function toPublicRow(rider: Rider): PublicRiderRow {
  const social = rider.show_social_links;
  return {
    id: rider.id,
    slug: rider.slug,
    display_name: rider.display_name,
    community_position: rider.community_position,
    bio: rider.bio,
    short_bio: rider.short_bio,
    joined_date: rider.joined_date,
    bike_brand: rider.bike_brand,
    bike_model: rider.bike_model,
    bike_variant: rider.bike_variant,
    bike_year: rider.bike_year,
    bike_color: rider.bike_color,
    riding_since: rider.riding_since,
    riding_style: rider.riding_style,
    favorite_route: rider.favorite_route,
    achievements: rider.achievements,
    age: rider.show_age ? rider.age : null,
    blood_group: rider.show_blood_group ? rider.blood_group : null,
    city: rider.show_city ? rider.city : null,
    instagram_url: social ? rider.instagram_url : null,
    facebook_url: social ? rider.facebook_url : null,
    youtube_url: social ? rider.youtube_url : null,
    website_url: social ? rider.website_url : null,
    is_featured: rider.is_featured,
    is_active: rider.is_active,
    profile_image_url: rider.profile_image?.src ?? null,
    cover_image_url: rider.cover_image?.src ?? null,
    bike_image_url: rider.bike_image?.src ?? null,
  };
}

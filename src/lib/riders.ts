/**
 * Directory projection. Call from server components only.
 * Age, blood group, and social links are never copied onto the public row.
 * City is copied only when show_city is true.
 */

import { MOCK_RIDERS } from "@/data/mock-riders";
import type { CommunityPosition, DirectoryRider, Rider, RiderNeighbor, RiderProfile } from "@/types/rider";

const POSITION_LABEL: Record<CommunityPosition, string> = {
  founder: "Founder",
  "co-founder": "Co-founder",
  president: "President",
  "vice-president": "Vice-president",
  secretary: "Secretary",
  treasurer: "Treasurer",
  captain: "Captain",
  "co-captain": "Co-captain",
  member: "Rider",
  prospect: "Prospect",
};

const FEATURED_TONE: Record<string, DirectoryRider["tone"]> = {
  "vikram-rathore": "dawn",
  "arjun-mehta": "machine",
  "kabir-sen": "crew",
};

const TONES: DirectoryRider["tone"][] = [
  "highway",
  "machine",
  "crew",
  "dawn",
  "salt",
  "rain",
];

export function positionLabel(position: CommunityPosition): string {
  return POSITION_LABEL[position];
}

function markFromName(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function toneFor(slug: string): DirectoryRider["tone"] {
  const featured = FEATURED_TONE[slug];
  if (featured) return featured;
  let sum = 0;
  for (const char of slug) sum += char.charCodeAt(0);
  return TONES[sum % TONES.length] ?? "highway";
}

export function toDirectoryRider(rider: Rider): DirectoryRider {
  return {
    id: rider.id,
    slug: rider.slug,
    display_name: rider.display_name,
    short_bio: rider.short_bio,
    community_position: rider.community_position,
    position_label: positionLabel(rider.community_position),
    bike_brand: rider.bike_brand,
    bike_model: rider.bike_model,
    bike_year: rider.bike_year,
    riding_style: rider.riding_style,
    city: rider.show_city ? rider.city : null,
    mark: markFromName(rider.display_name),
    tone: toneFor(rider.slug),
    is_featured: rider.is_featured,
  };
}

export function getDirectoryRiders(): DirectoryRider[] {
  return orderedActiveRiders().map(toDirectoryRider);
}

function orderedActiveRiders(): Rider[] {
  const active = MOCK_RIDERS.filter((rider) => rider.is_active);
  const featured = active.filter((rider) => rider.is_featured);
  const rest = active
    .filter((rider) => !rider.is_featured)
    .sort((a, b) => a.display_name.localeCompare(b.display_name));
  return [...featured, ...rest];
}

function neighbor(rider: Rider | undefined): RiderNeighbor | null {
  if (!rider) return null;
  return { slug: rider.slug, display_name: rider.display_name };
}

export function toRiderProfile(
  rider: Rider,
  previous: Rider | undefined,
  next: Rider | undefined
): RiderProfile {
  const social = rider.show_social_links;
  return {
    id: rider.id,
    slug: rider.slug,
    display_name: rider.display_name,
    position_label: positionLabel(rider.community_position),
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
    mark: markFromName(rider.display_name),
    tone: toneFor(rider.slug),
    is_featured: rider.is_featured,
    previous: neighbor(previous),
    next: neighbor(next),
  };
}

export function getRiderProfile(slug: string): RiderProfile | null {
  const ordered = orderedActiveRiders();
  const index = ordered.findIndex((rider) => rider.slug === slug);
  const rider = ordered[index];
  if (!rider) return null;
  return toRiderProfile(rider, ordered[index - 1], ordered[index + 1]);
}

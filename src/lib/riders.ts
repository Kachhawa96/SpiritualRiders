/**
 * Public rider reads. Rows are already privacy-filtered.
 * Do not import mock records from UI code.
 */

import { loadPublicRiderRows } from "@/lib/db/riders";
import type { PublicRiderRow } from "@/lib/db/public-rider";
import type {
  CommunityPosition,
  DirectoryRider,
  RiderNeighbor,
  RiderProfile,
} from "@/types/rider";

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

function orderRows(rows: PublicRiderRow[]): PublicRiderRow[] {
  const featured = rows.filter((row) => row.is_featured);
  const rest = rows
    .filter((row) => !row.is_featured)
    .sort((a, b) => a.display_name.localeCompare(b.display_name));
  return [...featured, ...rest];
}

function toDirectoryRider(row: PublicRiderRow): DirectoryRider {
  return {
    id: row.id,
    slug: row.slug,
    display_name: row.display_name,
    short_bio: row.short_bio,
    community_position: row.community_position,
    position_label: positionLabel(row.community_position),
    bike_brand: row.bike_brand,
    bike_model: row.bike_model,
    bike_year: row.bike_year,
    riding_style: row.riding_style,
    city: row.city,
    mark: markFromName(row.display_name),
    tone: toneFor(row.slug),
    is_featured: row.is_featured,
  };
}

function toRiderProfile(
  row: PublicRiderRow,
  previous: PublicRiderRow | undefined,
  next: PublicRiderRow | undefined
): RiderProfile {
  return {
    id: row.id,
    slug: row.slug,
    display_name: row.display_name,
    position_label: positionLabel(row.community_position),
    bio: row.bio,
    short_bio: row.short_bio,
    joined_date: row.joined_date.slice(0, 10),
    bike_brand: row.bike_brand,
    bike_model: row.bike_model,
    bike_variant: row.bike_variant,
    bike_year: row.bike_year,
    bike_color: row.bike_color,
    riding_since: row.riding_since,
    riding_style: row.riding_style,
    favorite_route: row.favorite_route,
    achievements: row.achievements,
    age: row.age,
    blood_group: row.blood_group,
    city: row.city,
    instagram_url: row.instagram_url,
    facebook_url: row.facebook_url,
    youtube_url: row.youtube_url,
    website_url: row.website_url,
    mark: markFromName(row.display_name),
    tone: toneFor(row.slug),
    is_featured: row.is_featured,
    previous: neighbor(previous),
    next: neighbor(next),
  };
}

function neighbor(row: PublicRiderRow | undefined): RiderNeighbor | null {
  if (!row) return null;
  return { slug: row.slug, display_name: row.display_name };
}

export async function getDirectoryRiders(): Promise<DirectoryRider[]> {
  const rows = orderRows(await loadPublicRiderRows());
  return rows.map(toDirectoryRider);
}

export async function getRiderProfile(slug: string): Promise<RiderProfile | null> {
  const rows = orderRows(await loadPublicRiderRows());
  const index = rows.findIndex((row) => row.slug === slug);
  const row = rows[index];
  if (!row) return null;
  return toRiderProfile(row, rows[index - 1], rows[index + 1]);
}

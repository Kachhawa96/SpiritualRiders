/**
 * Public rides and gallery. Participant rows only carry name, slug, and position.
 */

import { loadGallery, loadParticipants, loadRides } from "@/lib/db/community";
import { RIDE_STATUS_LABEL, RIDE_TYPE_LABEL } from "@/lib/ride-labels";
import { positionLabel } from "@/lib/riders";
import type { PublicGalleryRow, PublicRideRow } from "@/lib/db/community-schema";
import type { CommunityPosition } from "@/types/rider";

export interface RideSummary {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  short_description: string;
  ride_type: PublicRideRow["ride_type"];
  status: PublicRideRow["status"];
  start_date: string;
  end_date: string | null;
  distance_km: number | null;
  route_summary: string | null;
  participant_count: number;
  is_featured: boolean;
  tone: PublicRideRow["tone"];
}

export interface RideParticipant {
  slug: string;
  display_name: string;
  position_label: string;
}

export interface RideDetail extends RideSummary {
  description: string;
  meeting_point: string | null;
  participants: RideParticipant[];
  frames: GalleryFrame[];
}

export interface GalleryFrame {
  id: string;
  title: string;
  caption: string;
  taken_on: string | null;
  tone: PublicGalleryRow["tone"];
  ride_slug: string | null;
  ride_title: string | null;
  rider_slug: string | null;
  rider_name: string | null;
}

function dateOnly(value: string | null): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

function toSummary(row: PublicRideRow): RideSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tagline: row.tagline,
    short_description: row.short_description,
    ride_type: row.ride_type,
    status: row.status,
    start_date: dateOnly(row.start_date) ?? row.start_date,
    end_date: dateOnly(row.end_date),
    distance_km: row.distance_km,
    route_summary: row.route_summary,
    participant_count: row.participant_count,
    is_featured: row.is_featured,
    tone: row.tone,
  };
}

function toFrame(row: PublicGalleryRow): GalleryFrame {
  return {
    id: row.id,
    title: row.title,
    caption: row.caption,
    taken_on: dateOnly(row.taken_on),
    tone: row.tone,
    ride_slug: row.ride_slug,
    ride_title: row.ride_title,
    rider_slug: row.rider_slug,
    rider_name: row.rider_name,
  };
}

export { RIDE_STATUS_LABEL, RIDE_TYPE_LABEL };

export async function getRides(): Promise<RideSummary[]> {
  const rows = await loadRides();
  return rows
    .map(toSummary)
    .sort((a, b) => b.start_date.localeCompare(a.start_date));
}

export async function getFeaturedRide(): Promise<RideSummary | null> {
  const rides = await getRides();
  return rides.find((ride) => ride.is_featured) ?? rides[0] ?? null;
}

export async function getRide(slug: string): Promise<RideDetail | null> {
  const rows = await loadRides();
  const row = rows.find((ride) => ride.slug === slug);
  if (!row) return null;
  const [participants, frames] = await Promise.all([loadParticipants(), loadGallery()]);
  return {
    ...toSummary(row),
    description: row.description,
    meeting_point: row.meeting_point,
    participants: participants
      .filter((person) => person.ride_slug === slug)
      .map((person) => ({
        slug: person.rider_slug,
        display_name: person.rider_name,
        position_label: positionLabel(person.community_position as CommunityPosition),
      })),
    frames: frames.filter((frame) => frame.ride_slug === slug).map(toFrame),
  };
}

export async function getGallery(): Promise<GalleryFrame[]> {
  const rows = await loadGallery();
  return rows
    .map(toFrame)
    .sort((a, b) => (b.taken_on ?? "").localeCompare(a.taken_on ?? ""));
}

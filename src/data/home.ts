/**
 * Fictional homepage content.
 * Clearly not real community records. Private fields are removed
 * before anything reaches a section: city is null when showCity is false.
 * Age, blood group, and social links are not part of this view.
 */

import { SITE_CONFIG } from "@/config/site";
import { getDirectoryRiders } from "@/lib/riders";

export type FrameTone = "highway" | "machine" | "crew" | "dawn" | "salt" | "rain";

export interface HomeRider {
  slug: string;
  displayName: string;
  position: string;
  shortBio: string;
  bike: string;
  city: string | null;
  tone: FrameTone;
  mark: string;
}

export interface HomeBike {
  brand: string;
  model: string;
  year: number;
  color: string;
  rider: string;
  note: string;
  tone: FrameTone;
}

export interface HomeChapter {
  year: string;
  title: string;
  text: string;
}

export interface HomeFrame {
  tone: FrameTone;
  label: string;
  title: string;
}

export async function getFeaturedHomeRiders(): Promise<HomeRider[]> {
  const riders = await getDirectoryRiders();
  return riders
    .filter((rider) => rider.is_featured)
    .map((rider) => ({
      slug: rider.slug,
      displayName: rider.display_name,
      position: rider.position_label,
      shortBio: rider.short_bio,
      bike: `${rider.bike_brand} ${rider.bike_model}`,
      city: rider.city,
      tone: rider.tone,
      mark: rider.mark,
    }));
}

export const FEATURED_BIKES: HomeBike[] = [
  {
    brand: "Royal Enfield",
    model: "Continental GT",
    year: 2022,
    color: "Black and brass",
    rider: "Vikram Rathore",
    note: "The founder’s machine. Cafe stance, long tank, and a habit of leaving before sunrise.",
    tone: "machine",
  },
  {
    brand: "BMW",
    model: "R nineT",
    year: 2021,
    color: "Graphite",
    rider: "Kabir Sen",
    note: "Boxer twin, bare metal, and enough road behind it to need no introduction.",
    tone: "highway",
  },
];

export const CHAPTERS: HomeChapter[] = [
  {
    year: "2020",
    title: "A dawn departure",
    text: "Twelve riders left Jaipur before the city woke. That morning became the house.",
  },
  {
    year: "2021",
    title: "The first chapter",
    text: "The line grew. Machines were named. The ride home started to matter as much as the road out.",
  },
  {
    year: "2023",
    title: "Salt and silence",
    text: "A straight run toward the white desert. No banners. Just distance, dust, and the crew.",
  },
  {
    year: "2025",
    title: "Night patrol",
    text: "After-dark rides became a ritual. Headlamps in a line, and no one riding alone.",
  },
  {
    year: "2026",
    title: "The house opens",
    text: "The brotherhood steps into the open. The road was always the point.",
  },
];

export const GALLERY_FRAMES: HomeFrame[] = [
  { tone: "dawn", label: "04:40", title: "Before the city" },
  { tone: "highway", label: "The line", title: "Single file" },
  { tone: "rain", label: "Monsoon", title: "After the rain" },
  { tone: "salt", label: "The Rann", title: "White horizon" },
  { tone: "crew", label: "Camp", title: "The long pause" },
];

export const VALUES = [
  {
    index: "01",
    title: "Respect before speed",
    text: "The road is shared. Rank is a responsibility, not a volume.",
  },
  {
    index: "02",
    title: "The machine is kept",
    text: "Every motorcycle here is known by name, history, and the hands that keep it true.",
  },
  {
    index: "03",
    title: "No one rides alone",
    text: "If a rider stops, the line stops. Brotherhood is the only formation that matters.",
  },
] as const;

export function homeStats(): { label: string; value: number }[] {
  return [
    { label: "Riders", value: 48 },
    { label: "Machines", value: 52 },
    { label: "Rides", value: 86 },
    {
      label: "Years",
      value: new Date().getFullYear() - SITE_CONFIG.foundedYear,
    },
  ];
}

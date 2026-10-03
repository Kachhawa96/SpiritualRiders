/**
 * Fictional homepage content.
 * Clearly not real community records. Private fields are removed
 * before anything reaches a section: city is null when showCity is false.
 * Age, blood group, and social links are not part of this view.
 */

import { SITE_CONFIG } from "@/config/site";

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

interface RiderSource {
  slug: string;
  displayName: string;
  position: string;
  shortBio: string;
  bike: string;
  city: string;
  showCity: boolean;
  tone: FrameTone;
  mark: string;
}

const RIDER_SOURCE: RiderSource[] = [
  {
    slug: "vikram-rathore",
    displayName: "Vikram Rathore",
    position: "Founder",
    shortBio: "Keeps the dawn starts honest and the crew pointed at the horizon.",
    bike: "Royal Enfield Continental GT",
    city: "Jaipur",
    showCity: true,
    tone: "dawn",
    mark: "VR",
  },
  {
    slug: "arjun-mehta",
    displayName: "Arjun Mehta",
    position: "Captain",
    shortBio: "Rides the long way home and never leaves a machine in the dark.",
    bike: "Triumph Street Twin",
    city: "Pune",
    showCity: false,
    tone: "machine",
    mark: "AM",
  },
  {
    slug: "kabir-sen",
    displayName: "Kabir Sen",
    position: "Co-founder",
    shortBio: "The quiet one at the back of the line, and the first to stop for another rider.",
    bike: "BMW R nineT",
    city: "Udaipur",
    showCity: true,
    tone: "crew",
    mark: "KS",
  },
];

export const FEATURED_RIDERS: HomeRider[] = RIDER_SOURCE.map(
  ({ showCity, city, ...rider }) => ({
    ...rider,
    city: showCity ? city : null,
  })
);

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

export const FEATURED_RIDE = {
  slug: "salt-and-silence",
  title: "Salt and Silence",
  date: "2026-03-12",
  distanceKm: 640,
  riders: 18,
  route: "Jaipur to the Rann",
  summary:
    "A two-day run into the white desert. Dawn starts, a long straight, and a camp where the only sound left was the cooling of the engines.",
} as const;

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

/**
 * Schema.org JSON-LD Structured Data Generators for SEO.
 */

import type { PublicCommunitySettings } from "@/lib/community";

export interface RideSeoData {
  title: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  start_date: string;
  end_date?: string | null;
  cover_image_url?: string | null;
  meeting_point?: string | null;
  route_summary?: string | null;
}

export function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || "https://spiritualriders.in"
  ).replace(/\/$/, "");
}

/**
 * Organization & SportsClub JSON-LD schema for homepage and about page.
 */
export function generateOrganizationSchema(
  settings?: PublicCommunitySettings | null,
  baseUrl = getBaseUrl()
): Record<string, unknown> {
  const sameAs = [
    settings?.instagram_url,
    settings?.facebook_url,
    settings?.youtube_url,
  ].filter((url): url is string => Boolean(url?.trim()));

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "SportsClub"],
    "@id": `${baseUrl}#organization`,
    name: settings?.name || "Spiritual Riders",
    alternateName: "Spiritual Riders Motorcycle Club",
    url: baseUrl,
    logo: settings?.logo_image_url || `${baseUrl}/icon.png`,
    image: settings?.hero_image_url || `${baseUrl}/icon.png`,
    description:
      settings?.description ||
      "A premium motorcycle brotherhood built on passion, respect, and the open road.",
    foundingDate: settings?.founded_year ? String(settings.founded_year) : "2020",
    email: settings?.email || "contact@spiritualriders.in",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    knowsAbout: [
      "Motorcycle Touring",
      "Brotherhood",
      "Road Expeditions",
      "Cruiser & Adventure Motorcycles",
    ],
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

/**
 * SportsEvent JSON-LD schema for ride detail pages.
 */
export function generateRideEventSchema(
  ride: RideSeoData,
  baseUrl = getBaseUrl()
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${baseUrl}/rides/${ride.slug}#event`,
    name: ride.title,
    description: ride.description || ride.short_description,
    url: `${baseUrl}/rides/${ride.slug}`,
    image: ride.cover_image_url ? [ride.cover_image_url] : undefined,
    startDate: ride.start_date,
    endDate: ride.end_date || ride.start_date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: ride.meeting_point || ride.route_summary || "Highway Corridor",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Spiritual Riders",
      url: baseUrl,
    },
  };
}

/**
 * BreadcrumbList JSON-LD schema for search engine snippet hierarchies.
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
  baseUrl = getBaseUrl()
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path.startsWith("/") ? "" : "/"}${item.path}`,
    })),
  };
}

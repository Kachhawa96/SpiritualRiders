import type { MetadataRoute } from "next";
import { getRides } from "@/lib/community";
import { loadPublicRiderRows } from "@/lib/db/riders";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://spiritualriders.in"
  ).replace(/\/$/, "");

  const currentDate = new Date().toISOString();

  // Core Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/rides`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/riders`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/join`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/onboard`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic Rides Routes
  let rideRoutes: MetadataRoute.Sitemap = [];
  try {
    const rides = await getRides();
    rideRoutes = rides.map((ride) => ({
      url: `${baseUrl}/rides/${ride.slug}`,
      lastModified: ride.start_date
        ? new Date(ride.start_date).toISOString()
        : currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.warn("[Sitemap] Could not load dynamic rides:", err);
  }

  // Dynamic Rider Profile Routes
  let riderRoutes: MetadataRoute.Sitemap = [];
  try {
    const riders = await loadPublicRiderRows();
    riderRoutes = riders.map((rider) => ({
      url: `${baseUrl}/riders/${rider.slug}`,
      lastModified: rider.joined_date
        ? new Date(rider.joined_date).toISOString()
        : currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.warn("[Sitemap] Could not load dynamic riders:", err);
  }

  return [...staticRoutes, ...rideRoutes, ...riderRoutes];
}

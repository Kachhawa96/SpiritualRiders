import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RiderProfileView } from "@/components/riders/RiderProfileView";
import { SITE_CONFIG } from "@/config/site";
import { getDirectoryRiders, getRiderProfile } from "@/lib/riders";
import type { RiderProfile } from "@/types/rider";

type PageProps = {
  params: Promise<{ slug: string }>;
};

import { generateBreadcrumbSchema } from "@/lib/seo-schema";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const riders = await getDirectoryRiders();
  return riders.map((rider) => ({ slug: rider.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getRiderProfile(slug);
  if (!profile) notFound();

  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://spiritualriders.in"
  ).replace(/\/$/, "");

  const description = publicDescription(profile);
  const ogImage = profile.cover_image_url || profile.profile_image_url;

  return {
    title: profile.display_name,
    description,
    alternates: {
      canonical: `${baseUrl}/riders/${slug}`,
    },
    openGraph: {
      title: `${profile.display_name} | ${SITE_CONFIG.name}`,
      description,
      url: `${baseUrl}/riders/${slug}`,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.display_name} | ${SITE_CONFIG.name}`,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function RiderProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const profile = await getRiderProfile(slug);
  if (!profile) notFound();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Riders", path: "/riders" },
    { name: profile.display_name, path: `/riders/${profile.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(riderJsonLd(profile)).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />
      <RiderProfileView profile={profile} />
    </>
  );
}

function publicDescription(profile: RiderProfile): string {
  const place = profile.city ? `, ${profile.city}` : "";
  return `${profile.display_name} is ${profile.position_label}${place} with ${SITE_CONFIG.name}. ${profile.bike_year} ${profile.bike_brand} ${profile.bike_model}. ${profile.short_bio}`;
}

function riderJsonLd(profile: RiderProfile): Record<string, unknown> {
  const sameAs = [
    profile.instagram_url,
    profile.facebook_url,
    profile.youtube_url,
    profile.website_url,
  ].filter((url): url is string => Boolean(url));

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.display_name,
    description: profile.short_bio,
    jobTitle: profile.position_label,
  };

  if (profile.city) {
    data.homeLocation = { "@type": "Place", name: profile.city };
  }
  if (sameAs.length > 0) data.sameAs = sameAs;
  return data;
}

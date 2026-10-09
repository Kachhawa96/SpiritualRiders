import type { Metadata } from "next";
import { CommunityIntro } from "@/components/sections/home/CommunityIntro";
// import { FeaturedBikes } from "@/components/sections/home/FeaturedBikes";
import { FeaturedRiders } from "@/components/sections/home/FeaturedRiders";
import { FinalCta } from "@/components/sections/home/FinalCta";
import { GalleryPreview } from "@/components/sections/home/GalleryPreview";
import { Hero } from "@/components/sections/home/Hero";
import { RideHighlight } from "@/components/sections/home/RideHighlight";
import { Stats } from "@/components/sections/home/Stats";
import { Timeline } from "@/components/sections/home/Timeline";
import { Values } from "@/components/sections/home/Values";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  },
  description: SITE_CONFIG.description,
};

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ notice?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const showClosedNotice = resolvedParams?.notice === "onboarding-closed";

  return (
    <>
      {showClosedNotice && (
        <div className="relative z-30 border-b border-gold-500/30 bg-obsidian-900/90 px-4 py-3 text-center text-xs text-graphite-300">
          <span className="font-semibold text-gold-400">Notice:</span> Profile onboarding is currently closed. Contact leadership if you need assistance.
        </div>
      )}
      <Hero />
      <CommunityIntro />
      <Stats />
      <FeaturedRiders />
      <Values />
      {/* 
        'The machines' (Steel, held with care) section is disabled per user preference.
        To re-enable in the future, simply uncomment the line below.
      */}
      {/* <FeaturedBikes /> */}
      <Timeline />
      <RideHighlight />
      <GalleryPreview />
      <FinalCta />
    </>
  );
}


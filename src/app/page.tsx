import type { Metadata } from "next";
import { CommunityIntro } from "@/components/sections/home/CommunityIntro";
import { FeaturedBikes } from "@/components/sections/home/FeaturedBikes";
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

export default function HomePage() {
  return (
    <>
      <Hero />
      <CommunityIntro />
      <Stats />
      <FeaturedRiders />
      <Values />
      <FeaturedBikes />
      <Timeline />
      <RideHighlight />
      <GalleryPreview />
      <FinalCta />
    </>
  );
}

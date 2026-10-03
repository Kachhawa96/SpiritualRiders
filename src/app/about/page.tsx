import type { Metadata } from "next";
import { AboutCta } from "@/components/sections/about/AboutCta";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutValues } from "@/components/sections/about/AboutValues";
import { Culture } from "@/components/sections/about/Culture";
import { Origin } from "@/components/sections/about/Origin";
import { Philosophy } from "@/components/sections/about/Philosophy";
import { WhatWeRide } from "@/components/sections/about/WhatWeRide";
import { Timeline } from "@/components/sections/home/Timeline";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `How ${SITE_CONFIG.name} began on a dawn ride out of Jaipur in ${SITE_CONFIG.foundedYear}, and the code the brotherhood still keeps.`,
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Origin />
      <Philosophy />
      <AboutValues />
      <WhatWeRide />
      <Culture />
      <Timeline />
      <AboutCta />
    </>
  );
}

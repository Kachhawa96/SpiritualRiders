import { getHeroImageUrl } from "@/lib/community";
import { HeroClient } from "@/components/sections/home/HeroClient";

interface HeroProps {
  heroImageUrl?: string | null;
}

export async function Hero({ heroImageUrl: propHeroImageUrl }: HeroProps = {}) {
  const heroImageUrl =
    propHeroImageUrl !== undefined ? propHeroImageUrl : await getHeroImageUrl();

  return <HeroClient heroImageUrl={heroImageUrl} />;
}


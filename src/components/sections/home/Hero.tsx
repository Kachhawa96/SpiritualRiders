import { loadCommunitySettings } from "@/lib/db/community";
import { HeroClient } from "@/components/sections/home/HeroClient";

interface HeroProps {
  heroImageUrl?: string | null;
  heroVideoUrl?: string | null;
  logoImageUrl?: string | null;
}

export async function Hero(props: HeroProps = {}) {
  const settings = await loadCommunitySettings();

  const heroImageUrl =
    props.heroImageUrl !== undefined ? props.heroImageUrl : settings.hero_image_url;
  const heroVideoUrl =
    props.heroVideoUrl !== undefined ? props.heroVideoUrl : settings.hero_video_url;
  const logoImageUrl =
    props.logoImageUrl !== undefined ? props.logoImageUrl : settings.logo_image_url;

  return (
    <HeroClient
      heroImageUrl={heroImageUrl}
      heroVideoUrl={heroVideoUrl}
      logoImageUrl={logoImageUrl}
    />
  );
}


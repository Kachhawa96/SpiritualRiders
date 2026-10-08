import Image from "next/image";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/config/site";
import { getHeroImageUrl } from "@/lib/community";

interface HeroProps {
  heroImageUrl?: string | null;
}

export async function Hero({ heroImageUrl: propHeroImageUrl }: HeroProps = {}) {
  const heroImageUrl =
    propHeroImageUrl !== undefined ? propHeroImageUrl : await getHeroImageUrl();

  return (
    <section className="relative -mt-20 flex min-h-svh flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {heroImageUrl ? (
          <div className="absolute inset-0">
            {/* Cinematic Background Image */}
            <Image
              src={heroImageUrl}
              alt="Spiritual Riders brotherhood on the road"
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
            />

            {/* Dark Vignette & Atmospheric Gradients */}
            {/* 1. Base dark tint to preserve contrast across all screens */}
            <div className="absolute inset-0 bg-obsidian-950/60" />

            {/* 2. Vertical gradient: deeper at the bottom where text and next sections reside */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/75 to-obsidian-950/25" />

            {/* 3. Horizontal gradient: deep from the left to protect the heading & body typography */}
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950/90 via-obsidian-950/50 to-transparent" />

            {/* 4. Top radial gold glow for brotherhood warmth */}
            <div className="absolute -top-24 right-0 h-[36rem] w-[36rem] rounded-full bg-gold-500/10 blur-3xl" />
          </div>
        ) : (
          /* Procedural drift & road SVG fallback when no image is configured */
          <div className="hero-drift absolute inset-0">
            <div className="absolute inset-0 bg-obsidian-950" />
            <div className="absolute -top-24 right-0 h-[36rem] w-[36rem] rounded-full bg-gold-500/10 blur-3xl" />
            <svg
              className="absolute inset-x-0 bottom-0 h-[70%] w-full"
              viewBox="0 0 800 900"
              preserveAspectRatio="xMidYMax slice"
              fill="none"
            >
              <path d="M400 0 L640 900" stroke="oklch(75% 0.13 80)" strokeOpacity="0.45" />
              <path d="M400 0 L160 900" stroke="oklch(75% 0.13 80)" strokeOpacity="0.45" />
              <path d="M360 280 H440" stroke="oklch(96% 0.01 90)" strokeOpacity="0.2" />
              <path d="M300 520 H500" stroke="oklch(96% 0.01 90)" strokeOpacity="0.12" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/75 to-obsidian-950/25" />
          </div>
        )}

        {/* Signature architectural gold line */}
        <div className="absolute inset-y-0 left-[8%] hidden w-px bg-gradient-to-b from-transparent via-gold-500/40 to-transparent md:block" />
      </div>

      <Container className="relative z-10 mt-auto pt-32 pb-16 md:pb-20">
        <p className="mb-8 max-w-none text-[0.68rem] uppercase tracking-[0.42em] text-gold-500">
          Est. {SITE_CONFIG.foundedYear} — The Brotherhood
        </p>
        <AnimatedText
          as="h1"
          text="Ride Beyond Roads."
          className="max-w-5xl font-medium text-foreground"
        />
        <p className="mt-8 max-w-2xl font-display text-2xl leading-snug font-medium text-ivory-100 italic md:text-3xl">
          More than riders. One spirit.
        </p>
        <p className="mt-5 max-w-xl">
          A crew bound by machines, miles, and the quiet code of the road.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href="#intro">Enter the chapter</Button>
          <Button href="#machines" variant="outline">
            The machines
          </Button>
        </div>
        <a
          href="#intro"
          className="mt-16 inline-flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.38em] text-graphite-300"
        >
          <span className="h-px w-12 bg-gold-500/80" aria-hidden="true" />
          Scroll
        </a>
      </Container>
    </section>
  );
}

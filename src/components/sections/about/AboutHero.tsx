import { AnimatedText } from "@/components/motion/AnimatedText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/config/site";

export function AboutHero() {
  return (
    <section className="relative -mt-20 flex min-h-[88svh] flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-obsidian-950" />
        <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] rounded-full bg-gold-500/10 blur-3xl" />
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <path d="M0 220 H1200" stroke="oklch(75% 0.13 80)" strokeOpacity="0.4" />
          <path d="M60 280 H340" stroke="oklch(96% 0.01 90)" strokeOpacity="0.14" />
          <path d="M860 300 H1140" stroke="oklch(96% 0.01 90)" strokeOpacity="0.1" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/88 to-obsidian-950/20" />
      </div>

      <Container className="relative z-10 mt-auto pt-32 pb-16 md:pb-20">
        <p className="mb-8 max-w-none text-[0.68rem] uppercase tracking-[0.42em] text-gold-500">
          The story · Est. {SITE_CONFIG.foundedYear}
        </p>
        <AnimatedText
          as="h1"
          text="The long way into a house."
          className="max-w-4xl font-medium text-foreground"
        />
        <p className="mt-8 max-w-xl font-display text-2xl leading-snug font-medium text-ivory-100 italic md:text-3xl">
          Twelve riders. One dawn. A brotherhood.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href="#origin">The origin</Button>
          <Button href="#philosophy" variant="outline">
            Our philosophy
          </Button>
        </div>
      </Container>
    </section>
  );
}

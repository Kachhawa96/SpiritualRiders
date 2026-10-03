import type { Metadata } from "next";
import { RoadPlate } from "@/components/brand/RoadPlate";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  },
  description: SITE_CONFIG.description,
};

const PRINCIPLES = [
  {
    index: "01",
    eyebrow: "Brotherhood",
    title: "We ride as one.",
    description:
      "Respect is the only rank that matters. The crew comes before the machine, and the machine before the noise.",
  },
  {
    index: "02",
    eyebrow: "Machines",
    title: "Known by heart.",
    description:
      "Every motorcycle here has a rider, a history, and a road it already understands.",
  },
  {
    index: "03",
    eyebrow: "The road",
    title: "Chapters, not posts.",
    description:
      "Dawn starts, long highways, and the ride home. That is the record this house keeps.",
  },
] as const;

/**
 * Temporary brand shell. Phase 2 replaces this page with the full homepage.
 */
export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[calc(100svh-5rem)] flex-col">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-y-0 left-[8%] hidden w-px bg-gradient-to-b from-transparent via-gold-500/35 to-transparent md:block" />
          <div className="absolute -top-24 right-0 h-[28rem] w-[28rem] rounded-full bg-gold-500/5 blur-3xl" />
        </div>

        <Container className="relative flex flex-1 flex-col justify-end pt-16 pb-14 md:pb-20">
          <p className="mb-8 max-w-none text-[0.68rem] uppercase tracking-[0.42em] text-gold-500">
            Est. {SITE_CONFIG.foundedYear} — The Brotherhood
          </p>

          <AnimatedText
            as="h1"
            text="Ride Beyond Roads."
            className="max-w-5xl font-medium text-foreground"
          />

          <div className="mt-8 max-w-2xl">
            <p className="max-w-none font-display text-2xl leading-snug font-medium text-ivory-100 italic md:text-3xl">
              More than riders. One spirit.
            </p>
          </div>

          <div className="mt-5 max-w-xl">
            <p>
              A brotherhood built on machines, miles, and the quiet code of the road.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="#brotherhood">Enter the chapter</Button>
            <Button href="#machines" variant="outline">
              The machines
            </Button>
          </div>

          <a
            href="#brotherhood"
            className="mt-16 inline-flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.38em] text-graphite-300"
          >
            <span className="h-px w-12 bg-gold-500/80" aria-hidden="true" />
            Scroll
          </a>
        </Container>
      </section>

      <section id="brotherhood" className="section-padding border-t border-border-subtle">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="The spirit"
              title="Brotherhood, before everything."
              subtitle="Spiritual Riders is a motorcycle crew with a house style: dark, exact, and loyal to the ride."
            />
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
            {PRINCIPLES.map((principle, index) => (
              <Reveal key={principle.index} delay={index * 0.08} className="h-full">
                <Card interactive {...principle} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="machines" className="section-padding border-t border-border-subtle">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="The machines"
                title="Steel, held with care."
                subtitle="Portraits, rides, and the gallery open in the chapters ahead. The mark of the house is already set."
              />
            </Reveal>
            <Reveal delay={0.12} className="mt-8">
              <Button href={`mailto:${SITE_CONFIG.email}`} variant="glow">
                Write to the crew
              </Button>
            </Reveal>
          </div>

          <ImageReveal className="aspect-[3/4] w-full border border-border-subtle">
            <RoadPlate />
          </ImageReveal>
        </Container>
      </section>
    </>
  );
}

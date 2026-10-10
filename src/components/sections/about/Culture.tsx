import Image from "next/image";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CULTURE_IMAGE_URL =
  "https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/ride-salt-and-silence.jpg";

export function Culture() {
  return (
    <section id="culture" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Culture"
              title="Dawn, dark, and the pause."
              subtitle="The house has rituals, not performances."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8">
              Dawn starts are still the purest hour. The city has not begun its argument,
              and the line can hear itself. Night patrol came later, in 2025, when
              after-dark rides became the way the crew proved that the back of the
              formation is watched.
            </p>
            <p className="mt-5">
              Salt and Silence, the run from Jaipur to the Rann, is the story the house
              tells when someone asks what a chapter feels like. Eighteen riders, a long
              straight, and a camp where the last sound was the engines cooling. No
              trophies. The ride was the record.
            </p>
          </Reveal>
        </div>
        <ImageReveal className="relative aspect-[4/5] w-full overflow-hidden border border-border-subtle bg-obsidian-950 group lg:order-first">
          <Image
            src={CULTURE_IMAGE_URL}
            alt="Salt and Silence - The Rann"
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian-950/85 via-obsidian-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-graphite-300">
            <span className="text-gold-500">The Rann</span>
            <span className="text-ivory-100 font-medium">Salt and Silence</span>
          </div>
        </ImageReveal>
      </Container>
    </section>
  );
}

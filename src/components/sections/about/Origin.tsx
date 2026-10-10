import Image from "next/image";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ORIGIN_IMAGE_URL =
  "https://fkchydbhfklfsuvodfja.supabase.co/storage/v1/object/public/rider-media/covers/gallery-before-the-city.jpg";

export function Origin() {
  return (
    <section id="origin" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <ImageReveal className="relative aspect-[4/5] w-full overflow-hidden border border-border-subtle bg-obsidian-950 group">
          <Image
            src={ORIGIN_IMAGE_URL}
            alt="Before the city - Jaipur, 2020"
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian-950/85 via-obsidian-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-graphite-300">
            <span className="text-gold-500">2020</span>
            <span className="text-ivory-100 font-medium">Before the city</span>
          </div>
        </ImageReveal>
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="Origin"
              title="Jaipur, before light."
              subtitle="Twelve riders left before the city woke. That morning became the house."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8">
              Vikram Rathore called the first departure. Kabir Sen was already in the line.
              There was no banner and no name grand enough to matter yet. There was a road
              out of Jaipur, cold air, and the agreement that the ride home would count as
              much as the road out.
            </p>
            <p className="mt-5">
              The brotherhood did not begin as a directory of motorcycles. It began as a
              formation. Arjun Mehta keeps that formation now, as captain: the line stays
              whole, and no machine is left in the dark.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

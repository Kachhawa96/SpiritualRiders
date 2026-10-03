import { FEATURED_BIKES } from "@/data/home";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

export function FeaturedBikes() {
  return (
    <section id="machines" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="The machines"
            title="Steel, held with care."
            subtitle="Two motorcycles from the line. Each one has a rider who knows it by heart."
          />
        </Reveal>

        <div className="mt-16 flex flex-col gap-16 md:gap-24">
          {FEATURED_BIKES.map((bike, index) => (
            <article
              key={bike.model}
              className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <ImageReveal
                className={cn(
                  "aspect-[4/5] w-full border border-border-subtle sm:aspect-[5/4]",
                  index % 2 === 1 && "lg:order-2"
                )}
              >
                <ChapterFrame
                  tone={bike.tone}
                  label={String(bike.year)}
                  title={bike.model}
                />
              </ImageReveal>
              <Reveal delay={0.08} className={index % 2 === 1 ? "lg:order-1" : undefined}>
                <p className="text-[0.68rem] uppercase tracking-[0.32em] text-gold-500">
                  {bike.brand}
                </p>
                <h3 className="mt-4 font-medium">{bike.model}</h3>
                <p className="mt-2 text-sm text-ivory-100">
                  {bike.year} · {bike.color}
                </p>
                <p className="mt-5 max-w-md">{bike.note}</p>
                <p className="mt-6 text-xs uppercase tracking-[0.24em] text-graphite-300">
                  Ridden by {bike.rider}
                </p>
              </Reveal>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
        <ImageReveal className="aspect-[4/5] w-full border border-border-subtle lg:order-first">
          <ChapterFrame tone="salt" label="The Rann" title="Salt and Silence" />
        </ImageReveal>
      </Container>
    </section>
  );
}

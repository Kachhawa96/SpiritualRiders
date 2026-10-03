import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Origin() {
  return (
    <section id="origin" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <ImageReveal className="aspect-[4/5] w-full border border-border-subtle">
          <ChapterFrame tone="dawn" label="2020" title="Before the city" />
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

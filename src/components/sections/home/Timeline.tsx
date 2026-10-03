import { CHAPTERS } from "@/data/home";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Timeline() {
  return (
    <section id="journey" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <SectionHeading
            eyebrow="Our journey"
            title="Chapters of the house."
            subtitle="A short line from the first dawn to the road we are on now."
          />
        </Reveal>
        <div className="relative lg:col-span-7 lg:col-start-6">
          <span
            className="absolute top-2 bottom-2 left-[3px] w-px bg-border-subtle"
            aria-hidden="true"
          />
          <ol>
            {CHAPTERS.map((chapter, index) => (
            <li key={chapter.year} className="relative pb-10 pl-10 last:pb-0">
              <span
                className="absolute top-2 left-0 size-2 bg-gold-500"
                aria-hidden="true"
              />
              <Reveal delay={index * 0.05}>
                <p className="text-[0.68rem] uppercase tracking-[0.32em] text-gold-500">
                  {chapter.year}
                </p>
                <h3 className="mt-3 text-[clamp(1.35rem,2vw,1.75rem)] font-medium">
                  {chapter.title}
                </h3>
                <p className="mt-3 text-sm">{chapter.text}</p>
              </Reveal>
            </li>
          ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}

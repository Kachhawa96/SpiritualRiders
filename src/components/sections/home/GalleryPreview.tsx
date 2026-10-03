import { GALLERY_FRAMES } from "@/data/home";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES } from "@/config/site";
import { cn } from "@/lib/utils";

export function GalleryPreview() {
  return (
    <section id="gallery" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="Memories"
              title="From the road."
              subtitle="A few frames from the line. The full gallery opens with the next chapter."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <Button href={ROUTES.gallery} variant="ghost">
              The gallery
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4">
          {GALLERY_FRAMES.map((frame, index) => (
            <ImageReveal
              key={frame.title}
              className={cn(
                "min-h-52 border border-border-subtle",
                index === 0 && "col-span-2 min-h-72 md:row-span-2 md:min-h-[36rem]"
              )}
            >
              <ChapterFrame tone={frame.tone} label={frame.label} title={frame.title} />
            </ImageReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

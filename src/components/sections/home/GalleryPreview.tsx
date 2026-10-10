import Image from "next/image";
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
                "relative min-h-52 overflow-hidden border border-border-subtle bg-obsidian-950 group",
                index === 0 && "col-span-2 min-h-72 md:row-span-2 md:min-h-[36rem]"
              )}
            >
              {frame.image_url ? (
                <>
                  <Image
                    src={frame.image_url}
                    alt={frame.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes={
                      index === 0
                        ? "(min-width: 768px) 50vw, 100vw"
                        : "(min-width: 768px) 25vw, 50vw"
                    }
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian-950/85 via-obsidian-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-graphite-300">
                    <span className="text-gold-500">{frame.label}</span>
                    <span className="text-ivory-100 font-medium truncate ml-2">{frame.title}</span>
                  </div>
                </>
              ) : (
                <ChapterFrame tone={frame.tone} label={frame.label} title={frame.title} />
              )}
            </ImageReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

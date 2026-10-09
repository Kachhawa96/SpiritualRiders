import { ABOUT_MACHINES } from "@/data/about";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FrameTone } from "@/data/home";

const TONES: FrameTone[] = ["machine", "highway", "crew"];

export function WhatWeRide() {
  return (
    <section id="what-we-ride" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="What we ride"
            title="A mixed stable, kept honestly."
            subtitle="Cafe, twin, and boxer share the same line. Nothing here is a showroom. The machine is known, maintained, and ridden."
          />
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {ABOUT_MACHINES.map((machine, index) => (
            <Reveal key={machine.model} delay={index * 0.08} className="h-full">
              <article className="card-interactive group flex h-full flex-col border border-border-subtle bg-obsidian-900/40 p-4 sm:p-5 rounded-sm">
                <ImageReveal className="aspect-[4/5] w-full border border-border-subtle">
                  <ChapterFrame
                    tone={TONES[index] ?? "machine"}
                    label={machine.brand}
                    title={machine.model}
                  />
                </ImageReveal>
                <h3 className="mt-6 font-medium text-[clamp(1.5rem,2vw,2rem)]">
                  {machine.model}
                </h3>
                <p className="mt-2 text-xs uppercase tracking-[0.22em] text-gold-500">
                  {machine.detail}
                </p>
                <p className="mt-4 text-sm">{machine.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

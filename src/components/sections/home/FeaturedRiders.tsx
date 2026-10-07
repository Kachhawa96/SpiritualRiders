import Image from "next/image";
import Link from "next/link";
import { getFeaturedHomeRiders } from "@/data/home";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isLiveRoute, ROUTES } from "@/config/site";

export async function FeaturedRiders() {
  const featured = await getFeaturedHomeRiders();
  return (
    <section id="crew" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="The crew"
              title="Faces of the line."
              subtitle="Three riders from the house. The full line is with the crew."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <Button href={ROUTES.riders} variant="ghost">
              All riders
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {featured.map((rider, index) => (
            <Reveal key={rider.slug} delay={index * 0.08} className="h-full">
              <article className="flex h-full flex-col">
                <ImageReveal className="relative aspect-[3/4] w-full overflow-hidden border border-border-subtle bg-obsidian-950">
                  {rider.profile_image_url ? (
                    <Image
                      src={rider.profile_image_url}
                      alt={rider.displayName}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  ) : (
                    <ChapterFrame tone={rider.tone} label={rider.mark} title={rider.position} />
                  )}
                </ImageReveal>
                <p className="mt-6 text-[0.68rem] uppercase tracking-[0.32em] text-gold-500">
                  {rider.position}
                </p>
                <h3 className="mt-3 font-medium text-[clamp(1.6rem,2vw,2.1rem)]">
                  <Link
                    href={ROUTES.rider(rider.slug)}
                    prefetch={isLiveRoute(ROUTES.rider(rider.slug))}
                    className="hover:text-gold-400"
                  >
                    {rider.displayName}
                  </Link>
                </h3>
                <p className="mt-3 text-sm">{rider.shortBio}</p>
                <p className="mt-auto pt-5 text-sm text-ivory-100">{rider.bike}</p>
                {rider.city ? (
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-graphite-300">
                    {rider.city}
                  </p>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

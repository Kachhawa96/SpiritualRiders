import Image from "next/image";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ROUTES } from "@/config/site";
import { getFeaturedRide } from "@/lib/community";
import { formatDate, formatNumber } from "@/lib/utils";

export async function RideHighlight() {
  const ride = await getFeaturedRide();
  if (!ride) return null;

  return (
    <section id="ride" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container>
        <article className="grid overflow-hidden border border-border-subtle lg:grid-cols-2">
          <ImageReveal className="relative min-h-[22rem] lg:min-h-[36rem] overflow-hidden bg-obsidian-950">
            {ride.cover_image_url ? (
              <>
                <Image
                  src={ride.cover_image_url}
                  alt={ride.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between text-xs tracking-[0.2em] uppercase text-graphite-300">
                  <span className="text-gold-500">{ride.route_summary ?? "The road"}</span>
                  <span>{ride.title}</span>
                </div>
              </>
            ) : (
              <ChapterFrame tone={ride.tone} label={ride.route_summary ?? "The road"} title={ride.title} />
            )}
          </ImageReveal>
          <div className="flex flex-col justify-center bg-obsidian-900 px-7 py-12 md:px-12 md:py-16">
            <Reveal>
              <p className="text-[0.68rem] uppercase tracking-[0.32em] text-gold-500">
                Ride highlight
              </p>
              <h2 className="mt-5 font-medium">{ride.title}</h2>
              <p className="mt-5 max-w-md text-base">{ride.short_description}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-border-subtle pt-6">
                <div>
                  <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-graphite-300">
                    When
                  </dt>
                  <dd className="mt-2 text-sm text-ivory-100">
                    {formatDate(`${ride.start_date}T12:00:00`)}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-graphite-300">
                    Distance
                  </dt>
                  <dd className="mt-2 text-sm text-ivory-100">
                    {ride.distance_km ? `${formatNumber(ride.distance_km)} km` : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-graphite-300">
                    The line
                  </dt>
                  <dd className="mt-2 text-sm text-ivory-100">{ride.participant_count} riders</dd>
                </div>
              </dl>
              <div className="mt-10">
                <Button href={ROUTES.ride(ride.slug)} variant="outline">
                  The ride
                </Button>
              </div>
            </Reveal>
          </div>
        </article>
      </Container>
    </section>
  );
}

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
          <ImageReveal className="min-h-[22rem] lg:min-h-[36rem]">
            <ChapterFrame tone={ride.tone} label={ride.route_summary ?? "The road"} title={ride.title} />
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

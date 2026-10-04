import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { isLiveRoute, ROUTES, SITE_CONFIG } from "@/config/site";
import { getRide, getRides, RIDE_STATUS_LABEL, RIDE_TYPE_LABEL } from "@/lib/community";
import { formatDate, formatNumber } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const rides = await getRides();
  return rides.map((ride) => ({ slug: ride.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ride = await getRide(slug);
  if (!ride) notFound();
  return {
    title: ride.title,
    description: ride.short_description,
    openGraph: {
      title: `${ride.title} | ${SITE_CONFIG.name}`,
      description: ride.short_description,
    },
  };
}

export default async function RidePage({ params }: PageProps) {
  const { slug } = await params;
  const ride = await getRide(slug);
  if (!ride) notFound();

  return (
    <>
      <section className="relative -mt-20 flex min-h-[70svh] flex-col">
        <div className="pointer-events-none absolute inset-0 bg-obsidian-950" aria-hidden="true" />
        <Container className="relative z-10 mt-auto pt-32 pb-14">
          <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">
            {RIDE_TYPE_LABEL[ride.ride_type]} · {RIDE_STATUS_LABEL[ride.status]}
          </p>
          <h1 className="mt-5 max-w-4xl font-medium">{ride.title}</h1>
          {ride.tagline ? (
            <p className="mt-6 max-w-xl font-display text-2xl text-ivory-100 italic">{ride.tagline}</p>
          ) : null}
          <div className="mt-10">
            <Button href={ROUTES.rides} variant="outline">
              All rides
            </Button>
          </div>
        </Container>
      </section>

      <section className="section-padding border-t border-border-subtle">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="max-w-2xl text-base md:text-lg">{ride.description}</p>
            <dl className="mt-10 grid gap-px bg-border-subtle sm:grid-cols-2">
              <Fact label="When" value={formatDate(`${ride.start_date}T12:00:00`)} />
              <Fact
                label="Distance"
                value={ride.distance_km ? `${formatNumber(ride.distance_km)} km` : "—"}
              />
              <Fact label="Road" value={ride.route_summary ?? "—"} />
              <Fact label="Meet" value={ride.meeting_point ?? "—"} />
              <Fact label="The line" value={`${ride.participant_count} riders`} />
            </dl>
          </div>
          <ImageReveal className="min-h-80 border border-border-subtle lg:col-span-5">
            <ChapterFrame tone={ride.tone} label={ride.route_summary ?? "The road"} title={ride.title} />
          </ImageReveal>
        </Container>
      </section>

      <section className="section-padding border-t border-border-subtle">
        <Container>
          <h2 className="font-medium">From the crew</h2>
          <p className="mt-4 max-w-xl text-sm">
            Names the house can show. The recorded line was {ride.participant_count}.
          </p>
          {ride.participants.length > 0 ? (
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ride.participants.map((person) => (
                <li key={person.slug} className="border border-border-subtle px-5 py-4">
                  <Link
                    href={ROUTES.rider(person.slug)}
                    prefetch={isLiveRoute(ROUTES.rider(person.slug))}
                    className="font-display text-2xl text-ivory-100"
                  >
                    {person.display_name}
                  </Link>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-gold-500">
                    {person.position_label}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8">No named riders are attached to this ride yet.</p>
          )}
        </Container>
      </section>

      {ride.frames.length > 0 ? (
        <section className="section-padding border-t border-border-subtle">
          <Container>
            <h2 className="font-medium">Frames</h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-3">
              {ride.frames.map((frame) => (
                <li key={frame.id} className="border border-border-subtle">
                  <div className="relative aspect-[4/3]">
                    <ChapterFrame tone={frame.tone} label={frame.rider_name ?? "The road"} title={frame.title} />
                  </div>
                  <p className="px-4 py-4 text-sm">{frame.caption}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-obsidian-950 px-5 py-5">
      <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-graphite-300">{label}</dt>
      <dd className="mt-2 text-sm text-ivory-100">{value}</dd>
    </div>
  );
}

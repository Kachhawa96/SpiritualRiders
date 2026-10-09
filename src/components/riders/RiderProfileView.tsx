import Image from "next/image";
import Link from "next/link";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { isLiveRoute, ROUTES } from "@/config/site";
import { STYLE_LABEL } from "@/lib/directory";
import { formatDate, yearsExperience } from "@/lib/utils";
import type { RiderProfile } from "@/types/rider";

interface RiderProfileViewProps {
  profile: RiderProfile;
}

export function RiderProfileView({ profile }: RiderProfileViewProps) {
  const socials = [
    { label: "Instagram", href: profile.instagram_url },
    { label: "Facebook", href: profile.facebook_url },
    { label: "YouTube", href: profile.youtube_url },
    { label: "Website", href: profile.website_url },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));

  const paragraphs = profile.bio.split(/\n\n+/).filter(Boolean);

  return (
    <>
      <section className="relative -mt-20 flex min-h-[78svh] flex-col">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-obsidian-950" />
          {profile.cover_image_url ? (
            <Image
              src={profile.cover_image_url}
              alt={profile.display_name}
              fill
              priority
              className="object-cover opacity-30"
            />
          ) : null}
          <div className="absolute top-0 right-0 h-[24rem] w-[24rem] rounded-full bg-gold-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/80 to-obsidian-950/25" />
        </div>
        <Container className="relative z-10 mt-auto pt-32 pb-14">
          <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">
            {profile.position_label}
            {profile.city ? ` · ${profile.city}` : ""}
          </p>
          <h1 className="mt-5 max-w-4xl font-medium">{profile.display_name}</h1>
          <p className="mt-6 max-w-xl text-lg">{profile.short_bio}</p>
          <p className="mt-4 text-sm text-ivory-100">
            {profile.bike_year} {profile.bike_brand} {profile.bike_model}
          </p>
          <div className="mt-10">
            <Button href={ROUTES.riders} variant="outline">
              Back to the crew
            </Button>
          </div>
        </Container>
      </section>

      <section className="section-padding border-t border-border-subtle">
        <Container className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading eyebrow="The rider" title="The story." />
          </Reveal>
          <div className="lg:col-span-8">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="mt-5 first:mt-0 max-w-2xl text-base md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="section-padding border-t border-border-subtle">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <ImageReveal className="relative aspect-[4/5] w-full overflow-hidden border border-border-subtle bg-obsidian-950">
            {profile.bike_image_url ? (
              <Image
                src={profile.bike_image_url}
                alt={`${profile.bike_brand} ${profile.bike_model}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            ) : (
              <ChapterFrame
                tone={profile.tone}
                label={String(profile.bike_year)}
                title={profile.bike_model}
              />
            )}
          </ImageReveal>
          <Reveal>
            <SectionHeading
              eyebrow="The machine"
              title={`${profile.bike_brand} ${profile.bike_model}`}
              subtitle={profile.bike_color ? `${profile.bike_year} · ${profile.bike_color}` : String(profile.bike_year)}
            />
            {profile.bike_variant ? (
              <p className="mt-6 text-sm text-ivory-100">{profile.bike_variant}</p>
            ) : null}
            <p className="mt-6 max-w-md">
              This is the motorcycle {profile.display_name} keeps in the line.
              {profile.favorite_route ? ` The road they name is ${profile.favorite_route}.` : ""}
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="section-padding border-t border-border-subtle">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Riding identity" title="How they ride." />
          </Reveal>
          <dl className="mt-12 grid gap-px bg-border-subtle sm:grid-cols-2 lg:grid-cols-3">
            <Fact label="Style" value={profile.riding_style.map((style) => STYLE_LABEL[style]).join(", ")} />
            <Fact
              label="Riding since"
              value={profile.riding_since ? `${profile.riding_since} · ${yearsExperience(profile.riding_since)}` : "—"}
            />
            <Fact label="Joined the house" value={formatDate(`${profile.joined_date}T12:00:00`)} />
            <Fact label="Favored road" value={profile.favorite_route ?? "—"} />
            {profile.age !== null ? <Fact label="Age" value={String(profile.age)} /> : null}
            {profile.blood_group ? <Fact label="Blood group" value={profile.blood_group} /> : null}
            {profile.city ? <Fact label="City" value={profile.city} /> : null}
          </dl>
          {socials.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-4">
              {socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-gold-400"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </Container>
      </section>

      <section className="section-padding border-t border-border-subtle">
        <Container className="grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <SectionHeading eyebrow="Contributions" title="What they have given the line." />
          </Reveal>
          <ol className="lg:col-span-8">
            {profile.achievements.length > 0 ? (
              profile.achievements.map((item) => (
                <li key={item} className="border-t border-border-subtle py-5 text-ivory-100 last:border-b">
                  {item}
                </li>
              ))
            ) : (
              <li className="border-t border-border-subtle py-5">
                The record of this rider is still short.
              </li>
            )}
          </ol>
        </Container>
      </section>

      <section className="section-padding border-t border-border-subtle">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Gallery"
              title="Marks from the road."
              subtitle="Drawn frames for this rider. Photography comes when the house has it."
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <ImageReveal className="relative min-h-64 overflow-hidden border border-border-subtle bg-obsidian-950">
              {profile.profile_image_url ? (
                <Image
                  src={profile.profile_image_url}
                  alt={profile.display_name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
              ) : (
                <ChapterFrame tone={profile.tone} label={profile.mark} title={profile.bike_model} />
              )}
            </ImageReveal>
            <ImageReveal className="min-h-64 border border-border-subtle">
              <ChapterFrame tone="highway" label="The road" title={profile.favorite_route ?? "The line"} />
            </ImageReveal>
            <ImageReveal className="min-h-64 border border-border-subtle">
              <ChapterFrame
                tone="dawn"
                label="Style"
                title={profile.riding_style[0] ? STYLE_LABEL[profile.riding_style[0]] : "The ride"}
              />
            </ImageReveal>
          </div>
        </Container>
      </section>

      <nav aria-label="Other riders" className="border-t border-border-subtle">
        <Container className="grid gap-px bg-border-subtle sm:grid-cols-2">
          <NeighborLink label="Previous" rider={profile.previous} />
          <NeighborLink label="Next" rider={profile.next} align="end" />
        </Container>
      </nav>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-obsidian-950 px-6 py-6">
      <dt className="text-[0.62rem] uppercase tracking-[0.22em] text-graphite-300">{label}</dt>
      <dd className="mt-2 text-sm text-ivory-100">{value}</dd>
    </div>
  );
}

function NeighborLink({
  label,
  rider,
  align = "start",
}: {
  label: string;
  rider: RiderProfile["previous"];
  align?: "start" | "end";
}) {
  if (!rider) {
    return <div className="bg-obsidian-950 px-6 py-8" />;
  }

  return (
    <Link
      href={ROUTES.rider(rider.slug)}
      prefetch={isLiveRoute(ROUTES.rider(rider.slug))}
      className={`group bg-obsidian-950 px-6 py-8 transition-colors duration-200 hover:bg-obsidian-900 ${align === "end" ? "sm:text-right" : ""}`}
    >
      <span className="text-[0.62rem] uppercase tracking-[0.22em] text-gold-500">{label}</span>
      <span className="mt-2 block font-display text-2xl text-ivory-100 transition-colors duration-200 group-hover:text-gold-400">{rider.display_name}</span>
    </Link>
  );
}

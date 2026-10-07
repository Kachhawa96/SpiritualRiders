import Image from "next/image";
import Link from "next/link";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { isLiveRoute, ROUTES } from "@/config/site";
import { STYLE_LABEL } from "@/lib/directory";
import type { DirectoryRider } from "@/types/rider";

interface RiderCardProps {
  rider: DirectoryRider;
}

export function RiderCard({ rider }: RiderCardProps) {
  const styles = rider.riding_style.map((style) => STYLE_LABEL[style]).join(" · ");
  const imageUrl = rider.profile_image_url || rider.cover_image_url;

  return (
    <article className="group flex h-full flex-col border border-border-subtle bg-obsidian-900 transition-colors hover:border-gold-500/40">
      <Link
        href={ROUTES.rider(rider.slug)}
        prefetch={isLiveRoute(ROUTES.rider(rider.slug))}
        className="flex h-full flex-col"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-obsidian-950">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={rider.display_name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent opacity-60" />
            </>
          ) : (
            <ChapterFrame tone={rider.tone} label={rider.mark} title={rider.position_label} />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-500">
              {rider.position_label}
            </p>
            {rider.is_featured ? (
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-graphite-300">
                Featured
              </p>
            ) : null}
          </div>
          <h2 className="mt-3 font-medium text-[clamp(1.45rem,2vw,1.9rem)]">
            {rider.display_name}
          </h2>
          <p className="mt-3 text-sm">{rider.short_bio}</p>
          <p className="mt-auto pt-5 text-sm text-ivory-100">
            {rider.bike_brand} {rider.bike_model}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-graphite-300">
            {rider.bike_year}
            {rider.city ? ` · ${rider.city}` : ""}
            {styles ? ` · ${styles}` : ""}
          </p>
        </div>
      </Link>
    </article>
  );
}

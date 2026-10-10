import Image from "next/image";
import Link from "next/link";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { RideStatusBadge } from "@/components/rides/RideStatusBadge";
import { isLiveRoute, ROUTES } from "@/config/site";
import { getCalculatedRideStatus, RIDE_TYPE_LABEL } from "@/lib/ride-labels";
import type { RideSummary } from "@/lib/community";
import { formatDate, formatNumber } from "@/lib/utils";

export function RideCard({ ride }: { ride: RideSummary }) {
  const calculatedStatus =
    ride.calculated_status ?? getCalculatedRideStatus(ride.start_date, ride.end_date);

  return (
    <article className="card-interactive group flex h-full flex-col border border-border-subtle bg-obsidian-900 rounded-sm overflow-hidden">
      <Link
        href={ROUTES.ride(ride.slug)}
        prefetch={isLiveRoute(ROUTES.ride(ride.slug))}
        className="flex h-full flex-col"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-obsidian-950">
          <div className="absolute top-3.5 left-3.5 z-20">
            <RideStatusBadge status={calculatedStatus} />
          </div>

          {ride.cover_image_url ? (
            <>
              <Image
                src={ride.cover_image_url}
                alt={ride.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-obsidian-900/20 to-transparent" />
            </>
          ) : (
            <ChapterFrame
              tone={ride.tone}
              label={RIDE_TYPE_LABEL[ride.ride_type]}
              title={ride.title}
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-500">
            {RIDE_TYPE_LABEL[ride.ride_type]}
            {ride.route_summary ? ` · ${ride.route_summary}` : ""}
          </p>
          <h2 className="mt-3 font-medium text-[clamp(1.45rem,2vw,1.9rem)]">{ride.title}</h2>
          <p className="mt-3 text-sm">{ride.short_description}</p>
          <p className="mt-auto pt-5 text-xs uppercase tracking-[0.18em] text-graphite-300">
            {formatDate(`${ride.start_date}T12:00:00`)}
            {ride.distance_km ? ` · ${formatNumber(ride.distance_km)} km` : ""}
            {` · ${ride.participant_count} in the line`}
          </p>
        </div>
      </Link>
    </article>
  );
}

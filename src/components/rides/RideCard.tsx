import Link from "next/link";
import { ChapterFrame } from "@/components/visuals/ChapterFrame";
import { isLiveRoute, ROUTES } from "@/config/site";
import { RIDE_STATUS_LABEL, RIDE_TYPE_LABEL } from "@/lib/ride-labels";
import type { RideSummary } from "@/lib/community";
import { formatDate, formatNumber } from "@/lib/utils";

export function RideCard({ ride }: { ride: RideSummary }) {
  return (
    <article className="card-interactive group flex h-full flex-col border border-border-subtle bg-obsidian-900 rounded-sm">
      <Link
        href={ROUTES.ride(ride.slug)}
        prefetch={isLiveRoute(ROUTES.ride(ride.slug))}
        className="flex h-full flex-col"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <ChapterFrame
            tone={ride.tone}
            label={RIDE_TYPE_LABEL[ride.ride_type]}
            title={ride.title}
          />
        </div>
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-500">
            {RIDE_STATUS_LABEL[ride.status]}
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

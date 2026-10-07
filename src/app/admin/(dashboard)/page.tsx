import Link from "next/link";
import { getAdminDashboardStats } from "@/lib/db/admin";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-[0.08em] text-ivory-100 sm:text-4xl">
            Operations Dashboard
          </h1>
          <p className="mt-1 text-sm text-graphite-300">
            Real-time community telemetry, active roster metrics, and content management.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/riders/new"
            className="cursor-pointer rounded-sm border border-gold-500 bg-gold-500 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400"
          >
            + New Rider
          </Link>
          <Link
            href="/admin/rides/new"
            className="cursor-pointer rounded-sm border border-charcoal-500 bg-charcoal-700/60 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ivory-100 transition-colors hover:border-gold-500 hover:text-gold-400"
          >
            + New Ride
          </Link>
          <Link
            href="/admin/gallery"
            className="cursor-pointer rounded-sm border border-charcoal-500 bg-charcoal-700/60 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ivory-100 transition-colors hover:border-gold-500 hover:text-gold-400"
          >
            + Upload Frame
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Riders metric */}
        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-graphite-300">
              Total Roster
            </span>
            <span className="rounded-xs bg-gold-500/10 px-1.5 py-0.5 text-[0.62rem] font-semibold text-gold-400">
              Riders
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-ivory-100">
            {stats.riders.total}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-graphite-300">
            <span>
              <strong className="text-ivory-100">{stats.riders.active}</strong> active
            </span>
            <span>•</span>
            <span>
              <strong className="text-gold-400">{stats.riders.featured}</strong> featured
            </span>
          </div>
        </div>

        {/* Rides metric */}
        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-graphite-300">
              Community Rides
            </span>
            <span className="rounded-xs bg-gold-500/10 px-1.5 py-0.5 text-[0.62rem] font-semibold text-gold-400">
              Expeditions
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-ivory-100">
            {stats.rides.total}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-graphite-300">
            <span>
              <strong className="text-ivory-100">{stats.rides.upcoming}</strong> upcoming
            </span>
            <span>•</span>
            <span>
              <strong className="text-graphite-200">{stats.rides.completed}</strong> completed
            </span>
          </div>
        </div>

        {/* Gallery metric */}
        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-graphite-300">
              Archive Frames
            </span>
            <span className="rounded-xs bg-gold-500/10 px-1.5 py-0.5 text-[0.62rem] font-semibold text-gold-400">
              Gallery
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-ivory-100">
            {stats.gallery.total}
          </p>
          <p className="mt-2 text-xs text-graphite-300">
            Photographs and moments on record
          </p>
        </div>

        {/* Security & Access */}
        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/60 p-5">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-medium uppercase tracking-[0.22em] text-graphite-300">
              System Access
            </span>
            <span className="rounded-xs bg-emerald-500/10 px-1.5 py-0.5 text-[0.62rem] font-semibold text-emerald-400">
              Active
            </span>
          </div>
          <p className="mt-3 font-display text-lg font-semibold text-ivory-100">
            Supabase Protected
          </p>
          <p className="mt-2 text-xs text-graphite-300">
            Server-side RLS authorization active
          </p>
        </div>
      </div>

      {/* Two Column Section: Recent Riders & Recent Rides */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Riders */}
        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
          <div className="flex items-center justify-between border-b border-charcoal-700 pb-4">
            <h2 className="font-display text-xl font-bold tracking-wide text-ivory-100">
              Recent Riders
            </h2>
            <Link
              href="/admin/riders"
              className="text-xs uppercase tracking-wider text-gold-400 hover:underline"
            >
              View All ({stats.riders.total}) →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-charcoal-700/60">
            {stats.recentRiders.length === 0 ? (
              <p className="py-6 text-center text-xs text-graphite-400">
                No riders recorded yet.
              </p>
            ) : (
              stats.recentRiders.map((rider) => (
                <div
                  key={rider.id}
                  className="flex items-center justify-between py-3.5"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-ivory-100">
                        {rider.display_name}
                      </p>
                      {rider.is_featured && (
                        <span className="rounded-xs bg-gold-500/20 px-1.5 py-0.2 text-[0.58rem] font-semibold tracking-wider text-gold-400 uppercase">
                          Featured
                        </span>
                      )}
                      {!rider.is_active && (
                        <span className="rounded-xs bg-charcoal-700 px-1.5 py-0.2 text-[0.58rem] font-semibold tracking-wider text-graphite-400 uppercase">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-graphite-300">
                      {rider.bike_brand} {rider.bike_model} ({rider.bike_year}) •{" "}
                      <span className="capitalize">{rider.community_position}</span>
                    </p>
                  </div>

                  <Link
                    href={`/admin/riders/${rider.id}`}
                    className="shrink-0 rounded-sm border border-charcoal-500 bg-charcoal-700/40 px-2.5 py-1 text-xs text-ivory-100 transition-colors hover:border-gold-500 hover:text-gold-400"
                  >
                    Edit
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Rides */}
        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
          <div className="flex items-center justify-between border-b border-charcoal-700 pb-4">
            <h2 className="font-display text-xl font-bold tracking-wide text-ivory-100">
              Recent Expeditions
            </h2>
            <Link
              href="/admin/rides"
              className="text-xs uppercase tracking-wider text-gold-400 hover:underline"
            >
              View All ({stats.rides.total}) →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-charcoal-700/60">
            {stats.recentRides.length === 0 ? (
              <p className="py-6 text-center text-xs text-graphite-400">
                No rides recorded yet.
              </p>
            ) : (
              stats.recentRides.map((ride) => (
                <div
                  key={ride.id}
                  className="flex items-center justify-between py-3.5"
                >
                  <div className="min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium text-ivory-100">
                        {ride.title}
                      </p>
                      <span
                        className={`rounded-xs px-1.5 py-0.2 text-[0.58rem] font-semibold tracking-wider uppercase ${
                          ride.status === "upcoming"
                            ? "bg-amber-500/20 text-amber-400"
                            : ride.status === "ongoing"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-charcoal-700 text-graphite-300"
                        }`}
                      >
                        {ride.status}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-graphite-300">
                      {ride.start_date}{" "}
                      {ride.distance_km ? `• ${ride.distance_km} km` : ""} •{" "}
                      <span className="capitalize">{ride.ride_type}</span>
                    </p>
                  </div>

                  <Link
                    href={`/admin/rides/${ride.id}`}
                    className="shrink-0 rounded-sm border border-charcoal-500 bg-charcoal-700/40 px-2.5 py-1 text-xs text-ivory-100 transition-colors hover:border-gold-500 hover:text-gold-400"
                  >
                    Edit
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Gallery Frames */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <div className="flex items-center justify-between border-b border-charcoal-700 pb-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-wide text-ivory-100">
              Recent Moments & Frames
            </h2>
            <p className="mt-0.5 text-xs text-graphite-300">
              Archive records connected with riders and runs
            </p>
          </div>
          <Link
            href="/admin/gallery"
            className="text-xs uppercase tracking-wider text-gold-400 hover:underline"
          >
            Manage Gallery →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {stats.recentFrames.length === 0 ? (
            <p className="col-span-full py-8 text-center text-xs text-graphite-400">
              No gallery items recorded yet.
            </p>
          ) : (
            stats.recentFrames.map((frame) => (
              <div
                key={frame.id}
                className="group relative flex flex-col justify-between rounded-sm border border-charcoal-600 bg-obsidian-950 p-3.5 transition-colors hover:border-gold-500/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-xs bg-charcoal-700 px-1.5 py-0.5 text-[0.6rem] font-medium tracking-wider text-graphite-300 uppercase">
                      {frame.tone}
                    </span>
                    <span className="text-[0.65rem] text-graphite-400">
                      {frame.taken_on?.slice(0, 4) ?? "—"}
                    </span>
                  </div>
                  <h3 className="mt-2.5 line-clamp-1 text-xs font-semibold text-ivory-100">
                    {frame.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[0.7rem] text-graphite-400">
                    {frame.caption}
                  </p>
                </div>

                <div className="mt-3 border-t border-charcoal-700/60 pt-2 text-[0.65rem] text-graphite-400">
                  {frame.rider_name || frame.ride_title ? (
                    <span className="truncate block">
                      {frame.rider_name ?? frame.ride_title}
                    </span>
                  ) : (
                    <span>General Frame</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

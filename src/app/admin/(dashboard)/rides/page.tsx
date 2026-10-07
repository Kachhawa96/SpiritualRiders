import Link from "next/link";
import { getAdminRides } from "@/lib/db/admin";
import { RideTable } from "@/components/admin/RideTable";

export default async function AdminRidesPage() {
  const rides = await getAdminRides();

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-[0.08em] text-ivory-100">
            Ride & Expedition Management
          </h1>
          <p className="mt-1 text-xs text-graphite-300">
            Schedule upcoming tours, log completed runs, and assign community ride participants.
          </p>
        </div>

        <Link
          href="/admin/rides/new"
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-gold-500 bg-gold-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400"
        >
          + Plan New Ride
        </Link>
      </div>

      <RideTable initialRides={rides} />
    </div>
  );
}

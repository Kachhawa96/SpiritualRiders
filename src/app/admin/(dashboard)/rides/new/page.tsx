import Link from "next/link";
import { getAdminRiders } from "@/lib/db/admin";
import { RideForm } from "@/components/admin/RideForm";

export default async function NewRidePage() {
  const riders = await getAdminRiders();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/rides"
          className="text-xs text-graphite-400 hover:text-gold-400"
        >
          ← Back to Rides
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-bold tracking-[0.08em] text-ivory-100">
          Plan New Expedition
        </h1>
        <p className="mt-1 text-xs text-graphite-300">
          Log route details, dates, participating crew members, and narrative summary.
        </p>
      </div>

      <RideForm availableRiders={riders} />
    </div>
  );
}

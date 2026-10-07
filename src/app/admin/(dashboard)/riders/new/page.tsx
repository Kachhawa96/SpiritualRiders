import Link from "next/link";
import { RiderForm } from "@/components/admin/RiderForm";

export default function NewRiderPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/riders"
          className="text-xs text-graphite-400 hover:text-gold-400"
        >
          ← Back to Riders Roster
        </Link>
      </div>

      <div>
        <h1 className="font-display text-3xl font-bold tracking-[0.08em] text-ivory-100">
          Enlist New Rider
        </h1>
        <p className="mt-1 text-xs text-graphite-300">
          Add a brother or prospect to the Spiritual Riders community directory.
        </p>
      </div>

      <RiderForm />
    </div>
  );
}

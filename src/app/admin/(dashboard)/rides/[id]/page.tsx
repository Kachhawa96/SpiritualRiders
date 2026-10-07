import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminRideById, getAdminRiders } from "@/lib/db/admin";
import { RideForm } from "@/components/admin/RideForm";

interface EditRidePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRidePage({ params }: EditRidePageProps) {
  const { id } = await params;
  const [ride, riders] = await Promise.all([
    getAdminRideById(id),
    getAdminRiders(),
  ]);

  if (!ride) {
    notFound();
  }

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-[0.08em] text-ivory-100">
            Edit Ride: {ride.title}
          </h1>
          <p className="mt-1 text-xs text-graphite-300">
            ID: {ride.id} • Slug: {ride.slug}
          </p>
        </div>

        <Link
          href={`/rides/${ride.slug}`}
          target="_blank"
          className="text-xs text-gold-400 hover:underline"
        >
          View Public Ride ↗
        </Link>
      </div>

      <RideForm initialData={ride} availableRiders={riders} />
    </div>
  );
}

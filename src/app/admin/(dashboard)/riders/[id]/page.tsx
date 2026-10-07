import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminRiderById } from "@/lib/db/admin";
import { RiderForm } from "@/components/admin/RiderForm";

interface EditRiderPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRiderPage({ params }: EditRiderPageProps) {
  const { id } = await params;
  const rider = await getAdminRiderById(id);

  if (!rider) {
    notFound();
  }

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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-[0.08em] text-ivory-100">
            Edit Rider: {rider.display_name}
          </h1>
          <p className="mt-1 text-xs text-graphite-300">
            ID: {rider.id} • Slug: {rider.slug}
          </p>
        </div>

        <Link
          href={`/riders/${rider.slug}`}
          target="_blank"
          className="text-xs text-gold-400 hover:underline"
        >
          View Public Profile ↗
        </Link>
      </div>

      <RiderForm initialData={rider} />
    </div>
  );
}

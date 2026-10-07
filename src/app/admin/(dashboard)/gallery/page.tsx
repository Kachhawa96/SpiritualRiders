import {
  getAdminGallery,
  getAdminRides,
  getAdminRiders,
} from "@/lib/db/admin";
import { GalleryManager } from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  const [frames, rides, riders] = await Promise.all([
    getAdminGallery(),
    getAdminRides(),
    getAdminRiders(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-[0.08em] text-ivory-100">
          Community Gallery Archive
        </h1>
        <p className="mt-1 text-xs text-graphite-300">
          Curate photographs, upload route frames, and associate visual moments with riders and rides.
        </p>
      </div>

      <GalleryManager initialFrames={frames} rides={rides} riders={riders} />
    </div>
  );
}

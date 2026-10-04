import { GalleryBrowser } from "@/components/gallery/GalleryBrowser";
import { Container } from "@/components/ui/Container";
import { getGallery } from "@/lib/community";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Frames from Spiritual Riders rides. Open a mark to see the ride and the rider.",
};

export default async function GalleryPage() {
  const frames = await getGallery();

  return (
    <section className="section-padding">
      <Container>
        <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">Gallery</p>
        <h1 className="mt-5 max-w-3xl font-medium">Moments from the road.</h1>
        <p className="mt-5 max-w-xl">
          Drawn frames until the house has photographs. Open one to see the ride and the rider.
        </p>
        <div className="mt-12">
          <GalleryBrowser frames={frames} />
        </div>
      </Container>
    </section>
  );
}

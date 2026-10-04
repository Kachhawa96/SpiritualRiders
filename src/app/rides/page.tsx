import { Suspense } from "react";
import type { Metadata } from "next";
import { RideBrowser } from "@/components/rides/RideBrowser";
import { Container } from "@/components/ui/Container";
import { getRides } from "@/lib/community";

export const metadata: Metadata = {
  title: "Rides",
  description: "Chapter rides of Spiritual Riders. Dawn patrols, night lines, and the long way to the desert.",
};

export default async function RidesPage() {
  const rides = await getRides();

  return (
    <section className="section-padding">
      <Container>
        <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">Rides</p>
        <h1 className="mt-5 max-w-3xl font-medium">The roads the house has taken.</h1>
        <p className="mt-5 max-w-xl">
          Search a ride or a road. Narrow by kind, or by whether it is still ahead.
        </p>
        <div className="mt-12">
          <Suspense fallback={<p className="text-graphite-300">Gathering the rides.</p>}>
            <RideBrowser rides={rides} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}

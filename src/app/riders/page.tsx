import { Suspense } from "react";
import type { Metadata } from "next";
import { RiderDirectory } from "@/components/riders/RiderDirectory";
import { RiderDirectoryFallback } from "@/components/riders/RiderDirectoryFallback";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/config/site";
import { getDirectoryRiders } from "@/lib/riders";

export const metadata: Metadata = {
  title: "The Crew",
  description: `The riders of ${SITE_CONFIG.name}. Search the line by name, machine, or style.`,
};

export default function RidersPage() {
  const riders = getDirectoryRiders();

  return (
    <section className="section-padding scroll-mt-24">
      <Container>
        <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">
          The crew
        </p>
        <h1 className="mt-5 max-w-3xl font-medium">Every rider in the line.</h1>
        <p className="mt-5 max-w-xl text-base md:text-lg">
          Search a name or a machine. Narrow the line by style, brand, or place.
          What a rider keeps private stays off this page.
        </p>
        <div className="mt-12">
          <Suspense fallback={<RiderDirectoryFallback />}>
            <RiderDirectory riders={riders} />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}

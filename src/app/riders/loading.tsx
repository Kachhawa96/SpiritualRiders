import { RiderDirectoryFallback } from "@/components/riders/RiderDirectoryFallback";
import { Container } from "@/components/ui/Container";

export default function RidersLoading() {
  return (
    <section className="section-padding" aria-busy="true" aria-live="polite">
      <Container>
        <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">
          The crew
        </p>
        <h1 className="mt-5 font-medium">Gathering the line.</h1>
        <div className="mt-12">
          <RiderDirectoryFallback />
        </div>
      </Container>
    </section>
  );
}

import { Container } from "@/components/ui/Container";

export default function RidesLoading() {
  return (
    <section className="section-padding" aria-busy="true">
      <Container>
        <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">Rides</p>
        <h1 className="mt-5 font-medium">Gathering the rides.</h1>
      </Container>
    </section>
  );
}

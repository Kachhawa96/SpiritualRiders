import { Container } from "@/components/ui/Container";

export default function RiderLoading() {
  return (
    <section className="section-padding" aria-busy="true" aria-live="polite">
      <Container>
        <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">The crew</p>
        <div className="mt-6 h-16 max-w-md border border-border-subtle bg-obsidian-900" />
        <div className="mt-10 h-80 border border-border-subtle bg-obsidian-900" />
      </Container>
    </section>
  );
}

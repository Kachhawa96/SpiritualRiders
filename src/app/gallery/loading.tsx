import { Container } from "@/components/ui/Container";

export default function GalleryLoading() {
  return (
    <section className="section-padding" aria-busy="true">
      <Container>
        <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">Gallery</p>
        <h1 className="mt-5 font-medium">Gathering the frames.</h1>
      </Container>
    </section>
  );
}

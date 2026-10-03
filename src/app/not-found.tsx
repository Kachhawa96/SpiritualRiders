import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SITE_CONFIG } from "@/config/site";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center">
      <Container variant="narrow" className="py-28 md:py-36">
        <p className="max-w-none text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">
          Off the map
        </p>
        <h1 className="mt-5 font-medium">This road is not open yet.</h1>
        <p className="mt-6 text-lg">
          You have ridden past the current chapter. The crew, the rides, and the gallery are still ahead.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button href="/">Return home</Button>
          <Button href={`mailto:${SITE_CONFIG.email}`} variant="ghost">
            Write to the crew
          </Button>
        </div>
      </Container>
    </section>
  );
}

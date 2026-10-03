import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ROUTES } from "@/config/site";

export default function RiderNotFound() {
  return (
    <section className="flex flex-1 items-center">
      <Container variant="narrow" className="py-28 md:py-36">
        <p className="max-w-none text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">
          The crew
        </p>
        <h1 className="mt-5 font-medium">This rider is not in the line.</h1>
        <p className="mt-6 text-lg">
          That name does not match anyone in the brotherhood.
        </p>
        <div className="mt-10">
          <Button href={ROUTES.riders}>Back to the crew</Button>
        </div>
      </Container>
    </section>
  );
}

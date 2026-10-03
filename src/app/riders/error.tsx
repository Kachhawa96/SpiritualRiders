"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

interface RidersErrorProps {
  reset: () => void;
}

export default function RidersError({ reset }: RidersErrorProps) {
  return (
    <section className="section-padding">
      <Container variant="narrow" className="text-center">
        <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">
          The crew
        </p>
        <h1 className="mt-5 font-medium">The line broke.</h1>
        <p className="mx-auto mt-5 max-w-md">
          The crew could not be gathered. Try the road again.
        </p>
        <div className="mt-8 flex justify-center">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
        </div>
      </Container>
    </section>
  );
}

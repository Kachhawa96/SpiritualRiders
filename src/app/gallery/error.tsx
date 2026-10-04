"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function GalleryError({ reset }: { reset: () => void }) {
  return (
    <section className="section-padding">
      <Container variant="narrow" className="text-center">
        <h1 className="font-medium">The frames could not be gathered.</h1>
        <div className="mt-8 flex justify-center">
          <Button type="button" onClick={reset}>
            Try again
          </Button>
        </div>
      </Container>
    </section>
  );
}

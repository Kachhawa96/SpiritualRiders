import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ROUTES, SITE_CONFIG } from "@/config/site";

export function FinalCta() {
  return (
    <section id="join" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container variant="narrow" className="text-center">
        <Reveal>
          <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">
            Get in touch
          </p>
          <h2 className="mt-5 font-medium">Ride with the crew.</h2>
          <p className="mx-auto mt-5 max-w-lg text-base md:text-lg">
            If the line feels like yours, write to the house. The brotherhood answers
            riders, not inquiries.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={`mailto:${SITE_CONFIG.email}`}>Write to the crew</Button>
            <Button href={ROUTES.contact} variant="ghost">
              Make contact
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

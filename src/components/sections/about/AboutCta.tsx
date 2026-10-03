import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ROUTES, SITE_CONFIG } from "@/config/site";

export function AboutCta() {
  return (
    <section id="join" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container variant="narrow" className="text-center">
        <Reveal>
          <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold-500">
            The invitation
          </p>
          <h2 className="mt-5 font-medium">If the line feels like yours.</h2>
          <p className="mx-auto mt-5 max-w-lg">
            The story is not a form. Write to the house. The brotherhood answers riders.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={`mailto:${SITE_CONFIG.email}`}>Write to the crew</Button>
            <Button href={ROUTES.home} variant="outline">
              Back to the road
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

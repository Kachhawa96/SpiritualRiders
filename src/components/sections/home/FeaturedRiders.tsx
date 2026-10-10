import { getFeaturedHomeRiders } from "@/data/home";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ROUTES } from "@/config/site";
import { FeaturedRidersCarousel } from "@/components/sections/home/FeaturedRidersCarousel";

export async function FeaturedRiders() {
  const featured = await getFeaturedHomeRiders();

  return (
    <section id="crew" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="The crew"
              title="Faces of the line."
              subtitle="Featured riders from the house. The full line is with the crew."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <Button href={ROUTES.riders} variant="ghost">
              All riders
            </Button>
          </Reveal>
        </div>

        <FeaturedRidersCarousel riders={featured} />
      </Container>
    </section>
  );
}

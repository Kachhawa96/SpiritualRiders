import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE_CONFIG } from "@/config/site";
import { loadCommunitySettings, type PublicCommunitySettings } from "@/lib/community";

interface CommunityIntroProps {
  settings?: PublicCommunitySettings;
}

export async function CommunityIntro({ settings: propSettings }: CommunityIntroProps = {}) {
  const settings = propSettings ?? (await loadCommunitySettings());
  const name = settings.name || SITE_CONFIG.name;
  const foundedYear = settings.founded_year || SITE_CONFIG.foundedYear;

  return (
    <section id="intro" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container className="grid items-end gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <SectionHeading
            eyebrow="The house"
            title="A brotherhood, not a listing."
          />
        </Reveal>
        <div className="lg:col-span-7">
          <Reveal delay={0.08}>
            <p className="max-w-none font-display text-3xl leading-snug font-medium text-ivory-100 italic md:text-4xl">
              We ride as one line. The spirit is what holds it.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-6 max-w-xl text-base md:text-lg">
              {name} began as a dawn departure in {foundedYear} and
              became a house. Motorcycles are kept, roads are shared, and no rider is left
              at the side of one. This is the crew, told the way the road tells it.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

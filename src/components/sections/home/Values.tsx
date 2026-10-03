import { VALUES } from "@/data/home";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Values() {
  return (
    <section id="brotherhood" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Brotherhood"
            title="What the crew keeps."
            subtitle="Three rules, kept quieter than the engines."
          />
        </Reveal>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {VALUES.map((value, index) => (
            <li key={value.index} className="border-t border-border-subtle pt-6">
              <Reveal delay={index * 0.08}>
                <p className="font-display text-sm tracking-[0.28em] text-gold-500">
                  {value.index}
                </p>
                <h3 className="mt-5 font-medium">{value.title}</h3>
                <p className="mt-4 text-sm leading-relaxed">{value.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

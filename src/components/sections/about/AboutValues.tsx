import { ABOUT_VALUES } from "@/data/about";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutValues() {
  return (
    <section id="values" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <SectionHeading
            eyebrow="Values"
            title="Three rules, kept quiet."
            subtitle="The code the line actually rides by."
          />
        </Reveal>
        <ol className="lg:col-span-8">
          {ABOUT_VALUES.map((value, index) => (
            <li key={value.index} className="border-t border-border-subtle py-10 last:border-b">
              <Reveal delay={index * 0.06}>
                <p className="font-display text-sm tracking-[0.28em] text-gold-500">
                  {value.index}
                </p>
                <h3 className="mt-4 font-medium">{value.title}</h3>
                <p className="mt-4 max-w-2xl">{value.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

import { ABOUT_PHILOSOPHY } from "@/data/about";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Philosophy() {
  return (
    <section id="philosophy" className="section-padding scroll-mt-24 border-t border-border-subtle">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Philosophy"
            title="Spirit, then everything else."
            subtitle="Not a roster. Not a showroom. A way of riding together."
          />
        </Reveal>
        <ol className="mt-16 border-t border-border-subtle">
          {ABOUT_PHILOSOPHY.map((item, index) => (
            <li key={item.index} className="border-b border-border-subtle py-10 md:py-12">
              <Reveal delay={index * 0.06}>
                <div className="grid gap-6 md:grid-cols-12 md:items-baseline">
                  <p className="font-display text-sm tracking-[0.28em] text-gold-500 md:col-span-2">
                    {item.index}
                  </p>
                  <h3 className="font-medium md:col-span-5">{item.title}</h3>
                  <p className="md:col-span-5">{item.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

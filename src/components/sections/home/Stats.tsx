import { getHomeStats, type HomeStat } from "@/data/home";
import { Reveal } from "@/components/motion/Reveal";
import { StatCount } from "@/components/sections/home/StatCount";
import { Container } from "@/components/ui/Container";

interface StatsProps {
  stats?: HomeStat[];
}

export async function Stats({ stats: propStats }: StatsProps = {}) {
  const stats = propStats ?? (await getHomeStats());

  return (
    <section id="stats" className="scroll-mt-24 border-t border-border-subtle" aria-label="The brotherhood in numbers">
      <Container className="py-4 md:py-6">
        <Reveal>
          <dl className="grid grid-cols-2 gap-px bg-border-subtle md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-obsidian-950 px-6 py-10 md:px-8 md:py-14">
                <dt className="text-[0.68rem] uppercase tracking-[0.32em] text-gold-500">
                  {stat.label}
                </dt>
                <dd className="mt-4 font-display text-5xl font-medium text-foreground md:text-6xl">
                  <StatCount value={stat.value} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}

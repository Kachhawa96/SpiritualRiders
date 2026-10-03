import { NAV_ITEMS, SITE_CONFIG, SOCIAL_LINKS } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/layout/BrandMark";
import { PrimaryLink } from "@/components/layout/PrimaryLink";

const SOCIALS = [
  { label: "Instagram", href: SOCIAL_LINKS.instagram },
  { label: "Facebook", href: SOCIAL_LINKS.facebook },
  { label: "YouTube", href: SOCIAL_LINKS.youtube },
] as const;

export function Footer() {
  const year = new Date().getFullYear();
  const socials = SOCIALS.flatMap((item) =>
    item.href ? [{ label: item.label, href: item.href }] : []
  );

  return (
    <footer className="border-t border-border-subtle">
      <div className="divider-gold" aria-hidden="true" />
      <div className="container-site grid gap-14 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <BrandMark />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            {SITE_CONFIG.description}
          </p>
          <div className="mt-8">
            <Button href={`mailto:${SITE_CONFIG.email}`} variant="outline" size="sm">
              Write to the crew
            </Button>
          </div>
        </div>

        <div className="md:col-span-3">
          <p className="max-w-none text-[0.68rem] uppercase tracking-[0.32em] text-graphite-300">
            Explore
          </p>
          <ul className="mt-6 space-y-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <PrimaryLink
                  item={item}
                  className="text-sm transition-colors duration-300 hover:text-gold-400"
                  idleClassName="text-ivory-100"
                  activeClassName="text-gold-400"
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="max-w-none text-[0.68rem] uppercase tracking-[0.32em] text-graphite-300">
            The road
          </p>
          <a
            href={`mailto:${SITE_CONFIG.email}`}
            className="mt-6 inline-block text-sm text-gold-400"
          >
            {SITE_CONFIG.email}
          </a>
          <p className="mt-6 max-w-xs text-sm">
            Founded {SITE_CONFIG.foundedYear}. The long way home, still being written.
          </p>
          {socials.length > 0 ? (
            <ul className="mt-6 space-y-3">
              {socials.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-ivory-100 transition-colors duration-300 hover:text-gold-400"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-graphite-400 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-none">
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="max-w-none tracking-[0.22em] uppercase">{SITE_CONFIG.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

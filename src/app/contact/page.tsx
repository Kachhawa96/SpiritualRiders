import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { loadCommunitySettings } from "@/lib/community";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact — Connect with the Brotherhood",
  description:
    "Official communication dispatch for Spiritual Riders. Connect with chapter leadership, send ride invitations, or inquire about the brotherhood.",
};

export default async function ContactPage() {
  const settings = await loadCommunitySettings();

  const socials = [
    { label: "Instagram", href: settings.instagram_url, handle: "@spiritualriders" },
    { label: "Facebook", href: settings.facebook_url, handle: "Spiritual Riders Official" },
    { label: "YouTube", href: settings.youtube_url, handle: "Spiritual Riders Media" },
  ].filter((item): item is { label: string; href: string; handle: string } => Boolean(item.href));

  return (
    <div className="section-padding">
      <Container>
        {/* Header */}
        <Reveal>
          <SectionHeading
            eyebrow="Communications & Dispatch"
            title="The road is open."
            subtitle="Whether you ride with an allied chapter, carry words for leadership, or seek counsel on the line, transmit your dispatch below."
          />
        </Reveal>

        {/* Content Grid */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Direct Channels & Chapter Presence */}
          <div className="space-y-8 lg:col-span-5">
            {/* Direct Dispatch Card */}
            <div className="rounded-sm border border-border-subtle bg-obsidian-900/40 p-6 sm:p-7">
              <span className="text-[0.68rem] uppercase tracking-[0.24em] text-gold-500">
                Official Dispatch
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-ivory-100">
                Direct Line
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-graphite-300">
                For administrative communications, official chapter invitations, and urgent brotherhood matters.
              </p>
              <div className="mt-5">
                <a
                  href={`mailto:${settings.email || SITE_CONFIG.email}`}
                  className="inline-flex items-center gap-2 font-mono text-sm text-gold-400 transition-colors hover:text-gold-300 hover:underline"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span>{settings.email || SITE_CONFIG.email}</span>
                </a>
              </div>
            </div>

            {/* Territory / Origin Card */}
            <div className="rounded-sm border border-border-subtle bg-obsidian-900/40 p-6 sm:p-7">
              <span className="text-[0.68rem] uppercase tracking-[0.24em] text-gold-500">
                Territory & Base
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-ivory-100">
                Corridors of Ride
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-graphite-300">
                Originating from Jodhpur across the Thar desert highways, riding state corridors and nationwide mountain passes across India.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-ivory-100">
                <span className="size-2 rounded-full bg-gold-500" aria-hidden="true" />
                <span>Rajasthan, India · Nationwide Expeditions</span>
              </div>
            </div>

            {/* Social Channels (if configured in admin) */}
            {socials.length > 0 ? (
              <div className="rounded-sm border border-border-subtle bg-obsidian-900/40 p-6 sm:p-7">
                <span className="text-[0.68rem] uppercase tracking-[0.24em] text-gold-500">
                  Brotherhood Media
                </span>
                <h3 className="mt-2 font-display text-xl font-bold text-ivory-100">
                  Live Channels
                </h3>
                <ul className="mt-4 space-y-3">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between rounded-sm border border-charcoal-600 bg-obsidian-950 px-3.5 py-2.5 text-xs transition-colors hover:border-gold-500/50"
                      >
                        <span className="text-ivory-100 group-hover:text-gold-400 font-medium">
                          {social.label}
                        </span>
                        <span className="text-[0.68rem] text-graphite-400">
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Recruitment Callout (when onboarding portal is active) */}
            {settings.onboarding_enabled ? (
              <div className="rounded-sm border border-gold-500/30 bg-gold-500/5 p-6 sm:p-7">
                <span className="text-[0.68rem] uppercase tracking-[0.24em] text-gold-400">
                  Rider Roster Open
                </span>
                <h3 className="mt-2 font-display text-xl font-bold text-ivory-100">
                  Seeking to Join the Crew?
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-graphite-300">
                  Prospective riders can submit their machine specifications, riding experience, and bio directly through the dedicated onboarding portal.
                </p>
                <div className="mt-5">
                  <Link
                    href="/onboard"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-400 transition-colors hover:text-gold-300"
                  >
                    <span>Submit Rider Profile</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Column: Interactive Dispatch Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}

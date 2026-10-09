import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { loadCommunitySettings } from "@/lib/community";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact — Spiritual Riders",
  description:
    "Get in touch with Spiritual Riders. Inquiries, ride invitations, sponsorships, and questions.",
};

export default async function ContactPage() {
  const settings = await loadCommunitySettings();

  const socials = [
    { label: "Instagram", href: settings.instagram_url },
    { label: "Facebook", href: settings.facebook_url },
    { label: "YouTube", href: settings.youtube_url },
  ].filter((item): item is { label: string; href: string } => Boolean(item.href));

  return (
    <div className="section-padding">
      <Container>
        {/* Header */}
        <Reveal>
          <SectionHeading
            eyebrow="Contact Us"
            title="Get in touch."
            subtitle="Have questions, want to ride with us, or discuss a sponsorship? Drop us a message or reach out directly."
          />
        </Reveal>

        {/* Content Grid */}
        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Direct Info */}
          <div className="space-y-6 lg:col-span-5">
            {/* Email Card */}
            <div className="rounded-sm border border-border-subtle bg-obsidian-900/40 p-6 sm:p-7">
              <span className="text-[0.68rem] uppercase tracking-[0.24em] text-gold-500">
                Email
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-ivory-100">
                Email Us
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-graphite-300">
                Drop us an email for general questions, ride inquiries, or sponsorships.
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

            {/* Location Card */}
            <div className="rounded-sm border border-border-subtle bg-obsidian-900/40 p-6 sm:p-7">
              <span className="text-[0.68rem] uppercase tracking-[0.24em] text-gold-500">
                Location
              </span>
              <h3 className="mt-2 font-display text-xl font-bold text-ivory-100">
                Our Location
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-graphite-300">
                Based in Jodhpur, Rajasthan, with rides and expeditions across India.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-ivory-100">
                <span className="size-2 rounded-full bg-gold-500" aria-hidden="true" />
                <span>Jodhpur, Rajasthan, India</span>
              </div>
            </div>

            {/* Social Media Channels */}
            {socials.length > 0 ? (
              <div className="rounded-sm border border-border-subtle bg-obsidian-900/40 p-6 sm:p-7">
                <span className="text-[0.68rem] uppercase tracking-[0.24em] text-gold-500">
                  Social Media
                </span>
                <h3 className="mt-2 font-display text-xl font-bold text-ivory-100">
                  Follow Us
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
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}

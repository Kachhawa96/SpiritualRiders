import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

// ── Display / editorial typeface ──────────────────────────────────────────────
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// ── Body / UI typeface ────────────────────────────────────────────────────────
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://spiritualriders.in"
  ),
  title: {
    default: "Spiritual Riders — Riders. Brotherhood. Spirit.",
    template: "%s | Spiritual Riders",
  },
  description:
    "Spiritual Riders is a premium motorcycle brotherhood built on passion, respect, and the open road. Explore our riders, machines, rides, and community story.",
  keywords: [
    "Spiritual Riders",
    "motorcycle brotherhood",
    "biker community",
    "riders club",
    "motorcycle community India",
  ],
  authors: [{ name: "Spiritual Riders" }],
  creator: "Spiritual Riders",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Spiritual Riders",
    title: "Spiritual Riders — Riders. Brotherhood. Spirit.",
    description:
      "A premium motorcycle brotherhood built on passion, respect, and the open road.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Spiritual Riders — Riders. Brotherhood. Spirit.",
    description:
      "A premium motorcycle brotherhood built on passion, respect, and the open road.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// ── Viewport ──────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0e",
};

// ── Layout ────────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col antialiased">
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[80] focus:rounded-sm focus:bg-gold-500 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-obsidian-950"
        >
          Skip to main content
        </a>

        <noscript>
          <style>
            {`[data-motion-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}[data-motion-reveal] *{transform:none!important;clip-path:none!important}`}
          </style>
        </noscript>

        <AppShell footer={<Footer />}>{children}</AppShell>
      </body>
    </html>
  );
}

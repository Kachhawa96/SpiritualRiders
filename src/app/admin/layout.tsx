import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin Console | Spiritual Riders",
  description: "Administrative control center for Spiritual Riders.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-obsidian-950 text-ivory-100 selection:bg-gold-500 selection:text-obsidian-950">
      {children}
    </div>
  );
}

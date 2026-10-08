import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isOnboardingEnabled } from "@/lib/db/onboarding";
import { OnboardingClient } from "@/components/onboarding/OnboardingClient";

export const metadata: Metadata = {
  title: "Rider Profile Onboarding — Spiritual Riders",
  description:
    "Join the brotherhood. Submit or update your official rider and motorcycle telemetry profile for inclusion in the Spiritual Riders community roster.",
};

export default async function OnboardingPage() {
  const enabled = await isOnboardingEnabled();

  // If onboarding is disabled by administrator, redirect to homepage
  if (!enabled) {
    redirect("/?notice=onboarding-closed");
  }

  return (
    <main className="min-h-screen bg-obsidian-950 pb-24 pt-12">
      <OnboardingClient />
    </main>
  );
}

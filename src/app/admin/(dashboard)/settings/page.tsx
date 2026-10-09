import { getCommunitySettings } from "@/lib/db/admin";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  let settings;
  try {
    settings = await getCommunitySettings();
  } catch {
    settings = {
      name: "Spiritual Riders",
      tagline: "Riders. Spirit. Brotherhood.",
      description: "A premium motorcycle brotherhood built on passion, respect, and the open road.",
      email: "contact@spiritualriders.in",
      founded_year: 2020,
      hero_image_url: null,
      logo_image_url: null,
      onboarding_enabled: false,
    };
  }


  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-[0.08em] text-ivory-100">
          Community Settings
        </h1>
        <p className="mt-1 text-xs text-graphite-300">
          Configure site identity, mission statement, contact details, and brotherhood social links.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}

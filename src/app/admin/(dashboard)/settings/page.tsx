import { getCommunitySettings } from "@/lib/db/admin";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getCommunitySettings();

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

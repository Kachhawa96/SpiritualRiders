import { NotificationsDashboard } from "@/components/admin/NotificationsDashboard";

export const metadata = {
  title: "Dispatches & Push Notifications — Admin Console",
};

export default function AdminNotificationsPage() {
  const appId =
    process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || process.env.ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-[0.08em] text-ivory-100">
          Crew Dispatches & Push Notifications
        </h1>
        <p className="mt-1 text-xs text-graphite-300">
          Manage automated brotherhood alerts and broadcast custom web push dispatches to all subscribed riders.
        </p>
      </div>

      <NotificationsDashboard
        appIdConfigured={Boolean(appId?.trim())}
        apiKeyConfigured={Boolean(apiKey?.trim())}
      />
    </div>
  );
}

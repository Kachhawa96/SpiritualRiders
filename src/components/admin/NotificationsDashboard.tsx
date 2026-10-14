"use client";

import { useState, useTransition } from "react";
import { sendAdminCustomPushAction } from "@/app/admin/notifications/actions";
import { Button } from "@/components/ui/Button";

interface NotificationsDashboardProps {
  appIdConfigured: boolean;
  apiKeyConfigured: boolean;
}

const TEMPLATES = [
  {
    name: "Weekend Ride Briefing",
    title: "🏍️ Weekend Expedition: Mount Abu Climb",
    message: "Meetup confirmed at 05:00 AM at Highway Toll Plaza. Fuel tanks topped up, protective gear mandatory. Tap to view route.",
    audience: "rides",
    url: "/rides",
  },
  {
    name: "Weather & Safety Advisory",
    title: "⚠️ Crew Road Advisory: Monsoon Caution",
    message: "Heavy showers forecast along the Western Ghats corridor. Ensure tire treads and rain suits are prepped before morning departure.",
    audience: "announcements",
    url: "/",
  },
  {
    name: "New Gallery Drop",
    title: "📸 New Ride Photography Published",
    message: "High-resolution frames from the Pushkar Dawn Patrol have just been published to the Brotherhood Gallery. Relive the moments.",
    audience: "updates",
    url: "/gallery",
  },
  {
    name: "Test Push (Admin Only)",
    title: "🛡️ Spiritual Riders Admin Ping",
    message: "This is a test notification dispatched strictly to logged-in administrator devices.",
    audience: "admin",
    url: "/admin",
  },
];

export function NotificationsDashboard({
  appIdConfigured,
  apiKeyConfigured,
}: NotificationsDashboardProps) {
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [url, setUrl] = useState("/");
  const [imageUrl, setImageUrl] = useState("");

  const [dispatchStatus, setDispatchStatus] = useState<{
    type: "success" | "error";
    message: string;
    recipients?: number;
    id?: string;
  } | null>(null);

  const applyTemplate = (tpl: (typeof TEMPLATES)[number]) => {
    setTitle(tpl.title);
    setMessage(tpl.message);
    setAudience(tpl.audience);
    setUrl(tpl.url);
    setDispatchStatus(null);
  };

  const clearForm = () => {
    setTitle("");
    setMessage("");
    setAudience("all");
    setUrl("/");
    setImageUrl("");
    setDispatchStatus(null);
  };

  const handleDispatch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDispatchStatus(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await sendAdminCustomPushAction(formData);
      if (res.success) {
        setDispatchStatus({
          type: "success",
          message: "Notification successfully dispatched through OneSignal!",
          recipients: res.recipients,
          id: res.id,
        });
      } else {
        setDispatchStatus({
          type: "error",
          message: res.error || "Failed to dispatch notification.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* System Status Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* App ID Status */}
        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-graphite-400">
              OneSignal App
            </span>
            <span
              className={`size-2 rounded-full ${
                appIdConfigured
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  : "bg-amber-400"
              }`}
            />
          </div>
          <p className="mt-2 text-sm font-medium text-ivory-100">
            {appIdConfigured ? "Connected & Active" : "Missing App ID"}
          </p>
          <p className="mt-0.5 text-[0.68rem] text-graphite-400">
            Client push subscription listener
          </p>
        </div>

        {/* REST API Status */}
        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-graphite-400">
              REST API Key
            </span>
            <span
              className={`size-2 rounded-full ${
                apiKeyConfigured
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                  : "bg-red-400"
              }`}
            />
          </div>
          <p className="mt-2 text-sm font-medium text-ivory-100">
            {apiKeyConfigured ? "Authorized on Server" : "Missing REST Key"}
          </p>
          <p className="mt-0.5 text-[0.68rem] text-graphite-400">
            Allows instant & automated dispatch
          </p>
        </div>

        {/* Automated Triggers Status */}
        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-graphite-400">
              Automated Events
            </span>
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <p className="mt-2 text-sm font-medium text-ivory-100">
            5 Triggers Active
          </p>
          <p className="mt-0.5 text-[0.68rem] text-graphite-400">
            Rides • Reminders • Onboarding • Approvals
          </p>
        </div>
      </div>

      {/* Automated Triggers Info Banner */}
      <div className="rounded-sm border border-charcoal-700 bg-obsidian-950 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
          Automated Dispatch Lifecycle Rules
        </h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs text-graphite-300">
          <div className="rounded-sm border border-charcoal-800 bg-obsidian-900/40 p-3">
            <p className="font-medium text-ivory-100">1. New Ride Published</p>
            <p className="mt-1 text-[0.7rem] text-graphite-400 leading-relaxed">
              Triggers immediately when a ride is saved in Admin. Dispatches to all riders subscribed to <code>topic_rides</code>.
            </p>
          </div>
          <div className="rounded-sm border border-charcoal-800 bg-obsidian-900/40 p-3">
            <p className="font-medium text-ivory-100">2. 24h Pre-Ride Reminder</p>
            <p className="mt-1 text-[0.7rem] text-graphite-400 leading-relaxed">
              Automatically scheduled with OneSignal 24 hours before ride starts with meet point and gear advisory.
            </p>
          </div>
          <div className="rounded-sm border border-charcoal-800 bg-obsidian-900/40 p-3">
            <p className="font-medium text-ivory-100">3. 24h Post-Ride Recap</p>
            <p className="mt-1 text-[0.7rem] text-graphite-400 leading-relaxed">
              Automatically scheduled 24 hours after ride ends inviting members to view photo highlights in the Gallery.
            </p>
          </div>
          <div className="rounded-sm border border-charcoal-800 bg-obsidian-900/40 p-3">
            <p className="font-medium text-ivory-100">4. Rider Profile Submitted</p>
            <p className="mt-1 text-[0.7rem] text-graphite-400 leading-relaxed">
              Sends an instant push alert strictly to Admin devices tagged with <code>role: admin</code> to review.
            </p>
          </div>
          <div className="rounded-sm border border-charcoal-800 bg-obsidian-900/40 p-3">
            <p className="font-medium text-ivory-100">5. Applicant Approved</p>
            <p className="mt-1 text-[0.7rem] text-graphite-400 leading-relaxed">
              Sends personalized approval notification directly to the applicant&apos;s device + brotherhood announcement.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Broadcast Dispatch Composer */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Form: Composer */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-[0.06em] text-ivory-100">
              Manual Dispatch Composer
            </h2>
            <p className="mt-1 text-xs text-graphite-300">
              Broadcast an immediate notification to subscribers or specific segments.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-graphite-400">
              Quick Templates
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className="rounded-sm border border-charcoal-600 bg-obsidian-900 px-3 py-1.5 text-xs text-graphite-200 transition-colors hover:border-gold-500/60 hover:text-gold-300 cursor-pointer"
                >
                  {tpl.name}
                </button>
              ))}
              <button
                type="button"
                onClick={clearForm}
                className="rounded-sm border border-charcoal-700 bg-transparent px-3 py-1.5 text-xs text-graphite-400 hover:text-ivory-100 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Feedback Banner */}
          {dispatchStatus && (
            <div
              className={`rounded-sm border p-4 text-xs ${
                dispatchStatus.type === "success"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                  : "border-red-500/40 bg-red-500/10 text-red-200"
              }`}
            >
              <div className="flex items-center gap-2 font-medium">
                {dispatchStatus.type === "success" ? "✓" : "⚠"}{" "}
                {dispatchStatus.message}
              </div>
              {dispatchStatus.id && (
                <p className="mt-1 text-[0.68rem] opacity-80">
                  Notification ID: <code>{dispatchStatus.id}</code>
                  {dispatchStatus.recipients !== undefined &&
                    ` • Estimated Recipients: ${dispatchStatus.recipients}`}
                </p>
              )}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleDispatch} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-graphite-300">
                Notification Title *
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 🏍️ Weekend Ride: Mount Abu Climb"
                required
                className="mt-1.5 w-full rounded-sm border border-charcoal-600 bg-obsidian-900 px-3 py-2 text-sm text-ivory-100 placeholder:text-graphite-400 focus:border-gold-500 focus:outline-none"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-graphite-300">
                Message Body *
              </label>
              <textarea
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Write the dispatch alert message..."
                required
                className="mt-1.5 w-full rounded-sm border border-charcoal-600 bg-obsidian-900 px-3 py-2 text-sm text-ivory-100 placeholder:text-graphite-400 focus:border-gold-500 focus:outline-none"
              />
            </div>

            {/* Audience Target */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-graphite-300">
                Target Audience *
              </label>
              <select
                name="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="mt-1.5 w-full rounded-sm border border-charcoal-600 bg-obsidian-900 px-3 py-2 text-sm text-ivory-100 focus:border-gold-500 focus:outline-none"
              >
                <option value="all">📢 All Subscribed Members (General Broadcast)</option>
                <option value="rides">🏍️ Ride Alerts Only (topic_rides = true)</option>
                <option value="announcements">🚨 Crew Announcements Only (topic_announcements = true)</option>
                <option value="updates">📰 Stories & Updates Only (topic_updates = true)</option>
                <option value="admin">🛡️ Test Dispatch to Admin Devices Only (role = admin)</option>
              </select>
            </div>

            {/* Target URL */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-graphite-300">
                Action / Launch URL
              </label>
              <input
                type="text"
                name="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/rides or /gallery or full URL"
                className="mt-1.5 w-full rounded-sm border border-charcoal-600 bg-obsidian-900 px-3 py-2 text-sm text-ivory-100 placeholder:text-graphite-400 focus:border-gold-500 focus:outline-none"
              />
            </div>

            {/* Optional Banner Image URL */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-[0.16em] text-graphite-300">
                Banner Image URL (Optional)
              </label>
              <input
                type="text"
                name="image_url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://.../cover.jpg"
                className="mt-1.5 w-full rounded-sm border border-charcoal-600 bg-obsidian-900 px-3 py-2 text-sm text-ivory-100 placeholder:text-graphite-400 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isPending || !title.trim() || !message.trim()}
                className="w-full sm:w-auto"
              >
                {isPending ? "Sending Broadcast..." : "Send Broadcast Dispatch"}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-graphite-400">
            Live Notification Mockup
          </span>

          <div className="rounded-md border border-charcoal-600 bg-obsidian-900/90 p-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-charcoal-700/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-xs bg-gold-500 font-bold text-[0.6rem] text-obsidian-950">
                  SR
                </span>
                <span className="text-xs font-semibold text-ivory-100">
                  Spiritual Riders
                </span>
              </div>
              <span className="text-[0.62rem] text-graphite-400">now</span>
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-ivory-100 leading-snug">
                {title.trim() || "Notification Title Preview"}
              </p>
              <p className="mt-1 text-xs text-graphite-300 leading-relaxed">
                {message.trim() ||
                  "This is a preview of the push notification message body that will be delivered directly to rider devices."}
              </p>
            </div>

            {imageUrl && (
              <div className="mt-3 aspect-video w-full overflow-hidden rounded-xs border border-charcoal-700 bg-obsidian-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Notification preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="mt-3 border-t border-charcoal-700/60 pt-2 text-[0.65rem] text-graphite-400 flex items-center justify-between">
              <span>Target: {url || "/"}</span>
              <span className="uppercase text-gold-400 tracking-wider">
                {audience.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

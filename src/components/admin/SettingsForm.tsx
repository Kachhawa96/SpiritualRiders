"use client";

import { useState, useTransition } from "react";
import type { AdminCommunitySettings } from "@/lib/db/admin-schema";
import { saveSettingsAction } from "@/app/admin/actions";

interface SettingsFormProps {
  initialSettings: AdminCommunitySettings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await saveSettingsAction(formData);
      if (res.success) {
        setSuccessMessage("Community settings updated successfully.");
      } else {
        setErrorMessage(res.error || "Failed to update settings.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="rounded-sm border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-300">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-sm border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs text-emerald-300">
          ✓ {successMessage}
        </div>
      )}

      {/* Brand Identity */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          Community Brand & Identity
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Community Name *
            </label>
            <input
              name="name"
              required
              defaultValue={initialSettings.name}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Motto / Tagline *
            </label>
            <input
              name="tagline"
              required
              defaultValue={initialSettings.tagline}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Official Contact Email *
            </label>
            <input
              name="email"
              type="email"
              required
              defaultValue={initialSettings.email}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Founded Year *
            </label>
            <input
              name="founded_year"
              type="number"
              min="1900"
              max="2030"
              required
              defaultValue={initialSettings.founded_year}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Mission Statement & Description *
            </label>
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={initialSettings.description}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs leading-relaxed text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Official Community Social Accounts */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          Official Brotherhood Social Links
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Instagram
            </label>
            <input
              name="instagram_url"
              type="url"
              defaultValue={initialSettings.instagram_url ?? ""}
              placeholder="https://instagram.com/spiritualriders"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Facebook
            </label>
            <input
              name="facebook_url"
              type="url"
              defaultValue={initialSettings.facebook_url ?? ""}
              placeholder="https://facebook.com/spiritualriders"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              YouTube Channel
            </label>
            <input
              name="youtube_url"
              type="url"
              defaultValue={initialSettings.youtube_url ?? ""}
              placeholder="https://youtube.com/@spiritualriders"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer rounded-sm border border-gold-500 bg-gold-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Community Settings"}
        </button>
      </div>
    </form>
  );
}

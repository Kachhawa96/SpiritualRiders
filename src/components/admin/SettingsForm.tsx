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
  const [heroImageUrl, setHeroImageUrl] = useState<string>(
    initialSettings.hero_image_url ?? ""
  );
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [logoImageUrl, setLogoImageUrl] = useState<string>(
    initialSettings.logo_image_url ?? ""
  );
  const [logoFilePreview, setLogoFilePreview] = useState<string | null>(null);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setLogoFilePreview(null);
      return;
    }

    const maxMb = 5;
    if (file.size > maxMb * 1024 * 1024) {
      setErrorMessage(
        `Selected logo is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed size is ${maxMb}MB.`
      );
      e.target.value = "";
      setLogoFilePreview(null);
      return;
    }

    const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.type) && !isSvg) {
      setErrorMessage(`Invalid logo format (${file.type || "unknown"}). Allowed: SVG, PNG, WebP, JPG, AVIF.`);
      e.target.value = "";
      setLogoFilePreview(null);
      return;
    }

    setErrorMessage(null);
    setLogoFilePreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFilePreview(null);
      return;
    }

    const maxMb = 5;
    if (file.size > maxMb * 1024 * 1024) {
      setErrorMessage(
        `Selected file is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed size is ${maxMb}MB.`
      );
      e.target.value = "";
      setFilePreview(null);
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowed.includes(file.type)) {
      setErrorMessage(`Invalid image format (${file.type}). Allowed: JPG, PNG, WebP, AVIF.`);
      e.target.value = "";
      setFilePreview(null);
      return;
    }

    setErrorMessage(null);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("hero_image_file") as HTMLInputElement | null;
    const file = fileInput?.files?.[0];

    if (file && file.size > 5 * 1024 * 1024) {
      setErrorMessage(
        `Selected hero image is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed size is 5MB.`
      );
      return;
    }

    const logoInput = form.elements.namedItem("logo_image_file") as HTMLInputElement | null;
    const logoFile = logoInput?.files?.[0];

    if (logoFile && logoFile.size > 5 * 1024 * 1024) {
      setErrorMessage(
        `Selected logo is ${(logoFile.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed size is 5MB.`
      );
      return;
    }

    const formData = new FormData(form);

    startTransition(async () => {
      try {
        const res = await saveSettingsAction(formData);
        if (res.success) {
          setSuccessMessage("Community settings updated successfully.");
          if (fileInput) fileInput.value = "";
          setFilePreview(null);
          if (logoInput) logoInput.value = "";
          setLogoFilePreview(null);
        } else {
          setErrorMessage(res.error || "Failed to update settings.");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to update settings.";
        if (/failed to fetch|network|aborted/i.test(msg)) {
          setErrorMessage(
            "Upload request could not be completed. The image file may exceed network/server limits or connection was interrupted. Please ensure the file is under 5MB."
          );
        } else {
          setErrorMessage(msg);
        }
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

      {/* Official Brand Logo */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <div className="border-b border-charcoal-700 pb-3">
          <h2 className="font-display text-lg font-bold text-ivory-100">
            Brand Logo
          </h2>
          <p className="mt-1 text-xs text-graphite-300">
            Upload the official emblem/logo image for Spiritual Riders. Displays in the header, mobile drawer, footer, and admin navigation.
          </p>
        </div>

        <div className="mt-5 space-y-5">
          <div className="flex flex-wrap items-center gap-3 rounded-sm border border-gold-500/30 bg-gold-500/5 px-4 py-3 text-xs text-graphite-300">
            <span className="font-semibold uppercase tracking-wider text-gold-400">
              Recommended:
            </span>
            <span>Transparent PNG or SVG</span>
            <span>·</span>
            <span>Square or Horizontal</span>
            <span>·</span>
            <span>Max 5MB</span>
          </div>

          {/* Logo Preview */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex size-20 items-center justify-center rounded-sm border border-charcoal-600 bg-obsidian-950 p-2 shadow-inner">
              {logoFilePreview || logoImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoFilePreview || logoImageUrl}
                  alt="Brand Logo Preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="grid size-12 place-items-center border border-gold-500/70 font-display text-sm font-bold tracking-[0.14em] text-gold-400">
                  SR
                </span>
              )}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-ivory-100">
                {logoFilePreview
                  ? "● Pending Upload (Click Save Below)"
                  : logoImageUrl
                    ? "✓ Active Custom Logo"
                    : "Default Procedural 'SR' Badge"}
              </span>
              <p className="text-[0.7rem] text-graphite-400">
                {logoFilePreview || logoImageUrl
                  ? "This logo is rendered in the global navigation bar and brand marks."
                  : 'No custom image uploaded yet. The site is currently using the stylized gold "SR" badge.'}
              </p>
              <div className="flex items-center gap-4 pt-1">
                {logoFilePreview ? (
                  <button
                    type="button"
                    onClick={() => setLogoFilePreview(null)}
                    className="cursor-pointer text-xs text-graphite-400 hover:text-ivory-100"
                  >
                    ✕ Cancel new selection
                  </button>
                ) : null}
                {logoImageUrl && !logoFilePreview ? (
                  <button
                    type="button"
                    onClick={() => {
                      setLogoImageUrl("");
                      setLogoFilePreview(null);
                    }}
                    className="cursor-pointer text-xs text-red-400 hover:text-red-300"
                  >
                    ✕ Remove logo (revert to &apos;SR&apos; badge)
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* File Upload and URL inputs */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
              <label className="block text-xs uppercase tracking-wider text-graphite-300">
                Upload Logo File
              </label>
              <input
                type="file"
                name="logo_image_file"
                accept="image/png,image/svg+xml,image/webp,image/jpeg,image/avif,.svg"
                onChange={handleLogoFileChange}
                className="mt-2 block w-full text-xs text-graphite-400 file:mr-2 file:cursor-pointer file:rounded-xs file:border-0 file:bg-charcoal-700 file:px-2.5 file:py-1 file:text-xs file:text-ivory-100 hover:file:bg-gold-500 hover:file:text-obsidian-950"
              />
              <p className="mt-2 text-[0.65rem] text-graphite-400">
                Direct upload to Supabase storage (<code className="text-gold-400">rider-media/brand</code>).
              </p>
            </div>

            <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
              <label className="block text-xs uppercase tracking-wider text-graphite-300">
                Or Direct Logo URL
              </label>
              <input
                name="logo_image_url"
                value={logoImageUrl}
                onChange={(e) => setLogoImageUrl(e.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
              />
              <p className="mt-2 text-[0.65rem] text-graphite-400">
                Paste an external image link or keep existing storage URL.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Homepage Hero Imagery */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <div className="border-b border-charcoal-700 pb-3">
          <h2 className="font-display text-lg font-bold text-ivory-100">
            Homepage Hero Imagery
          </h2>
          <p className="mt-1 text-xs text-graphite-300">
            Configure the cinematic background image for the website hero section. Works with the dark overlay and golden ambiance.
          </p>
        </div>

        <div className="mt-5 space-y-5">
          {/* Recommended Specs Badge */}
          <div className="flex flex-wrap items-center gap-3 rounded-sm border border-gold-500/30 bg-gold-500/5 px-4 py-3 text-xs text-graphite-300">
            <span className="font-semibold uppercase tracking-wider text-gold-400">
              Recommended Specs:
            </span>
            <span>1920 × 1080 px or higher</span>
            <span>·</span>
            <span>16:9 Aspect Ratio</span>
            <span>·</span>
            <span>WebP or JPG</span>
            <span>·</span>
            <span>Max 5MB</span>
          </div>

          {/* Hero Image Preview (Live active or pending file) */}
          {filePreview || heroImageUrl ? (
            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-graphite-300">
                {filePreview ? "New Selected Image (Preview)" : "Current Background Preview"}
              </label>
              <div className="relative aspect-[16/9] w-full max-w-xl overflow-hidden rounded-sm border border-charcoal-600 bg-obsidian-950 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={filePreview || heroImageUrl}
                  alt="Homepage Hero Background"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-obsidian-950/20" />
                <div className="absolute bottom-3 left-3 text-[0.68rem] uppercase tracking-[0.2em] text-gold-400">
                  {filePreview ? "● Pending Upload (Click Save Below)" : "✓ Live Hero Image Active"}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {filePreview ? (
                  <button
                    type="button"
                    onClick={() => setFilePreview(null)}
                    className="cursor-pointer text-xs text-graphite-400 transition-colors hover:text-ivory-100"
                  >
                    ✕ Cancel new selection
                  </button>
                ) : null}
                {heroImageUrl ? (
                  <button
                    type="button"
                    onClick={() => {
                      setHeroImageUrl("");
                      setFilePreview(null);
                    }}
                    className="cursor-pointer text-xs text-red-400 transition-colors hover:text-red-300"
                  >
                    ✕ Remove background image (revert to procedural road art)
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-xs text-graphite-400 italic">
              No hero image currently active. The homepage will display the procedural road artwork.
            </p>
          )}

          {/* File Upload and URL inputs */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
              <label className="block text-xs uppercase tracking-wider text-graphite-300">
                Upload New Image File
              </label>
              <input
                type="file"
                name="hero_image_file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileChange}
                className="mt-2 block w-full text-xs text-graphite-400 file:mr-2 file:cursor-pointer file:rounded-xs file:border-0 file:bg-charcoal-700 file:px-2.5 file:py-1 file:text-xs file:text-ivory-100 hover:file:bg-gold-500 hover:file:text-obsidian-950"
              />
              <p className="mt-2 text-[0.65rem] text-graphite-400">
                Direct upload to Supabase storage bucket (<code className="text-gold-400">rider-media/hero</code>).
              </p>
            </div>

            <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
              <label className="block text-xs uppercase tracking-wider text-graphite-300">
                Or Direct Image URL
              </label>
              <input
                name="hero_image_url"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
              />
              <p className="mt-2 text-[0.65rem] text-graphite-400">
                Paste an external image link or keep existing storage URL.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rider Profile Onboarding System (Feature Toggle) */}
      <div className="rounded-sm border border-gold-500/30 bg-obsidian-900/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-charcoal-700 pb-3">
          <div>
            <h2 className="font-display text-lg font-bold text-ivory-100">
              Rider Profile Onboarding System
            </h2>
            <p className="mt-1 text-xs text-graphite-300">
              Temporary public portal for prospective riders to register and existing members to update their profile.
            </p>
          </div>
          <span
            className={`rounded-xs px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-wider ${
              initialSettings.onboarding_enabled
                ? "border border-green-500/40 bg-green-950/40 text-green-400"
                : "border border-charcoal-500 bg-charcoal-800 text-graphite-400"
            }`}
          >
            {initialSettings.onboarding_enabled ? "● Portal Active" : "○ Portal Disabled"}
          </span>
        </div>

        <div className="mt-5 space-y-4">
          <label className="flex cursor-pointer items-start gap-3 rounded-sm border border-charcoal-600 bg-obsidian-950 p-4 transition-colors hover:border-gold-500/40">
            <input
              type="checkbox"
              name="onboarding_enabled"
              defaultChecked={initialSettings.onboarding_enabled ?? false}
              className="mt-0.5 h-4 w-4 rounded-xs accent-gold-500"
            />
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-ivory-100">
                Enable Public Rider Profile Onboarding Portal
              </span>
              <p className="text-xs text-graphite-300">
                When checked, the public onboarding page at{" "}
                <code className="text-gold-400 font-mono">/onboard</code> is active and accessible for submissions.
              </p>
              <p className="text-[0.7rem] text-graphite-400">
                When unchecked, visiting <code className="text-graphite-300 font-mono">/onboard</code> redirects visitors to the homepage. Pending submissions are never lost and can still be reviewed and approved by administrators at any time.
              </p>
            </div>
          </label>
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

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AdminRiderRecord } from "@/lib/db/admin-schema";
import { saveRiderAction } from "@/app/admin/actions";

interface RiderFormProps {
  initialData?: AdminRiderRecord | null;
}

const POSITIONS = [
  { value: "founder", label: "Founder" },
  { value: "co-founder", label: "Co-Founder" },
  { value: "president", label: "President" },
  { value: "vice-president", label: "Vice-President" },
  { value: "captain", label: "Captain" },
  { value: "co-captain", label: "Co-Captain" },
  { value: "secretary", label: "Secretary" },
  { value: "treasurer", label: "Treasurer" },
  { value: "member", label: "Member" },
  { value: "prospect", label: "Prospect" },
];

const RIDING_STYLES = [
  "touring",
  "adventure",
  "cruiser",
  "sport",
  "naked",
  "offroad",
  "commuter",
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function RiderForm({ initialData }: RiderFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [displayName, setDisplayName] = useState(initialData?.display_name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    initialData?.riding_style ?? []
  );

  const isEditing = Boolean(initialData?.id);

  const handleGenerateSlug = () => {
    if (!displayName) return;
    const generated = displayName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generated);
  };

  const handleToggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Append selected styles
    formData.delete("riding_style");
    selectedStyles.forEach((s) => formData.append("riding_style", s));

    startTransition(async () => {
      const res = await saveRiderAction(initialData?.id ?? null, formData);
      if (res.success) {
        router.push("/admin/riders");
        router.refresh();
      } else {
        setErrorMessage(res.error || "Failed to save rider.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errorMessage && (
        <div className="rounded-sm border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-300">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}

      {/* 1. Identity Section */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          1. Community Identity
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Display Name *
            </label>
            <input
              name="display_name"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Vikram Rathore"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Full Legal Name *
            </label>
            <input
              name="full_name"
              required
              defaultValue={initialData?.full_name ?? ""}
              placeholder="e.g. Vikram Singh Rathore"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs uppercase tracking-wider text-graphite-300">
                URL Slug *
              </label>
              <button
                type="button"
                onClick={handleGenerateSlug}
                className="cursor-pointer text-[0.65rem] text-gold-400 hover:underline"
              >
                Generate from name
              </button>
            </div>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. vikram-rathore"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Community Position *
            </label>
            <select
              name="community_position"
              required
              defaultValue={initialData?.community_position ?? "member"}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            >
              {POSITIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Date Joined *
            </label>
            <input
              name="joined_date"
              type="date"
              required
              defaultValue={
                initialData?.joined_date
                  ? initialData.joined_date.slice(0, 10)
                  : new Date().toISOString().slice(0, 10)
              }
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Motorcycle Showcase */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          2. Machine Specification
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Bike Brand *
            </label>
            <input
              name="bike_brand"
              required
              defaultValue={initialData?.bike_brand ?? ""}
              placeholder="e.g. Royal Enfield"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Bike Model *
            </label>
            <input
              name="bike_model"
              required
              defaultValue={initialData?.bike_model ?? ""}
              placeholder="e.g. Continental GT"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Variant / Displacement
            </label>
            <input
              name="bike_variant"
              defaultValue={initialData?.bike_variant ?? ""}
              placeholder="e.g. 650 Twin"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Manufacturing Year *
            </label>
            <input
              name="bike_year"
              type="number"
              min="1950"
              max="2030"
              required
              defaultValue={initialData?.bike_year ?? 2022}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Bike Color / Livery
            </label>
            <input
              name="bike_color"
              defaultValue={initialData?.bike_color ?? ""}
              placeholder="e.g. Black and brass"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Personal & Privacy Enforcement */}
      <div className="rounded-sm border border-gold-500/20 bg-obsidian-900/40 p-6">
        <div className="flex items-center justify-between border-b border-charcoal-700 pb-3">
          <h2 className="font-display text-lg font-bold text-ivory-100">
            3. Personal Information & Privacy Controls
          </h2>
          <span className="rounded-xs bg-gold-500/10 px-2 py-0.5 text-[0.62rem] font-medium tracking-wider text-gold-400 uppercase">
            Privacy Engine Active
          </span>
        </div>
        <p className="mt-2 text-xs text-graphite-300">
          Configure personal details and toggle whether they are public or masked in the public directory and SEO metadata.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* City */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              City / Base
            </label>
            <input
              name="city"
              defaultValue={initialData?.city ?? ""}
              placeholder="e.g. Jaipur"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
            <label className="mt-3 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="show_city"
                defaultChecked={initialData?.show_city ?? false}
                className="h-3.5 w-3.5 rounded-xs accent-gold-500"
              />
              <span className="text-xs text-graphite-300">
                Show city publicly on directory and profile
              </span>
            </label>
          </div>

          {/* Age */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Age
            </label>
            <input
              name="age"
              type="number"
              min="18"
              max="99"
              defaultValue={initialData?.age ?? ""}
              placeholder="e.g. 38"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
            <label className="mt-3 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="show_age"
                defaultChecked={initialData?.show_age ?? false}
                className="h-3.5 w-3.5 rounded-xs accent-gold-500"
              />
              <span className="text-xs text-graphite-300">
                Show age publicly on profile
              </span>
            </label>
          </div>

          {/* Blood Group */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Blood Group
            </label>
            <select
              name="blood_group"
              defaultValue={initialData?.blood_group ?? ""}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            >
              <option value="">Not Recorded</option>
              {BLOOD_GROUPS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <label className="mt-3 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="show_blood_group"
                defaultChecked={initialData?.show_blood_group ?? false}
                className="h-3.5 w-3.5 rounded-xs accent-gold-500"
              />
              <span className="text-xs text-graphite-300">
                Show blood group publicly on profile
              </span>
            </label>
          </div>

          {/* Social Links Privacy */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Social Links Visibility
            </label>
            <p className="mt-1 text-[0.7rem] text-graphite-400">
              Controls whether Instagram, Facebook, and other links are visible to the public.
            </p>
            <label className="mt-4 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                name="show_social_links"
                defaultChecked={initialData?.show_social_links ?? false}
                className="h-3.5 w-3.5 rounded-xs accent-gold-500"
              />
              <span className="text-xs text-graphite-300">
                Show social links publicly on profile
              </span>
            </label>
          </div>
        </div>

        {/* Social URL Inputs */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-[0.7rem] uppercase tracking-wider text-graphite-400">
              Instagram URL
            </label>
            <input
              name="instagram_url"
              type="url"
              defaultValue={initialData?.instagram_url ?? ""}
              placeholder="https://instagram.com/..."
              className="mt-1 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-2.5 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[0.7rem] uppercase tracking-wider text-graphite-400">
              Facebook URL
            </label>
            <input
              name="facebook_url"
              type="url"
              defaultValue={initialData?.facebook_url ?? ""}
              placeholder="https://facebook.com/..."
              className="mt-1 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-2.5 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[0.7rem] uppercase tracking-wider text-graphite-400">
              YouTube URL
            </label>
            <input
              name="youtube_url"
              type="url"
              defaultValue={initialData?.youtube_url ?? ""}
              placeholder="https://youtube.com/..."
              className="mt-1 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-2.5 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[0.7rem] uppercase tracking-wider text-graphite-400">
              Personal Website
            </label>
            <input
              name="website_url"
              type="url"
              defaultValue={initialData?.website_url ?? ""}
              placeholder="https://..."
              className="mt-1 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-2.5 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Riding Experience */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          4. Riding Profile & Style
        </h2>
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs uppercase tracking-wider text-graphite-300">
                Riding Since (Year)
              </label>
              <input
                name="riding_since"
                type="number"
                min="1950"
                max="2030"
                defaultValue={initialData?.riding_since ?? ""}
                placeholder="e.g. 2004"
                className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-graphite-300">
                Favorite Route / Road
              </label>
              <input
                name="favorite_route"
                defaultValue={initialData?.favorite_route ?? ""}
                placeholder="e.g. Jaipur to the Rann of Kutch"
                className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Riding Style (Select all that apply)
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {RIDING_STYLES.map((style) => {
                const active = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleToggleStyle(style)}
                    className={`cursor-pointer rounded-xs px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                      active
                        ? "border border-gold-500 bg-gold-500/20 text-gold-400"
                        : "border border-charcoal-500 bg-obsidian-950 text-graphite-400 hover:text-ivory-100"
                    }`}
                  >
                    {style}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Community Achievements / Milestones (One per line)
            </label>
            <textarea
              name="achievements"
              rows={3}
              defaultValue={initialData?.achievements?.join("\n") ?? ""}
              placeholder={"Called the first dawn departure in 2020\nLed Salt and Silence toward the Rann"}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. Editorial Content */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          5. Editorial Narrative & Biography
        </h2>
        <div className="mt-5 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Short Bio (1-2 sentences for card previews) *
            </label>
            <textarea
              name="short_bio"
              required
              rows={2}
              defaultValue={initialData?.short_bio ?? ""}
              placeholder="Keeps the dawn starts honest and the crew pointed at the horizon."
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Full Editorial Bio (Paragraph story) *
            </label>
            <textarea
              name="bio"
              required
              rows={5}
              defaultValue={initialData?.bio ?? ""}
              placeholder="Vikram called the first departure out of Jaipur..."
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs leading-relaxed text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 6. Media & Photos */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          6. Imagery & Media
        </h2>
        <p className="mt-1 text-xs text-graphite-300">
          Upload images directly to Supabase storage (max 5MB) or enter existing URLs.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Profile Image */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Profile Portrait
            </label>
            <input
              type="file"
              name="profile_image_file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="mt-2 block w-full text-xs text-graphite-400 file:mr-2 file:cursor-pointer file:rounded-xs file:border-0 file:bg-charcoal-700 file:px-2.5 file:py-1 file:text-xs file:text-ivory-100 hover:file:bg-gold-500 hover:file:text-obsidian-950"
            />
            <div className="mt-2">
              <span className="text-[0.65rem] text-graphite-400">Or Image URL:</span>
              <input
                name="profile_image_url"
                defaultValue={initialData?.profile_image_url ?? ""}
                placeholder="https://..."
                className="mt-1 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-2 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Bike Image */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Motorcycle Photo
            </label>
            <input
              type="file"
              name="bike_image_file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="mt-2 block w-full text-xs text-graphite-400 file:mr-2 file:cursor-pointer file:rounded-xs file:border-0 file:bg-charcoal-700 file:px-2.5 file:py-1 file:text-xs file:text-ivory-100 hover:file:bg-gold-500 hover:file:text-obsidian-950"
            />
            <div className="mt-2">
              <span className="text-[0.65rem] text-graphite-400">Or Image URL:</span>
              <input
                name="bike_image_url"
                defaultValue={initialData?.bike_image_url ?? ""}
                placeholder="https://..."
                className="mt-1 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-2 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Cover / Header Image
            </label>
            <input
              type="file"
              name="cover_image_file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="mt-2 block w-full text-xs text-graphite-400 file:mr-2 file:cursor-pointer file:rounded-xs file:border-0 file:bg-charcoal-700 file:px-2.5 file:py-1 file:text-xs file:text-ivory-100 hover:file:bg-gold-500 hover:file:text-obsidian-950"
            />
            <div className="mt-2">
              <span className="text-[0.65rem] text-graphite-400">Or Image URL:</span>
              <input
                name="cover_image_url"
                defaultValue={initialData?.cover_image_url ?? ""}
                placeholder="https://..."
                className="mt-1 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-2 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7. Status Toggles */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          7. Publication & Membership Status
        </h2>
        <div className="mt-4 flex flex-wrap gap-8">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={initialData?.is_featured ?? false}
              className="h-4 w-4 rounded-xs accent-gold-500"
            />
            <div>
              <span className="text-xs font-medium text-ivory-100">
                Feature on Homepage
              </span>
              <p className="text-[0.7rem] text-graphite-400">
                Display prominently in the Featured Riders community carousel
              </p>
            </div>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              defaultChecked={initialData?.is_active ?? true}
              className="h-4 w-4 rounded-xs accent-gold-500"
            />
            <div>
              <span className="text-xs font-medium text-ivory-100">
                Active Member Roster
              </span>
              <p className="text-[0.7rem] text-graphite-400">
                Uncheck to archive member without permanently deleting records
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Form Submission Actions */}
      <div className="flex items-center justify-end gap-4 border-t border-charcoal-700 pt-4">
        <Link
          href="/admin/riders"
          className="rounded-sm border border-charcoal-500 px-4 py-2 text-xs uppercase tracking-wider text-graphite-300 hover:text-ivory-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer rounded-sm border border-gold-500 bg-gold-500 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400 disabled:opacity-50"
        >
          {isPending ? "Saving Rider..." : isEditing ? "Save Changes" : "Create Rider"}
        </button>
      </div>
    </form>
  );
}

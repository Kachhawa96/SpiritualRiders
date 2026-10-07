"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AdminRideRecord, AdminRiderRecord } from "@/lib/db/admin-schema";
import { saveRideAction } from "@/app/admin/actions";

interface RideFormProps {
  initialData?: AdminRideRecord | null;
  availableRiders?: AdminRiderRecord[];
}

const RIDE_TYPES = [
  { value: "day-ride", label: "Day Ride" },
  { value: "weekend-ride", label: "Weekend Ride" },
  { value: "tour", label: "Tour / Expedition" },
  { value: "dawn-patrol", label: "Dawn Patrol" },
  { value: "night-ride", label: "Night Ride" },
  { value: "meetup", label: "Meetup" },
  { value: "charity", label: "Charity Ride" },
];

const RIDE_STATUSES = [
  { value: "upcoming", label: "Upcoming (Ahead)" },
  { value: "ongoing", label: "Ongoing (Live)" },
  { value: "completed", label: "Completed (Ridden)" },
  { value: "cancelled", label: "Cancelled" },
];

const TONES = [
  { value: "highway", label: "Highway" },
  { value: "machine", label: "Machine" },
  { value: "crew", label: "Crew" },
  { value: "dawn", label: "Dawn" },
  { value: "salt", label: "Salt" },
  { value: "rain", label: "Rain" },
];

export function RideForm({
  initialData,
  availableRiders = [],
}: RideFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");

  const initialParticipantIds =
    initialData?.participants?.map((p) => p.id) ?? [];
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    initialParticipantIds
  );

  const isEditing = Boolean(initialData?.id);

  const handleGenerateSlug = () => {
    if (!title) return;
    const generated = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generated);
  };

  const handleToggleParticipant = (riderId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(riderId)
        ? prev.filter((id) => id !== riderId)
        : [...prev, riderId]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Append participants
    formData.delete("participants");
    selectedParticipants.forEach((id) => formData.append("participants", id));

    startTransition(async () => {
      const res = await saveRideAction(initialData?.id ?? null, formData);
      if (res.success) {
        router.push("/admin/rides");
        router.refresh();
      } else {
        setErrorMessage(res.error || "Failed to save ride.");
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

      {/* 1. Expedition Identity */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          1. Expedition Overview
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Title *
            </label>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Salt and Silence"
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
                Generate from title
              </button>
            </div>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. salt-and-silence"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Tagline
            </label>
            <input
              name="tagline"
              defaultValue={initialData?.tagline ?? ""}
              placeholder="e.g. A straight line to the white desert"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Ride Type *
            </label>
            <select
              name="ride_type"
              required
              defaultValue={initialData?.ride_type ?? "tour"}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            >
              {RIDE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Status *
            </label>
            <select
              name="status"
              required
              defaultValue={initialData?.status ?? "upcoming"}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            >
              {RIDE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Tone / Visual Style *
            </label>
            <select
              name="tone"
              required
              defaultValue={initialData?.tone ?? "highway"}
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Logistics & Route */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          2. Logistics & Itinerary
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Departure Date *
            </label>
            <input
              name="start_date"
              type="date"
              required
              defaultValue={
                initialData?.start_date
                  ? initialData.start_date.slice(0, 10)
                  : new Date().toISOString().slice(0, 10)
              }
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Return / End Date
            </label>
            <input
              name="end_date"
              type="date"
              defaultValue={
                initialData?.end_date ? initialData.end_date.slice(0, 10) : ""
              }
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Estimated Distance (km)
            </label>
            <input
              name="distance_km"
              type="number"
              min="0"
              defaultValue={initialData?.distance_km ?? ""}
              placeholder="e.g. 640"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Route Summary
            </label>
            <input
              name="route_summary"
              defaultValue={initialData?.route_summary ?? ""}
              placeholder="e.g. Jaipur to the Rann"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Meeting Point / Staging Area
            </label>
            <input
              name="meeting_point"
              defaultValue={initialData?.meeting_point ?? ""}
              placeholder="e.g. Jaipur, before light"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Total Rider Attendance
            </label>
            <input
              name="participant_count"
              type="number"
              min="0"
              defaultValue={initialData?.participant_count ?? 0}
              placeholder="e.g. 18"
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Narrative & Content */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          3. Ride Narrative
        </h2>
        <div className="mt-5 space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Short Description (Listing preview) *
            </label>
            <textarea
              name="short_description"
              required
              rows={2}
              defaultValue={initialData?.short_description ?? ""}
              placeholder="A two-day run into the white desert..."
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Full Chronicle / Description *
            </label>
            <textarea
              name="description"
              required
              rows={5}
              defaultValue={initialData?.description ?? ""}
              placeholder="A two-day run into the white desert. Dawn starts, a long straight..."
              className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs leading-relaxed text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Participating Crew */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <div className="flex items-center justify-between border-b border-charcoal-700 pb-3">
          <h2 className="font-display text-lg font-bold text-ivory-100">
            4. Named Participating Crew ({selectedParticipants.length} selected)
          </h2>
          <span className="text-xs text-graphite-400">
            Links public rider profiles to this expedition
          </span>
        </div>

        {availableRiders.length === 0 ? (
          <p className="mt-4 text-xs text-graphite-400">
            No riders available in the roster. Add riders first to link them.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {availableRiders.map((rider) => {
              const selected = selectedParticipants.includes(rider.id);
              return (
                <button
                  key={rider.id}
                  type="button"
                  onClick={() => handleToggleParticipant(rider.id)}
                  className={`cursor-pointer rounded-sm border p-2 text-left text-xs transition-colors ${
                    selected
                      ? "border-gold-500 bg-gold-500/15 text-gold-300"
                      : "border-charcoal-600 bg-obsidian-950 text-graphite-300 hover:border-charcoal-500"
                  }`}
                >
                  <div className="truncate font-medium">{rider.display_name}</div>
                  <div className="truncate text-[0.65rem] text-graphite-400 capitalize">
                    {rider.community_position}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Cover Media & Publication */}
      <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
          5. Cover Imagery & Feature Status
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
            <label className="block text-xs uppercase tracking-wider text-graphite-300">
              Expedition Cover Image
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

          <div className="flex flex-col justify-center rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={initialData?.is_featured ?? false}
                className="h-4 w-4 rounded-xs accent-gold-500"
              />
              <div>
                <span className="text-xs font-medium text-ivory-100">
                  Feature as Highlight Ride
                </span>
                <p className="text-[0.7rem] text-graphite-400">
                  Showcase on the homepage Featured Expedition section
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Submission Actions */}
      <div className="flex items-center justify-end gap-4 border-t border-charcoal-700 pt-4">
        <Link
          href="/admin/rides"
          className="rounded-sm border border-charcoal-500 px-4 py-2 text-xs uppercase tracking-wider text-graphite-300 hover:text-ivory-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer rounded-sm border border-gold-500 bg-gold-500 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400 disabled:opacity-50"
        >
          {isPending ? "Saving Ride..." : isEditing ? "Save Changes" : "Create Ride"}
        </button>
      </div>
    </form>
  );
}

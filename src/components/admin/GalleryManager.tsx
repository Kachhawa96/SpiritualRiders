"use client";

import { useState, useTransition } from "react";
import type {
  AdminGalleryRecord,
  AdminRideRecord,
  AdminRiderRecord,
} from "@/lib/db/admin-schema";
import { deleteGalleryAction, saveGalleryAction } from "@/app/admin/actions";

interface GalleryManagerProps {
  initialFrames: AdminGalleryRecord[];
  rides: AdminRideRecord[];
  riders: AdminRiderRecord[];
}

const TONES = [
  { value: "highway", label: "Highway" },
  { value: "machine", label: "Machine" },
  { value: "crew", label: "Crew" },
  { value: "dawn", label: "Dawn" },
  { value: "salt", label: "Salt" },
  { value: "rain", label: "Rain" },
];

export function GalleryManager({
  initialFrames,
  rides,
  riders,
}: GalleryManagerProps) {
  const [frames, setFrames] = useState(initialFrames);
  const [filterTone, setFilterTone] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFrame, setEditingFrame] = useState<AdminGalleryRecord | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filtered = frames.filter((frame) => {
    return filterTone === "all" || frame.tone === filterTone;
  });

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete frame "${title}" permanently?`)) return;

    startTransition(async () => {
      const res = await deleteGalleryAction(id);
      if (res.success) {
        setFrames((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert(res.error || "Failed to delete frame.");
      }
    });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const id = editingFrame?.id ?? null;
      const res = await saveGalleryAction(id, formData);
      if (res.success) {
        setShowAddForm(false);
        setEditingFrame(null);
        window.location.reload();
      } else {
        setErrorMessage(res.error || "Failed to save gallery frame.");
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <select
            value={filterTone}
            onChange={(e) => setFilterTone(e.target.value)}
            className="rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
          >
            <option value="all">All Tones</option>
            {TONES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <span className="text-xs text-graphite-400">
            {filtered.length} frames
          </span>
        </div>

        <button
          onClick={() => {
            setEditingFrame(null);
            setShowAddForm(!showAddForm);
          }}
          className="cursor-pointer rounded-sm border border-gold-500 bg-gold-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400"
        >
          {showAddForm ? "Close Form" : "+ Upload New Frame"}
        </button>
      </div>

      {/* Frame Form (Upload or Edit) */}
      {(showAddForm || editingFrame) && (
        <div className="rounded-sm border border-gold-500/30 bg-obsidian-900 p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-charcoal-700 pb-3">
            <h2 className="font-display text-lg font-bold text-ivory-100">
              {editingFrame ? `Edit Frame: ${editingFrame.title}` : "Upload New Gallery Frame"}
            </h2>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingFrame(null);
              }}
              className="text-xs text-graphite-400 hover:text-ivory-100"
            >
              Cancel ✕
            </button>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-sm border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="mt-5 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Frame Title *
                </label>
                <input
                  name="title"
                  required
                  defaultValue={editingFrame?.title ?? ""}
                  placeholder="e.g. Before the city"
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Tone / Aesthetic *
                </label>
                <select
                  name="tone"
                  required
                  defaultValue={editingFrame?.tone ?? "highway"}
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                >
                  {TONES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Date Captured
                </label>
                <input
                  name="taken_on"
                  type="date"
                  defaultValue={
                    editingFrame?.taken_on
                      ? editingFrame.taken_on.slice(0, 10)
                      : new Date().toISOString().slice(0, 10)
                  }
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Associate with Expedition / Ride
                </label>
                <select
                  name="ride_id"
                  defaultValue={editingFrame?.ride_id ?? ""}
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                >
                  <option value="">None (Independent Moment)</option>
                  {rides.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.start_date.slice(0, 4)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Associate with Rider
                </label>
                <select
                  name="rider_id"
                  defaultValue={editingFrame?.rider_id ?? ""}
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                >
                  <option value="">None (General Crew)</option>
                  {riders.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.display_name} ({r.community_position})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-graphite-300">
                Editorial Caption *
              </label>
              <textarea
                name="caption"
                required
                rows={2}
                defaultValue={editingFrame?.caption ?? ""}
                placeholder="The line, still in the dark, waiting on Vikram."
                className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Upload Image File (Max 10MB)
                </label>
                <input
                  type="file"
                  name="image_file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="mt-2 block w-full text-xs text-graphite-400 file:mr-2 file:cursor-pointer file:rounded-xs file:border-0 file:bg-charcoal-700 file:px-2.5 file:py-1 file:text-xs file:text-ivory-100 hover:file:bg-gold-500 hover:file:text-obsidian-950"
                />
              </div>

              <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Or Image URL
                </label>
                <input
                  name="image_url"
                  defaultValue={editingFrame?.image_url ?? ""}
                  placeholder="https://..."
                  className="mt-2 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingFrame(null);
                }}
                className="rounded-sm border border-charcoal-500 px-4 py-2 text-xs uppercase tracking-wider text-graphite-300 hover:text-ivory-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer rounded-sm border border-gold-500 bg-gold-500 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400 disabled:opacity-50"
              >
                {isPending ? "Saving..." : editingFrame ? "Update Frame" : "Save Frame"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Gallery Frames */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.length === 0 ? (
          <p className="col-span-full py-12 text-center text-xs text-graphite-400">
            No gallery frames recorded.
          </p>
        ) : (
          filtered.map((frame) => (
            <div
              key={frame.id}
              className="flex flex-col justify-between rounded-sm border border-charcoal-600 bg-obsidian-900/60 p-4 transition-colors hover:border-gold-500/40"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-xs border border-charcoal-600 bg-charcoal-700/60 px-2 py-0.5 text-[0.62rem] font-medium tracking-wider text-graphite-300 uppercase">
                    {frame.tone}
                  </span>
                  <span className="text-[0.68rem] text-graphite-400">
                    {frame.taken_on ?? "Date unrecorded"}
                  </span>
                </div>

                <h3 className="mt-3 text-sm font-semibold text-ivory-100">
                  {frame.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-graphite-300">
                  {frame.caption}
                </p>
              </div>

              <div className="mt-4 border-t border-charcoal-700/60 pt-3">
                <div className="space-y-1 text-[0.7rem] text-graphite-400">
                  {frame.ride_title && (
                    <div className="truncate">
                      Ride: <span className="text-ivory-100">{frame.ride_title}</span>
                    </div>
                  )}
                  {frame.rider_name && (
                    <div className="truncate">
                      Rider: <span className="text-gold-400">{frame.rider_name}</span>
                    </div>
                  )}
                  {frame.image_url && (
                    <div className="truncate text-emerald-400">
                      ✓ Photograph attached
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingFrame(frame);
                      setShowAddForm(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="cursor-pointer rounded-xs border border-charcoal-500 bg-charcoal-700/40 px-2.5 py-1 text-[0.68rem] text-ivory-100 hover:border-gold-500 hover:text-gold-400"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(frame.id, frame.title)}
                    disabled={isPending}
                    className="cursor-pointer rounded-xs border border-charcoal-600 px-2 py-1 text-[0.68rem] text-graphite-400 hover:border-red-500/50 hover:bg-red-950/30 hover:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { AdminRiderRecord } from "@/lib/db/admin-schema";
import {
  deleteRiderAction,
  toggleRiderActiveAction,
  toggleRiderFeaturedAction,
} from "@/app/admin/actions";

interface RiderTableProps {
  initialRiders: AdminRiderRecord[];
}

export function RiderTable({ initialRiders }: RiderTableProps) {
  const [riders, setRiders] = useState(initialRiders);
  const [search, setSearch] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  const filtered = riders.filter((rider) => {
    const matchesSearch =
      rider.display_name.toLowerCase().includes(search.toLowerCase()) ||
      rider.full_name.toLowerCase().includes(search.toLowerCase()) ||
      rider.bike_brand.toLowerCase().includes(search.toLowerCase()) ||
      rider.bike_model.toLowerCase().includes(search.toLowerCase());

    const matchesPosition =
      positionFilter === "all" || rider.community_position === positionFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && rider.is_active) ||
      (statusFilter === "archived" && !rider.is_active) ||
      (statusFilter === "featured" && rider.is_featured);

    return matchesSearch && matchesPosition && matchesStatus;
  });

  const handleToggleFeatured = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleRiderFeaturedAction(id, !current);
      if (res.success) {
        setRiders((prev) =>
          prev.map((r) => (r.id === id ? { ...r, is_featured: !current } : r))
        );
      }
    });
  };

  const handleToggleActive = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleRiderActiveAction(id, !current);
      if (res.success) {
        setRiders((prev) =>
          prev.map((r) => (r.id === id ? { ...r, is_active: !current } : r))
        );
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete rider "${name}"?`)) {
      return;
    }
    startTransition(async () => {
      const res = await deleteRiderAction(id);
      if (res.success) {
        setRiders((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(res.error || "Failed to delete rider.");
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search riders by name, brand, model..."
            className="w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-3.5 py-2 text-xs text-ivory-100 placeholder-graphite-400 focus:border-gold-500 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-xs text-graphite-400 hover:text-ivory-100"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
          >
            <option value="all">All Positions</option>
            <option value="founder">Founder</option>
            <option value="co-founder">Co-founder</option>
            <option value="president">President</option>
            <option value="vice-president">Vice-president</option>
            <option value="captain">Captain</option>
            <option value="co-captain">Co-captain</option>
            <option value="secretary">Secretary</option>
            <option value="treasurer">Treasurer</option>
            <option value="member">Member</option>
            <option value="prospect">Prospect</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="featured">Featured Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Riders Table */}
      <div className="overflow-x-auto rounded-sm border border-charcoal-600 bg-obsidian-900/60">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-charcoal-600 bg-obsidian-900 text-[0.68rem] uppercase tracking-[0.16em] text-graphite-300">
            <tr>
              <th className="px-4 py-3">Rider</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Machine</th>
              <th className="px-4 py-3">Privacy Flags</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-700/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-graphite-400">
                  No riders matching your criteria.
                </td>
              </tr>
            ) : (
              filtered.map((rider) => (
                <tr
                  key={rider.id}
                  className="transition-colors hover:bg-charcoal-700/20"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-ivory-100">
                      {rider.display_name}
                    </div>
                    <div className="text-[0.7rem] text-graphite-400">
                      {rider.full_name} ({rider.slug})
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-xs border border-charcoal-600 bg-charcoal-700/50 px-2 py-0.5 text-[0.62rem] font-medium tracking-wider text-graphite-200 uppercase">
                      {rider.community_position}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-ivory-100">
                      {rider.bike_brand} {rider.bike_model}
                    </div>
                    <div className="text-[0.7rem] text-graphite-400">
                      {rider.bike_year} {rider.bike_color ? `• ${rider.bike_color}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 text-[0.65rem]">
                      <span
                        title={rider.show_city ? "City is Public" : "City is Hidden"}
                        className={`rounded-xs px-1 py-0.2 ${
                          rider.show_city
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-charcoal-800 text-graphite-400"
                        }`}
                      >
                        City
                      </span>
                      <span
                        title={rider.show_age ? "Age is Public" : "Age is Hidden"}
                        className={`rounded-xs px-1 py-0.2 ${
                          rider.show_age
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-charcoal-800 text-graphite-400"
                        }`}
                      >
                        Age
                      </span>
                      <span
                        title={
                          rider.show_blood_group
                            ? "Blood is Public"
                            : "Blood is Hidden"
                        }
                        className={`rounded-xs px-1 py-0.2 ${
                          rider.show_blood_group
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-charcoal-800 text-graphite-400"
                        }`}
                      >
                        Blood
                      </span>
                      <span
                        title={
                          rider.show_social_links
                            ? "Socials are Public"
                            : "Socials are Hidden"
                        }
                        className={`rounded-xs px-1 py-0.2 ${
                          rider.show_social_links
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-charcoal-800 text-graphite-400"
                        }`}
                      >
                        Social
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() =>
                          handleToggleFeatured(rider.id, rider.is_featured)
                        }
                        disabled={isPending}
                        title="Toggle Featured"
                        className={`cursor-pointer rounded-xs px-2 py-0.5 text-[0.6rem] font-semibold tracking-wider uppercase transition-colors ${
                          rider.is_featured
                            ? "border border-gold-500/40 bg-gold-500/20 text-gold-400 hover:bg-gold-500/30"
                            : "border border-charcoal-600 bg-charcoal-800 text-graphite-400 hover:text-ivory-100"
                        }`}
                      >
                        {rider.is_featured ? "Featured" : "Regular"}
                      </button>

                      <button
                        onClick={() => handleToggleActive(rider.id, rider.is_active)}
                        disabled={isPending}
                        title="Toggle Active / Archive"
                        className={`cursor-pointer rounded-xs px-2 py-0.5 text-[0.6rem] font-semibold tracking-wider uppercase transition-colors ${
                          rider.is_active
                            ? "border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40"
                            : "border border-charcoal-600 bg-charcoal-800 text-graphite-400 hover:text-ivory-100"
                        }`}
                      >
                        {rider.is_active ? "Active" : "Archived"}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/riders/${rider.id}`}
                        className="rounded-sm border border-charcoal-500 bg-charcoal-700/50 px-2.5 py-1 text-[0.68rem] text-ivory-100 hover:border-gold-500 hover:text-gold-400"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(rider.id, rider.display_name)}
                        disabled={isPending}
                        className="cursor-pointer rounded-sm border border-charcoal-600 px-2 py-1 text-[0.68rem] text-graphite-400 hover:border-red-500/50 hover:bg-red-950/30 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

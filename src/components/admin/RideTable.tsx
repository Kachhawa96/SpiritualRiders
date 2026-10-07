"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import type { AdminRideRecord } from "@/lib/db/admin-schema";
import { deleteRideAction, toggleRideFeaturedAction } from "@/app/admin/actions";

interface RideTableProps {
  initialRides: AdminRideRecord[];
}

export function RideTable({ initialRides }: RideTableProps) {
  const [rides, setRides] = useState(initialRides);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  const filtered = rides.filter((ride) => {
    const matchesSearch =
      ride.title.toLowerCase().includes(search.toLowerCase()) ||
      (ride.tagline ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (ride.route_summary ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || ride.status === statusFilter;
    const matchesType = typeFilter === "all" || ride.ride_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleToggleFeatured = (id: string, current: boolean) => {
    startTransition(async () => {
      const res = await toggleRideFeaturedAction(id, !current);
      if (res.success) {
        setRides((prev) =>
          prev.map((r) => (r.id === id ? { ...r, is_featured: !current } : r))
        );
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete ride "${title}"?`)) {
      return;
    }
    startTransition(async () => {
      const res = await deleteRideAction(id);
      if (res.success) {
        setRides((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert(res.error || "Failed to delete ride.");
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
            placeholder="Search rides by title, route, tagline..."
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="tour">Tour</option>
            <option value="day-ride">Day Ride</option>
            <option value="weekend-ride">Weekend Ride</option>
            <option value="night-ride">Night Ride</option>
            <option value="dawn-patrol">Dawn Patrol</option>
            <option value="meetup">Meetup</option>
            <option value="charity">Charity</option>
          </select>
        </div>
      </div>

      {/* Rides Table */}
      <div className="overflow-x-auto rounded-sm border border-charcoal-600 bg-obsidian-900/60">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-charcoal-600 bg-obsidian-900 text-[0.68rem] uppercase tracking-[0.16em] text-graphite-300">
            <tr>
              <th className="px-4 py-3">Ride</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Dates & Distance</th>
              <th className="px-4 py-3">Crew Size</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-700/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-graphite-400">
                  No rides matching your criteria.
                </td>
              </tr>
            ) : (
              filtered.map((ride) => (
                <tr
                  key={ride.id}
                  className="transition-colors hover:bg-charcoal-700/20"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-ivory-100">{ride.title}</div>
                    <div className="text-[0.7rem] text-graphite-400">
                      {ride.tagline || ride.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-xs border border-charcoal-600 bg-charcoal-700/50 px-2 py-0.5 text-[0.62rem] font-medium tracking-wider text-graphite-200 uppercase">
                      {ride.ride_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-xs px-2 py-0.5 text-[0.62rem] font-semibold tracking-wider uppercase ${
                        ride.status === "upcoming"
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : ride.status === "ongoing"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : ride.status === "cancelled"
                              ? "bg-red-950/40 text-red-400 border border-red-500/30"
                              : "bg-charcoal-700 text-graphite-300 border border-charcoal-600"
                      }`}
                    >
                      {ride.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-ivory-100">{ride.start_date}</div>
                    <div className="text-[0.7rem] text-graphite-400">
                      {ride.distance_km ? `${ride.distance_km} km` : "Distance TBD"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-graphite-200">
                    {ride.participant_count} riders
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() =>
                        handleToggleFeatured(ride.id, ride.is_featured)
                      }
                      disabled={isPending}
                      className={`cursor-pointer rounded-xs px-2 py-0.5 text-[0.6rem] font-semibold tracking-wider uppercase transition-colors ${
                        ride.is_featured
                          ? "border border-gold-500/40 bg-gold-500/20 text-gold-400 hover:bg-gold-500/30"
                          : "border border-charcoal-600 bg-charcoal-800 text-graphite-400 hover:text-ivory-100"
                      }`}
                    >
                      {ride.is_featured ? "Featured" : "Regular"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/rides/${ride.id}`}
                        className="rounded-sm border border-charcoal-500 bg-charcoal-700/50 px-2.5 py-1 text-[0.68rem] text-ivory-100 hover:border-gold-500 hover:text-gold-400"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(ride.id, ride.title)}
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

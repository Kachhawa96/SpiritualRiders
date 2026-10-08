"use client";

import { useState } from "react";
import Link from "next/link";
import type { OnboardingSubmissionRecord } from "@/lib/db/onboarding-schema";

interface SubmissionTableProps {
  initialSubmissions: OnboardingSubmissionRecord[];
}

export function SubmissionTable({ initialSubmissions }: SubmissionTableProps) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [search, setSearch] = useState("");

  const filtered = initialSubmissions.filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = s.display_name.toLowerCase().includes(q) || s.full_name.toLowerCase().includes(q);
      const matchEmail = (s.contact_email || "").toLowerCase().includes(q);
      const matchBike = `${s.bike_brand} ${s.bike_model}`.toLowerCase().includes(q);
      return matchName || matchEmail || matchBike;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Controls: Filter buttons and search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 rounded-sm border border-charcoal-600 bg-obsidian-950 p-1">
          {(
            [
              { id: "all", label: "All Submissions" },
              { id: "pending", label: "Pending Review" },
              { id: "approved", label: "Approved" },
              { id: "rejected", label: "Rejected" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`cursor-pointer rounded-xs px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === tab.id
                  ? "border border-gold-500/40 bg-charcoal-700 text-gold-400"
                  : "text-graphite-400 hover:text-ivory-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, machine, or email..."
            className="w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-sm border border-charcoal-600 bg-obsidian-900/40">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-charcoal-700 bg-obsidian-950 text-[0.68rem] uppercase tracking-wider text-graphite-400">
            <tr>
              <th className="px-4 py-3">Rider Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Machine</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-700 text-graphite-300">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-graphite-400 italic">
                  No submissions found matching this filter.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id} className="transition-colors hover:bg-obsidian-950/50">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-ivory-100">{sub.display_name}</div>
                    <div className="text-[0.68rem] text-graphite-400">{sub.contact_email || sub.full_name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-xs px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider ${
                        sub.submission_type === "update"
                          ? "border border-blue-500/30 bg-blue-950/40 text-blue-400"
                          : "border border-amber-500/30 bg-amber-950/40 text-amber-400"
                      }`}
                    >
                      {sub.submission_type === "update" ? "Update" : "New Rider"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-ivory-100">{sub.bike_brand} {sub.bike_model}</div>
                    <div className="text-[0.68rem] text-graphite-400">{sub.bike_year}</div>
                  </td>
                  <td className="px-4 py-3 text-graphite-400">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {sub.status === "pending" && (
                      <span className="inline-flex items-center gap-1 rounded-xs border border-amber-500/30 bg-amber-950/30 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-amber-400">
                        ● Pending
                      </span>
                    )}
                    {sub.status === "approved" && (
                      <span className="inline-flex items-center gap-1 rounded-xs border border-green-500/30 bg-green-950/30 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-green-400">
                        ✓ Approved
                      </span>
                    )}
                    {sub.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 rounded-xs border border-red-500/30 bg-red-950/30 px-2 py-0.5 text-[0.62rem] font-medium uppercase tracking-wider text-red-400">
                        ✕ Rejected
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/onboarding/${sub.id}`}
                      className="inline-flex items-center gap-1 rounded-xs border border-charcoal-500 bg-obsidian-950 px-2.5 py-1 text-[0.68rem] uppercase tracking-wider text-gold-400 hover:border-gold-500 hover:bg-gold-500/10"
                    >
                      Review →
                    </Link>
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

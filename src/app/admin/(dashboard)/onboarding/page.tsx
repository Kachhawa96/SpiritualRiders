import Link from "next/link";
import { isOnboardingEnabled, listAdminSubmissions } from "@/lib/db/onboarding";
import { SubmissionTable } from "@/components/admin/SubmissionTable";

export default async function AdminOnboardingPage() {
  const [submissions, portalEnabled] = await Promise.all([
    listAdminSubmissions("all").catch(() => []),
    isOnboardingEnabled().catch(() => false),
  ]);

  const pendingCount = submissions.filter((s) => s.status === "pending").length;
  const approvedCount = submissions.filter((s) => s.status === "approved").length;
  const rejectedCount = submissions.filter((s) => s.status === "rejected").length;

  return (
    <div className="space-y-8">
      {/* Header & Status Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal-700 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ivory-100">
              Rider Profile Submissions
            </h1>
            <span
              className={`rounded-xs px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider ${
                portalEnabled
                  ? "border border-green-500/40 bg-green-950/40 text-green-400"
                  : "border border-charcoal-500 bg-charcoal-800 text-graphite-400"
              }`}
            >
              {portalEnabled ? "● Public Portal Active" : "○ Portal Closed"}
            </span>
          </div>
          <p className="mt-1 text-xs text-graphite-300">
            Review, verify, and approve incoming rider profiles and live updates. Submissions are stored separately and do not alter the public directory until approved.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/settings"
            className="rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-1.5 text-xs uppercase tracking-wider text-graphite-300 hover:text-ivory-100"
          >
            Portal Toggle Settings
          </Link>
          <Link
            href="/onboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-sm border border-gold-500 bg-gold-500/10 px-3 py-1.5 text-xs uppercase tracking-wider text-gold-400 hover:bg-gold-500/20"
          >
            View Public Form ↗
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-4">
          <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
            Pending Review
          </span>
          <div className="mt-1 font-display text-2xl font-bold text-amber-400">
            {pendingCount}
          </div>
        </div>

        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-4">
          <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
            Approved
          </span>
          <div className="mt-1 font-display text-2xl font-bold text-green-400">
            {approvedCount}
          </div>
        </div>

        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-4">
          <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
            Rejected
          </span>
          <div className="mt-1 font-display text-2xl font-bold text-red-400">
            {rejectedCount}
          </div>
        </div>

        <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-4">
          <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
            Total Submissions
          </span>
          <div className="mt-1 font-display text-2xl font-bold text-ivory-100">
            {submissions.length}
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <SubmissionTable initialSubmissions={submissions} />
    </div>
  );
}

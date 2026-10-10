"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { OnboardingSubmissionRecord } from "@/lib/db/onboarding-schema";
import type { AdminRiderRecord } from "@/lib/db/admin-schema";
import {
  approveSubmissionAction,
  rejectSubmissionAction,
} from "@/app/admin/onboarding/actions";
import { formatDeterministicDateTime } from "@/lib/date-utils";
import { useAdminFeedback } from "@/components/admin/AdminFeedbackContext";

interface SubmissionReviewProps {
  submission: OnboardingSubmissionRecord;
  liveRider: AdminRiderRecord | null;
}

export function SubmissionReview({ submission, liveRider }: SubmissionReviewProps) {
  const router = useRouter();
  const { showFeedback } = useAdminFeedback();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  const isUpdate = submission.submission_type === "update" && Boolean(liveRider);

  const handleApprove = () => {
    if (!confirm("Are you sure you want to approve this submission? It will immediately update or create the live public profile.")) {
      return;
    }
    setErrorMessage(null);
    startTransition(async () => {
      const res = await approveSubmissionAction(submission.id);
      if (res.success) {
        setSuccessMessage("Submission approved successfully! Live roster updated.");
        showFeedback({
          type: "success",
          title: "Submission Approved",
          message: `Rider profile for "${submission.display_name}" has been approved and published to the live roster.`,
          scrollToTop: true,
        });
        router.refresh();
      } else {
        const err = res.error || "Approval failed.";
        setErrorMessage(err);
        showFeedback({
          type: "error",
          title: "Approval Failed",
          message: err,
          scrollToTop: true,
        });
      }
    });
  };

  const handleReject = () => {
    setErrorMessage(null);
    startTransition(async () => {
      const res = await rejectSubmissionAction(submission.id, rejectNotes);
      if (res.success) {
        setShowRejectModal(false);
        setSuccessMessage("Submission rejected.");
        showFeedback({
          type: "info",
          title: "Submission Rejected",
          message: `Submission for "${submission.display_name}" has been marked as rejected.`,
          scrollToTop: true,
        });
        router.refresh();
      } else {
        const err = res.error || "Rejection failed.";
        setErrorMessage(err);
        showFeedback({
          type: "error",
          title: "Rejection Failed",
          message: err,
          scrollToTop: true,
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Messages */}
      {errorMessage && (
        <div className="rounded-sm border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-300">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="rounded-sm border border-green-500/40 bg-green-950/40 p-4 text-xs text-green-300">
          <strong>Success:</strong> {successMessage}
        </div>
      )}

      {/* Action Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-xs px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider ${
                submission.status === "pending"
                  ? "border border-amber-500/40 bg-amber-950/40 text-amber-400"
                  : submission.status === "approved"
                  ? "border border-green-500/40 bg-green-950/40 text-green-400"
                  : "border border-red-500/40 bg-red-950/40 text-red-400"
              }`}
            >
              Status: {submission.status.toUpperCase()}
            </span>

            <span
              className={`rounded-xs px-2.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider ${
                isUpdate
                  ? "border border-blue-500/40 bg-blue-950/40 text-blue-400"
                  : "border border-gold-500/40 bg-gold-500/10 text-gold-400"
              }`}
            >
              {isUpdate ? "Profile Update" : "New Rider"}
            </span>
          </div>

          <h2 className="mt-2 font-display text-2xl font-bold text-ivory-100">
            {submission.display_name}
          </h2>
          <p className="text-xs text-graphite-300" suppressHydrationWarning>
            Submitted on {formatDeterministicDateTime(submission.created_at)}
            {submission.contact_email ? ` · Contact: ${submission.contact_email}` : ""}
            {submission.submitter_ip ? ` · IP: ${submission.submitter_ip}` : ""}
          </p>

          {submission.status === "approved" && submission.reviewed_at && (
            <p className="mt-2 text-xs text-green-400" suppressHydrationWarning>
              ✓ Approved by <span className="font-semibold">{submission.reviewer_email || "Admin"}</span> on{" "}
              {formatDeterministicDateTime(submission.reviewed_at)}
            </p>
          )}

          {submission.status === "rejected" && (
            <div className="mt-2 text-xs text-red-400" suppressHydrationWarning>
              ✕ Rejected by <span className="font-semibold">{submission.reviewer_email || "Admin"}</span> on{" "}
              {submission.reviewed_at ? formatDeterministicDateTime(submission.reviewed_at) : "N/A"}
              {submission.reviewer_notes && (
                <div className="mt-1 rounded-sm border border-red-900/50 bg-red-950/30 p-2 text-xs text-red-300">
                  Notes: {submission.reviewer_notes}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {submission.status === "pending" && (
            <>
              <button
                type="button"
                onClick={handleApprove}
                disabled={isPending}
                className="cursor-pointer rounded-sm border border-green-500 bg-green-600 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ivory-100 transition-colors hover:bg-green-500 disabled:opacity-50"
              >
                {isPending ? "Processing..." : "✓ Approve & Publish"}
              </button>
              <button
                type="button"
                onClick={() => setShowRejectModal(true)}
                disabled={isPending}
                className="cursor-pointer rounded-sm border border-red-500 bg-red-950/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-400 transition-colors hover:bg-red-900/50 disabled:opacity-50"
              >
                ✕ Reject
              </button>
            </>
          )}

          {submission.status === "approved" && (
            <Link
              href={`/riders/${submission.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm border border-gold-500 bg-gold-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-400 hover:bg-gold-500/20"
            >
              View Live Profile ↗
            </Link>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="rounded-sm border border-red-500/40 bg-obsidian-950 p-6 shadow-xl space-y-4">
          <h3 className="font-display text-lg font-bold text-red-400">
            Reject Profile Submission
          </h3>
          <p className="text-xs text-graphite-300">
            Provide optional notes explaining why this submission is rejected. The rider will be able to see these notes when checking their tracking status.
          </p>
          <textarea
            rows={3}
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            placeholder="e.g. Please upload higher resolution motorcycle photo..."
            className="w-full rounded-sm border border-charcoal-500 bg-obsidian-900 p-3 text-xs text-ivory-100 focus:border-red-500 focus:outline-none"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowRejectModal(false)}
              className="rounded-sm border border-charcoal-500 px-3 py-1.5 text-xs text-graphite-300 hover:text-ivory-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={isPending}
              className="rounded-sm border border-red-500 bg-red-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-ivory-100 hover:bg-red-500"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE DIFF VIEW (For Existing Rider Updates) */}
      {isUpdate && liveRider ? (
        <div className="space-y-6">
          <div className="border-b border-charcoal-700 pb-2">
            <h3 className="font-display text-xl font-bold text-ivory-100">
              Side-by-Side Review: Live Profile vs. Submitted Changes
            </h3>
            <p className="text-xs text-graphite-400">
              Fields modified in this submission are highlighted in gold.
            </p>
          </div>

          <div className="overflow-x-auto rounded-sm border border-charcoal-600 bg-obsidian-900/40">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-charcoal-700 bg-obsidian-950 text-[0.68rem] uppercase tracking-wider text-graphite-400">
                <tr>
                  <th className="w-1/4 px-4 py-3">Profile Attribute</th>
                  <th className="w-3/8 px-4 py-3 text-graphite-300">Current Live Value</th>
                  <th className="w-3/8 px-4 py-3 text-gold-400">Submitted New Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-700">
                {[
                  { label: "Display Name", live: liveRider.display_name, sub: submission.display_name },
                  { label: "Full Legal Name", live: liveRider.full_name, sub: submission.full_name },
                  { label: "Slug", live: liveRider.slug, sub: submission.slug },
                  { label: "Position", live: liveRider.community_position, sub: submission.community_position },
                  { label: "Bike Brand", live: liveRider.bike_brand, sub: submission.bike_brand },
                  { label: "Bike Model", live: liveRider.bike_model, sub: submission.bike_model },
                  { label: "Bike Variant", live: liveRider.bike_variant || "—", sub: submission.bike_variant || "—" },
                  { label: "Bike Year", live: liveRider.bike_year, sub: submission.bike_year },
                  { label: "Bike Color", live: liveRider.bike_color || "—", sub: submission.bike_color || "—" },
                  { label: "City", live: liveRider.city || "—", sub: submission.city || "—" },
                  { label: "Date of Birth", live: liveRider.date_of_birth || "—", sub: submission.date_of_birth || "—" },
                  { label: "Age", live: liveRider.age ?? "—", sub: submission.age ?? "—" },
                  { label: "Blood Group", live: liveRider.blood_group || "—", sub: submission.blood_group || "—" },

                  { label: "Riding Since", live: liveRider.riding_since ?? "—", sub: submission.riding_since ?? "—" },
                  { label: "Favorite Route", live: liveRider.favorite_route || "—", sub: submission.favorite_route || "—" },
                  {
                    label: "Riding Styles",
                    live: (liveRider.riding_style || []).join(", ") || "—",
                    sub: (submission.riding_style || []).join(", ") || "—",
                  },
                  {
                    label: "Achievements",
                    live: (liveRider.achievements || []).join(" | ") || "—",
                    sub: (submission.achievements || []).join(" | ") || "—",
                  },
                  { label: "Short Bio", live: liveRider.short_bio, sub: submission.short_bio },
                  { label: "Full Bio", live: liveRider.bio, sub: submission.bio },
                  { label: "Instagram", live: liveRider.instagram_url || "—", sub: submission.instagram_url || "—" },
                  { label: "Facebook", live: liveRider.facebook_url || "—", sub: submission.facebook_url || "—" },
                  { label: "YouTube", live: liveRider.youtube_url || "—", sub: submission.youtube_url || "—" },
                  {
                    label: "Show Age",
                    live: liveRider.show_age ? "Yes (Public)" : "No (Masked)",
                    sub: submission.show_age ? "Yes (Public)" : "No (Masked)",
                  },
                  {
                    label: "Show Blood Group",
                    live: liveRider.show_blood_group ? "Yes (Public)" : "No (Masked)",
                    sub: submission.show_blood_group ? "Yes (Public)" : "No (Masked)",
                  },
                  {
                    label: "Show City",
                    live: liveRider.show_city ? "Yes (Public)" : "No (Masked)",
                    sub: submission.show_city ? "Yes (Public)" : "No (Masked)",
                  },
                  {
                    label: "Show Social Links",
                    live: liveRider.show_social_links ? "Yes (Public)" : "No (Masked)",
                    sub: submission.show_social_links ? "Yes (Public)" : "No (Masked)",
                  },
                ].map((row) => {
                  const isModified = String(row.live) !== String(row.sub);
                  return (
                    <tr
                      key={row.label}
                      className={isModified ? "bg-gold-500/5 transition-colors" : "transition-colors"}
                    >
                      <td className="px-4 py-3 font-semibold text-graphite-300">
                        {row.label}
                        {isModified && (
                          <span className="ml-2 rounded-xs bg-gold-500/20 px-1.5 py-0.5 text-[0.62rem] font-bold text-gold-400 uppercase">
                            Modified
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-graphite-400 break-words">{String(row.live)}</td>
                      <td
                        className={`px-4 py-3 break-words ${
                          isModified ? "font-semibold text-gold-300" : "text-graphite-300"
                        }`}
                      >
                        {String(row.sub)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Photos Comparison */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4 space-y-2">
              <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
                Profile Portrait
              </span>
              {submission.profile_image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={submission.profile_image_url}
                  alt="Submitted Portrait"
                  className="aspect-square w-full rounded-sm object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded-sm bg-obsidian-900 flex items-center justify-center text-xs text-graphite-500">
                  No image
                </div>
              )}
            </div>

            <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4 space-y-2">
              <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
                Motorcycle Photo
              </span>
              {submission.bike_image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={submission.bike_image_url}
                  alt="Submitted Motorcycle"
                  className="aspect-square w-full rounded-sm object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded-sm bg-obsidian-900 flex items-center justify-center text-xs text-graphite-500">
                  No image
                </div>
              )}
            </div>

            <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4 space-y-2">
              <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
                Cover / Header Banner
              </span>
              {submission.cover_image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={submission.cover_image_url}
                  alt="Submitted Cover"
                  className="aspect-square w-full rounded-sm object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded-sm bg-obsidian-900 flex items-center justify-center text-xs text-graphite-500">
                  No image
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* FULL PREVIEW FOR NEW RIDER SUBMISSION */
        <div className="space-y-6">
          <div className="border-b border-charcoal-700 pb-2">
            <h3 className="font-display text-xl font-bold text-ivory-100">
              New Rider Enlistment Specifications
            </h3>
            <p className="text-xs text-graphite-400">
              Review all details before publishing this rider to the live brotherhood directory.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Machine & Telemetry */}
            <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6 space-y-4">
              <h4 className="font-display text-base font-bold text-gold-400 border-b border-charcoal-700 pb-2">
                Motorcycle Specification
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-graphite-400">Brand:</span>
                  <p className="font-semibold text-ivory-100">{submission.bike_brand}</p>
                </div>
                <div>
                  <span className="text-graphite-400">Model:</span>
                  <p className="font-semibold text-ivory-100">{submission.bike_model}</p>
                </div>
                <div>
                  <span className="text-graphite-400">Variant:</span>
                  <p className="text-ivory-100">{submission.bike_variant || "—"}</p>
                </div>
                <div>
                  <span className="text-graphite-400">Year:</span>
                  <p className="text-ivory-100">{submission.bike_year}</p>
                </div>
                <div>
                  <span className="text-graphite-400">Color:</span>
                  <p className="text-ivory-100">{submission.bike_color || "—"}</p>
                </div>
                <div>
                  <span className="text-graphite-400">Riding Since:</span>
                  <p className="text-ivory-100">{submission.riding_since || "—"}</p>
                </div>
              </div>

              <div>
                <span className="text-xs text-graphite-400">Riding Styles:</span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {submission.riding_style.map((style) => (
                    <span
                      key={style}
                      className="rounded-xs border border-charcoal-600 bg-obsidian-950 px-2 py-0.5 text-[0.62rem] uppercase tracking-wider text-gold-400"
                    >
                      {style}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs text-graphite-400">Favorite Route:</span>
                <p className="text-xs text-ivory-100">{submission.favorite_route || "—"}</p>
              </div>
            </div>

            {/* Personal Details & Privacy */}
            <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6 space-y-4">
              <h4 className="font-display text-base font-bold text-gold-400 border-b border-charcoal-700 pb-2">
                Personal Identity & Privacy
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-graphite-400">City / Base:</span>
                  <p className="font-semibold text-ivory-100">
                    {submission.city || "—"}{" "}
                    <span className="text-[0.65rem] text-graphite-400">
                      ({submission.show_city ? "Public" : "Hidden"})
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-graphite-400">Date of Birth:</span>
                  <p className="font-semibold text-ivory-100">
                    {submission.date_of_birth || "—"}
                  </p>
                </div>
                <div>
                  <span className="text-graphite-400">Age:</span>
                  <p className="text-ivory-100">
                    {submission.age || "—"}{" "}
                    <span className="text-[0.65rem] text-graphite-400">
                      ({submission.show_age ? "Public" : "Hidden"})
                    </span>
                  </p>
                </div>

                <div>
                  <span className="text-graphite-400">Blood Group:</span>
                  <p className="text-ivory-100">
                    {submission.blood_group || "—"}{" "}
                    <span className="text-[0.65rem] text-graphite-400">
                      ({submission.show_blood_group ? "Public" : "Hidden"})
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-graphite-400">Social Links:</span>
                  <p className="text-ivory-100">
                    {submission.show_social_links ? "Publicly Visible" : "Masked"}
                  </p>
                </div>
                <div>
                  <span className="text-graphite-400">Contact Email:</span>
                  <p className="text-ivory-100 font-mono text-[0.68rem]">{submission.contact_email || "—"}</p>
                </div>
                <div>
                  <span className="text-graphite-400">Phone:</span>
                  <p className="text-ivory-100 font-mono text-[0.68rem]">{submission.contact_phone || "—"}</p>
                </div>
              </div>

              <div>
                <span className="text-xs text-graphite-400">URL Slug:</span>
                <p className="text-xs font-mono text-gold-400">/riders/{submission.slug}</p>
              </div>
            </div>
          </div>

          {/* Narrative & Bio */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6 space-y-4">
            <h4 className="font-display text-base font-bold text-gold-400 border-b border-charcoal-700 pb-2">
              Editorial Narrative
            </h4>
            <div>
              <span className="text-xs uppercase tracking-wider text-graphite-400">
                Short Bio (Card Preview):
              </span>
              <p className="mt-1 text-xs text-ivory-100 italic">{submission.short_bio}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-graphite-400">
                Full Biography:
              </span>
              <p className="mt-1 text-xs text-graphite-300 leading-relaxed whitespace-pre-wrap">
                {submission.bio}
              </p>
            </div>
            {submission.achievements.length > 0 && (
              <div>
                <span className="text-xs uppercase tracking-wider text-graphite-400">
                  Achievements:
                </span>
                <ul className="mt-1 list-disc list-inside text-xs text-graphite-300">
                  {submission.achievements.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Imagery Previews */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4 space-y-2">
              <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
                Portrait Photo
              </span>
              {submission.profile_image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={submission.profile_image_url}
                  alt="Submitted Portrait"
                  className="aspect-square w-full rounded-sm object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded-sm bg-obsidian-900 flex items-center justify-center text-xs text-graphite-500">
                  No portrait uploaded
                </div>
              )}
            </div>

            <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4 space-y-2">
              <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
                Motorcycle Photo
              </span>
              {submission.bike_image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={submission.bike_image_url}
                  alt="Submitted Motorcycle"
                  className="aspect-square w-full rounded-sm object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded-sm bg-obsidian-900 flex items-center justify-center text-xs text-graphite-500">
                  No bike image uploaded
                </div>
              )}
            </div>

            <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4 space-y-2">
              <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
                Cover / Header Banner
              </span>
              {submission.cover_image_url ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={submission.cover_image_url}
                  alt="Submitted Cover"
                  className="aspect-square w-full rounded-sm object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded-sm bg-obsidian-900 flex items-center justify-center text-xs text-graphite-500">
                  No cover uploaded
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

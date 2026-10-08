"use client";

import { useState, useTransition, useId } from "react";
import Link from "next/link";
import {
  submitOnboardingAction,
  checkSubmissionStatusAction,
  searchExistingRidersAction,
  getExistingRiderPrefillAction,
} from "@/app/onboard/actions";
import { slugify } from "@/lib/db/onboarding-schema";
import type { AdminRiderRecord } from "@/lib/db/admin-schema";


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

type OnboardingTab = "new" | "update" | "status";

export function OnboardingClient() {
  const [activeTab, setActiveTab] = useState<OnboardingTab>("new");
  const [isPending, startTransition] = useTransition();

  // Form states
  const [displayName, setDisplayName] = useState("");
  const [autoSlug, setAutoSlug] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [linkedRider, setLinkedRider] = useState<AdminRiderRecord | null>(null);

  // Messages & status states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    submissionId: string;
    slug: string;
  } | null>(null);

  // Search states for existing riders
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; display_name: string; slug: string; bike: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  // Status lookup state
  const [statusIdInput, setStatusIdInput] = useState("");
  const [statusResult, setStatusResult] = useState<{
    id: string;
    display_name: string;
    submission_type: string;
    status: "pending" | "approved" | "rejected";
    submitted_at: string;
    reviewed_at: string | null;
    reviewer_notes: string | null;
    slug: string;
  } | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const honeypotId = useId();

  // Handle Display Name change -> auto-generate slug
  const handleDisplayNameChange = (val: string) => {
    setDisplayName(val);
    if (!linkedRider) {
      setAutoSlug(slugify(val));
    }
  };

  const handleToggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  // Search existing riders
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setErrorMessage(null);

    const res = await searchExistingRidersAction(searchQuery);
    setIsSearching(false);
    if (res.success && res.results) {
      setSearchResults(res.results);
      if (res.results.length === 0) {
        setErrorMessage("No active riders found matching your query.");
      }
    } else {
      setErrorMessage(res.error || "Search failed.");
    }
  };

  // Select existing rider to prefill
  const handleSelectRider = async (riderId: string) => {
    setErrorMessage(null);
    setIsSearching(true);
    const res = await getExistingRiderPrefillAction(riderId);
    setIsSearching(false);

    if (res.success && res.rider) {
      setLinkedRider(res.rider);
      setDisplayName(res.rider.display_name);
      setAutoSlug(res.rider.slug);
      setSelectedStyles(res.rider.riding_style || []);
      setSearchResults([]);
    } else {
      setErrorMessage(res.error || "Failed to load rider details.");
    }
  };

  // Check submission status
  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusIdInput.trim()) return;
    setStatusError(null);
    setStatusResult(null);

    startTransition(async () => {
      const res = await checkSubmissionStatusAction(statusIdInput);
      if (res.success && res.data) {
        setStatusResult(res.data as typeof statusResult);
      } else {
        setStatusError(res.error || "Submission record not found.");
      }
    });
  };

  // Submit form (New or Update)
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Append auto-derived slug
    formData.set("slug", autoSlug || slugify(displayName));

    // Append riding styles
    formData.delete("riding_style");
    selectedStyles.forEach((s) => formData.append("riding_style", s));

    // Append rider_id if in update mode
    if (linkedRider?.id) {
      formData.set("rider_id", linkedRider.id);
    }

    startTransition(async () => {
      const res = await submitOnboardingAction(formData);
      if (res.success && res.submissionId) {
        setSubmissionSuccess({
          submissionId: res.submissionId,
          slug: res.slug || autoSlug,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMessage(res.error || "Failed to submit profile. Please review fields.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Editorial Header */}
      <div className="mb-10 text-center">
        <span className="rounded-xs border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-gold-400">
          Brotherhood Enlistment
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ivory-100 sm:text-5xl">
          Rider Profile Onboarding
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-graphite-300">
          Submit your machine and riding profile to join our active brotherhood roster or update your existing profile.
        </p>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="mb-8 flex rounded-sm border border-charcoal-600 bg-obsidian-950 p-1 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setActiveTab("new");
            setLinkedRider(null);
            setDisplayName("");
            setAutoSlug("");
            setSubmissionSuccess(null);
            setErrorMessage(null);
          }}
          className={`flex-1 rounded-xs py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
            activeTab === "new"
              ? "border border-gold-500/40 bg-charcoal-700 text-gold-400 shadow-sm"
              : "text-graphite-400 hover:text-ivory-100"
          }`}
        >
          1. New Rider
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("update");
            setSubmissionSuccess(null);
            setErrorMessage(null);
          }}
          className={`flex-1 rounded-xs py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
            activeTab === "update"
              ? "border border-gold-500/40 bg-charcoal-700 text-gold-400 shadow-sm"
              : "text-graphite-400 hover:text-ivory-100"
          }`}
        >
          2. Update Profile
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("status");
            setSubmissionSuccess(null);
            setErrorMessage(null);
          }}
          className={`flex-1 rounded-xs py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
            activeTab === "status"
              ? "border border-gold-500/40 bg-charcoal-700 text-gold-400 shadow-sm"
              : "text-graphite-400 hover:text-ivory-100"
          }`}
        >
          3. Check Status
        </button>
      </div>

      {/* Success Notification Box */}
      {submissionSuccess && (
        <div className="mb-8 rounded-sm border border-gold-500/50 bg-obsidian-900/90 p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-500 bg-gold-500/10 text-lg text-gold-400">
              ✓
            </span>
            <div className="space-y-2">
              <h3 className="font-display text-xl font-bold text-ivory-100">
                Profile Submission Received
              </h3>
              <p className="text-xs text-graphite-300">
                Your profile has been submitted and is awaiting admin approval. The live public directory will automatically update once an administrator reviews and approves it.
              </p>
              <div className="mt-4 rounded-sm border border-charcoal-600 bg-obsidian-950 p-3">
                <span className="block text-[0.65rem] uppercase tracking-wider text-graphite-400">
                  Your Reference Tracking ID:
                </span>
                <code className="mt-1 block font-mono text-xs font-semibold text-gold-400 select-all">
                  {submissionSuccess.submissionId}
                </code>
              </div>
              <p className="text-[0.7rem] text-graphite-400">
                Save this tracking ID to check your review status anytime under the &ldquo;Check Status&rdquo; tab above.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionSuccess(null);
                    setDisplayName("");
                    setAutoSlug("");
                    setLinkedRider(null);
                  }}
                  className="cursor-pointer text-xs uppercase tracking-wider text-gold-400 hover:underline"
                >
                  Submit another profile →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mb-6 rounded-sm border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-300">
          <strong>Notice:</strong> {errorMessage}
        </div>
      )}

      {/* TAB 3: CHECK SUBMISSION STATUS */}
      {activeTab === "status" && (
        <div className="space-y-6 rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6 sm:p-8">
          <div>
            <h2 className="font-display text-xl font-bold text-ivory-100">
              Track Submission Status
            </h2>
            <p className="mt-1 text-xs text-graphite-300">
              Enter your Reference Tracking ID to check whether your profile submission is pending, approved, or requires changes.
            </p>
          </div>

          <form onSubmit={handleCheckStatus} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              required
              value={statusIdInput}
              onChange={(e) => setStatusIdInput(e.target.value)}
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              className="flex-1 rounded-sm border border-charcoal-500 bg-obsidian-950 px-3.5 py-2.5 font-mono text-xs text-ivory-100 placeholder:font-sans placeholder:text-graphite-400 focus:border-gold-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-sm border border-gold-500 bg-gold-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400 disabled:opacity-50"
            >
              {isPending ? "Checking..." : "Check Status"}
            </button>
          </form>

          {statusError && (
            <div className="rounded-sm border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-300">
              {statusError}
            </div>
          )}

          {statusResult && (
            <div className="mt-6 rounded-sm border border-charcoal-600 bg-obsidian-950 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-charcoal-700 pb-3">
                <div>
                  <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
                    Rider Identity
                  </span>
                  <h3 className="font-display text-lg font-bold text-ivory-100">
                    {statusResult.display_name}
                  </h3>
                </div>
                <div>
                  {statusResult.status === "pending" && (
                    <span className="inline-flex items-center gap-1.5 rounded-xs border border-amber-500/40 bg-amber-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
                      🟡 Pending Admin Review
                    </span>
                  )}
                  {statusResult.status === "approved" && (
                    <span className="inline-flex items-center gap-1.5 rounded-xs border border-green-500/40 bg-green-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green-400">
                      🟢 Approved & Live
                    </span>
                  )}
                  {statusResult.status === "rejected" && (
                    <span className="inline-flex items-center gap-1.5 rounded-xs border border-red-500/40 bg-red-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-red-400">
                      🔴 Rejected
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <span className="text-graphite-400">Submission Type:</span>{" "}
                  <span className="font-semibold uppercase tracking-wider text-ivory-100">
                    {statusResult.submission_type === "update" ? "Profile Update" : "New Enlistment"}
                  </span>
                </div>
                <div>
                  <span className="text-graphite-400">Submitted On:</span>{" "}
                  <span className="text-ivory-100">
                    {new Date(statusResult.submitted_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {statusResult.status === "approved" && (
                <div className="pt-2">
                  <Link
                    href={`/riders/${statusResult.slug}`}
                    className="inline-flex items-center gap-2 rounded-sm border border-gold-500 bg-gold-500 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400"
                  >
                    View Public Live Profile →
                  </Link>
                </div>
              )}

              {statusResult.status === "rejected" && statusResult.reviewer_notes && (
                <div className="rounded-sm border border-charcoal-700 bg-obsidian-900 p-4">
                  <span className="block text-[0.68rem] uppercase tracking-wider text-red-400">
                    Reviewer Notes / Feedback:
                  </span>
                  <p className="mt-1 text-xs text-graphite-300">
                    {statusResult.reviewer_notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EXISTING RIDER SEARCH SELECTOR */}
      {activeTab === "update" && !linkedRider && (
        <div className="mb-8 space-y-6 rounded-sm border border-gold-500/30 bg-obsidian-900/40 p-6 sm:p-8">
          <div>
            <span className="rounded-xs bg-gold-500/10 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wider text-gold-400">
              Existing Member Profile
            </span>
            <h2 className="mt-2 font-display text-xl font-bold text-ivory-100">
              Search Your Live Profile
            </h2>
            <p className="mt-1 text-xs text-graphite-300">
              Enter your name or bike model to find your profile and pre-fill the form with your current live records.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Vikram Rathore or Continental GT"
              className="flex-1 rounded-sm border border-charcoal-500 bg-obsidian-950 px-3.5 py-2.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="cursor-pointer rounded-sm border border-gold-500 bg-gold-500 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400 disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search Profile"}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
                Found Matching Profiles ({searchResults.length}):
              </span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {searchResults.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-sm border border-charcoal-600 bg-obsidian-950 p-4 transition-colors hover:border-gold-500/50"
                  >
                    <div>
                      <h4 className="font-display text-base font-bold text-ivory-100">
                        {r.display_name}
                      </h4>
                      <p className="text-xs text-gold-400/80">{r.bike}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectRider(r.id)}
                      className="cursor-pointer rounded-xs border border-charcoal-500 bg-charcoal-800 px-3 py-1.5 text-xs uppercase tracking-wider text-ivory-100 hover:border-gold-500 hover:bg-gold-500/10 hover:text-gold-400"
                    >
                      Select & Update
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FORM: NEW RIDER OR EXISTING RIDER UPDATE */}
      {(activeTab === "new" || (activeTab === "update" && linkedRider)) && (
        <form onSubmit={handleSubmitForm} className="space-y-8">
          {/* Honeypot anti-spam trap */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor={honeypotId}>Website (leave blank)</label>
            <input
              id={honeypotId}
              type="text"
              name="hp_website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Active Mode Banner */}
          {linkedRider ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-gold-500/40 bg-gold-500/10 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 text-xs font-bold text-obsidian-950">
                  ✎
                </span>
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gold-400">
                    Updating Existing Rider Record
                  </span>
                  <h3 className="font-display text-base font-bold text-ivory-100">
                    {linkedRider.display_name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLinkedRider(null)}
                className="cursor-pointer text-xs text-graphite-300 hover:text-ivory-100 hover:underline"
              >
                ✕ Change selected rider
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-sm border border-charcoal-600 bg-obsidian-950/60 p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500/10 text-xs font-bold text-gold-400">
                +
              </span>
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-graphite-400">
                  Mode
                </span>
                <p className="text-xs text-graphite-300">
                  New Rider Enlistment — Complete your profile to submit for brotherhood review.
                </p>
              </div>
            </div>
          )}

          {/* 1. Identity Section */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
            <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
              1. Community Identity
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Display Name (Road Name) *
                </label>
                <input
                  name="display_name"
                  required
                  value={displayName}
                  onChange={(e) => handleDisplayNameChange(e.target.value)}
                  placeholder="e.g. Vikram Rathore"
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                />
                {autoSlug && (
                  <p className="mt-1 text-[0.68rem] text-gold-400 font-mono">
                    Public Profile URL: /riders/{autoSlug}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Full Legal Name *
                </label>
                <input
                  name="full_name"
                  required
                  defaultValue={linkedRider?.full_name ?? ""}
                  placeholder="e.g. Vikram Singh Rathore"
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                />
                <p className="mt-1 text-[0.68rem] text-graphite-400">
                  Kept private from public view for official administrative records.
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Community Position
                </label>
                <select
                  name="community_position"
                  defaultValue={linkedRider?.community_position ?? "member"}
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
                  Date Joined
                </label>
                <input
                  name="joined_date"
                  type="date"
                  defaultValue={
                    linkedRider?.joined_date
                      ? linkedRider.joined_date.slice(0, 10)
                      : new Date().toISOString().slice(0, 10)
                  }
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Machine Specification */}
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
                  defaultValue={linkedRider?.bike_brand ?? ""}
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
                  defaultValue={linkedRider?.bike_model ?? ""}
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
                  defaultValue={linkedRider?.bike_variant ?? ""}
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
                  defaultValue={linkedRider?.bike_year ?? 2022}
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Bike Color / Livery
                </label>
                <input
                  name="bike_color"
                  defaultValue={linkedRider?.bike_color ?? ""}
                  placeholder="e.g. British Racing Green"
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
                Privacy Protected
              </span>
            </div>
            <p className="mt-2 text-xs text-graphite-300">
              Check the boxes below to choose what is publicly shown versus kept private.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* City */}
              <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  City / Base
                </label>
                <input
                  name="city"
                  defaultValue={linkedRider?.city ?? ""}
                  placeholder="e.g. Jaipur"
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                />
                <label className="mt-3 flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="show_city"
                    defaultChecked={linkedRider?.show_city ?? true}
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
                  defaultValue={linkedRider?.age ?? ""}
                  placeholder="e.g. 32"
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                />
                <label className="mt-3 flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="show_age"
                    defaultChecked={linkedRider?.show_age ?? false}
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
                  Blood Group (Crucial for ride emergency telemetry)
                </label>
                <select
                  name="blood_group"
                  defaultValue={linkedRider?.blood_group ?? ""}
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
                    defaultChecked={linkedRider?.show_blood_group ?? false}
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
                  Controls whether Instagram, Facebook, and personal links are shown publicly.
                </p>
                <label className="mt-4 flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="show_social_links"
                    defaultChecked={linkedRider?.show_social_links ?? true}
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
                  defaultValue={linkedRider?.instagram_url ?? ""}
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
                  defaultValue={linkedRider?.facebook_url ?? ""}
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
                  defaultValue={linkedRider?.youtube_url ?? ""}
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
                  defaultValue={linkedRider?.website_url ?? ""}
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
                    defaultValue={linkedRider?.riding_since ?? ""}
                    placeholder="e.g. 2012"
                    className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-graphite-300">
                    Favorite Route / Road
                  </label>
                  <input
                    name="favorite_route"
                    defaultValue={linkedRider?.favorite_route ?? ""}
                    placeholder="e.g. Jaipur to Mount Abu via Udaipur"
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
                  defaultValue={linkedRider?.achievements?.join("\n") ?? ""}
                  placeholder={"Completed 1,000km Dawn Patrol\nLed Rajasthan Desert Expedition"}
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
                  defaultValue={linkedRider?.short_bio ?? ""}
                  placeholder="Passionate long-distance tourer and backbone of the weekend patrol."
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
                  rows={4}
                  defaultValue={linkedRider?.bio ?? ""}
                  placeholder="Tell your riding story, philosophy, and journey with Spiritual Riders..."
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
              Upload photos directly (max 5MB) or provide image URLs.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Profile Image */}
              <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Portrait Photo
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
                    defaultValue={linkedRider?.profile_image_url ?? ""}
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
                    defaultValue={linkedRider?.bike_image_url ?? ""}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-2 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Cover / Banner
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
                    defaultValue={linkedRider?.cover_image_url ?? ""}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-sm border border-charcoal-500 bg-obsidian-900 px-2 py-1.5 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 7. Contact Information for Administrative Review */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
            <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
              7. Contact Information (For Admin Review Verification)
            </h2>
            <p className="mt-1 text-xs text-graphite-300">
              Used strictly by leadership to verify membership. Never shown publicly.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Contact Email *
                </label>
                <input
                  name="contact_email"
                  type="email"
                  required
                  placeholder="rider@example.com"
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Phone Number
                </label>
                <input
                  name="contact_phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-charcoal-700 pt-6">
            <p className="text-[0.7rem] text-graphite-400">
              Submissions undergo administrative approval before being reflected publicly.
            </p>
            <button
              type="submit"
              disabled={isPending}
              className="cursor-pointer rounded-sm border border-gold-500 bg-gold-500 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400 disabled:opacity-50"
            >
              {isPending
                ? "Submitting Profile..."
                : linkedRider
                ? "Submit Profile Update"
                : "Submit for Approval"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

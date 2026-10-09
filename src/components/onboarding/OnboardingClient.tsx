"use client";

import { useState, useTransition, useId, useRef } from "react";
import {
  submitOnboardingAction,
  searchExistingRidersAction,
  getExistingRiderPrefillAction,
} from "@/app/onboard/actions";
import { slugify } from "@/lib/db/onboarding-schema";
import { calculateAgeFromDob } from "@/lib/date-utils";
import { DatePicker } from "@/components/ui/DatePicker";
import { ErrorModal } from "@/components/ui/ErrorModal";
import { SubmissionSuccessModal } from "@/components/ui/SubmissionSuccessModal";
import type { AdminRiderRecord } from "@/lib/db/admin-schema";

const POSITIONS = [
  { value: "member", label: "Member (Default)" },
  { value: "prospect", label: "Prospect" },
  { value: "founder", label: "Founder" },
  { value: "co-founder", label: "Co-Founder" },
  { value: "president", label: "President" },
  { value: "vice-president", label: "Vice-President" },
  { value: "captain", label: "Captain" },
  { value: "co-captain", label: "Co-Captain" },
  { value: "secretary", label: "Secretary" },
  { value: "treasurer", label: "Treasurer" },
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
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

type OnboardingTab = "new" | "update";

interface FileState {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
  sizeFormatted: string | null;
}

export function OnboardingClient() {
  const [activeTab, setActiveTab] = useState<OnboardingTab>("new");
  const [isPending, startTransition] = useTransition();

  // Form identity states
  const [displayName, setDisplayName] = useState("");
  const [autoSlug, setAutoSlug] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [linkedRider, setLinkedRider] = useState<AdminRiderRecord | null>(null);

  // Date and calculated age states
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [joinedDate, setJoinedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // Community position state - default is "member"
  const [communityPosition, setCommunityPosition] = useState<string>("member");

  // File upload states with 5MB validation
  const [profileFileState, setProfileFileState] = useState<FileState>({
    file: null,
    previewUrl: null,
    error: null,
    sizeFormatted: null,
  });
  const [bikeFileState, setBikeFileState] = useState<FileState>({
    file: null,
    previewUrl: null,
    error: null,
    sizeFormatted: null,
  });
  const [coverFileState, setCoverFileState] = useState<FileState>({
    file: null,
    previewUrl: null,
    error: null,
    sizeFormatted: null,
  });

  // Modal error state & scroll targeting
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [firstInvalidFieldId, setFirstInvalidFieldId] = useState<string | null>(null);

  // Submission result & modal states
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isEditingSubmitted, setIsEditingSubmitted] = useState(false);
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

  const formRef = useRef<HTMLFormElement>(null);
  const honeypotId = useId();

  // Date of Birth change handler -> dynamically calculates age in real time
  const handleDobChange = (dob: string) => {
    setDateOfBirth(dob);
    const age = calculateAgeFromDob(dob);
    setCalculatedAge(age);
  };

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

  // File selection validator: checks 5MB limit immediately
  const handleFileSelection = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<FileState>>,
    fileCategoryName: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      setter({ file: null, previewUrl: null, error: null, sizeFormatted: null });
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

    if (file.size > MAX_FILE_SIZE_BYTES) {
      e.target.value = "";
      setter({
        file: null,
        previewUrl: null,
        error: `Selected ${fileCategoryName} (${sizeMb} MB) exceeds the 5MB maximum limit. Please choose a smaller photo.`,
        sizeFormatted: null,
      });
      // Show pop-up immediately so user never misses it
      setValidationErrors([
        `${fileCategoryName} (${file.name}): File size is ${sizeMb} MB. Maximum allowed upload size is 5.0 MB.`,
      ]);
      setFirstInvalidFieldId(`card-${fileCategoryName.toLowerCase().replace(/\s+/g, "-")}`);
      setIsErrorModalOpen(true);
      return;
    }

    setter({
      file,
      previewUrl: URL.createObjectURL(file),
      error: null,
      sizeFormatted: `${sizeMb} MB`,
    });
  };

  // Search existing riders
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setValidationErrors([]);

    const res = await searchExistingRidersAction(searchQuery);
    setIsSearching(false);
    if (res.success && res.results) {
      setSearchResults(res.results);
      if (res.results.length === 0) {
        setValidationErrors(["No active riders found matching your search."]);
        setIsErrorModalOpen(true);
      }
    } else {
      setValidationErrors([res.error || "Search failed."]);
      setIsErrorModalOpen(true);
    }
  };

  // Select existing rider to prefill
  const handleSelectRider = async (riderId: string) => {
    setIsSearching(true);
    const res = await getExistingRiderPrefillAction(riderId);
    setIsSearching(false);

    if (res.success && res.rider) {
      setLinkedRider(res.rider);
      setDisplayName(res.rider.display_name);
      setAutoSlug(res.rider.slug);
      setSelectedStyles(res.rider.riding_style || []);
      setCommunityPosition(res.rider.community_position || "member");
      setJoinedDate(res.rider.joined_date ? res.rider.joined_date.slice(0, 10) : "");
      if (res.rider.date_of_birth) {
        setDateOfBirth(res.rider.date_of_birth);
        setCalculatedAge(calculateAgeFromDob(res.rider.date_of_birth));
      } else if (res.rider.age) {
        setCalculatedAge(res.rider.age);
      }
      setSearchResults([]);
    } else {
      setValidationErrors([res.error || "Failed to load rider details."]);
      setIsErrorModalOpen(true);
    }
  };

  // When user clicks "Review & Fix Fields" on the modal
  const handleReviewAndFix = () => {
    setIsErrorModalOpen(false);
    if (!firstInvalidFieldId) return;

    // Small delay to let modal exit DOM
    setTimeout(() => {
      const el = document.getElementById(firstInvalidFieldId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });

        // Add highlight styling for 3 seconds
        el.classList.add("ring-2", "ring-gold-500", "animate-pulse");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-gold-500", "animate-pulse");
        }, 3000);

        // If focusable, focus it
        if ("focus" in el) {
          (el as HTMLElement).focus();
        }
      }
    }, 100);
  };

  // Action 1: Edit application -> keeps all form data, closes modal, scrolls to form
  const handleEditApplication = () => {
    setIsSuccessModalOpen(false);
    setIsEditingSubmitted(true);
    setTimeout(() => {
      const el = document.getElementById("field-display_name");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        if ("focus" in el) (el as HTMLElement).focus();
      }
    }, 120);
  };

  // Action 2: Submit another profile -> clears all inputs and states for fresh start
  const handleSubmitAnother = () => {
    setIsSuccessModalOpen(false);
    setSubmissionSuccess(null);
    setIsEditingSubmitted(false);

    if (formRef.current) {
      formRef.current.reset();
    }
    setDisplayName("");
    setAutoSlug("");
    setDateOfBirth("");
    setCalculatedAge(null);
    setCommunityPosition("member");
    setJoinedDate(new Date().toISOString().slice(0, 10));
    setLinkedRider(null);
    setSelectedStyles([]);
    setProfileFileState({ file: null, previewUrl: null, error: null, sizeFormatted: null });
    setBikeFileState({ file: null, previewUrl: null, error: null, sizeFormatted: null });
    setCoverFileState({ file: null, previewUrl: null, error: null, sizeFormatted: null });
    setActiveTab("new");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Action 3: Close the pop-up (Dismiss)
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  // Client-Side Validation before Server Action
  const validateFormClientSide = (form: HTMLFormElement): { valid: boolean; errors: string[]; firstId: string | null } => {
    const errors: string[] = [];
    let firstId: string | null = null;

    const setErr = (msg: string, id: string) => {
      errors.push(msg);
      if (!firstId) firstId = id;
    };

    const dName = (form.elements.namedItem("display_name") as HTMLInputElement)?.value?.trim();
    if (!dName || dName.length < 2) {
      setErr("Display Name (Road Name) is required (at least 2 characters).", "field-display_name");
    }

    const fName = (form.elements.namedItem("full_name") as HTMLInputElement)?.value?.trim();
    if (!fName || fName.length < 2) {
      setErr("Full Legal Name is required.", "field-full_name");
    }

    if (!dateOfBirth) {
      setErr("Date of Birth is required to verify rider eligibility and telemetry.", "field-date_of_birth");
    } else if (calculatedAge !== null && calculatedAge < 16) {
      setErr(`Riders must be at least 16 years old to register (Calculated age: ${calculatedAge}).`, "field-date_of_birth");
    }

    if (!joinedDate) {
      setErr("Date Joined is required.", "field-joined_date");
    }

    const bikeBrand = (form.elements.namedItem("bike_brand") as HTMLInputElement)?.value?.trim();
    if (!bikeBrand) {
      setErr("Motorcycle Brand is required (e.g. Royal Enfield, Triumph).", "field-bike_brand");
    }

    const bikeModel = (form.elements.namedItem("bike_model") as HTMLInputElement)?.value?.trim();
    if (!bikeModel) {
      setErr("Motorcycle Model is required (e.g. Continental GT, Tiger 900).", "field-bike_model");
    }

    const bikeYear = Number((form.elements.namedItem("bike_year") as HTMLInputElement)?.value);
    if (!bikeYear || bikeYear < 1950 || bikeYear > 2030) {
      setErr("Motorcycle Manufacturing Year must be between 1950 and 2030.", "field-bike_year");
    }

    const shortBio = (form.elements.namedItem("short_bio") as HTMLTextAreaElement)?.value?.trim();
    if (!shortBio || shortBio.length < 5) {
      setErr("Short Bio preview is required (at least 5 characters).", "field-short_bio");
    }

    const fullBio = (form.elements.namedItem("bio") as HTMLTextAreaElement)?.value?.trim();
    if (!fullBio || fullBio.length < 10) {
      setErr("Full Editorial Biography is required (at least 10 characters).", "field-bio");
    }

    const email = (form.elements.namedItem("contact_email") as HTMLInputElement)?.value?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("A valid Contact Email is required for administrative verification.", "field-contact_email");
    }

    // Check file sizes
    if (profileFileState.error) setErr(profileFileState.error, "card-profile-photo");
    if (bikeFileState.error) setErr(bikeFileState.error, "card-motorcycle-photo");
    if (coverFileState.error) setErr(coverFileState.error, "card-cover-photo");

    return { valid: errors.length === 0, errors, firstId };
  };

  // Submit form
  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    // Run client validation
    const validation = validateFormClientSide(form);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      setFirstInvalidFieldId(validation.firstId);
      setIsErrorModalOpen(true);
      return;
    }

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

    // Append date_of_birth and calculated age
    if (dateOfBirth) {
      formData.set("date_of_birth", dateOfBirth);
    }
    if (calculatedAge !== null) {
      formData.set("age", String(calculatedAge));
    }
    if (joinedDate) {
      formData.set("joined_date", joinedDate);
    }

    startTransition(async () => {
      const res = await submitOnboardingAction(formData);
      if (res.success && res.submissionId) {
        setSubmissionSuccess({
          submissionId: res.submissionId,
          slug: res.slug || autoSlug,
        });
        setIsSuccessModalOpen(true);
        setIsEditingSubmitted(false);
      } else {
        setValidationErrors([res.error || "Failed to submit profile. Please review fields."]);
        setIsErrorModalOpen(true);
      }
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Error Modal Pop-up with auto-scroll CTA */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        title="Required Details Missing"
        errors={validationErrors}
        onClose={() => setIsErrorModalOpen(false)}
        onReviewAndFix={handleReviewAndFix}
      />

      {/* Submission Success Modal Pop-up with 3 Options */}
      <SubmissionSuccessModal
        isOpen={isSuccessModalOpen}
        submissionId={submissionSuccess?.submissionId || ""}
        slug={submissionSuccess?.slug}
        onEditApplication={handleEditApplication}
        onSubmitAnother={handleSubmitAnother}
        onClose={handleCloseSuccessModal}
      />

      {/* Editorial Header */}
      <div className="mb-10 text-center">
        <span className="rounded-xs border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.25em] text-gold-400">
          Brotherhood Enlistment
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ivory-100 sm:text-5xl">
          Rider Profile Onboarding
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-graphite-300">
          Submit your machine specifications and riding narrative to join our active brotherhood roster or update your existing profile.
        </p>
      </div>

      {/* Mode Navigation Tabs (Only New Rider and Update Profile) */}
      <div className="mb-8 flex rounded-sm border border-charcoal-600 bg-obsidian-950 p-1 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setActiveTab("new");
            setLinkedRider(null);
            setDisplayName("");
            setAutoSlug("");
            setDateOfBirth("");
            setCalculatedAge(null);
            setCommunityPosition("member");
            setSubmissionSuccess(null);
            setIsEditingSubmitted(false);
            setIsSuccessModalOpen(false);
          }}
          className={`flex-1 rounded-xs py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
            activeTab === "new"
              ? "border border-gold-500/40 bg-charcoal-700 text-gold-400 shadow-sm"
              : "text-graphite-400 hover:text-ivory-100"
          }`}
        >
          1. New Rider Enlistment
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("update");
            setSubmissionSuccess(null);
            setIsEditingSubmitted(false);
            setIsSuccessModalOpen(false);
          }}
          className={`flex-1 rounded-xs py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition-all ${
            activeTab === "update"
              ? "border border-gold-500/40 bg-charcoal-700 text-gold-400 shadow-sm"
              : "text-graphite-400 hover:text-ivory-100"
          }`}
        >
          2. Existing Member Update
        </button>
      </div>

      {/* Edit Mode Notification Banner (if user chose to modify their submitted application) */}
      {isEditingSubmitted && submissionSuccess && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-gold-500/50 bg-obsidian-900/90 p-5 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold-500 bg-gold-500/10 text-sm text-gold-400">
              ✏️
            </span>
            <div>
              <h4 className="font-display text-base font-bold text-ivory-100">
                Editing Your Submitted Application
              </h4>
              <p className="text-xs text-graphite-300">
                Reference ID: <code className="font-mono font-semibold text-gold-400 select-all">{submissionSuccess.submissionId}</code>. You can adjust your details below and re-submit.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSuccessModalOpen(true)}
              className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-300 hover:underline"
            >
              View Pop-up Options →
            </button>
            <span className="text-graphite-600">|</span>
            <button
              type="button"
              onClick={handleSubmitAnother}
              className="cursor-pointer text-xs uppercase tracking-wider text-graphite-400 hover:text-ivory-100 hover:underline"
            >
              Start Fresh
            </button>
          </div>
        </div>
      )}

      {/* Subtle confirmation bar if user dismissed the pop-up modal */}
      {!isSuccessModalOpen && !isEditingSubmitted && submissionSuccess && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-charcoal-600 bg-obsidian-900/50 p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-green-500/40 bg-green-500/10 text-xs text-green-400">
              ✓
            </span>
            <div>
              <p className="text-xs font-semibold text-ivory-100">
                Application Submitted & Awaiting Review
              </p>
              <p className="text-[0.68rem] text-graphite-400">
                Tracking ID: <code className="font-mono text-gold-400 font-semibold">{submissionSuccess.submissionId}</code>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSuccessModalOpen(true)}
              className="cursor-pointer text-xs uppercase tracking-wider text-gold-400 hover:underline"
            >
              View Pop-up
            </button>
            <button
              type="button"
              onClick={handleEditApplication}
              className="cursor-pointer text-xs uppercase tracking-wider text-graphite-300 hover:text-ivory-100 hover:underline"
            >
              Edit Application
            </button>
            <button
              type="button"
              onClick={handleSubmitAnother}
              className="cursor-pointer text-xs uppercase tracking-wider text-graphite-400 hover:text-ivory-100 hover:underline"
            >
              Submit Another
            </button>
          </div>
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
        <form ref={formRef} onSubmit={handleSubmitForm} className="space-y-8" noValidate>
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
                  Enlistment Mode
                </span>
                <p className="text-xs text-graphite-300">
                  New Rider Registration — Complete all sections below to submit for brotherhood review.
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
              <div id="field-display_name">
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Display Name (Road / Moniker Name) *
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

              <div id="field-full_name">
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
                  Kept private from public view for official brotherhood telemetry records.
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Community Position (Default: Member) *
                </label>
                <select
                  name="community_position"
                  value={communityPosition}
                  onChange={(e) => setCommunityPosition(e.target.value)}
                  className="mt-1.5 w-full rounded-sm border border-charcoal-500 bg-obsidian-950 px-3 py-2 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                >
                  {POSITIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div id="field-joined_date">
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Date Joined *
                </label>
                <div className="mt-1.5">
                  <DatePicker
                    name="joined_date"
                    id="input-joined_date"
                    value={joinedDate}
                    onChange={(d) => setJoinedDate(d)}
                    minYear={2010}
                    maxYear={new Date().getFullYear()}
                    maxDate={new Date().toISOString().slice(0, 10)}
                    placeholder="Select Date Joined..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Machine Specification */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
            <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
              2. Machine Specification
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div id="field-bike_brand">
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

              <div id="field-bike_model">
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

              <div id="field-bike_year">
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
              Provide your date of birth (age is dynamically computed) and toggle which attributes are publicly visible.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Date of Birth & Dynamic Age Calculation */}
              <div id="field-date_of_birth" className="rounded-sm border border-charcoal-600 bg-obsidian-950 p-4">
                <label className="block text-xs uppercase tracking-wider text-graphite-300">
                  Date of Birth *
                </label>
                <p className="mt-0.5 text-[0.68rem] text-graphite-400">
                  Universal calendar picker working across all phones and laptops.
                </p>
                <div className="mt-2">
                  <DatePicker
                    name="date_of_birth"
                    id="input-date_of_birth"
                    value={dateOfBirth}
                    onChange={handleDobChange}
                    minYear={1940}
                    maxYear={new Date().getFullYear() - 16}
                    maxDate={new Date(new Date().getFullYear() - 16, 11, 31).toISOString().slice(0, 10)}
                    placeholder="Select Date of Birth..."
                  />
                </div>

                {/* Dynamically Computed Age Display */}
                <div className="mt-3 flex items-center justify-between rounded-xs border border-charcoal-700 bg-obsidian-900 px-3 py-2">
                  <span className="text-xs text-graphite-300">Calculated Age:</span>
                  <span className="font-display text-xs font-bold text-gold-400">
                    {calculatedAge !== null ? `${calculatedAge} years old` : "Select birth date above"}
                  </span>
                </div>

                <label className="mt-3 flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    name="show_age"
                    defaultChecked={linkedRider?.show_age ?? false}
                    className="h-3.5 w-3.5 rounded-xs accent-gold-500"
                  />
                  <span className="text-xs text-graphite-300">
                    Show age publicly on directory and profile
                  </span>
                </label>
              </div>

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
                <label className="mt-4 flex cursor-pointer items-center gap-2">
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
              <div id="field-short_bio">
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

              <div id="field-bio">
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

          {/* 6. Media & Photos with Prominent 5MB UI/UX File Size Validation */}
          <div className="rounded-sm border border-gold-500/30 bg-obsidian-900/40 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-charcoal-700 pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-ivory-100">
                  6. Imagery & Media
                </h2>
                <p className="mt-0.5 text-xs text-graphite-300">
                  Upload photos for your profile card, bike showcase, and editorial header.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-xs border border-gold-500/40 bg-gold-500/10 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-gold-400">
                  Max File Size: 5MB
                </span>
                <span className="hidden sm:inline rounded-xs border border-charcoal-600 bg-charcoal-800 px-2.5 py-1 text-[0.65rem] uppercase tracking-wider text-graphite-300">
                  JPG · PNG · WebP · AVIF
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Profile Image Card */}
              <div
                id="card-portrait-photo"
                className={`rounded-sm border bg-obsidian-950 p-4 transition-all ${
                  profileFileState.error
                    ? "border-red-500 ring-1 ring-red-500/50"
                    : profileFileState.file
                    ? "border-green-500/50"
                    : "border-charcoal-600 hover:border-gold-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ivory-100">
                    Portrait Photo
                  </label>
                  <span className="text-[0.62rem] font-mono text-gold-400">≤ 5MB</span>
                </div>

                <input
                  type="file"
                  name="profile_image_file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => handleFileSelection(e, setProfileFileState, "Portrait Photo")}
                  className="mt-2 block w-full text-xs text-graphite-400 file:mr-2 file:cursor-pointer file:rounded-xs file:border-0 file:bg-charcoal-700 file:px-2.5 file:py-1 file:text-xs file:text-ivory-100 hover:file:bg-gold-500 hover:file:text-obsidian-950"
                />

                {/* Validation Status Indicator */}
                {profileFileState.error && (
                  <p className="mt-2 rounded-xs border border-red-500/40 bg-red-950/40 p-2 text-[0.68rem] text-red-300">
                    ✕ {profileFileState.error}
                  </p>
                )}

                {profileFileState.sizeFormatted && (
                  <div className="mt-2 flex items-center justify-between rounded-xs border border-green-500/30 bg-green-950/30 px-2 py-1 text-[0.65rem] text-green-400 font-semibold">
                    <span>✓ Ready: {profileFileState.sizeFormatted} / 5MB</span>
                    <button
                      type="button"
                      onClick={() => setProfileFileState({ file: null, previewUrl: null, error: null, sizeFormatted: null })}
                      className="cursor-pointer text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Preview Thumbnail */}
                {profileFileState.previewUrl && (
                  <div className="mt-2 overflow-hidden rounded-xs border border-charcoal-700 aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={profileFileState.previewUrl}
                      alt="Portrait Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="mt-3 border-t border-charcoal-800 pt-2">
                  <span className="text-[0.62rem] text-graphite-400">Or Paste Image URL:</span>
                  <input
                    name="profile_image_url"
                    defaultValue={linkedRider?.profile_image_url ?? ""}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-sm border border-charcoal-600 bg-obsidian-900 px-2 py-1 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bike Image Card */}
              <div
                id="card-motorcycle-photo"
                className={`rounded-sm border bg-obsidian-950 p-4 transition-all ${
                  bikeFileState.error
                    ? "border-red-500 ring-1 ring-red-500/50"
                    : bikeFileState.file
                    ? "border-green-500/50"
                    : "border-charcoal-600 hover:border-gold-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ivory-100">
                    Motorcycle Photo
                  </label>
                  <span className="text-[0.62rem] font-mono text-gold-400">≤ 5MB</span>
                </div>

                <input
                  type="file"
                  name="bike_image_file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => handleFileSelection(e, setBikeFileState, "Motorcycle Photo")}
                  className="mt-2 block w-full text-xs text-graphite-400 file:mr-2 file:cursor-pointer file:rounded-xs file:border-0 file:bg-charcoal-700 file:px-2.5 file:py-1 file:text-xs file:text-ivory-100 hover:file:bg-gold-500 hover:file:text-obsidian-950"
                />

                {/* Validation Status Indicator */}
                {bikeFileState.error && (
                  <p className="mt-2 rounded-xs border border-red-500/40 bg-red-950/40 p-2 text-[0.68rem] text-red-300">
                    ✕ {bikeFileState.error}
                  </p>
                )}

                {bikeFileState.sizeFormatted && (
                  <div className="mt-2 flex items-center justify-between rounded-xs border border-green-500/30 bg-green-950/30 px-2 py-1 text-[0.65rem] text-green-400 font-semibold">
                    <span>✓ Ready: {bikeFileState.sizeFormatted} / 5MB</span>
                    <button
                      type="button"
                      onClick={() => setBikeFileState({ file: null, previewUrl: null, error: null, sizeFormatted: null })}
                      className="cursor-pointer text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Preview Thumbnail */}
                {bikeFileState.previewUrl && (
                  <div className="mt-2 overflow-hidden rounded-xs border border-charcoal-700 aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bikeFileState.previewUrl}
                      alt="Bike Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="mt-3 border-t border-charcoal-800 pt-2">
                  <span className="text-[0.62rem] text-graphite-400">Or Paste Image URL:</span>
                  <input
                    name="bike_image_url"
                    defaultValue={linkedRider?.bike_image_url ?? ""}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-sm border border-charcoal-600 bg-obsidian-900 px-2 py-1 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image Card */}
              <div
                id="card-cover-photo"
                className={`rounded-sm border bg-obsidian-950 p-4 transition-all ${
                  coverFileState.error
                    ? "border-red-500 ring-1 ring-red-500/50"
                    : coverFileState.file
                    ? "border-green-500/50"
                    : "border-charcoal-600 hover:border-gold-500/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ivory-100">
                    Cover / Banner Photo
                  </label>
                  <span className="text-[0.62rem] font-mono text-gold-400">≤ 5MB</span>
                </div>

                <input
                  type="file"
                  name="cover_image_file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => handleFileSelection(e, setCoverFileState, "Cover Photo")}
                  className="mt-2 block w-full text-xs text-graphite-400 file:mr-2 file:cursor-pointer file:rounded-xs file:border-0 file:bg-charcoal-700 file:px-2.5 file:py-1 file:text-xs file:text-ivory-100 hover:file:bg-gold-500 hover:file:text-obsidian-950"
                />

                {/* Validation Status Indicator */}
                {coverFileState.error && (
                  <p className="mt-2 rounded-xs border border-red-500/40 bg-red-950/40 p-2 text-[0.68rem] text-red-300">
                    ✕ {coverFileState.error}
                  </p>
                )}

                {coverFileState.sizeFormatted && (
                  <div className="mt-2 flex items-center justify-between rounded-xs border border-green-500/30 bg-green-950/30 px-2 py-1 text-[0.65rem] text-green-400 font-semibold">
                    <span>✓ Ready: {coverFileState.sizeFormatted} / 5MB</span>
                    <button
                      type="button"
                      onClick={() => setCoverFileState({ file: null, previewUrl: null, error: null, sizeFormatted: null })}
                      className="cursor-pointer text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Preview Thumbnail */}
                {coverFileState.previewUrl && (
                  <div className="mt-2 overflow-hidden rounded-xs border border-charcoal-700 aspect-square">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverFileState.previewUrl}
                      alt="Cover Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="mt-3 border-t border-charcoal-800 pt-2">
                  <span className="text-[0.62rem] text-graphite-400">Or Paste Image URL:</span>
                  <input
                    name="cover_image_url"
                    defaultValue={linkedRider?.cover_image_url ?? ""}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-sm border border-charcoal-600 bg-obsidian-900 px-2 py-1 text-xs text-ivory-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 7. Contact Information for Administrative Review */}
          <div className="rounded-sm border border-charcoal-600 bg-obsidian-900/40 p-6">
            <h2 className="border-b border-charcoal-700 pb-3 font-display text-lg font-bold text-ivory-100">
              7. Contact Information (For Administrative Verification)
            </h2>
            <p className="mt-1 text-xs text-graphite-300">
              Used strictly by leadership to verify membership. Never shown publicly.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div id="field-contact_email">
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
              Submissions undergo administrative approval before being reflected publicly on the site.
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

"use client";

import { useEffect, useState } from "react";

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  submissionId: string;
  slug?: string;
  onEditApplication: () => void;
  onSubmitAnother: () => void;
  onClose: () => void;
}

export function SubmissionSuccessModal({
  isOpen,
  submissionId,
  slug,
  onEditApplication,
  onSubmitAnother,
  onClose,
}: SubmissionSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyId = async () => {
    if (!submissionId) return;
    try {
      await navigator.clipboard.writeText(submissionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is unavailable
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-obsidian-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-modal-title"
        className="relative w-full max-w-lg overflow-hidden rounded-sm border border-gold-500/50 bg-obsidian-950 p-6 shadow-2xl transition-all sm:p-8"
      >
        {/* Close 'X' button top-right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-xs p-1 text-graphite-400 transition-colors hover:bg-obsidian-900 hover:text-ivory-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header with Emerald/Gold Badge */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="space-y-1 pr-6">
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-gold-400">
              Submission Successful
            </span>
            <h3
              id="success-modal-title"
              className="font-display text-2xl font-bold tracking-tight text-ivory-100"
            >
              Profile Submission Received
            </h3>
            <p className="text-xs text-graphite-300">
              Your profile has been logged in the pending queue and is awaiting administrator verification. The public directory will reflect your details once approved.
            </p>
          </div>
        </div>

        {/* Reference Tracking ID Box */}
        <div className="mt-5 rounded-sm border border-charcoal-600 bg-obsidian-900/80 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] uppercase tracking-wider text-graphite-400">
              Reference Tracking ID:
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-[0.68rem] font-medium uppercase tracking-wider text-gold-400 transition-colors hover:text-gold-300"
            >
              {copied ? "✓ Copied!" : "Copy ID"}
            </button>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <code className="font-mono text-xs font-semibold text-gold-400 select-all break-all">
              {submissionId}
            </code>
          </div>
          {slug && (
            <div className="mt-2 text-[0.68rem] text-graphite-400">
              Assigned Slug: <span className="font-mono text-ivory-100">{slug}</span>
            </div>
          )}
        </div>

        {/* Options & Action Buttons */}
        <div className="mt-6 space-y-3">
          {/* Option 1: Edit your application */}
          <button
            type="button"
            onClick={onEditApplication}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-gold-500 bg-gold-500 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            1. Edit Your Application
          </button>

          {/* Option 2: Submit another profile */}
          <button
            type="button"
            onClick={onSubmitAnother}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-charcoal-500 bg-obsidian-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ivory-100 transition-colors hover:border-gold-500 hover:text-gold-400"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            2. Submit Another Profile
          </button>

          {/* Option 3: Close / Dismiss */}
          <button
            type="button"
            onClick={onClose}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-transparent py-2 text-xs uppercase tracking-[0.15em] text-graphite-400 transition-colors hover:text-ivory-100"
          >
            3. Close & Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

interface ErrorModalProps {
  isOpen: boolean;
  title?: string;
  errors: string[];
  onClose: () => void;
  onReviewAndFix?: () => void;
}

export function ErrorModal({
  isOpen,
  title = "Incomplete or Invalid Details",
  errors,
  onClose,
  onReviewAndFix,
}: ErrorModalProps) {
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

  if (!isOpen || errors.length === 0) return null;

  const handleAction = () => {
    onClose();
    onReviewAndFix?.();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg overflow-hidden rounded-sm border border-red-500/40 bg-obsidian-950 p-6 shadow-2xl transition-all sm:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-red-500/40 bg-red-950/50 text-red-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="font-display text-xl font-bold tracking-tight text-ivory-100">
              {title}
            </h3>
            <p className="text-xs text-graphite-300">
              Please resolve the following before submitting your profile:
            </p>

            {/* List of specific human-friendly errors */}
            <ul className="mt-3 max-h-60 space-y-2 overflow-y-auto rounded-sm border border-charcoal-700 bg-obsidian-900/60 p-3.5 text-xs text-red-300">
              {errors.map((err, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-400">•</span>
                  <span>{err}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal CTA Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-charcoal-700 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-sm border border-charcoal-500 bg-obsidian-900 px-4 py-2 text-xs uppercase tracking-wider text-graphite-300 hover:text-ivory-100"
          >
            Dismiss
          </button>
          <button
            type="button"
            onClick={handleAction}
            className="cursor-pointer rounded-sm border border-gold-500 bg-gold-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-obsidian-950 transition-colors hover:border-gold-400 hover:bg-gold-400"
          >
            Review & Fix Fields →
          </button>
        </div>
      </div>
    </div>
  );
}

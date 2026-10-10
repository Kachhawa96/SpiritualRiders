"use client";

import { useEffect } from "react";

export type AdminFeedbackType = "success" | "error" | "info";

export interface AdminFeedbackModalProps {
  isOpen: boolean;
  type?: AdminFeedbackType;
  title: string;
  message: string;
  onClose: () => void;
  confirmLabel?: string;
}

export function AdminFeedbackModal({
  isOpen,
  type = "info",
  title,
  message,
  onClose,
  confirmLabel,
}: AdminFeedbackModalProps) {
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

  const isSuccess = type === "success";
  const isError = type === "error";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
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
        aria-labelledby="admin-feedback-title"
        className={`relative w-full max-w-md overflow-hidden rounded-sm border bg-obsidian-950 p-6 shadow-2xl transition-all sm:p-8 ${
          isSuccess
            ? "border-gold-500/50 shadow-[0_0_40px_rgba(212,175,55,0.15)]"
            : isError
              ? "border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.15)]"
              : "border-charcoal-600 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
        }`}
      >
        {/* Close 'X' button top-right */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="cursor-pointer absolute right-4 top-4 rounded-xs p-1 text-graphite-400 transition-colors hover:bg-obsidian-900 hover:text-ivory-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content area with icon & text */}
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          {isSuccess && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}

          {isError && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-red-500/40 bg-red-950/40 text-red-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          )}

          {!isSuccess && !isError && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
          )}

          <div className="flex-1 space-y-1.5 pr-4">
            <span
              className={`text-[0.62rem] font-bold uppercase tracking-[0.22em] ${
                isSuccess
                  ? "text-emerald-400"
                  : isError
                    ? "text-red-400"
                    : "text-gold-400"
              }`}
            >
              {isSuccess
                ? "● Action Successful"
                : isError
                  ? "▲ Attention Required"
                  : "ℹ Notice"}
            </span>
            <h3
              id="admin-feedback-title"
              className="font-display text-xl font-bold tracking-tight text-ivory-100"
            >
              {title}
            </h3>
            <p className="text-xs leading-relaxed text-graphite-300">
              {message}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-7 flex items-center justify-end border-t border-charcoal-700 pt-4">
          <button
            type="button"
            onClick={onClose}
            className={`cursor-pointer rounded-sm px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
              isSuccess
                ? "border border-gold-500 bg-gold-500 text-obsidian-950 hover:border-gold-400 hover:bg-gold-400"
                : isError
                  ? "border border-red-500 bg-red-600 text-ivory-100 hover:bg-red-500"
                  : "border border-gold-500 bg-gold-500 text-obsidian-950 hover:bg-gold-400"
            }`}
          >
            {confirmLabel || "Dismiss & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

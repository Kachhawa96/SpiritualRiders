"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOneSignal } from "./OneSignalProvider";
import { Button } from "@/components/ui/Button";

export function NotificationPrompt() {
  const {
    isConfigured,
    isReady,
    isPromptOpen,
    isSubscribed,
    isLoading,
    subscribe,
    closePrompt,
  } = useOneSignal();

  const [justSubscribed, setJustSubscribed] = useState(false);

  // If not configured, not initialized (e.g. origin mismatch on localhost), already subscribed, or prompt is closed, don't show
  if (!isConfigured || !isReady || !isPromptOpen || isSubscribed) {
    return null;
  }

  const handleAccept = async () => {
    const success = await subscribe();
    if (success) {
      setJustSubscribed(true);
      setTimeout(() => {
        closePrompt(30);
      }, 2500);
    }
  };

  const handleDismiss = () => {
    closePrompt(7); // Snooze for 7 days
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-5 right-5 z-40 max-w-sm sm:max-w-md w-[calc(100vw-2.5rem)] overflow-hidden rounded-md border border-charcoal-500 bg-obsidian-950/95 p-5 sm:p-6 text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(212,175,55,0.12)] backdrop-blur-xl"
        role="dialog"
        aria-labelledby="push-prompt-heading"
        aria-describedby="push-prompt-desc"
      >
        {/* Top Gold Hairline Accent */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/80 to-transparent"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 grid size-8 place-items-center rounded-sm text-graphite-400 hover:text-ivory-100 hover:bg-white/5 transition-colors"
          aria-label="Dismiss notification prompt"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>

        {justSubscribed ? (
          <div className="py-2 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-400">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-display text-xl text-ivory-100">
              Welcome to the Dispatch
            </h3>
            <p className="mt-1 text-xs text-graphite-300">
              You are now subscribed to Spiritual Riders ride alerts & brotherhood announcements.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-sm border border-gold-500/30 bg-obsidian-900 text-gold-400 shadow-glow-gold">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>

              <div>
                <span className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold-400">
                  Brotherhood Dispatch
                </span>
                <h3
                  id="push-prompt-heading"
                  className="font-display text-lg sm:text-xl font-medium tracking-tight text-ivory-100 leading-snug mt-0.5"
                >
                  Never Miss a Ride Announcement
                </h3>
                <p
                  id="push-prompt-desc"
                  className="mt-1.5 text-xs text-graphite-300 leading-relaxed"
                >
                  Get direct alerts on upcoming weekend rides, emergency route updates, and crew stories. Instant unsubscribe anytime.
                </p>
              </div>
            </div>

            <div className="mt-1 flex items-center gap-2.5 pt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={handleAccept}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Enabling..." : "Enable Alerts"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                disabled={isLoading}
                className="text-graphite-400 hover:text-ivory-100"
              >
                Maybe Later
              </Button>
            </div>
          </div>
        )}
      </motion.aside>
    </AnimatePresence>
  );
}

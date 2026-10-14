"use client";

import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOneSignal } from "./OneSignalProvider";
import { NOTIFICATION_TOPICS, NotificationTopicKey } from "@/lib/onesignal";
import { Button } from "@/components/ui/Button";

export function NotificationBell() {
  const {
    isConfigured,
    isReady,
    isPromptOpen,
    isSubscribed,
    permission,
    isLoading,
    topics,
    isPreferencesOpen,
    isIosNeedsPwa,
    subscribe,
    unsubscribe,
    updateTopic,
    closePreferences,
    togglePreferences,
  } = useOneSignal();

  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        closePreferences();
      }
    }

    if (isPreferencesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [closePreferences, isPreferencesOpen]);

  // Don't render floating bell if OneSignal is not configured, not initialized (e.g. origin mismatch), or prompt is actively open
  if (!isConfigured || !isReady || isPromptOpen) {
    return null;
  }

  const isBlocked = permission === "denied";

  return (
    <div className="fixed bottom-5 right-5 z-40" ref={popoverRef}>
      {/* Floating Bell Trigger Button */}
      <button
        type="button"
        onClick={togglePreferences}
        className="group relative flex size-12 cursor-pointer items-center justify-center rounded-full border border-charcoal-500 bg-obsidian-950/90 text-gold-400 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(212,175,55,0.15)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-gold-500 hover:text-gold-300 hover:shadow-glow-gold active:scale-95"
        aria-label="Notification settings"
        aria-expanded={isPreferencesOpen}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 group-hover:rotate-12"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Status Indicator Dot */}
        {isSubscribed ? (
          <span
            className="absolute top-1 right-1 flex size-3"
            title="Notifications Active"
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex size-3 rounded-full border border-obsidian-950 bg-emerald-500" />
          </span>
        ) : isBlocked ? (
          <span
            className="absolute top-1 right-1 flex size-3"
            title="Notifications Blocked in Browser"
          >
            <span className="relative inline-flex size-3 rounded-full border border-obsidian-950 bg-amber-500" />
          </span>
        ) : (
          <span
            className="absolute top-1 right-1 flex size-2.5"
            title="Notifications Inactive"
          >
            <span className="relative inline-flex size-2.5 rounded-full border border-obsidian-950 bg-graphite-400" />
          </span>
        )}
      </button>

      {/* Preferences Popover Modal / Drawer */}
      <AnimatePresence>
        {isPreferencesOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-16 right-0 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm rounded-md border border-charcoal-500 bg-obsidian-950/95 p-5 text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.12)] backdrop-blur-xl"
            role="dialog"
            aria-label="Notification Preferences"
          >
            {/* Top Gold Hairline */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500/80 to-transparent"
              aria-hidden="true"
            />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid size-7 place-items-center rounded-sm border border-gold-500/30 bg-obsidian-900 text-gold-400">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-ivory-100">
                    Dispatch Alerts
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={closePreferences}
                className="grid size-7 place-items-center rounded-sm text-graphite-400 hover:text-ivory-100 hover:bg-white/5 transition-colors"
                aria-label="Close preferences"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                >
                  <path d="M1 1l12 12M13 1L1 13" />
                </svg>
              </button>
            </div>

            {/* Status Section */}
            <div className="mt-3.5 flex items-center justify-between rounded-sm border border-charcoal-700 bg-obsidian-900/60 p-3">
              <div className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full ${
                    isSubscribed
                      ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                      : isBlocked
                      ? "bg-amber-400"
                      : "bg-graphite-400"
                  }`}
                />
                <span className="text-[0.68rem] uppercase tracking-[0.16em] text-graphite-200">
                  {isSubscribed
                    ? "Subscribed"
                    : isBlocked
                    ? "Blocked by Browser"
                    : "Not Subscribed"}
                </span>
              </div>

              {isSubscribed ? (
                <button
                  type="button"
                  onClick={unsubscribe}
                  disabled={isLoading}
                  className="text-[0.62rem] uppercase tracking-[0.16em] text-graphite-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  {isLoading ? "Updating..." : "Unsubscribe"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={subscribe}
                  disabled={isLoading || isBlocked}
                  className="text-[0.62rem] uppercase tracking-[0.16em] text-gold-400 hover:text-gold-300 transition-colors font-medium cursor-pointer disabled:opacity-40"
                >
                  {isLoading ? "Enabling..." : "Subscribe"}
                </button>
              )}
            </div>

            {/* Browser Blocked Warning */}
            {isBlocked && (
              <div className="mt-3 rounded-sm border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                <p className="font-medium">Notifications are blocked</p>
                <p className="mt-1 text-[0.7rem] text-amber-200/80 leading-relaxed">
                  Click the lock or site settings icon in your browser address bar and set <strong>Notifications</strong> to <strong>Allow</strong>.
                </p>
              </div>
            )}

            {/* iOS Add to Home Screen Guidance */}
            {isIosNeedsPwa && (
              <div className="mt-3 rounded-sm border border-gold-500/30 bg-gold-500/10 p-3 text-xs text-gold-200">
                <p className="font-medium text-gold-300">iPhone / iPad Setup</p>
                <p className="mt-1 text-[0.7rem] text-graphite-200 leading-relaxed">
                  Apple requires installing the app to receive push alerts:
                  <br />
                  1. Tap the <strong>Share</strong> button in Safari.
                  <br />
                  2. Select <strong>Add to Home Screen</strong>.
                  <br />
                  3. Open Spiritual Riders from your home screen.
                </p>
              </div>
            )}

            {/* Topic Preferences */}
            <div className="mt-4">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-graphite-400">
                Alert Categories
              </p>
              <div className="mt-2.5 space-y-2">
                {(Object.keys(NOTIFICATION_TOPICS) as NotificationTopicKey[]).map(
                  (key) => {
                    const item = NOTIFICATION_TOPICS[key];
                    const isChecked = topics[key];

                    return (
                      <label
                        key={key}
                        className="flex cursor-pointer items-start justify-between gap-3 rounded-sm border border-charcoal-700/60 bg-obsidian-900/30 p-2.5 transition-colors hover:border-charcoal-600 hover:bg-obsidian-900/70"
                      >
                        <div className="flex-1 pr-2">
                          <p className="text-xs font-medium text-ivory-100">
                            {item.label}
                          </p>
                          <p className="mt-0.5 text-[0.68rem] text-graphite-400 leading-normal">
                            {item.description}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => updateTopic(key, e.target.checked)}
                          disabled={!isSubscribed || isLoading}
                          className="mt-0.5 size-4 cursor-pointer accent-gold-500 disabled:opacity-40"
                        />
                      </label>
                    );
                  }
                )}
              </div>
            </div>

            {/* Action Button */}
            {!isSubscribed && !isBlocked && (
              <div className="mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={subscribe}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Enabling..." : "Subscribe to Alerts"}
                </Button>
              </div>
            )}

            {/* Footer */}
            <p className="mt-3 text-center text-[0.62rem] text-graphite-400">
              OneSignal Push Service • No spam guarantee
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

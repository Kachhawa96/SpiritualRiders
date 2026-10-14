"use client";

import { useOneSignal } from "./OneSignalProvider";

export function NotificationFooterToggle() {
  const {
    isConfigured,
    isReady,
    isSubscribed,
    isLoading,
    openPreferences,
  } = useOneSignal();

  if (!isConfigured || !isReady) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-border-subtle/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${
              isSubscribed
                ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                : "bg-graphite-400"
            }`}
          />
          <span className="text-[0.68rem] uppercase tracking-[0.2em] text-graphite-300">
            Push Alerts: {isSubscribed ? "Active" : "Off"}
          </span>
        </div>

        <button
          type="button"
          onClick={openPreferences}
          disabled={isLoading}
          className="text-xs text-gold-400 hover:text-gold-300 transition-colors underline cursor-pointer"
        >
          {isSubscribed ? "Preferences" : "Enable Alerts"}
        </button>
      </div>
    </div>
  );
}

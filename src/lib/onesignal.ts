/**
 * Helper utilities for OneSignal Web Push notifications.
 */

export const NOTIFICATION_TOPICS = {
  rides: {
    key: "topic_rides",
    label: "Upcoming Rides & Routes",
    description: "Weekend rides, route dispatches, and meet points.",
  },
  announcements: {
    key: "topic_announcements",
    label: "Crew Announcements",
    description: "Urgent updates, safety briefs, and brotherhood news.",
  },
  updates: {
    key: "topic_updates",
    label: "Stories & Website Updates",
    description: "New member profiles, ride photo galleries, and logs.",
  },
} as const;

export type NotificationTopicKey = keyof typeof NOTIFICATION_TOPICS;

const DISMISS_STORAGE_KEY = "sr_push_prompt_dismissed_until";
const TOPICS_STORAGE_KEY = "sr_push_notification_topics";

/**
 * Checks if the current client browser supports Web Push notifications.
 */
export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

/**
 * Detects if the current user agent is an Apple iOS device (iPhone, iPad, iPod).
 */
export function isIosDevice(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/**
 * Checks whether the website is running as an installed PWA (Home Screen standalone mode).
 * Required for Web Push notifications on iOS 16.4+.
 */
export function isStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  const isStandaloneMatch = window.matchMedia("(display-mode: standalone)").matches;
  const isNavStandalone = (window.navigator as unknown as { standalone?: boolean })
    .standalone;
  return Boolean(isStandaloneMatch || isNavStandalone);
}

/**
 * Checks if the notification prompt has been temporarily dismissed by the user.
 */
export function isPromptDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (!raw) return false;
    const expiresAt = Number(raw);
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}

/**
 * Dismisses the notification prompt for a given number of days (defaults to 7 days).
 */
export function dismissPrompt(days = 7): void {
  if (typeof window === "undefined") return;
  try {
    const expiresAt = Date.now() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_STORAGE_KEY, String(expiresAt));
  } catch {
    // Ignore localStorage write failures (e.g. private mode quota)
  }
}

/**
 * Resets the prompt dismissal so it can be displayed again.
 */
export function resetPromptDismissal(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DISMISS_STORAGE_KEY);
  } catch {
    // Ignore
  }
}

/**
 * Retrieves the user's stored topic notification preferences.
 */
export function getSavedTopicPreferences(): Record<NotificationTopicKey, boolean> {
  const defaults: Record<NotificationTopicKey, boolean> = {
    rides: true,
    announcements: true,
    updates: true,
  };

  if (typeof window === "undefined") return defaults;

  try {
    const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      rides: parsed.rides !== false,
      announcements: parsed.announcements !== false,
      updates: parsed.updates !== false,
    };
  } catch {
    return defaults;
  }
}

/**
 * Saves topic preferences locally.
 */
export function saveTopicPreferences(
  prefs: Record<NotificationTopicKey, boolean>
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore
  }
}

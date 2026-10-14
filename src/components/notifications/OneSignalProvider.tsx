"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Script from "next/script";
import {
  NOTIFICATION_TOPICS,
  NotificationTopicKey,
  dismissPrompt as setDismissedStorage,
  getSavedTopicPreferences,
  isIosDevice,
  isPromptDismissed,
  isPushSupported,
  isStandaloneMode,
  saveTopicPreferences,
} from "@/lib/onesignal";

export type PermissionState = "default" | "granted" | "denied" | "unsupported";

export interface OneSignalContextType {
  isConfigured: boolean;
  isSupported: boolean;
  isIosNeedsPwa: boolean;
  isReady: boolean;
  isSubscribed: boolean;
  permission: PermissionState;
  isLoading: boolean;
  topics: Record<NotificationTopicKey, boolean>;
  isPromptOpen: boolean;
  isPreferencesOpen: boolean;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<void>;
  toggleSubscription: () => Promise<void>;
  updateTopic: (topic: NotificationTopicKey, enabled: boolean) => Promise<void>;
  openPrompt: () => void;
  closePrompt: (snoozeDays?: number) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  togglePreferences: () => void;
}

const OneSignalContext = createContext<OneSignalContextType | null>(null);

interface OneSignalProviderProps {
  children: ReactNode;
}

export function OneSignalProvider({ children }: OneSignalProviderProps) {
  const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID?.trim() || "";
  const safariWebId = process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID?.trim() || "";
  const isConfigured = Boolean(appId);

  const [isSupported, setIsSupported] = useState(false);
  const [isIosNeedsPwa, setIsIosNeedsPwa] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<PermissionState>("default");
  const [isLoading, setIsLoading] = useState(false);
  const [topics, setTopics] = useState<Record<NotificationTopicKey, boolean>>(
    getSavedTopicPreferences
  );
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const initializedRef = useRef(false);
  const promptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync current subscription and permission state from window.OneSignal
  const syncState = useCallback(() => {
    if (typeof window === "undefined" || !window.OneSignal) return;

    try {
      const oneSignal = window.OneSignal;
      const optedIn = oneSignal.User?.PushSubscription?.optedIn ?? false;
      setIsSubscribed(optedIn);

      const nativePerm =
        typeof Notification !== "undefined"
          ? Notification.permission
          : "default";
      setPermission(nativePerm as PermissionState);
    } catch {
      // Ignore initialization read errors
    }
  }, []);

  // Sync topic tags with OneSignal User model
  const syncTagsToOneSignal = useCallback(
    async (currentTopics: Record<NotificationTopicKey, boolean>) => {
      if (typeof window === "undefined" || !window.OneSignal) return;
      try {
        const tags: Record<string, string> = {};
        (Object.keys(currentTopics) as NotificationTopicKey[]).forEach((key) => {
          tags[NOTIFICATION_TOPICS[key].key] = currentTopics[key] ? "true" : "false";
        });
        await window.OneSignal.User.addTags(tags);
      } catch (err) {
        console.warn("[OneSignal] Could not sync user tags:", err);
      }
    },
    []
  );

  // Initialize OneSignal on browser load
  useEffect(() => {
    if (typeof window === "undefined") return;

    const supported = isPushSupported();
    const onIos = isIosDevice();
    const standalone = isStandaloneMode();

    // Defer initial browser capability state updates to prevent cascading render warnings
    queueMicrotask(() => {
      setIsSupported(supported);
      if (onIos && !standalone) {
        setIsIosNeedsPwa(true);
      }
      if (!supported) {
        setPermission("unsupported");
      } else if (typeof Notification !== "undefined") {
        setPermission(Notification.permission as PermissionState);
      }
    });

    if (!supported || !isConfigured) {
      return;
    }

    if (initializedRef.current) return;
    initializedRef.current = true;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await OneSignal.init({
          appId,
          allowLocalhostAsSecureOrigin: true,
          safari_web_id: safariWebId || undefined,
          notifyButton: { enable: false }, // Use our custom Obsidian & Gold UI
        });

        setIsReady(true);
        syncState();

        // Listen for subscription status changes
        OneSignal.User.PushSubscription.addEventListener("change", (e) => {
          setIsSubscribed(e.current.optedIn);
          if (e.current.optedIn) {
            setPermission("granted");
            syncTagsToOneSignal(topics);
          }
        });

        // Listen for native permission changes
        OneSignal.Notifications.addEventListener("permissionChange", (perm) => {
          setPermission(perm ? "granted" : "denied");
        });

        // Trigger gentle prompt after 4.5 seconds if visitor is not yet subscribed
        const optedIn = OneSignal.User.PushSubscription.optedIn;
        const nativePerm =
          typeof Notification !== "undefined"
            ? Notification.permission
            : "default";

        if (!optedIn && nativePerm === "default" && !isPromptDismissed()) {
          promptTimerRef.current = setTimeout(() => {
            setIsPromptOpen(true);
          }, 4500);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Can only be used on")) {
          const targetUrl = msg.replace(/.*Can only be used on:\s*/i, "").trim();
          console.warn(
            `[OneSignal] Origin restriction: This OneSignal App ID is configured for ${targetUrl}. Push notifications are paused on ${window.location.origin}. To test locally on localhost, see instructions in dashboard.`
          );
        } else {
          console.error("[OneSignal] Initialization error:", err);
        }
      }
    });

    return () => {
      if (promptTimerRef.current) {
        clearTimeout(promptTimerRef.current);
      }
    };
  }, [appId, isConfigured, safariWebId, syncState, syncTagsToOneSignal, topics]);

  // Subscribe method
  const subscribe = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    // Check iOS caveat
    if (isIosNeedsPwa) {
      setIsPreferencesOpen(true);
      return false;
    }

    if (!isPushSupported()) {
      alert("Web push notifications are not supported by this browser.");
      return false;
    }

    if (permission === "denied") {
      setIsPreferencesOpen(true);
      return false;
    }

    setIsLoading(true);

    try {
      if (!window.OneSignal) {
        throw new Error("OneSignal SDK not loaded");
      }

      await window.OneSignal.User.PushSubscription.optIn();
      syncState();

      // Tag user with initial topics
      await syncTagsToOneSignal(topics);

      setIsPromptOpen(false);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error("[OneSignal] Error requesting subscription:", err);
      syncState();
      setIsLoading(false);
      return false;
    }
  }, [isIosNeedsPwa, permission, syncState, syncTagsToOneSignal, topics]);

  // Unsubscribe method
  const unsubscribe = useCallback(async () => {
    if (typeof window === "undefined" || !window.OneSignal) return;
    setIsLoading(true);

    try {
      await window.OneSignal.User.PushSubscription.optOut();
      syncState();
    } catch (err) {
      console.error("[OneSignal] Error opting out:", err);
    } finally {
      setIsLoading(false);
    }
  }, [syncState]);

  // Toggle subscription
  const toggleSubscription = useCallback(async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  }, [isSubscribed, subscribe, unsubscribe]);

  // Update specific topic preference
  const updateTopic = useCallback(
    async (topic: NotificationTopicKey, enabled: boolean) => {
      const nextTopics = {
        ...topics,
        [topic]: enabled,
      };
      setTopics(nextTopics);
      saveTopicPreferences(nextTopics);

      if (isSubscribed && window.OneSignal) {
        await syncTagsToOneSignal(nextTopics);
      }
    },
    [isSubscribed, syncTagsToOneSignal, topics]
  );

  const openPrompt = useCallback(() => setIsPromptOpen(true), []);
  const closePrompt = useCallback((snoozeDays = 7) => {
    setIsPromptOpen(false);
    setDismissedStorage(snoozeDays);
  }, []);

  const openPreferences = useCallback(() => setIsPreferencesOpen(true), []);
  const closePreferences = useCallback(() => setIsPreferencesOpen(false), []);
  const togglePreferences = useCallback(
    () => setIsPreferencesOpen((prev) => !prev),
    []
  );

  const contextValue: OneSignalContextType = {
    isConfigured,
    isSupported,
    isIosNeedsPwa,
    isReady,
    isSubscribed,
    permission,
    isLoading,
    topics,
    isPromptOpen,
    isPreferencesOpen,
    subscribe,
    unsubscribe,
    toggleSubscription,
    updateTopic,
    openPrompt,
    closePrompt,
    openPreferences,
    closePreferences,
    togglePreferences,
  };

  return (
    <OneSignalContext.Provider value={contextValue}>
      {isConfigured && (
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
      )}
      {children}
    </OneSignalContext.Provider>
  );
}

export function useOneSignal(): OneSignalContextType {
  const context = useContext(OneSignalContext);
  if (!context) {
    throw new Error("useOneSignal must be used within an OneSignalProvider");
  }
  return context;
}

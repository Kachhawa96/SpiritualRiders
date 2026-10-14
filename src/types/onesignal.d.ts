/**
 * TypeScript type definitions for OneSignal Web SDK v16.
 */

export interface OneSignalUserSubscriptionChangeEvent {
  previous: {
    optedIn: boolean;
    id?: string | null;
    token?: string | null;
  };
  current: {
    optedIn: boolean;
    id?: string | null;
    token?: string | null;
  };
}

export interface OneSignalInitOptions {
  appId: string;
  allowLocalhostAsSecureOrigin?: boolean;
  safari_web_id?: string;
  autoRegister?: boolean;
  serviceWorkerParam?: { scope: string };
  serviceWorkerPath?: string;
  serviceWorkerUpdaterPath?: string;
  notifyButton?: { enable: boolean };
}

export interface OneSignalSDK {
  init(options: OneSignalInitOptions): Promise<void>;
  User: {
    PushSubscription: {
      optIn(): Promise<void>;
      optOut(): Promise<void>;
      optedIn: boolean;
      id?: string | null;
      token?: string | null;
      addEventListener(
        event: "change",
        handler: (event: OneSignalUserSubscriptionChangeEvent) => void
      ): void;
      removeEventListener(
        event: "change",
        handler: (event: OneSignalUserSubscriptionChangeEvent) => void
      ): void;
    };
    addTags(tags: Record<string, string | number>): Promise<void>;
    removeTags(tags: string[]): Promise<void>;
    getTags(): Promise<Record<string, string | number>>;
  };
  Notifications: {
    permission: boolean;
    permissionNative: NotificationPermission;
    requestPermission(): Promise<void>;
    addEventListener(
      event: "permissionChange",
      handler: (permission: boolean) => void
    ): void;
    removeEventListener(
      event: "permissionChange",
      handler: (permission: boolean) => void
    ): void;
  };
  Slidedown?: {
    promptPush(options?: unknown): Promise<void>;
  };
}

declare global {
  interface Window {
    OneSignalDeferred?: Array<(oneSignal: OneSignalSDK) => void | Promise<void>>;
    OneSignal?: OneSignalSDK;
  }
}

export {};

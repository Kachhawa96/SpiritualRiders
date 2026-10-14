"use server";

import { requireAdmin } from "@/lib/auth/server";
import {
  sendOneSignalPush,
  type OneSignalFilter,
} from "@/lib/onesignal-server";

export interface CustomPushResult {
  success: boolean;
  recipients?: number;
  id?: string;
  error?: string;
}

export async function sendAdminCustomPushAction(
  formData: FormData
): Promise<CustomPushResult> {
  try {
    await requireAdmin();

    const title = (formData.get("title") as string)?.trim();
    const message = (formData.get("message") as string)?.trim();
    const audience = (formData.get("audience") as string) || "all";
    const url = (formData.get("url") as string)?.trim() || "/";
    const image_url = (formData.get("image_url") as string)?.trim() || null;

    if (!title) {
      return { success: false, error: "Notification title is required." };
    }
    if (!message) {
      return { success: false, error: "Notification message is required." };
    }

    let filters: OneSignalFilter[] | undefined = undefined;
    let includedSegments: string[] | undefined = undefined;

    switch (audience) {
      case "rides":
        filters = [
          {
            field: "tag",
            key: "topic_rides",
            relation: "=",
            value: "true",
          },
        ];
        break;
      case "announcements":
        filters = [
          {
            field: "tag",
            key: "topic_announcements",
            relation: "=",
            value: "true",
          },
        ];
        break;
      case "updates":
        filters = [
          {
            field: "tag",
            key: "topic_updates",
            relation: "=",
            value: "true",
          },
        ];
        break;
      case "admin":
        filters = [
          {
            field: "tag",
            key: "role",
            relation: "=",
            value: "admin",
          },
        ];
        break;
      case "all":
      default:
        includedSegments = ["Subscribed Users"];
        break;
    }

    const result = await sendOneSignalPush({
      title,
      message,
      url,
      imageUrl: image_url,
      filters,
      includedSegments,
    });

    return result;
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Failed to dispatch notification.";
    return { success: false, error: msg };
  }
}

/**
 * Server-Side OneSignal Push Notification Engine.
 * Handles instant event triggers, automated scheduling, and targeted push delivery.
 */

export interface OneSignalFilter {
  field: "tag";
  key: string;
  relation: "=" | "!=" | "exists" | "not_exists";
  value?: string;
}

export interface SendPushOptions {
  title: string;
  message: string;
  url?: string;
  imageUrl?: string | null;
  filters?: OneSignalFilter[];
  includedSegments?: string[];
  sendAfter?: string; // ISO-8601 format or OneSignal date string
}

export interface PushResult {
  success: boolean;
  id?: string;
  recipients?: number;
  error?: string;
}

function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://spiritual-riders.vercel.app";
}

/**
 * Base sender: Makes an authenticated request to the OneSignal REST API.
 */
export async function sendOneSignalPush(
  options: SendPushOptions
): Promise<PushResult> {
  const appId =
    process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || process.env.ONESIGNAL_APP_ID;
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!appId || !apiKey) {
    console.warn(
      "[OneSignal Server] Push skipped: Missing NEXT_PUBLIC_ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY in environment."
    );
    return {
      success: false,
      error: "OneSignal server credentials not configured",
    };
  }

  try {
    const payload: Record<string, unknown> = {
      app_id: appId,
      headings: { en: options.title },
      contents: { en: options.message },
    };

    if (options.url) {
      const fullUrl = options.url.startsWith("http")
        ? options.url
        : `${getSiteUrl()}${options.url.startsWith("/") ? "" : "/"}${options.url}`;
      payload.url = fullUrl;
    }

    if (options.imageUrl) {
      payload.chrome_web_image = options.imageUrl;
      payload.big_picture = options.imageUrl;
    }

    if (options.sendAfter) {
      payload.send_after = options.sendAfter;
    }

    if (options.filters && options.filters.length > 0) {
      payload.filters = options.filters;
    } else if (options.includedSegments && options.includedSegments.length > 0) {
      payload.included_segments = options.includedSegments;
    } else {
      payload.included_segments = ["Subscribed Users"];
    }

    const res = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Basic ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const errMsg = Array.isArray(data.errors)
        ? data.errors.join(", ")
        : JSON.stringify(data.errors || data);
      console.error("[OneSignal Server] API error:", errMsg);
      return { success: false, error: errMsg };
    }

    return {
      success: true,
      id: data.id,
      recipients: data.recipients,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[OneSignal Server] Network request failed:", msg);
    return { success: false, error: msg };
  }
}

/**
 * TRIGGER 1: Notify all riders when a new ride is published.
 */
export async function notifyCrewNewRide(ride: {
  title: string;
  slug: string;
  start_date?: string | null;
  destination?: string | null;
  cover_image_url?: string | null;
}): Promise<PushResult> {
  const dateStr = ride.start_date
    ? new Date(ride.start_date).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const destStr = ride.destination ? `Destination: ${ride.destination}. ` : "";

  return sendOneSignalPush({
    title: `🏍️ New Ride Announced: ${ride.title}`,
    message: `${dateStr ? `Scheduled for ${dateStr}. ` : ""}${destStr}Tap to view route, meeting point & register.`,
    url: `/rides/${ride.slug}`,
    imageUrl: ride.cover_image_url,
    filters: [
      {
        field: "tag",
        key: "topic_rides",
        relation: "=",
        value: "true",
      },
    ],
  });
}

/**
 * TRIGGERS 2 & 3: Schedules automatic pre-ride and post-ride reminders.
 * - 24h Before Ride Starts: Pre-ride gear & meeting briefing
 * - 24h After Ride Ends: Ride completion recap & gallery upload invitation
 */
export async function scheduleRideReminders(ride: {
  title: string;
  slug: string;
  start_date?: string | null;
  end_date?: string | null;
  meeting_point?: string | null;
}): Promise<{ preRideResult?: PushResult; postRideResult?: PushResult }> {
  const results: { preRideResult?: PushResult; postRideResult?: PushResult } =
    {};
  const now = Date.now();

  // 1. Schedule 24h Pre-Ride Reminder
  if (ride.start_date) {
    const startTime = new Date(ride.start_date).getTime();
    // 24 hours prior to start date
    const preRideTarget = new Date(startTime - 24 * 60 * 60 * 1000);

    // Only schedule if the target time is at least 2 minutes in the future
    if (preRideTarget.getTime() > now + 120 * 1000) {
      results.preRideResult = await sendOneSignalPush({
        title: `⏰ Tomorrow is Ride Day: ${ride.title}`,
        message: `Tomorrow we ride! Meet point: ${ride.meeting_point || "Check route schedule"}. Inspect tires, top up fuel, and gear up!`,
        url: `/rides/${ride.slug}`,
        sendAfter: preRideTarget.toISOString(),
        filters: [
          {
            field: "tag",
            key: "topic_rides",
            relation: "=",
            value: "true",
          },
        ],
      });
    }
  }

  // 2. Schedule 24h Post-Ride Recap
  const finishDate = ride.end_date || ride.start_date;
  if (finishDate) {
    const finishTime = new Date(finishDate).getTime();
    // 24 hours after completion
    const postRideTarget = new Date(finishTime + 24 * 60 * 60 * 1000);

    if (postRideTarget.getTime() > now + 120 * 1000) {
      results.postRideResult = await sendOneSignalPush({
        title: `🏁 Ride Concluded: ${ride.title}`,
        message: `The dust has settled. Relive the ride highlights and explore photos in the Brotherhood Gallery.`,
        url: `/gallery`,
        sendAfter: postRideTarget.toISOString(),
        filters: [
          {
            field: "tag",
            key: "topic_rides",
            relation: "=",
            value: "true",
          },
        ],
      });
    }
  }

  return results;
}

/**
 * TRIGGER 4: Alert Admin when a new rider profile submission arrives.
 */
export async function notifyAdminNewSubmission(submission: {
  id: string;
  full_name: string;
  display_name: string;
  motorcycle_name?: string | null;
  is_update?: boolean;
}): Promise<PushResult> {
  const typeLabel = submission.is_update
    ? "Profile Update"
    : "New Rider Application";

  const bikeInfo = submission.motorcycle_name
    ? ` riding ${submission.motorcycle_name}`
    : "";

  return sendOneSignalPush({
    title: `🛡️ ${typeLabel}: ${submission.display_name}`,
    message: `${submission.full_name} (${submission.display_name})${bikeInfo} submitted for review. Tap to view submission.`,
    url: `/admin/onboarding/${submission.id}`,
    filters: [
      {
        field: "tag",
        key: "role",
        relation: "=",
        value: "admin",
      },
    ],
  });
}

/**
 * TRIGGER 5A: Notify the applicant that their profile has been approved.
 */
export async function notifyApplicantApproved(submission: {
  id: string;
  display_name: string;
  slug: string;
  is_update?: boolean;
}): Promise<PushResult> {
  const title = submission.is_update
    ? `✓ Profile Update Approved!`
    : `🎉 Welcome to Spiritual Riders!`;

  const message = submission.is_update
    ? `Your profile update has been verified and published to the Brotherhood Directory.`
    : `Your rider application has been approved! You are now live in the Brotherhood Directory.`;

  return sendOneSignalPush({
    title,
    message,
    url: `/riders/${submission.slug}`,
    filters: [
      {
        field: "tag",
        key: "submission_id",
        relation: "=",
        value: submission.id,
      },
    ],
  });
}

/**
 * TRIGGER 5B: Announce a newly approved brother to all subscribed members.
 */
export async function notifyBrotherhoodNewMember(rider: {
  display_name: string;
  full_name: string;
  slug: string;
  motorcycle_name?: string | null;
  cover_image_url?: string | null;
}): Promise<PushResult> {
  const bikeInfo = rider.motorcycle_name ? ` riding a ${rider.motorcycle_name}` : "";

  return sendOneSignalPush({
    title: `🔥 New Brother Welcomed: ${rider.display_name}`,
    message: `Give a warm welcome to ${rider.display_name} (${rider.full_name})${bikeInfo}! Check out their rider profile.`,
    url: `/riders/${rider.slug}`,
    imageUrl: rider.cover_image_url,
    filters: [
      {
        field: "tag",
        key: "topic_updates",
        relation: "=",
        value: "true",
      },
    ],
  });
}

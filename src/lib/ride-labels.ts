import type { PublicRideRow } from "@/lib/db/community-schema";

export const RIDE_TYPE_LABEL: Record<PublicRideRow["ride_type"], string> = {
  "day-ride": "Day ride",
  "weekend-ride": "Weekend",
  tour: "Tour",
  charity: "Charity",
  meetup: "Gathering",
  "dawn-patrol": "Dawn patrol",
  "night-ride": "Night ride",
};

export const RIDE_STATUS_LABEL: Record<PublicRideRow["status"], string> = {
  upcoming: "Ahead",
  ongoing: "On the road",
  completed: "Ridden",
  cancelled: "Called off",
};

export type CalculatedRideStatus = "upcoming" | "ongoing" | "completed";

export const CALCULATED_STATUS_LABEL: Record<CalculatedRideStatus, string> = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
};

export const CALCULATED_STATUS_BADGE: Record<CalculatedRideStatus, string> = {
  upcoming: "UPCOMING",
  ongoing: "ONGOING",
  completed: "COMPLETED",
};

/**
 * Returns today's date in YYYY-MM-DD format (local time).
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Automatically calculates ride status (upcoming, ongoing, completed)
 * from today's date and the ride's start/end dates.
 */
export function getCalculatedRideStatus(
  startDate: string,
  endDate?: string | null,
  referenceDate?: string
): CalculatedRideStatus {
  const today = referenceDate ?? getTodayDateString();
  const start = startDate.slice(0, 10);
  const end = endDate ? endDate.slice(0, 10) : start;

  if (today < start) {
    return "upcoming";
  }
  if (today > end) {
    return "completed";
  }
  return "ongoing";
}

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

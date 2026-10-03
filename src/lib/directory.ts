/**
 * Client-safe directory queries.
 * This module must not import rider records. Those stay on the server.
 */

import type { DirectoryRider, RidingStyle } from "@/types/rider";

export const STYLE_LABEL: Record<RidingStyle, string> = {
  touring: "Touring",
  adventure: "Adventure",
  cruiser: "Cruiser",
  sport: "Sport",
  naked: "Naked",
  offroad: "Off-road",
  commuter: "Commuter",
};

export interface DirectoryQuery {
  q: string;
  style: string;
  brand: string;
  position: string;
}

export function filterDirectoryRiders(
  riders: DirectoryRider[],
  query: DirectoryQuery
): DirectoryRider[] {
  const needle = query.q.trim().toLowerCase();

  return riders.filter((rider) => {
    if (query.style && !rider.riding_style.includes(query.style as RidingStyle)) {
      return false;
    }
    if (query.brand && rider.bike_brand !== query.brand) return false;
    if (query.position && rider.position_label !== query.position) return false;
    if (!needle) return true;

    const haystack = [
      rider.display_name,
      rider.bike_brand,
      rider.bike_model,
      rider.position_label,
      rider.city ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

/**
 * Date manipulation and age calculation utilities.
 */

/**
 * Calculates exact age in full years from an ISO date string (YYYY-MM-DD).
 */
export function calculateAgeFromDob(dobString: string | null | undefined): number | null {
  if (!dobString || typeof dobString !== "string") return null;

  const parts = dobString.split("-");
  if (parts.length !== 3) return null;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

  const birthDate = new Date(year, month, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 0 && age <= 120 ? age : null;
}

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Formats a Date object or ISO string deterministically in UTC (DD MMM YYYY).
 * Eliminates SSR hydration mismatches caused by different client/server locales.
 * Example: "09 Oct 2026"
 */
export function formatDeterministicDate(
  dateInput: string | Date | null | undefined
): string {
  if (!dateInput) return "—";
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return "—";

  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = SHORT_MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Formats a Date object or ISO string deterministically in UTC (DD MMM YYYY, HH:mm UTC).
 * Eliminates SSR hydration mismatches caused by different client/server locales.
 * Example: "09 Oct 2026, 07:04 UTC"
 */
export function formatDeterministicDateTime(
  dateInput: string | Date | null | undefined
): string {
  if (!dateInput) return "—";
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return "—";

  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = SHORT_MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes} UTC`;
}

/**
 * Formats a Date object or YYYY-MM-DD string into human-readable display.
 */
export function formatDateDisplay(dateInput: string | Date | null | undefined): string {
  return formatDeterministicDate(dateInput);
}

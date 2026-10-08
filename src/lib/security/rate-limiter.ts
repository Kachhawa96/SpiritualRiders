/**
 * In-memory sliding-window rate limiter for public forms.
 * Enforces max 10 requests per minute per IP address.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const threshold = now - windowMs;
  for (const [ip, record] of rateLimitStore.entries()) {
    const valid = record.timestamps.filter((ts) => ts > threshold);
    if (valid.length === 0) {
      rateLimitStore.delete(ip);
    } else {
      record.timestamps = valid;
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

/**
 * Check if the given identifier (e.g. IP address) is within the rate limit.
 *
 * @param identifier Client IP address or unique signature
 * @param maxRequests Maximum requests allowed within window (default: 10)
 * @param windowMs Window duration in milliseconds (default: 60,000 = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60 * 1000
): RateLimitResult {
  cleanupStaleEntries(windowMs);

  const now = Date.now();
  const threshold = now - windowMs;

  const record = rateLimitStore.get(identifier) ?? { timestamps: [] };
  // Keep only timestamps within the sliding window
  const activeTimestamps = record.timestamps.filter((ts) => ts > threshold);

  if (activeTimestamps.length >= maxRequests) {
    const oldest = activeTimestamps[0] ?? now;
    const resetSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetSeconds,
    };
  }

  activeTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: activeTimestamps });

  return {
    success: true,
    limit: maxRequests,
    remaining: maxRequests - activeTimestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}

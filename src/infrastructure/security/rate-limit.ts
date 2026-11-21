import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const MAX_BUCKETS = 5000;
const store = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim() || "unknown";
  }
  const realIp = request.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

/**
 * Bounded in-memory fixed-window rate limiter per client IP + route key.
 */
export function checkRateLimit(
  request: NextRequest,
  routeKey: string,
  limit = 60,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const key = `${routeKey}:${getClientIp(request)}`;

  // Evict expired entries if store grows large to prevent unbounded memory growth
  if (store.size >= MAX_BUCKETS) {
    for (const [entryKey, entry] of store.entries()) {
      if (entry.resetAt <= now) {
        store.delete(entryKey);
      }
    }
    if (store.size >= MAX_BUCKETS) {
      store.clear();
    }
  }

  const current = store.get(key);
  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000)
    );
    return { allowed: false, retryAfterSeconds };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

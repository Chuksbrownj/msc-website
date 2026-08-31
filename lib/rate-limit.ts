/**
 * MSC Website — In-Memory Rate Limiter
 *
 * Sliding-window rate limiter for API abuse protection.
 * Server-side only — never import in client components.
 *
 * Limitations (documented):
 * - In-memory state resets on serverless function cold starts
 * - Not shared across Vercel function instances
 * - On Vercel, each function invocation may have its own counter
 * - For production-grade rate limiting, use Upstash Redis
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  for (const [key, entry] of store) {
    if (now - entry.windowStart > windowMs) {
      store.delete(key);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  /** Maximum requests allowed per window. Default: 5 */
  maxRequests: number;
  /** Window duration in milliseconds. Default: 1 hour */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
};

/**
 * Check rate limit for a given key (typically an IP address).
 * Returns whether the request is allowed and metadata.
 */
export function checkRateLimit(
  key: string,
  config: Partial<RateLimitConfig> = {}
): RateLimitResult {
  const { maxRequests, windowMs } = { ...DEFAULT_CONFIG, ...config };
  const now = Date.now();
  const entry = store.get(key);

  // No entry or window expired — allow and start new window
  if (!entry || now - entry.windowStart > windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      retryAfterMs: 0,
    };
  }

  // Within window — check count
  if (entry.count < maxRequests) {
    entry.count += 1;
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      retryAfterMs: 0,
    };
  }

  // Rate limit exceeded
  const retryAfterMs = windowMs - (now - entry.windowStart);
  return {
    allowed: false,
    remaining: 0,
    retryAfterMs,
  };
}

/**
 * Extract client IP from request headers.
 * Falls back to "unknown" if no IP is found.
 */
export function getClientIp(request: Request): string {
  // Vercel/Next.js set these headers
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

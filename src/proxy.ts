import { NextRequest, NextResponse } from "next/server";
import { RATE_LIMIT_CONFIG } from "./constants";

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = RATE_LIMIT_CONFIG.MAX_REQUESTS_PER_WINDOW;
const WINDOW_SIZE = RATE_LIMIT_CONFIG.WINDOW_SIZE_MS;

/**
 * Cleans up expired entries from the rate limit store.
 * Removes entries where the reset time has passed.
 *
 * @param currentTime - Current timestamp for comparison
 */
function cleanupExpiredEntries(currentTime: number): void {
  for (const [key, value] of rateLimitStore.entries()) {
    if (currentTime > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

function getClientIP(request: NextRequest): string {
  // Try different headers to get the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  return "anonymous";
}

function getRateLimitStatus(ip: string) {
  const now = Date.now();
  const key = ip;

  let record = rateLimitStore.get(key);

  // Reset if window has passed
  if (!record || now > record.resetTime) {
    record = {
      count: 0,
      resetTime: now + WINDOW_SIZE
    };
  }

  record.count++;
  rateLimitStore.set(key, record);

  if (Math.random() < 0.1) {
    cleanupExpiredEntries(now);
  }

  return {
    success: record.count <= RATE_LIMIT,
    limit: RATE_LIMIT,
    remaining: Math.max(0, RATE_LIMIT - record.count),
    reset: record.resetTime
  };
}

export async function proxy(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
  if (isApiRoute) {
    const ip = getClientIP(request);

    const { success, limit, reset, remaining } = getRateLimitStatus(ip);

    const response = success
      ? NextResponse.next()
      : NextResponse.json(
          {
            error: "Too many requests",
            message: "Rate limit exceeded. Please try again later.",
            retryAfter: Math.ceil((reset - Date.now()) / 1000)
          },
          { status: 429 }
        );

    response.headers.set("X-RateLimit-Limit", limit.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set("X-RateLimit-Reset", new Date(reset).toISOString());

    if (!success) {
      response.headers.set("Retry-After", Math.ceil((reset - Date.now()) / 1000).toString());
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"]
};

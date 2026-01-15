export const QUERY_CONFIG = {
  // Stale times (how long data is considered fresh)
  STALE_TIME: {
    SHORT: 10 * 1000, // 10 seconds
    MEDIUM: 15 * 1000, // 15 seconds
    LONG: 60 * 1000 // 1 minute
  },

  // Garbage collection times (how long inactive queries stay in cache)
  GC_TIME: {
    SHORT: 5 * 60 * 1000, // 5 minutes
    MEDIUM: 10 * 60 * 1000, // 10 minutes
    LONG: 15 * 60 * 1000 // 15 minutes
  },

  // Refetch intervals for live data
  REFETCH_INTERVAL: {
    FAST: 15 * 1000, // 15 seconds
    NORMAL: 30 * 1000, // 30 seconds
    SLOW: 60 * 1000 // 1 minute
  },

  // Retry configuration
  RETRY: {
    COUNT: 3,
    DELAY_MULTIPLIER: 2,
    MAX_DELAY: 30 * 1000 // 30 seconds
  }
} as const;

export const RATE_LIMIT_CONFIG = {
  WINDOW_SIZE_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS_PER_WINDOW: 60 // 60 requests per window
} as const;

export const QUERY_KEYS = {
  EVENTS: ["events"],
  DASHBOARD_EVENTS: ["dashboard-events"]
} as const;

export const APP_MAX_WIDTH_PX = "1440px";

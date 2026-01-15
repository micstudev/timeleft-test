import { useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { getEvents } from "@/utils/api/getEvents";
import { useCallback, useEffect } from "react";
import { QUERY_CONFIG, QUERY_KEYS } from "@/constants";
import { Event } from "@/types/events";

interface UseDashboardEventsReturn extends Omit<UseQueryResult<Event[], Error>, "dataUpdatedAt"> {
  refreshData: () => void;
  lastUpdated: number;
  isLive: boolean;
}

/**
 * Custom hook for managing dashboard events data with live updates and enhanced features.
 *
 * This hook provides real-time event data fetching with automatic refresh capabilities,
 * optimized for dashboard usage where data freshness is critical.
 *
 * Features:
 * - Automatic refetching every 30 seconds
 * - Manual refresh capability
 * - Auto-refresh when user returns to the browser tab
 * - Live data indicators (fetching state)
 * - Optimized caching for dashboard performance
 *
 * @returns {UseDashboardEventsReturn} Dashboard events query result with enhanced functionality
 */
export const useDashboardEvents = (): UseDashboardEventsReturn => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_EVENTS,
    queryFn: getEvents,
    refetchInterval: QUERY_CONFIG.REFETCH_INTERVAL.NORMAL,
    staleTime: QUERY_CONFIG.STALE_TIME.MEDIUM,
    gcTime: QUERY_CONFIG.GC_TIME.MEDIUM,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: QUERY_CONFIG.RETRY.COUNT
  });

  const refreshData = useCallback((): void => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD_EVENTS });
  }, [queryClient]);

  useEffect(() => {
    const handleVisibilityChange = (): void => {
      if (!document.hidden && query.isStale) {
        refreshData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [query.isStale, refreshData]);

  return {
    ...query,
    refreshData,
    lastUpdated: query.dataUpdatedAt,
    isLive: query.isFetching
  };
};

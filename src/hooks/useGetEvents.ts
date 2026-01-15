import { useQuery } from "@tanstack/react-query";
import { getEvents } from "@/utils/api/getEvents";
import { QUERY_CONFIG, QUERY_KEYS } from "@/constants";

export const useGetEvents = () => {
  const {
    data: events,
    isLoading: loading,
    error
  } = useQuery({
    queryKey: QUERY_KEYS.EVENTS,
    queryFn: getEvents,
    refetchInterval: QUERY_CONFIG.REFETCH_INTERVAL.NORMAL,
    staleTime: QUERY_CONFIG.STALE_TIME.SHORT,
    gcTime: QUERY_CONFIG.GC_TIME.SHORT,
    refetchOnWindowFocus: true,
    retry: QUERY_CONFIG.RETRY.COUNT,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  return {
    events,
    loading,
    error: error?.message || null
  };
};

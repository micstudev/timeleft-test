"use client";

import { useDashboardEvents } from "@/hooks/useDashboardEvents";
import { StatsBox } from "@/components/stats/StatsBox";
import { EventFilters } from "@/components/table/Filtering";
import { TableComponent } from "@/components/table/Table";
import { MaxWidthWrapper } from "@/components/maxWidthWrapper/MaxWidthWrapper";
import { calculateEventStats } from "@/utils/events/calculateEventStats";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { LiveDataIndicator } from "@/components/liveDataIndicator/LiveDataIndicator";

export default function DashboardPage() {
  const { data: events, isLoading, error, isLive, lastUpdated, refreshData } = useDashboardEvents();
  const searchParams = useSearchParams();

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    const type = searchParams.get("type");
    const country = searchParams.get("country");
    const status = searchParams.get("status");

    let filtered = events;
    if (type) filtered = filtered.filter(e => e.type === type);
    if (country) filtered = filtered.filter(e => e.zone.city.country.name === country);
    if (status) filtered = filtered.filter(e => e.status === status);

    return filtered;
  }, [events, searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <div className="text-center">
          <p className="mb-4">Error loading dashboard data</p>
          <button onClick={refreshData} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const eventStats = calculateEventStats(filteredEvents ?? []);

  return (
    <div className="flex flex-col items-center justify-center w-screen p-7 md:p-14 ">
      <MaxWidthWrapper>
        <LiveDataIndicator isLive={isLive} lastUpdated={lastUpdated} refreshData={refreshData} />

        {/* Stats Grid */}
        {eventStats && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 mb-8">
            <StatsBox title="Total Events">{eventStats.totalEvents}</StatsBox>
            <StatsBox title="Upcoming Events">{eventStats.upcomingEvents}</StatsBox>
            <StatsBox title="Live Events">{eventStats.liveEvents}</StatsBox>
            <StatsBox title="Past Events">{eventStats.pastEvents}</StatsBox>
          </div>
        )}

        {events && events.length > 0 && <EventFilters events={events} />}
        <TableComponent events={filteredEvents ?? []} />
      </MaxWidthWrapper>
    </div>
  );
}

import { useMemo } from "react";
import { Event } from "@/types/events";

export function useEventTotals(events?: Event[]) {
  const totals = useMemo(() => {
    if (!events || events.length === 0) return null;

    return {
      totalEvents: events.length,
      totalCapacity: events.reduce((sum, event) => sum + event.capacity, 0),
      totalBooked: events.reduce((sum, event) => sum + event.booked, 0),
      uniqueCountries: new Set(events.map(e => e.zone.city.country.name)).size,
      uniqueCities: new Set(events.map(e => e.zone.city.name)).size,
      uniqueTypes: new Set(events.map(e => e.type)).size
    };
  }, [events]);

  return totals;
}

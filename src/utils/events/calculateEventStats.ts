import { Event } from "@/types/events";

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  liveEvents: number;
  pastEvents: number;
}

export function calculateEventStats(events: Event[]): EventStats {
  const now = new Date();

  const stats = events.reduce(
    (acc, event) => {
      const eventDate = new Date(event.date);

      if (event.status === "upcoming" || eventDate > now) {
        acc.upcomingEvents++;
      } else if (event.status === "live") {
        acc.liveEvents++;
      } else if (event.status === "past" || eventDate < now) {
        acc.pastEvents++;
      }

      return acc;
    },
    { totalEvents: 0, upcomingEvents: 0, liveEvents: 0, pastEvents: 0 }
  );

  stats.totalEvents = events.length;

  return stats;
}

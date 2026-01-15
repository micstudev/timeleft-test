import { calculateEventStats, EventStats } from "./calculateEventStats";
import { Event } from "@/types/events";

describe("calculateEventStats", () => {
  const mockZone = {
    id: 1,
    name: "11th",
    city: {
      id: 1,
      name: "Paris",
      country: {
        id: 1,
        name: "France"
      }
    }
  };

  it("should return correct stats for empty array", () => {
    const result = calculateEventStats([]);

    expect(result).toEqual({
      totalEvents: 0,
      upcomingEvents: 0,
      liveEvents: 0,
      pastEvents: 0
    });
  });

  it("should count upcoming events correctly", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const events: Event[] = [
      {
        id: "evt_1",
        type: "Coffee",
        date: futureDate.toISOString(),
        zone: mockZone,
        booked: 40,
        capacity: 50,
        status: "upcoming"
      }
    ];

    const result = calculateEventStats(events);

    expect(result.totalEvents).toBe(1);
    expect(result.upcomingEvents).toBe(1);
    expect(result.liveEvents).toBe(0);
    expect(result.pastEvents).toBe(0);
  });

  it("should count live events correctly", () => {
    const events: Event[] = [
      {
        id: "evt_1",
        type: "Coffee",
        date: new Date().toISOString(),
        zone: mockZone,
        booked: 40,
        capacity: 50,
        status: "live"
      }
    ];

    const result = calculateEventStats(events);

    expect(result.totalEvents).toBe(1);
    expect(result.liveEvents).toBe(1);
    expect(result.upcomingEvents).toBe(0);
    expect(result.pastEvents).toBe(0);
  });

  it("should count past events correctly", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);

    const events: Event[] = [
      {
        id: "evt_1",
        type: "Coffee",
        date: pastDate.toISOString(),
        zone: mockZone,
        booked: 40,
        capacity: 50,
        status: "past"
      }
    ];

    const result = calculateEventStats(events);

    expect(result.totalEvents).toBe(1);
    expect(result.pastEvents).toBe(1);
    expect(result.upcomingEvents).toBe(0);
    expect(result.liveEvents).toBe(0);
  });

  it("should handle mixed event statuses", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 7);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 7);

    const events: Event[] = [
      {
        id: "evt_1",
        type: "Coffee",
        date: futureDate.toISOString(),
        zone: mockZone,
        booked: 40,
        capacity: 50,
        status: "upcoming"
      },
      {
        id: "evt_2",
        type: "Meeting",
        date: new Date().toISOString(),
        zone: mockZone,
        booked: 20,
        capacity: 30,
        status: "live"
      },
      {
        id: "evt_3",
        type: "Conference",
        date: pastDate.toISOString(),
        zone: mockZone,
        booked: 50,
        capacity: 60,
        status: "past"
      }
    ];

    const result = calculateEventStats(events);

    expect(result.totalEvents).toBe(3);
    expect(result.upcomingEvents).toBe(1);
    expect(result.liveEvents).toBe(1);
    expect(result.pastEvents).toBe(1);
  });
});

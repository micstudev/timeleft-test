import { Event } from "@/types/events";
import { getEvents } from "./getEvents";

global.fetch = jest.fn();

describe("getEvents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and return events successfully", async () => {
    const mockEvents: Event[] = [
      {
        id: "evt_1",
        type: "Coffee",
        date: "2025-12-30T16:30:00Z",
        zone: {
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
        },
        booked: 40,
        capacity: 50,
        status: "upcoming"
      }
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents
    });

    const result = await getEvents();

    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/api/events");
    expect(result).toEqual(mockEvents);
  });

  it("should throw error when response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Internal Server Error"
    });

    await expect(getEvents()).rejects.toThrow("Failed to fetch events: Internal Server Error");
  });

  it("should throw error when fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    await expect(getEvents()).rejects.toThrow("Network error");
  });
});

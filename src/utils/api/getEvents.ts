import { Event } from "@/types/events";

export async function getEvents(): Promise<Event[]> {
  try {
    const response = await fetch("http://localhost:3000/api/events");

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data: Event[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

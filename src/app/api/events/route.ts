import { Event } from "@/types/events";
import { NextResponse } from "next/server";

const EVENTS_URL = "https://cdn.timeleft.com/frontend-tech-test/events.json";

export async function GET(): Promise<NextResponse<Event[] | { error: string }>> {
  try {
    if (!EVENTS_URL) {
      return NextResponse.json({ error: "EVENTS_URL not configured" }, { status: 500 });
    }

    const response = await fetch(`${EVENTS_URL}?t=${Date.now()}`, {
      headers: {
        "Cache-Control": "no-cache"
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch events" }, { status: response.status });
    }

    const data: Event[] = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=30, s-maxage=30",
        "X-Data-Timestamp": new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EventFilters } from "./Filtering";
import { Event } from "@/types/events";
import { useSearchParams } from "next/navigation";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn()
}));

jest.mock("@/hooks/useUpdateSearchParams", () => ({
  useUpdateSearchParams: jest.fn()
}));

describe("EventFilters", () => {
  const mockEvents: Event[] = [
    {
      id: "1",
      type: "Concert",
      date: "2024-01-15T19:00:00Z",
      capacity: 100,
      status: "upcoming",
      booked: 50,
      zone: {
        id: 1,
        name: "Zone A",
        city: { id: 1, name: "London", country: { id: 1, name: "UK" } }
      }
    },
    {
      id: "2",
      type: "Theater",
      date: "2024-01-20T20:00:00Z",
      capacity: 200,
      status: "live",
      booked: 75,
      zone: {
        id: 2,
        name: "Zone B",
        city: { id: 2, name: "Paris", country: { id: 2, name: "France" } }
      }
    },
    {
      id: "3",
      type: "Concert",
      date: "2024-02-10T18:00:00Z",
      capacity: 150,
      status: "live",
      booked: 100,
      zone: {
        id: 3,
        name: "Zone C",
        city: { id: 3, name: "London", country: { id: 1, name: "UK" } }
      }
    }
  ];

  const mockUpdateParam = jest.fn();
  const mockResetParams = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useUpdateSearchParams as jest.Mock).mockReturnValue({
      updateParam: mockUpdateParam,
      resetParams: mockResetParams
    });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(""));
  });

  describe("Rendering", () => {
    it("renders labels and reset button", () => {
      render(<EventFilters events={mockEvents} />);
      expect(screen.getByText("Event Type")).toBeInTheDocument();
      expect(screen.getByText("Country")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Reset Filters" })).toBeInTheDocument();
    });

    it("renders unique options for each filter", () => {
      render(<EventFilters events={mockEvents} />);

      const typeSelect = screen.getByLabelText("Event Type");
      const countrySelect = screen.getByLabelText("Country");
      const statusSelect = screen.getByLabelText("Status");

      expect(within(typeSelect).getByRole("option", { name: "Concert" })).toBeInTheDocument();
      expect(within(typeSelect).getByRole("option", { name: "Theater" })).toBeInTheDocument();

      expect(within(countrySelect).getByRole("option", { name: "UK" })).toBeInTheDocument();
      expect(within(countrySelect).getByRole("option", { name: "France" })).toBeInTheDocument();

      expect(within(statusSelect).getByRole("option", { name: "upcoming" })).toBeInTheDocument();
      expect(within(statusSelect).getByRole("option", { name: "live" })).toBeInTheDocument();
    });
  });

  describe("Search param binding", () => {
    it("selects initial values from search params", () => {
      (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams("type=Theater&country=France&status=live"));

      render(<EventFilters events={mockEvents} />);

      const typeSelect = screen.getByLabelText("Event Type") as HTMLSelectElement;
      const countrySelect = screen.getByLabelText("Country") as HTMLSelectElement;
      const statusSelect = screen.getByLabelText("Status") as HTMLSelectElement;

      expect(typeSelect.value).toBe("Theater");
      expect(countrySelect.value).toBe("France");
      expect(statusSelect.value).toBe("live");
    });
  });

  describe("Interactions", () => {
    it("updates search params when selecting values", async () => {
      const user = userEvent.setup();
      render(<EventFilters events={mockEvents} />);

      const typeSelect = screen.getByLabelText("Event Type");
      const countrySelect = screen.getByLabelText("Country");
      const statusSelect = screen.getByLabelText("Status");

      await user.selectOptions(typeSelect, "Concert");
      await user.selectOptions(countrySelect, "UK");
      await user.selectOptions(statusSelect, "upcoming");

      expect(mockUpdateParam).toHaveBeenCalledWith("type", "Concert");
      expect(mockUpdateParam).toHaveBeenCalledWith("country", "UK");
      expect(mockUpdateParam).toHaveBeenCalledWith("status", "upcoming");
    });

    it("resets filters when clicking Reset Filters", async () => {
      const user = userEvent.setup();
      render(<EventFilters events={mockEvents} />);

      const resetButton = screen.getByRole("button", { name: "Reset Filters" });
      await user.click(resetButton);

      expect(mockResetParams).toHaveBeenCalledTimes(1);
    });

    it("clears a filter when selecting placeholder (empty value)", async () => {
      const user = userEvent.setup();
      render(<EventFilters events={mockEvents} />);

      const typeSelect = screen.getByLabelText("Event Type");
      await user.selectOptions(typeSelect, "");

      expect(mockUpdateParam).toHaveBeenCalledWith("type", null);
    });
  });
});

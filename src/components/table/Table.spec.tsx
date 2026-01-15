import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableComponent } from "./Table";
import { Event } from "@/types/events";

describe("TableComponent", () => {
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
        city: {
          id: 1,
          name: "London",
          country: { id: 1, name: "UK" }
        }
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
        city: {
          id: 2,
          name: "Paris",
          country: { id: 2, name: "France" }
        }
      }
    }
  ];

  describe("Empty State", () => {
    it("shows empty state message when no events", () => {
      render(<TableComponent events={[]} />);
      expect(screen.getByText("No Events to display")).toBeInTheDocument();
      expect(screen.getByText("Check back soon for upcoming events")).toBeInTheDocument();
    });

    it("shows empty state when events is undefined", () => {
      render(<TableComponent />);
      expect(screen.getByText("No Events to display")).toBeInTheDocument();
    });
  });

  describe("Table with Data", () => {
    it("renders table structure and caption", () => {
      render(<TableComponent events={mockEvents} />);
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Showing 1 to 2 of 2 events")).toBeInTheDocument();
    });

    it("displays event data in table rows", () => {
      render(<TableComponent events={mockEvents} />);
      expect(screen.getAllByText("Concert").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Theater").length).toBeGreaterThan(0);
      expect(screen.getByText("UK")).toBeInTheDocument();
      expect(screen.getByText("France")).toBeInTheDocument();
      expect(screen.getByText("London")).toBeInTheDocument();
      expect(screen.getByText("Paris")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("200")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("75")).toBeInTheDocument();
      expect(screen.getByText("upcoming")).toBeInTheDocument();
      expect(screen.getByText("live")).toBeInTheDocument();
    });

    it("renders footer totals in expected format", () => {
      render(<TableComponent events={mockEvents} />);
      expect(screen.getByText("2 Events")).toBeInTheDocument();
      expect(screen.getByText("2 Countries")).toBeInTheDocument();
      expect(screen.getByText("2 Cities")).toBeInTheDocument();
      expect(screen.getByText("300 Capacity")).toBeInTheDocument();
      expect(screen.getByText("2 Types")).toBeInTheDocument();
      expect(screen.getByText("125 Booked")).toBeInTheDocument();
      expect(screen.getAllByText("-").length).toBe(2);
    });
  });

  describe("Row Interaction", () => {
    it("data rows are hoverable", () => {
      render(<TableComponent events={mockEvents} />);
      const rows = screen.getAllByRole("row");
      const dataRows = rows.slice(1, -1); // exclude header and footer
      dataRows.forEach(row => {
        expect(row).toHaveClass("hover:bg-gray-100");
        expect(row).toHaveClass("cursor-pointer");
      });
    });

    it("opens modal when a row is clicked", async () => {
      const user = userEvent.setup();
      render(<TableComponent events={mockEvents} />);
      const rows = screen.getAllByRole("row");
      const firstDataRow = rows[1];

      await user.click(firstDataRow);
      expect(screen.getByText("Concert - 1")).toBeInTheDocument();
    });
  });

  describe("Date Formatting", () => {
    it("formats dates using toLocaleDateString", () => {
      render(<TableComponent events={mockEvents} />);
      const expectedDate1 = new Date("2024-01-15T19:00:00Z").toLocaleDateString();
      const expectedDate2 = new Date("2024-01-20T20:00:00Z").toLocaleDateString();
      expect(screen.getByText(expectedDate1)).toBeInTheDocument();
      expect(screen.getByText(expectedDate2)).toBeInTheDocument();
    });
  });

  describe("Sorting Functionality", () => {
    it("has sortable header buttons", () => {
      render(<TableComponent events={mockEvents} />);
      const sortButtons = screen.getAllByRole("button");
      expect(sortButtons.length).toBeGreaterThan(0);
    });

    it("clicks specific sort header without ambiguity", async () => {
      const user = userEvent.setup();
      render(<TableComponent events={mockEvents} />);
      const eventHeaderBtn = screen.getByRole("button", { name: "Event" });
      await user.click(eventHeaderBtn);

      const rows = screen.getAllByRole("row");
      const firstDataRow = rows[1];
      expect(within(firstDataRow).getAllByText("Concert").length).toBeGreaterThan(0);
    });
  });

  describe("Modal Integration", () => {
    it("modal is initially closed", () => {
      render(<TableComponent events={mockEvents} />);
      expect(screen.queryByText("Concert - 1")).not.toBeInTheDocument();
      expect(screen.queryByText("Theater - 2")).not.toBeInTheDocument();
    });
  });

  describe("Table Structure", () => {
    it("has correct number of rows", () => {
      render(<TableComponent events={mockEvents} />);
      const rows = screen.getAllByRole("row");
      expect(rows).toHaveLength(4); // header + 2 data + footer
    });

    it("table cells have expected styling", () => {
      render(<TableComponent events={mockEvents} />);
      const cells = document.querySelectorAll(".text-md.capitalize");
      expect(cells.length).toBeGreaterThan(0);
    });
  });

  describe("Pagination", () => {
    it("shows pagination caption", () => {
      render(<TableComponent events={mockEvents} />);
      expect(screen.getByText("Showing 1 to 2 of 2 events")).toBeInTheDocument();
    });

    it("does not show pagination controls with one page", () => {
      render(<TableComponent events={mockEvents} />);
      expect(screen.queryByText("Previous")).not.toBeInTheDocument();
      expect(screen.queryByText("Next")).not.toBeInTheDocument();
    });
  });
});

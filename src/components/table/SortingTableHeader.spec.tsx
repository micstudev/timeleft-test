import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableHeaderWithSort, SortConfig } from "./SortingTableHeader";

describe("TableHeaderWithSort", () => {
  const mockHandleSort = jest.fn();

  const defaultSortConfig: SortConfig = { field: null, direction: null };
  const defaultProps = { sortConfig: defaultSortConfig, handleSort: mockHandleSort };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders all header columns", () => {
      render(<TableHeaderWithSort {...defaultProps} />);
      expect(screen.getByText("Event")).toBeInTheDocument();
      expect(screen.getByText("Country")).toBeInTheDocument();
      expect(screen.getByText("City")).toBeInTheDocument();
      expect(screen.getByText("Date")).toBeInTheDocument();
      expect(screen.getByText("Capacity")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Type")).toBeInTheDocument();
      expect(screen.getByText("Booked")).toBeInTheDocument();
    });

    it("renders 7 sortable buttons (Type is not sortable)", () => {
      render(<TableHeaderWithSort {...defaultProps} />);
      const sortButtons = screen.getAllByRole("button");
      expect(sortButtons).toHaveLength(7);
    });

    it("shows default up/down icons for inactive columns", () => {
      render(<TableHeaderWithSort {...defaultProps} />);
      const upDownIcons = document.querySelectorAll(".lucide-chevrons-up-down");
      expect(upDownIcons).toHaveLength(7);
    });
  });

  describe("Active Sorting States", () => {
    it("shows ascending arrow for active ascending sort", () => {
      const ascendingSortConfig: SortConfig = { field: "type", direction: "asc" };
      render(<TableHeaderWithSort sortConfig={ascendingSortConfig} handleSort={mockHandleSort} />);
      expect(document.querySelector(".lucide-chevron-up")).toBeInTheDocument();
    });

    it("shows descending arrow for active descending sort", () => {
      const descendingSortConfig: SortConfig = { field: "capacity", direction: "desc" };
      render(<TableHeaderWithSort sortConfig={descendingSortConfig} handleSort={mockHandleSort} />);
      expect(document.querySelector(".lucide-chevron-down")).toBeInTheDocument();
    });

    it("inactive columns keep up/down icons", () => {
      const sortConfig: SortConfig = { field: "type", direction: "asc" };
      render(<TableHeaderWithSort sortConfig={sortConfig} handleSort={mockHandleSort} />);
      expect(document.querySelectorAll(".lucide-chevron-up")).toHaveLength(1);
      expect(document.querySelectorAll(".lucide-chevrons-up-down")).toHaveLength(6);
    });
  });

  describe("User Interactions", () => {
    it("calls handleSort for Event header", async () => {
      const user = userEvent.setup();
      render(<TableHeaderWithSort {...defaultProps} />);
      const eventButton = screen.getByRole("button", { name: "Event" });
      await user.click(eventButton);
      expect(mockHandleSort).toHaveBeenCalledWith("type");
    });

    it("calls handleSort with correct field for each sortable column (exact names)", async () => {
      const user = userEvent.setup();
      render(<TableHeaderWithSort {...defaultProps} />);

      const cases = [
        { name: "Event", field: "type" },
        { name: "Country", field: "country" },
        { name: "City", field: "city" }, // exact, avoids matching "Capacity"
        { name: "Date", field: "date" },
        { name: "Capacity", field: "capacity" },
        { name: "Status", field: "status" },
        { name: "Booked", field: "booked" }
      ];

      for (const { name, field } of cases) {
        const btn = screen.getByRole("button", { name });
        await user.click(btn);
        expect(mockHandleSort).toHaveBeenCalledWith(field);
      }
      expect(mockHandleSort).toHaveBeenCalledTimes(7);
    });

    it("does not call handleSort when clicking non-sortable Type", async () => {
      const user = userEvent.setup();
      render(<TableHeaderWithSort {...defaultProps} />);
      const typeText = screen.getByText("Type");
      await user.click(typeText);
      expect(mockHandleSort).not.toHaveBeenCalled();
    });
  });

  describe("Styling and structure", () => {
    it("applies expected button classes", () => {
      render(<TableHeaderWithSort {...defaultProps} />);
      const buttons = screen.getAllByRole("button");
      buttons.forEach(b => {
        expect(b).toHaveClass(
          "flex",
          "items-center",
          "gap-2",
          "hover:text-gray-900",
          "transition-colors",
          "font-medium"
        );
      });
    });

    it("renders table header cells", () => {
      render(<TableHeaderWithSort {...defaultProps} />);
      expect(document.querySelector("thead")).toBeInTheDocument();
      expect(document.querySelectorAll("th")).toHaveLength(8);
      const expectedOrder = ["Event", "Country", "City", "Date", "Capacity", "Status", "Type", "Booked"];
      document.querySelectorAll("th").forEach((th, i) => {
        expect(th).toHaveTextContent(expectedOrder[i]);
      });
    });
  });
});

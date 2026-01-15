"use client";

import { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { Event } from "@/types/events";
import { Modal } from "@/components/modal/Modal";
import { usePagination } from "@/hooks/usePagination";
import { useEventTotals } from "@/hooks/useEventTotals";
import { SortableField, SortConfig, TableHeaderWithSort } from "./SortingTableHeader";
import { StatsModalContent } from "../stats/StatModalContent";
import { PaginationControls } from "./PaginatonControls";

const getSortValue = (event: Event, field: SortableField): string | number => {
  switch (field) {
    case "type":
      return event.type;
    case "country":
      return event.zone.city.country.name;
    case "city":
      return event.zone.city.name;
    case "date":
      return new Date(event.date).getTime();
    case "capacity":
      return event.capacity;
    case "status":
      return event.status;
    case "booked":
      return event.booked;
    default:
      return "";
  }
};

const sortEvents = (events: Event[], sortConfig: SortConfig): Event[] => {
  if (!sortConfig.field || !sortConfig.direction) {
    return events;
  }

  return [...events].sort((a, b) => {
    const aValue = getSortValue(a, sortConfig.field!);
    const bValue = getSortValue(b, sortConfig.field!);

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
};

const TableCellComponent = ({ content }: { content: React.ReactNode }) => {
  return <TableCell className="text-md capitalize">{content}</TableCell>;
};

const ITEMS_PER_PAGE = 10;

export function TableComponent({ events }: { events?: Event[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: null, direction: null });

  const sortedEvents = sortEvents(events ?? [], sortConfig);

  const {
    paginatedItems: paginatedEvents,
    totalPages,
    startIndex,
    endIndex,
    currentPage,
    setCurrentPage
  } = usePagination(sortedEvents, ITEMS_PER_PAGE);

  const totals = useEventTotals(events);

  const handleSort = (field: SortableField) => {
    setSortConfig(prev => {
      if (prev.field === field) {
        if (prev.direction === "asc") {
          return { field, direction: "desc" };
        }
        if (prev.direction === "desc") {
          return { field: null, direction: null };
        }
      }
      return { field, direction: "asc" };
    });
    setCurrentPage(1);
  };

  const handleRowClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!events || events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50">
          <p className="text-lg text-gray-600 font-medium">No Events to display</p>
          <p className="text-sm text-gray-400 mt-2">Check back soon for upcoming events</p>
        </div>
      </div>
    );
  }

  const footerCells = [
    { label: "Events", value: totals?.totalEvents },
    { label: "Countries", value: totals?.uniqueCountries },
    { label: "Cities", value: totals?.uniqueCities },
    { label: "-", value: "-" },
    { label: "Capacity", value: totals?.totalCapacity },
    { label: "-", value: "-" },
    { label: "Types", value: totals?.uniqueTypes },
    { label: "Booked", value: totals?.totalBooked }
  ];

  const tableColumns = [
    (event: Event) => event.type,
    (event: Event) => event.zone.city.country.name,
    (event: Event) => event.zone.city.name,
    (event: Event) => new Date(event.date).toLocaleDateString(),
    (event: Event) => event.capacity,
    (event: Event) => event.status,
    (event: Event) => event.type,
    (event: Event) => event.booked
  ];

  return (
    <>
      <Table className="w-full mx-auto">
        <TableCaption>
          Showing {startIndex + 1} to {endIndex} of {sortedEvents.length} events
        </TableCaption>
        <TableHeaderWithSort sortConfig={sortConfig} handleSort={handleSort} />
        <TableBody>
          {paginatedEvents.map(event => (
            <TableRow key={event.id} onClick={() => handleRowClick(event)} className="cursor-pointer hover:bg-gray-100">
              {tableColumns.map((getValue, index) => (
                <TableCellComponent key={index} content={getValue(event)} />
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="font-semibold">
            {footerCells.map((cell, index) => (
              <TableCell key={index}>{cell.value === "-" ? cell.value : `${cell.value} ${cell.label}`}</TableCell>
            ))}
          </TableRow>
        </TableFooter>
      </Table>

      {totalPages > 1 && (
        <PaginationControls currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${selectedEvent?.type} - ${selectedEvent?.id}`}>
        {selectedEvent && <StatsModalContent selectedEvent={selectedEvent} />}
      </Modal>
    </>
  );
}

"use client";

import { Event } from "@/types/events";
import { useSearchParams } from "next/navigation";
import { Label } from "../label/Label";
import { Select } from "../select/Select";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";

interface EventFiltersProps {
  events: Event[];
}

interface FilterConfig {
  key: string;
  label: string;
  options: string[];
  placeholder: string;
}

export const EventFilters = ({ events }: EventFiltersProps) => {
  const searchParams = useSearchParams();
  const { updateParam, resetParams } = useUpdateSearchParams();

  const eventTypes = Array.from(new Set(events.map(e => e.type)));
  const countries = Array.from(new Set(events.map(e => e.zone.city.country.name)));
  const statuses = Array.from(new Set(events.map(e => e.status)));

  const filters: FilterConfig[] = [
    { key: "type", label: "Event Type", options: eventTypes, placeholder: "All Types" },
    { key: "country", label: "Country", options: countries, placeholder: "All Countries" },
    { key: "status", label: "Status", options: statuses, placeholder: "All Statuses" }
  ];

  return (
    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
        {filters.map(filter => (
          <div key={filter.key} className="flex-1">
            <Label htmlFor={filter.key} className="block text-gray-700 mb-1">
              {filter.label}
            </Label>
            <Select
              id={filter.key}
              value={searchParams.get(filter.key) || ""}
              onChange={e => updateParam(filter.key, e.target.value || null)}
              options={filter.options.map(opt => ({ value: opt, label: opt }))}
              placeholder={filter.placeholder}
            />
          </div>
        ))}

        <button
          onClick={resetParams}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

"use client";

import { Event } from "@/types/events";
import { useRouter, useSearchParams } from "next/navigation";

interface EventFiltersProps {
  events: Event[];
}

interface FilterConfig {
  key: string;
  label: string;
  options: string[];
  placeholder: string;
}

// Simple Label component
function Label({ htmlFor, children, className }: { htmlFor: string; children: React.ReactNode; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
    </label>
  );
}

// Simple Select component
function Select({
  id,
  value,
  onChange,
  options,
  placeholder
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
      <option value="">{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function EventFilters({ events }: EventFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract unique values for filters
  const eventTypes = Array.from(new Set(events.map(e => e.type)));
  const countries = Array.from(new Set(events.map(e => e.zone.city.country.name)));
  const statuses = Array.from(new Set(events.map(e => e.status)));

  const filters: FilterConfig[] = [
    { key: "type", label: "Event Type", options: eventTypes, placeholder: "All Types" },
    { key: "country", label: "Country", options: countries, placeholder: "All Countries" },
    { key: "status", label: "Status", options: statuses, placeholder: "All Statuses" }
  ];

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/");
  };

  const handleReset = () => {
    router.push("/");
  };

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
              onChange={e => updateFilters(filter.key, e.target.value)}
              options={filter.options.map(opt => ({ value: opt, label: opt }))}
              placeholder={filter.placeholder}
            />
          </div>
        ))}

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium">
          Reset Filters
        </button>
      </div>
    </div>
  );
}

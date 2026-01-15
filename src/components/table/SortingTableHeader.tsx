import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

type SortDirection = "asc" | "desc" | null;
type SortableField = "type" | "country" | "city" | "date" | "capacity" | "status" | "booked";

interface SortConfig {
  field: SortableField | null;
  direction: SortDirection;
}

interface SortButton {
  field: SortableField;
  label: string;
  handleSort: (field: SortableField) => void;
  sortConfig: SortConfig;
}

const SortButton = ({ field, label, handleSort, sortConfig }: SortButton) => {
  const isActive = sortConfig.field === field;
  return (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-2 hover:text-gray-900 transition-colors font-medium">
      {label}
      {isActive ? (
        sortConfig.direction === "asc" ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )
      ) : (
        <ChevronsUpDown className="w-4 h-4 opacity-40" />
      )}
    </button>
  );
};

interface TableHeaderComponentProps {
  sortConfig: SortConfig;
  handleSort: (field: SortableField) => void;
}

export function TableHeaderWithSort({ sortConfig, handleSort }: TableHeaderComponentProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-md">
          <SortButton field="type" label="Event" handleSort={handleSort} sortConfig={sortConfig} />
        </TableHead>
        <TableHead className="text-md">
          <SortButton field="country" label="Country" handleSort={handleSort} sortConfig={sortConfig} />
        </TableHead>
        <TableHead className="text-md">
          <SortButton field="city" label="City" handleSort={handleSort} sortConfig={sortConfig} />
        </TableHead>
        <TableHead className="text-md">
          <SortButton field="date" label="Date" handleSort={handleSort} sortConfig={sortConfig} />
        </TableHead>
        <TableHead className="text-md">
          <SortButton field="capacity" label="Capacity" handleSort={handleSort} sortConfig={sortConfig} />
        </TableHead>
        <TableHead className="text-md">
          <SortButton field="status" label="Status" handleSort={handleSort} sortConfig={sortConfig} />
        </TableHead>
        <TableHead className="text-md">Type</TableHead>
        <TableHead className="text-md">
          <SortButton field="booked" label="Booked" handleSort={handleSort} sortConfig={sortConfig} />
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

export type { SortConfig, SortableField, SortDirection };

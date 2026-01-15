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

export const TableHeaderWithSort = ({ sortConfig, handleSort }: TableHeaderComponentProps) => {
  const headerColumns = [
    { field: "type" as SortableField, label: "Event", sortable: true },
    { field: "country" as SortableField, label: "Country", sortable: true },
    { field: "city" as SortableField, label: "City", sortable: true },
    { field: "date" as SortableField, label: "Date", sortable: true },
    { field: "capacity" as SortableField, label: "Capacity", sortable: true },
    { field: "status" as SortableField, label: "Status", sortable: true },
    { field: null, label: "Type", sortable: false },
    { field: "booked" as SortableField, label: "Booked", sortable: true }
  ];

  return (
    <TableHeader>
      <TableRow>
        {headerColumns.map((column, index) => (
          <TableHead key={index} className="text-md">
            {column.sortable && column.field ? (
              <SortButton field={column.field} label={column.label} handleSort={handleSort} sortConfig={sortConfig} />
            ) : (
              column.label
            )}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
};

export type { SortConfig, SortableField, SortDirection };

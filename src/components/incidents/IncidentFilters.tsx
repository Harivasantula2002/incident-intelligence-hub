import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ALL_ASSIGNMENT_GROUPS, SERVICES, categoriesFor } from "@/services/dataset";
import type { IncidentFilters as Filters } from "@/types";
import { ALL_COLUMNS, type ColumnKey } from "./IncidentTable";

const ANY = "__any__";

export function IncidentFilterBar({
  filters,
  onChange,
  visibleColumns,
  onToggleColumn,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  visibleColumns: Set<ColumnKey>;
  onToggleColumn: (col: ColumnKey) => void;
}) {
  const set = (key: keyof Filters, value: string) =>
    onChange({ ...filters, [key]: value === ANY ? undefined : value });

  const active = Object.entries(filters).filter(([, v]) => v !== undefined && v !== "").length;

  const FilterSelect = ({
    label,
    field,
    options,
  }: {
    label: string;
    field: keyof Filters;
    options: string[];
  }) => (
    <div className="min-w-0">
      <Label className="sr-only">{label}</Label>
      <Select value={(filters[field] as string) ?? ANY} onValueChange={(v) => set(field, v)}>
        <SelectTrigger className="h-9 w-full text-xs sm:w-auto sm:min-w-36" aria-label={label}>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>{label}: Any</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="panel mb-4 flex flex-wrap items-center gap-2 p-3">
      <div className="relative min-w-56 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={filters.search ?? ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search incident ID, description, cluster or assignment group"
          className="h-9 pl-8"
          aria-label="Search incidents"
        />
      </div>

      <FilterSelect label="Service" field="service" options={SERVICES} />
      <FilterSelect
        label="Category"
        field="category"
        options={filters.service ? categoriesFor(filters.service) : []}
      />
      <FilterSelect label="Assignment Group" field="assignmentGroup" options={[...ALL_ASSIGNMENT_GROUPS]} />
      <FilterSelect label="Priority" field="priority" options={["P1", "P2", "P3", "P4"]} />
      <FilterSelect label="State" field="state" options={["New", "In Progress", "Resolved", "Closed"]} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <SlidersHorizontal className="size-4" aria-hidden />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ALL_COLUMNS.map((col) => (
            <DropdownMenuCheckboxItem
              key={col}
              checked={visibleColumns.has(col)}
              onCheckedChange={() => onToggleColumn(col)}
              onSelect={(e) => e.preventDefault()}
            >
              {col}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {active > 0 ? (
        <Button variant="ghost" size="sm" className="h-9" onClick={() => onChange({})}>
          <X className="size-4" aria-hidden />
          Clear ({active})
        </Button>
      ) : null}
    </div>
  );
}

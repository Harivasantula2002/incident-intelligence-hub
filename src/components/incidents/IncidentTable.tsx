import { Link } from "@tanstack/react-router";
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfidenceBar } from "@/components/common/Confidence";
import {
  ClassificationStatusBadge,
  MembershipBadge,
  PriorityBadge,
  StateBadge,
} from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Incident, Paginated } from "@/types";

export const ALL_COLUMNS = [
  "Incident ID",
  "Created",
  "State",
  "Priority",
  "Service",
  "Category",
  "Subcategory",
  "Assignment Group",
  "Short Description",
  "Cluster",
  "Classification",
  "Cluster Conf.",
  "Status",
] as const;

export type ColumnKey = (typeof ALL_COLUMNS)[number];

export function IncidentTable({
  data,
  isLoading,
  visibleColumns,
  page,
  onPageChange,
  sortBy,
  sortDir,
  onSort,
}: {
  data?: Paginated<Incident>;
  isLoading: boolean;
  visibleColumns: Set<ColumnKey>;
  page: number;
  onPageChange: (p: number) => void;
  sortBy: keyof Incident;
  sortDir: "asc" | "desc";
  onSort: (key: keyof Incident) => void;
}) {
  const show = (c: ColumnKey) => visibleColumns.has(c);

  if (isLoading) {
    return (
      <div className="panel space-y-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <EmptyState
        title="No incidents match your current filters"
        description="Adjust the search term, clear one or more filters, or switch tabs to see other incident populations."
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  const SortHead = ({ label, field }: { label: string; field: keyof Incident }) => (
    <TableHead className="whitespace-nowrap">
      <button
        type="button"
        onClick={() => onSort(field)}
        className="inline-flex items-center gap-1 hover:text-foreground"
        aria-label={`Sort by ${label}`}
      >
        {label}
        <ArrowUpDown
          className={cn("size-3", sortBy === field ? "text-primary" : "text-muted-foreground/50")}
          aria-hidden
        />
      </button>
      {sortBy === field ? <span className="sr-only">sorted {sortDir}</span> : null}
    </TableHead>
  );

  return (
    <div className="panel overflow-hidden">
      <div className="max-h-[62vh] overflow-auto">
        <Table className="text-sm">
          <TableHeader className="sticky top-0 z-10 bg-muted/70 backdrop-blur">
            <TableRow className="hover:bg-transparent">
              {show("Incident ID") && <SortHead label="Incident ID" field="id" />}
              {show("Created") && <SortHead label="Created" field="createdAt" />}
              {show("State") && <TableHead>State</TableHead>}
              {show("Priority") && <TableHead>Priority</TableHead>}
              {show("Service") && <SortHead label="Service" field="service" />}
              {show("Category") && <TableHead>Category</TableHead>}
              {show("Subcategory") && <TableHead>Subcategory</TableHead>}
              {show("Assignment Group") && <TableHead>Assignment Group</TableHead>}
              {show("Short Description") && <TableHead className="min-w-64">Short Description</TableHead>}
              {show("Cluster") && <TableHead>Cluster</TableHead>}
              {show("Classification") && (
                <SortHead label="Classification Conf." field="classificationConfidence" />
              )}
              {show("Cluster Conf.") && <SortHead label="Cluster Conf." field="clusterConfidence" />}
              {show("Status") && <TableHead>Status</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.items.map((incident) => (
              <TableRow key={incident.id} className="group">
                {show("Incident ID") && (
                  <TableCell className="num font-medium whitespace-nowrap">
                    <Link
                      to="/incidents/$id"
                      params={{ id: incident.id }}
                      className="text-primary hover:underline"
                    >
                      {incident.id}
                    </Link>
                  </TableCell>
                )}
                {show("Created") && (
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatDate(incident.createdAt)}
                  </TableCell>
                )}
                {show("State") && (
                  <TableCell>
                    <StateBadge state={incident.state} />
                  </TableCell>
                )}
                {show("Priority") && (
                  <TableCell>
                    <PriorityBadge priority={incident.priority} />
                  </TableCell>
                )}
                {show("Service") && <TableCell className="whitespace-nowrap">{incident.service}</TableCell>}
                {show("Category") && <TableCell className="whitespace-nowrap">{incident.category}</TableCell>}
                {show("Subcategory") && (
                  <TableCell className="whitespace-nowrap">{incident.subcategory}</TableCell>
                )}
                {show("Assignment Group") && (
                  <TableCell className="whitespace-nowrap">{incident.assignmentGroup}</TableCell>
                )}
                {show("Short Description") && (
                  <TableCell className="max-w-80 truncate" title={incident.shortDescription}>
                    {incident.shortDescription}
                  </TableCell>
                )}
                {show("Cluster") && (
                  <TableCell className="whitespace-nowrap">
                    {incident.clusterName ? (
                      <div className="flex flex-col">
                        <span className="text-xs">{incident.clusterName}</span>
                        <span className="num text-[10px] text-muted-foreground">{incident.clusterId}</span>
                      </div>
                    ) : (
                      <MembershipBadge membership="unclustered" />
                    )}
                  </TableCell>
                )}
                {show("Classification") && (
                  <TableCell className="w-36">
                    <ConfidenceBar value={incident.classificationConfidence} label="Classification confidence" />
                  </TableCell>
                )}
                {show("Cluster Conf.") && (
                  <TableCell className="w-36">
                    <ConfidenceBar value={incident.clusterConfidence} label="Cluster confidence" />
                  </TableCell>
                )}
                {show("Status") && (
                  <TableCell>
                    <ClassificationStatusBadge status={incident.classificationStatus} />
                  </TableCell>
                )}
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/incidents/$id" params={{ id: incident.id }}>
                      <Eye className="size-4" aria-hidden />
                      <span className="sr-only sm:not-sr-only">View</span>
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <p>
          Showing <span className="num">{(page - 1) * data.pageSize + 1}</span>–
          <span className="num">{Math.min(page * data.pageSize, data.total)}</span> of{" "}
          <span className="num">{data.total}</span> incidents
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-4" aria-hidden /> Previous
          </Button>
          <span className="num">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Next <ChevronRight className="size-4" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}

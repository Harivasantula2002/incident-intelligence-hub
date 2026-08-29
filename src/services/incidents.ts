import { request } from "./api-client";
import { buildDataset } from "./dataset";
import type {
  DistributionPoint,
  Incident,
  IncidentFilters,
  KpiSummary,
  Paginated,
  SimilarIncident,
} from "@/types";

export type IncidentTab =
  | "all"
  | "review"
  | "candidate"
  | "unclustered"
  | "recent";

function matches(incident: Incident, filters: IncidentFilters): boolean {
  const q = filters.search?.trim().toLowerCase();
  if (q) {
    const haystack = [
      incident.id,
      incident.shortDescription,
      incident.clusterId ?? "",
      incident.clusterName ?? "",
      incident.assignmentGroup,
      incident.service,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (filters.service && incident.service !== filters.service) return false;
  if (filters.category && incident.category !== filters.category) return false;
  if (filters.subcategory && incident.subcategory !== filters.subcategory) return false;
  if (filters.assignmentGroup && incident.assignmentGroup !== filters.assignmentGroup) return false;
  if (filters.priority && incident.priority !== filters.priority) return false;
  if (filters.state && incident.state !== filters.state) return false;
  if (filters.membership && incident.membership !== filters.membership) return false;
  if (filters.classificationStatus && incident.classificationStatus !== filters.classificationStatus)
    return false;
  if (filters.minConfidence && incident.classificationConfidence < filters.minConfidence) return false;
  return true;
}

function tabFilter(incident: Incident, tab: IncidentTab): boolean {
  switch (tab) {
    case "review":
      return (
        incident.classificationStatus === "review_required" ||
        incident.classificationStatus === "human_required"
      );
    case "candidate":
      return incident.membership === "candidate";
    case "unclustered":
      return incident.membership === "unclustered";
    case "recent":
      return true;
    default:
      return true;
  }
}

export interface ListIncidentsParams extends IncidentFilters {
  tab?: IncidentTab;
  page?: number;
  pageSize?: number;
  sortBy?: keyof Incident;
  sortDir?: "asc" | "desc";
}

export function listIncidents(params: ListIncidentsParams = {}): Promise<Paginated<Incident>> {
  return request("/api/v1/incidents", {
    mock: () => {
      const { incidents } = buildDataset();
      const tab = params.tab ?? "all";
      let items = incidents.filter((i) => tabFilter(i, tab) && matches(i, params));

      const sortBy = params.sortBy ?? (tab === "recent" ? "updatedAt" : "createdAt");
      const dir = params.sortDir ?? "desc";
      items = [...items].sort((a, b) => {
        const av = a[sortBy] as unknown as string | number;
        const bv = b[sortBy] as unknown as string | number;
        if (av === bv) return 0;
        return (av > bv ? 1 : -1) * (dir === "asc" ? 1 : -1);
      });

      if (tab === "recent") items = items.slice(0, 40);

      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 15;
      return {
        items: items.slice((page - 1) * pageSize, page * pageSize),
        total: items.length,
        page,
        pageSize,
      };
    },
  });
}

export function getIncident(id: string): Promise<Incident | null> {
  return request(`/api/v1/incidents/${id}`, {
    mock: () => buildDataset().incidents.find((i) => i.id === id) ?? null,
  });
}

export function getSimilarIncidents(id: string): Promise<SimilarIncident[]> {
  return request(`/api/v1/incidents/${id}/similar`, {
    mock: () => {
      const { incidents } = buildDataset();
      const target = incidents.find((i) => i.id === id);
      if (!target) return [];
      const scored = incidents
        .filter((i) => i.id !== id)
        .map((i) => {
          let score = 0;
          if (i.service === target.service) score += 30;
          if (i.category === target.category) score += 26;
          if (i.subcategory === target.subcategory) score += 24;
          if (i.clusterId && i.clusterId === target.clusterId) score += 14;
          const overlap = i.shortDescription
            .toLowerCase()
            .split(" ")
            .filter((w) => w.length > 4 && target.shortDescription.toLowerCase().includes(w)).length;
          score += Math.min(overlap * 3, 12);
          return { incident: i, score };
        })
        .filter((s) => s.score > 55)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      return scored.map(({ incident, score }) => ({
        id: incident.id,
        shortDescription: incident.shortDescription,
        similarity: Math.min(98, Math.round(score)),
        service: incident.service,
        category: incident.category,
        subcategory: incident.subcategory,
      }));
    },
  });
}

export function getKpiSummary(): Promise<KpiSummary> {
  return request("/api/v1/incidents/summary", {
    mock: () => {
      const { incidents, clusters } = buildDataset();
      return {
        totalIncidents: incidents.length,
        activeClusters: clusters.filter((c) => c.status === "active").length,
        candidateClusters: clusters.filter((c) => c.status === "candidate").length,
        unclusteredIncidents: incidents.filter((i) => i.membership === "unclustered").length,
        accuracy: 94.2,
        humanReviewRequired: incidents.filter(
          (i) =>
            i.classificationStatus === "review_required" ||
            i.classificationStatus === "human_required",
        ).length,
      };
    },
  });
}

export interface DashboardDistributions {
  byService: DistributionPoint[];
  byState: DistributionPoint[];
  byCluster: DistributionPoint[];
  byConfidence: DistributionPoint[];
  byPriority: DistributionPoint[];
  trend: { day: string; classified: number; review: number }[];
}

export function getDistributions(): Promise<DashboardDistributions> {
  return request("/api/v1/incidents/distributions", {
    mock: () => {
      const { incidents, clusters } = buildDataset();
      const count = (fn: (i: (typeof incidents)[number]) => string) => {
        const map = new Map<string, number>();
        for (const i of incidents) map.set(fn(i), (map.get(fn(i)) ?? 0) + 1);
        return [...map.entries()].map(([label, value]) => ({ label, value }));
      };
      const recentClusters = clusters.filter(
        (c) => Date.now() - new Date(c.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30,
      ).length;

      const trend = Array.from({ length: 14 }, (_, idx) => {
        const d = new Date(Date.parse("2026-08-29T00:00:00Z") - (13 - idx) * 86_400_000);
        const seed = (idx * 37) % 11;
        return {
          day: d.toISOString().slice(5, 10),
          classified: 28 + seed * 3,
          review: 4 + (seed % 5),
        };
      });

      return {
        byService: count((i) => i.service).sort((a, b) => b.value - a.value),
        byState: count((i) => i.state),
        byPriority: count((i) => i.priority).sort((a, b) => a.label.localeCompare(b.label)),
        byCluster: [
          { label: "Active clusters", value: clusters.filter((c) => c.status === "active").length },
          { label: "Candidate clusters", value: clusters.filter((c) => c.status === "candidate").length },
          { label: "Unclustered incidents", value: incidents.filter((i) => i.membership === "unclustered").length },
          { label: "Created last 30 days", value: recentClusters },
        ],
        byConfidence: [
          { label: "80–100% Auto approval", value: incidents.filter((i) => i.classificationConfidence >= 80).length },
          { label: "60–79% Review required", value: incidents.filter((i) => i.classificationConfidence >= 60 && i.classificationConfidence < 80).length },
          { label: "Below 60% Human decision", value: incidents.filter((i) => i.classificationConfidence < 60).length },
        ],
      };
    },
  });
}

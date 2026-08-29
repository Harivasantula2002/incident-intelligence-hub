import { request } from "./api-client";
import { buildDataset } from "./dataset";
import type { Cluster, Incident } from "@/types";

export interface ClusterFilters {
  search?: string | undefined;
  service?: string | undefined;
  assignmentGroup?: string | undefined;
  status?: Cluster["status"] | undefined;
}

/** Mutations are applied to the in-memory dataset so the UI stays consistent. */
function apply(filters: ClusterFilters, c: Cluster) {
  const q = filters.search?.trim().toLowerCase();
  if (q && !`${c.id} ${c.name} ${c.assignmentGroup} ${c.service}`.toLowerCase().includes(q)) return false;
  if (filters.service && c.service !== filters.service) return false;
  if (filters.assignmentGroup && c.assignmentGroup !== filters.assignmentGroup) return false;
  if (filters.status && c.status !== filters.status) return false;
  return true;
}

export function listClusters(filters: ClusterFilters = {}): Promise<Cluster[]> {
  return request("/api/v1/clusters", {
    mock: () => buildDataset().clusters.filter((c) => apply(filters, c)),
  });
}

export function listCandidateClusters(): Promise<Cluster[]> {
  return request("/api/v1/clusters/candidates", {
    mock: () => buildDataset().clusters.filter((c) => c.status === "candidate"),
  });
}

export function getCluster(id: string): Promise<Cluster | null> {
  return request(`/api/v1/clusters/${id}`, {
    mock: () => buildDataset().clusters.find((c) => c.id === id) ?? null,
  });
}

export function getClusterIncidents(id: string): Promise<Incident[]> {
  return request(`/api/v1/clusters/${id}/incidents`, {
    mock: () => buildDataset().incidents.filter((i) => i.clusterId === id),
  });
}

export interface TreeNode {
  service: string;
  incidentCount: number;
  groups: {
    name: string;
    incidentCount: number;
    clusters: Cluster[];
  }[];
}

export function getClusterHierarchy(): Promise<TreeNode[]> {
  return request("/api/v1/clusters/hierarchy", {
    mock: () => {
      const { clusters } = buildDataset();
      const services = new Map<string, TreeNode>();
      for (const c of clusters) {
        if (c.status === "merged" || c.status === "retired") continue;
        let node = services.get(c.service);
        if (!node) {
          node = { service: c.service, incidentCount: 0, groups: [] };
          services.set(c.service, node);
        }
        let group = node.groups.find((g) => g.name === c.assignmentGroup);
        if (!group) {
          group = { name: c.assignmentGroup, incidentCount: 0, clusters: [] };
          node.groups.push(group);
        }
        group.clusters.push(c);
        group.incidentCount += c.incidentCount;
        node.incidentCount += c.incidentCount;
      }
      return [...services.values()].sort((a, b) => b.incidentCount - a.incidentCount);
    },
  });
}

/** Seeds a candidate cluster into the ServiceNow CLUSTER table. */
export function seedCluster(id: string, name?: string): Promise<Cluster> {
  return request(`/api/v1/clusters/${id}/seed`, {
    method: "POST",
    body: { name },
    mock: () => {
      const data = buildDataset();
      const cluster = data.clusters.find((c) => c.id === id);
      if (!cluster) throw new Error("Cluster not found");
      cluster.status = "active";
      cluster.inClusterTable = true;
      cluster.updatedAt = new Date().toISOString();
      if (name) cluster.name = name;
      for (const inc of data.incidents) {
        if (inc.clusterId === id) {
          inc.membership = "in_cluster";
          inc.clusterName = cluster.name;
          inc.syncedWithServiceNow = true;
        }
      }
      data.syncEvents.unshift({
        id: `sync-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: `Cluster ${cluster.id} created in CLUSTER table`,
        level: "success",
      });
      data.audit.unshift({
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        entityId: cluster.id,
        entityType: "cluster",
        action: "Cluster pushed to ServiceNow",
        finalValue: cluster.name,
        confidence: cluster.averageSimilarity,
        user: "admin",
      });
      return cluster;
    },
  });
}

export function renameCluster(id: string, name: string): Promise<Cluster> {
  return request(`/api/v1/clusters/${id}`, {
    method: "PATCH",
    body: { name },
    mock: () => {
      const data = buildDataset();
      const cluster = data.clusters.find((c) => c.id === id);
      if (!cluster) throw new Error("Cluster not found");
      const previous = cluster.name;
      cluster.name = name;
      cluster.updatedAt = new Date().toISOString();
      data.audit.unshift({
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        entityId: id,
        entityType: "cluster",
        action: "Cluster renamed",
        previousValue: previous,
        finalValue: name,
        user: "admin",
      });
      return cluster;
    },
  });
}

export function rejectCluster(id: string): Promise<Cluster> {
  return request(`/api/v1/clusters/${id}/reject`, {
    method: "POST",
    mock: () => {
      const data = buildDataset();
      const cluster = data.clusters.find((c) => c.id === id);
      if (!cluster) throw new Error("Cluster not found");
      cluster.status = "retired";
      cluster.updatedAt = new Date().toISOString();
      for (const inc of data.incidents) {
        if (inc.clusterId === id) {
          inc.membership = "unclustered";
          inc.clusterId = null;
          inc.clusterName = null;
        }
      }
      data.audit.unshift({
        id: `AUD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        entityId: id,
        entityType: "cluster",
        action: "Cluster rejected",
        finalValue: cluster.name,
        user: "admin",
      });
      return cluster;
    },
  });
}

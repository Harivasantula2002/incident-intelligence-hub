import { request } from "./api-client";
import { buildDataset } from "./dataset";
import type { AppNotification, AuditEvent, SyncStatus } from "@/types";

export function getSyncStatus(): Promise<SyncStatus> {
  return request("/api/v1/servicenow/status", {
    mock: () => {
      const { incidents, clusters, syncEvents } = buildDataset();
      return {
        connected: true,
        lastSync: new Date().toISOString(),
        mainRecords: incidents.length,
        clusterRecords: clusters.filter((c) => c.status === "active").length,
        pending: incidents.filter((i) => !i.syncedWithServiceNow).length,
        events: syncEvents.slice(0, 25),
      };
    },
  });
}

export function syncNow(): Promise<SyncStatus> {
  return request("/api/v1/servicenow/sync", {
    method: "POST",
    mock: () => {
      const data = buildDataset();
      let synced = 0;
      for (const inc of data.incidents) {
        if (!inc.syncedWithServiceNow && synced < 12) {
          inc.syncedWithServiceNow = true;
          synced++;
          data.syncEvents.unshift({
            id: `sync-${inc.id}-${Date.now()}`,
            timestamp: new Date().toISOString(),
            message: `${inc.id} synchronized successfully`,
            level: "success",
          });
        }
      }
      return {
        connected: true,
        lastSync: new Date().toISOString(),
        mainRecords: data.incidents.length,
        clusterRecords: data.clusters.filter((c) => c.status === "active").length,
        pending: data.incidents.filter((i) => !i.syncedWithServiceNow).length,
        events: data.syncEvents.slice(0, 25),
      };
    },
  });
}

export function pushIncident(id: string): Promise<{ ok: true; id: string }> {
  return request("/api/v1/servicenow/push", {
    method: "POST",
    body: { id },
    mock: () => {
      const data = buildDataset();
      data.syncEvents.unshift({
        id: `push-${Date.now()}`,
        timestamp: new Date().toISOString(),
        message: `${id} pushed to ServiceNow MAIN table`,
        level: "success",
      });
      return { ok: true as const, id };
    },
  });
}

export function listAudit(search?: string): Promise<AuditEvent[]> {
  return request("/api/v1/audit", {
    mock: () => {
      const { audit } = buildDataset();
      const q = search?.trim().toLowerCase();
      if (!q) return audit;
      return audit.filter((a) =>
        `${a.entityId} ${a.action} ${a.user} ${a.finalValue ?? ""}`.toLowerCase().includes(q),
      );
    },
  });
}

export function listNotifications(): Promise<AppNotification[]> {
  return request("/api/v1/notifications", {
    mock: () => {
      const { incidents, clusters } = buildDataset();
      const review = incidents.filter(
        (i) => i.classificationStatus === "review_required" || i.classificationStatus === "human_required",
      ).length;
      const candidates = clusters.filter((c) => c.status === "candidate");
      const now = Date.now();
      return [
        {
          id: "n1",
          type: "review" as const,
          title: "AI review required",
          message: `${review} incidents require human classification review.`,
          timestamp: new Date(now - 4 * 60_000).toISOString(),
        },
        {
          id: "n2",
          type: "candidate" as const,
          title: "Candidate cluster detected",
          message: `New candidate cluster "${candidates[0]?.name ?? "Emerging pattern"}" detected with ${candidates[0]?.incidentCount ?? 4} related incidents.`,
          timestamp: new Date(now - 26 * 60_000).toISOString(),
        },
        {
          id: "n3",
          type: "sync_success" as const,
          title: "Synchronization complete",
          message: "Cluster NET-VPN-003 successfully synchronized.",
          timestamp: new Date(now - 92 * 60_000).toISOString(),
        },
        {
          id: "n4",
          type: "sync_failure" as const,
          title: "Synchronization failed",
          message: "ServiceNow synchronization failed for 1 record and will be retried.",
          timestamp: new Date(now - 180 * 60_000).toISOString(),
        },
      ];
    },
  });
}

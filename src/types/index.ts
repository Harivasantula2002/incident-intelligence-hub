export type IncidentState = "New" | "In Progress" | "Resolved" | "Closed";
export type Priority = "P1" | "P2" | "P3" | "P4";

export type ClassificationStatus =
  | "auto_approved"
  | "review_required"
  | "human_required"
  | "human_approved"
  | "human_corrected";

export type ClusterMembership = "in_cluster" | "candidate" | "unclustered";

export type ClusterStatus = "active" | "candidate" | "merged" | "retired";

export type ConfidenceBand = "high" | "medium" | "low";

export interface Prediction {
  field: "Service" | "Category" | "Subcategory" | "Assignment Group";
  value: string;
  confidence: number; // 0-100
}

export interface PipelineStep {
  label: string;
  status: "complete" | "active" | "pending" | "failed";
  timestamp?: string | undefined;
}

export interface SimilarIncident {
  id: string;
  shortDescription: string;
  similarity: number;
  service: string;
  category: string;
  subcategory: string;
}

export interface Incident {
  id: string;
  createdAt: string;
  updatedAt: string;
  state: IncidentState;
  priority: Priority;
  service: string;
  category: string;
  subcategory: string;
  assignmentGroup: string;
  shortDescription: string;
  description: string;
  subDescription: string;
  clusterId: string | null;
  clusterName: string | null;
  membership: ClusterMembership;
  classificationConfidence: number;
  clusterConfidence: number;
  classificationStatus: ClassificationStatus;
  predictions: Prediction[];
  explanations: string[];
  pipeline: PipelineStep[];
  syncedWithServiceNow: boolean;
}

export interface Cluster {
  id: string;
  name: string;
  service: string;
  assignmentGroup: string;
  category: string;
  incidentCount: number;
  averageSimilarity: number;
  createdAt: string;
  updatedAt: string;
  status: ClusterStatus;
  inClusterTable: boolean;
  suggestedNames?: [string, string] | undefined;
  incidentIds: string[];
}

export interface KpiSummary {
  totalIncidents: number;
  activeClusters: number;
  candidateClusters: number;
  unclusteredIncidents: number;
  accuracy: number;
  humanReviewRequired: number;
}

export interface DistributionPoint {
  label: string;
  value: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  entityId: string;
  entityType: "incident" | "cluster" | "sync";
  action: string;
  previousValue?: string | undefined;
  aiPrediction?: string | undefined;
  finalValue?: string | undefined;
  confidence?: number | undefined;
  user: string;
}

export interface SyncEvent {
  id: string;
  timestamp: string;
  message: string;
  level: "success" | "info" | "error";
}

export interface SyncStatus {
  connected: boolean;
  lastSync: string;
  mainRecords: number;
  clusterRecords: number;
  pending: number;
  events: SyncEvent[];
}

export interface AppNotification {
  id: string;
  type: "review" | "candidate" | "sync_success" | "sync_failure";
  title: string;
  message: string;
  timestamp: string;
}

export interface IncidentFilters {
  search?: string;
  service?: string;
  category?: string;
  subcategory?: string;
  assignmentGroup?: string;
  priority?: string;
  state?: string;
  membership?: string;
  classificationStatus?: string;
  minConfidence?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ClassificationResult {
  predictions: Prediction[];
  overallConfidence: number;
  band: ConfidenceBand;
  decision: string;
  explanations: string[];
}

export interface ClusteringResult {
  matched: boolean;
  clusterId?: string | undefined;
  clusterName?: string | undefined;
  similarity: number;
  relatedIncidentCount: number;
  suggestedNames?: [string, string] | undefined;
  similarIncidents: SimilarIncident[];
}

export interface ModelMetric {
  field: string;
  accuracy: number;
  precision: number;
  recall: number;
}

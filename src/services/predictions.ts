import { request } from "./api-client";
import { buildDataset, TAXONOMY } from "./dataset";
import type {
  ClassificationResult,
  ClusteringResult,
  ConfidenceBand,
  ModelMetric,
  Prediction,
} from "@/types";

export function bandFor(confidence: number): ConfidenceBand {
  if (confidence >= 80) return "high";
  if (confidence >= 60) return "medium";
  return "low";
}

export function decisionFor(confidence: number): string {
  const band = bandFor(confidence);
  if (band === "high") return "High Confidence — Auto Approved";
  if (band === "medium") return "Medium Confidence — Review Required";
  return "Low Confidence — Human Decision Required";
}

export interface ClassifyInput {
  shortDescription: string;
  description: string;
  subDescription?: string;
  service?: string;
  category?: string;
  subcategory?: string;
  assignmentGroup?: string;
}

function scoreText(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) % 100003;
  return hash;
}

export function predictClassification(input: ClassifyInput): Promise<ClassificationResult> {
  return request("/api/v1/classification/predict", {
    method: "POST",
    body: input,
    mock: () => {
      const { incidents } = buildDataset();
      const text = `${input.shortDescription} ${input.description}`.toLowerCase();
      const words = text.split(/\W+/).filter((w) => w.length > 3);

      let best = incidents[0]!;
      let bestScore = -1;
      for (const inc of incidents) {
        const hay = `${inc.shortDescription} ${inc.category} ${inc.subcategory}`.toLowerCase();
        let score = words.reduce((acc, w) => acc + (hay.includes(w) ? 1 : 0), 0);
        if (input.service && inc.service === input.service) score += 1.5;
        if (input.category && inc.category === input.category) score += 1;
        if (score > bestScore) {
          bestScore = score;
          best = inc;
        }
      }

      const noise = scoreText(text) % 9;
      const baseConfidence = Math.max(38, Math.min(97, 62 + bestScore * 6 + noise - 4));
      const jitter = (offset: number) =>
        Math.max(32, Math.min(99, Math.round(baseConfidence + offset)));

      const service = input.service || best.service;
      const tax = TAXONOMY.find((t) => t.service === service);
      const category =
        input.category || (tax?.categories.some((c) => c.name === best.category) ? best.category : (tax?.categories[0]?.name ?? best.category));
      const subcategory =
        input.subcategory ||
        (tax?.categories.find((c) => c.name === category)?.subcategories.includes(best.subcategory)
          ? best.subcategory
          : (tax?.categories.find((c) => c.name === category)?.subcategories[0] ?? best.subcategory));
      const group = input.assignmentGroup || (tax?.assignmentGroups.includes(best.assignmentGroup) ? best.assignmentGroup : (tax?.assignmentGroups[0] ?? best.assignmentGroup));

      const predictions: Prediction[] = [
        { field: "Service", value: service, confidence: jitter(3) },
        { field: "Category", value: category, confidence: jitter(0) },
        { field: "Subcategory", value: subcategory, confidence: jitter(-3) },
        { field: "Assignment Group", value: group, confidence: jitter(-1) },
      ];
      const overall = Math.round(
        predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length,
      );

      return {
        predictions,
        overallConfidence: overall,
        band: bandFor(overall),
        decision: decisionFor(overall),
        explanations: [
          `Incident description contains symptoms associated with ${category} ${subcategory.toLowerCase()}.`,
          `Historical incidents with similar language were assigned to ${group}.`,
          `Semantic similarity to previous ${service} → ${category} incidents is ${overall >= 80 ? "high" : "moderate"}.`,
          overall >= 80
            ? "The ML classifier and AI reasoning layer are consistent."
            : "The ML classifier and AI reasoning layer partially disagree, so human review is recommended.",
        ],
      };
    },
  });
}

export function predictCluster(input: ClassifyInput & { incidentId?: string }): Promise<ClusteringResult> {
  return request("/api/v1/clustering/predict", {
    method: "POST",
    body: input,
    mock: () => {
      const { clusters, incidents } = buildDataset();
      const text = `${input.shortDescription} ${input.description}`.toLowerCase();
      const words = text.split(/\W+/).filter((w) => w.length > 3);

      const candidates = clusters
        .filter((c) => c.status === "active")
        .map((c) => {
          let score = 0;
          if (input.service && c.service === input.service) score += 34;
          if (input.category && c.category === input.category) score += 26;
          const nameWords = c.name.toLowerCase().split(/\W+/);
          score += words.filter((w) => nameWords.includes(w)).length * 9;
          return { cluster: c, score };
        })
        .sort((a, b) => b.score - a.score);

      const top = candidates[0];
      const similarity = Math.min(97, top ? top.score : 0);
      const matched = similarity >= 70;

      const similarIncidents = incidents
        .filter((i) => (top ? i.clusterId === top.cluster.id : i.service === input.service))
        .slice(0, 5)
        .map((i, idx) => ({
          id: i.id,
          shortDescription: i.shortDescription,
          similarity: Math.max(72, similarity - idx * 2),
          service: i.service,
          category: i.category,
          subcategory: i.subcategory,
        }));

      if (matched && top) {
        return {
          matched: true,
          clusterId: top.cluster.id,
          clusterName: top.cluster.name,
          similarity,
          relatedIncidentCount: top.cluster.incidentCount,
          similarIncidents,
        };
      }

      const label = input.subcategory || input.category || "Emerging";
      return {
        matched: false,
        similarity: Math.max(62, similarity),
        relatedIncidentCount: 4,
        suggestedNames: [
          `${input.service ?? "Service"} ${label} Anomalies`,
          `Emerging ${label} Issues`,
        ] as [string, string],
        similarIncidents,
      };
    },
  });
}

export interface ModelPerformance {
  metrics: ModelMetric[];
  autoApprovalRate: number;
  humanReviewRate: number;
  acceptanceRate: number;
  confidence: { label: string; value: number }[];
  history: { month: string; accuracy: number; autoApproval: number }[];
}

export function getModelPerformance(): Promise<ModelPerformance> {
  return request("/api/v1/predictions/performance", {
    mock: () => {
      const { incidents } = buildDataset();
      const total = incidents.length;
      const high = incidents.filter((i) => i.classificationConfidence >= 80).length;
      const medium = incidents.filter(
        (i) => i.classificationConfidence >= 60 && i.classificationConfidence < 80,
      ).length;
      const low = total - high - medium;
      return {
        metrics: [
          { field: "Service", accuracy: 96.1, precision: 95.4, recall: 94.8 },
          { field: "Category", accuracy: 94.2, precision: 93.1, recall: 92.7 },
          { field: "Subcategory", accuracy: 90.6, precision: 89.9, recall: 88.4 },
          { field: "Assignment Group", accuracy: 93.4, precision: 92.8, recall: 91.9 },
        ],
        autoApprovalRate: Math.round((high / total) * 1000) / 10,
        humanReviewRate: Math.round(((medium + low) / total) * 1000) / 10,
        acceptanceRate: 91.7,
        confidence: [
          { label: "High (80–100%)", value: high },
          { label: "Medium (60–79%)", value: medium },
          { label: "Low (<60%)", value: low },
        ],
        history: [
          { month: "Mar", accuracy: 88.4, autoApproval: 61 },
          { month: "Apr", accuracy: 89.9, autoApproval: 64 },
          { month: "May", accuracy: 91.2, autoApproval: 68 },
          { month: "Jun", accuracy: 92.6, autoApproval: 71 },
          { month: "Jul", accuracy: 93.5, autoApproval: 74 },
          { month: "Aug", accuracy: 94.2, autoApproval: 77 },
        ],
      };
    },
  });
}

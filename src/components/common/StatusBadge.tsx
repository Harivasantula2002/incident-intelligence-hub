import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  CircleHelp,
  Clock,
  Layers,
  XCircle,
} from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { ClassificationStatus, ClusterMembership, ClusterStatus } from "@/types";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "bg-success-soft text-success border-success/25",
  warning: "bg-warning-soft text-warning-foreground border-warning/35",
  danger: "bg-danger-soft text-danger border-danger/25",
  info: "bg-info-soft text-info border-info/25",
  neutral: "bg-neutral-soft text-muted-foreground border-border",
};

export function Pill({
  tone = "neutral",
  icon: Icon,
  children,
  className,
}: {
  tone?: Tone;
  icon?: ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClass[tone],
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden /> : null}
      {children}
    </span>
  );
}

const classificationMap: Record<
  ClassificationStatus,
  { label: string; tone: Tone; icon: ComponentType<{ className?: string }> }
> = {
  auto_approved: { label: "Auto Approved", tone: "success", icon: CheckCircle2 },
  human_approved: { label: "Human Approved", tone: "success", icon: CheckCircle2 },
  review_required: { label: "Review Required", tone: "warning", icon: AlertTriangle },
  human_required: { label: "Human Decision Required", tone: "danger", icon: CircleHelp },
  human_corrected: { label: "Human Corrected", tone: "info", icon: CheckCircle2 },
};

export function ClassificationStatusBadge({ status }: { status: ClassificationStatus }) {
  const cfg = classificationMap[status];
  return (
    <Pill tone={cfg.tone} icon={cfg.icon}>
      {cfg.label}
    </Pill>
  );
}

const membershipMap: Record<
  ClusterMembership,
  { label: string; tone: Tone; icon: ComponentType<{ className?: string }> }
> = {
  in_cluster: { label: "In Cluster", tone: "success", icon: Layers },
  candidate: { label: "Candidate", tone: "warning", icon: Clock },
  unclustered: { label: "Unclustered", tone: "neutral", icon: CircleDashed },
};

export function MembershipBadge({ membership }: { membership: ClusterMembership }) {
  const cfg = membershipMap[membership];
  return (
    <Pill tone={cfg.tone} icon={cfg.icon}>
      {cfg.label}
    </Pill>
  );
}

const clusterStatusMap: Record<ClusterStatus, { label: string; tone: Tone }> = {
  active: { label: "ACTIVE", tone: "success" },
  candidate: { label: "CANDIDATE", tone: "warning" },
  merged: { label: "MERGED", tone: "info" },
  retired: { label: "RETIRED", tone: "neutral" },
};

export function ClusterStatusBadge({ status }: { status: ClusterStatus }) {
  const cfg = clusterStatusMap[status];
  return (
    <Pill tone={cfg.tone} className="tracking-wide">
      {cfg.label}
    </Pill>
  );
}

export function StateBadge({ state }: { state: string }) {
  const tone: Tone =
    state === "New" ? "info" : state === "In Progress" ? "warning" : state === "Resolved" ? "success" : "neutral";
  return <Pill tone={tone}>{state}</Pill>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const tone: Tone = priority === "P1" ? "danger" : priority === "P2" ? "warning" : "neutral";
  return (
    <Pill tone={tone} className="num">
      {priority}
    </Pill>
  );
}

export function SyncBadge({ synced }: { synced: boolean }) {
  return synced ? (
    <Pill tone="success" icon={CheckCircle2}>
      Synced
    </Pill>
  ) : (
    <Pill tone="neutral" icon={XCircle}>
      Pending sync
    </Pill>
  );
}

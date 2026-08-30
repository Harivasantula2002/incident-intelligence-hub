import { cn } from "@/lib/utils";
import { bandFor } from "@/services/predictions";
import { Pill } from "./StatusBadge";
import { AlertTriangle, CheckCircle2, CircleHelp } from "lucide-react";

const bandTone = {
  high: "success",
  medium: "warning",
  low: "danger",
} as const;

const bandIcon = {
  high: CheckCircle2,
  medium: AlertTriangle,
  low: CircleHelp,
};

const bandLabel = {
  high: "High Confidence",
  medium: "Medium Confidence",
  low: "Low Confidence",
};

export function ConfidenceBadge({
  value,
  withLabel = false,
}: {
  value: number;
  withLabel?: boolean;
}) {
  const band = bandFor(value);
  return (
    <Pill tone={bandTone[band]} icon={bandIcon[band]}>
      <span className="num">{Math.round(value)}%</span>
      {withLabel ? <span className="font-normal">· {bandLabel[band]}</span> : null}
    </Pill>
  );
}

export function ConfidenceBar({
  value,
  showValue = true,
  className,
  label,
}: {
  value: number;
  showValue?: boolean;
  className?: string;
  label?: string;
}) {
  const band = bandFor(value);
  const barColor =
    band === "high" ? "bg-success" : band === "medium" ? "bg-warning" : "bg-danger";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="h-1.5 w-full min-w-16 overflow-hidden rounded-full bg-muted"
        role="meter"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Confidence"}
      >
        <div className={cn("h-full rounded-full", barColor)} style={{ width: `${value}%` }} />
      </div>
      {showValue ? (
        <span className="num w-9 shrink-0 text-right text-xs text-muted-foreground">
          {Math.round(value)}%
        </span>
      ) : null}
    </div>
  );
}

export function DecisionBanner({ value }: { value: number }) {
  const band = bandFor(value);
  const Icon = bandIcon[band];
  const styles =
    band === "high"
      ? "border-success/30 bg-success-soft"
      : band === "medium"
        ? "border-warning/35 bg-warning-soft"
        : "border-danger/30 bg-danger-soft";
  const title =
    band === "high"
      ? "High Confidence — Auto Approved"
      : band === "medium"
        ? "Medium Confidence — Review Required"
        : "Low Confidence — Human Decision Required";
  const body =
    band === "high"
      ? "Confidence is at or above 80%. The AI + ML prediction can be automatically approved."
      : band === "medium"
        ? "Confidence is between 60% and 79%. The AI recommendation stands, but an analyst must confirm it."
        : "Confidence is below 60%. An analyst must classify this incident manually.";
  return (
    <div className={cn("flex items-start gap-3 rounded-lg border p-3.5", styles)}>
      <Icon className="mt-0.5 size-4.5 shrink-0" aria-hidden />
      <div className="min-w-0">
        <p className="text-sm font-semibold">
          <span className="num">{Math.round(value)}%</span> — {title}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed opacity-90">{body}</p>
      </div>
    </div>
  );
}

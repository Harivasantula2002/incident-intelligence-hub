import { Check, Circle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineStep } from "@/types";
import { formatTime } from "@/lib/format";

export function ProcessingTimeline({ steps }: { steps: PipelineStep[] }) {
  return (
    <ol className="relative">
      {steps.map((step, idx) => {
        const last = idx === steps.length - 1;
        return (
          <li key={step.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <StepIcon status={step.status} />
              {!last ? (
                <div
                  className={cn(
                    "w-px flex-1",
                    step.status === "complete" ? "bg-success/40" : "bg-border",
                  )}
                />
              ) : null}
            </div>
            <div className={cn("min-w-0 pb-4", last && "pb-0")}>
              <p
                className={cn(
                  "text-sm leading-6",
                  step.status === "pending" ? "text-muted-foreground" : "font-medium text-foreground",
                )}
              >
                {step.label}
              </p>
              <p className="num text-xs text-muted-foreground">
                {step.status === "complete" && step.timestamp
                  ? formatTime(step.timestamp)
                  : step.status === "active"
                    ? "In progress"
                    : step.status === "failed"
                      ? "Failed"
                      : "Pending"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StepIcon({ status }: { status: PipelineStep["status"] }) {
  const base = "flex size-6 items-center justify-center rounded-full border";
  if (status === "complete")
    return (
      <span className={cn(base, "border-success/30 bg-success-soft text-success")}>
        <Check className="size-3.5" aria-label="Complete" />
      </span>
    );
  if (status === "active")
    return (
      <span className={cn(base, "border-info/30 bg-info-soft text-info")}>
        <Loader2 className="size-3.5 animate-spin" aria-label="In progress" />
      </span>
    );
  if (status === "failed")
    return (
      <span className={cn(base, "border-danger/30 bg-danger-soft text-danger")}>
        <X className="size-3.5" aria-label="Failed" />
      </span>
    );
  return (
    <span className={cn(base, "border-border bg-muted text-muted-foreground")}>
      <Circle className="size-2" aria-label="Pending" />
    </span>
  );
}

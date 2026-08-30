import type { ComponentType } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function KpiCard({
  label,
  value,
  subtitle,
  icon: Icon,
  tone = "neutral",
  loading,
}: {
  label: string;
  value: string | number;
  subtitle: string;
  icon: ComponentType<{ className?: string }>;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
  loading?: boolean;
}) {
  const accent = {
    neutral: "text-muted-foreground bg-neutral-soft",
    success: "text-success bg-success-soft",
    warning: "text-warning-foreground bg-warning-soft",
    danger: "text-danger bg-danger-soft",
    info: "text-info bg-info-soft",
  }[tone];

  return (
    <div className="panel p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
        <span className={cn("flex size-7 items-center justify-center rounded-md", accent)}>
          <Icon className="size-4" aria-hidden />
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-20" />
      ) : (
        <p className="num mt-2 text-2xl font-semibold text-foreground">{value}</p>
      )}
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

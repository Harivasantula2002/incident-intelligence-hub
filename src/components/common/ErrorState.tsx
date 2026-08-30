import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Something went wrong",
  description = "The request could not be completed. No data has been lost and the operation can be retried.",
  onRetry,
  onDetails,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onDetails?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger-soft p-4">
      <AlertOctagon className="mt-0.5 size-4.5 shrink-0 text-danger" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-danger">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-foreground/80">{description}</p>
        {(onRetry || onDetails) && (
          <div className="mt-3 flex gap-2">
            {onRetry ? (
              <Button size="sm" variant="outline" onClick={onRetry}>
                Retry
              </Button>
            ) : null}
            {onDetails ? (
              <Button size="sm" variant="ghost" onClick={onDetails}>
                View details
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

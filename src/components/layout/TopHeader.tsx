import { useQuery } from "@tanstack/react-query";
import { useRouterState } from "@tanstack/react-router";
import { AlertTriangle, Bell, CheckCircle2, Menu, Settings, Sparkles, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pill } from "@/components/common/StatusBadge";
import { GlobalSearch } from "./GlobalSearch";
import { PAGE_TITLES, NAV_ITEMS } from "./nav-config";
import { listNotifications } from "@/services/servicenow";
import { relativeTime } from "@/lib/format";

const notificationIcon = {
  review: AlertTriangle,
  candidate: Sparkles,
  sync_success: CheckCircle2,
  sync_failure: XCircle,
};

export function TopHeader({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: listNotifications,
  });

  const base = NAV_ITEMS.find((n) => (n.to === "/" ? pathname === "/" : pathname.startsWith(n.to)));
  const meta = PAGE_TITLES[base?.to ?? "/"] ?? { title: "Incident Intelligence" };
  const trailing = base && base.to !== "/" ? pathname.slice(base.to.length).split("/").filter(Boolean) : [];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Incident Intelligence</span>
          <span aria-hidden>/</span>
          <span className="text-foreground">{base?.label ?? "Dashboard"}</span>
          {trailing.map((part) => (
            <span key={part} className="num flex items-center gap-1.5">
              <span aria-hidden>/</span>
              <span className="text-foreground">{part}</span>
            </span>
          ))}
        </nav>
        <h1 className="truncate text-sm font-semibold text-foreground">{meta.title}</h1>
      </div>

      <div className="hidden md:block">
        <GlobalSearch />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="size-4.5" />
            {notifications?.length ? (
              <span className="num absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-danger text-[9px] font-semibold text-danger-foreground">
                {notifications.length}
              </span>
            ) : null}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-88">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(notifications ?? []).map((n) => {
            const Icon = notificationIcon[n.type];
            const tone =
              n.type === "sync_failure"
                ? "text-danger"
                : n.type === "review"
                  ? "text-warning"
                  : n.type === "candidate"
                    ? "text-info"
                    : "text-success";
            return (
              <DropdownMenuItem key={n.id} className="items-start gap-2.5 py-2.5">
                <Icon className={`mt-0.5 size-4 shrink-0 ${tone}`} aria-hidden />
                <div className="min-w-0">
                  <p className="text-xs font-medium">{n.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{n.message}</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{relativeTime(n.timestamp)}</p>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Pill tone="success" className="hidden lg:inline-flex" icon={CheckCircle2}>
        ServiceNow Connected
      </Pill>

      <Button variant="ghost" size="icon" aria-label="Settings" asChild>
        <a href="/settings">
          <Settings className="size-4.5" />
        </a>
      </Button>

      <span className="num flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        AD
      </span>
    </header>
  );
}

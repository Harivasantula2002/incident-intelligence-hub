import { Link, useRouterState } from "@tanstack/react-router";
import { CircleDot, Network, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-config";

function StatusRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning" | "danger";
}) {
  const dot =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-danger";
  return (
    <div className="flex items-center justify-between gap-2 text-xs">
      <span className="text-sidebar-foreground/60">{label}</span>
      <span className="inline-flex items-center gap-1.5 font-medium text-sidebar-foreground">
        <CircleDot className={cn("size-3", dot)} aria-hidden />
        {value}
      </span>
    </div>
  );
}

export function AppSidebar({
  collapsed,
  onToggle,
  onNavigate,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "flex h-full flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200",
        collapsed ? "w-[68px]" : "w-[264px]",
      )}
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary/15 text-sidebar-primary">
          <Network className="size-4.5" aria-hidden />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-accent-foreground">
              Incident Intelligence
            </p>
            <p className="truncate text-[10px] tracking-wide text-sidebar-foreground/55 uppercase">
              Classification &amp; Clusters
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 py-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon
                    className={cn("size-4.5 shrink-0", active && "text-sidebar-primary")}
                    aria-hidden
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-sidebar-border px-3 py-3">
        {!collapsed && (
          <div className="space-y-1.5 pb-3">
            <StatusRow label="System" value="Healthy" tone="success" />
            <StatusRow label="ServiceNow" value="Connected" tone="success" />
            <StatusRow label="AI/ML engine" value="Operational" tone="success" />
          </div>
        )}
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-md bg-sidebar-accent/50 p-2",
            collapsed && "justify-center bg-transparent p-0",
          )}
        >
          <span className="num flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/20 text-xs font-semibold text-sidebar-primary">
            AD
          </span>
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="truncate text-xs font-medium text-sidebar-accent-foreground">admin</p>
              <p className="truncate text-[10px] text-sidebar-foreground/55">Platform Operator</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="mt-3 hidden w-full items-center justify-center gap-2 rounded-md border border-sidebar-border py-1.5 text-xs text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" aria-hidden />
          ) : (
            <>
              <PanelLeftClose className="size-4" aria-hidden />
              Collapse
            </>
          )}
        </button>
      </div>
    </nav>
  );
}

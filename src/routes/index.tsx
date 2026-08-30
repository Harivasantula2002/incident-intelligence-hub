import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  Boxes,
  CircleDashed,
  Gauge,
  LayoutList,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { PageHeading } from "@/components/layout/AppShell";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pill } from "@/components/common/StatusBadge";
import { getDistributions, getKpiSummary } from "@/services/incidents";
import { compactNumber } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Incident Intelligence" },
      {
        name: "description",
        content:
          "Monitor incident classification, clustering, emerging patterns and AI/ML model performance across your ServiceNow estate.",
      },
      { property: "og:title", content: "Incident Intelligence Dashboard" },
      {
        property: "og:description",
        content: "Operational view of AI/ML incident classification and cluster intelligence.",
      },
    ],
  }),
  component: DashboardPage,
});

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="panel p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

const tooltipStyle = {
  contentStyle: {
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    fontSize: 12,
    boxShadow: "var(--shadow-overlay)",
  },
};

function DashboardPage() {
  const { data: kpi, isLoading } = useQuery({ queryKey: ["kpi"], queryFn: getKpiSummary });
  const { data: dist, isLoading: distLoading } = useQuery({
    queryKey: ["distributions"],
    queryFn: getDistributions,
  });

  return (
    <>
      <PageHeading
        title="Incident Intelligence Dashboard"
        subtitle="Monitor incident classification, clustering, emerging patterns and AI/ML performance."
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/candidate-clusters">
                Review candidates <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/create-incident">Create incident</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <KpiCard
          label="Total Incidents"
          value={kpi ? compactNumber(kpi.totalIncidents) : "—"}
          subtitle="All incidents in MAIN"
          icon={LayoutList}
          loading={isLoading}
        />
        <KpiCard
          label="Active Clusters"
          value={kpi?.activeClusters ?? "—"}
          subtitle="Clusters in CLUSTER table"
          icon={Boxes}
          tone="success"
          loading={isLoading}
        />
        <KpiCard
          label="Candidate Clusters"
          value={kpi?.candidateClusters ?? "—"}
          subtitle="Awaiting review"
          icon={Sparkles}
          tone="warning"
          loading={isLoading}
        />
        <KpiCard
          label="Unclustered Incidents"
          value={kpi?.unclusteredIncidents ?? "—"}
          subtitle="No sufficiently similar cluster"
          icon={CircleDashed}
          loading={isLoading}
        />
        <KpiCard
          label="AI Classification Accuracy"
          value={kpi ? `${kpi.accuracy}%` : "—"}
          subtitle="Current validation accuracy"
          icon={Gauge}
          tone="info"
          loading={isLoading}
        />
        <KpiCard
          label="Human Review Required"
          value={kpi?.humanReviewRequired ?? "—"}
          subtitle="Incidents awaiting review"
          icon={UserCheck}
          tone="danger"
          loading={isLoading}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel
            title="Incident Distribution by Service"
            description="Volume of MAIN incidents grouped by business service."
          >
            {distLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dist?.byService} layout="vertical" margin={{ left: 10, right: 24 }}>
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={170}
                    tick={{ fontSize: 11 }}
                    stroke="var(--muted-foreground)"
                  />
                  <Tooltip {...tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                  <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Panel>
        </div>

        <Panel title="Incident Distribution by State" description="Lifecycle position of all MAIN records.">
          {distLoading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={dist?.byState}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={2}
                >
                  {(dist?.byState ?? []).map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel title="Cluster Distribution" description="How incidents are organised across the CLUSTER table.">
          <ul className="space-y-2.5">
            {(dist?.byCluster ?? []).map((row) => (
              <li key={row.label} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="num font-semibold">{row.value}</span>
              </li>
            ))}
          </ul>
          <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
            <Link to="/cluster-management">Open cluster management</Link>
          </Button>
        </Panel>

        <div className="xl:col-span-2">
          <Panel
            title="AI Confidence Distribution"
            description="Confidence determines whether an incident is auto-approved or routed to a human."
          >
            <div className="grid gap-3 md:grid-cols-3">
              {[
                {
                  label: "80–100%",
                  title: "Auto Approval",
                  copy: "AI + ML prediction is applied automatically.",
                  tone: "success" as const,
                  idx: 0,
                },
                {
                  label: "60–79%",
                  title: "AI Recommendation + Human Review",
                  copy: "Analyst confirms the AI recommendation before it is applied.",
                  tone: "warning" as const,
                  idx: 1,
                },
                {
                  label: "Below 60%",
                  title: "Human Classification",
                  copy: "Analyst classifies the incident manually.",
                  tone: "danger" as const,
                  idx: 2,
                },
              ].map((band) => (
                <div key={band.label} className="rounded-lg border border-border p-3.5">
                  <Pill tone={band.tone}>{band.label}</Pill>
                  <p className="num mt-2.5 text-xl font-semibold">
                    {dist?.byConfidence[band.idx]?.value ?? "—"}
                  </p>
                  <p className="text-xs font-medium text-foreground">{band.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{band.copy}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="mt-4">
        <Panel
          title="Classification Throughput"
          description="Incidents classified automatically versus routed to human review over the last 14 days."
        >
          {distLoading ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={dist?.trend} margin={{ left: 0, right: 16, top: 8 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" width={32} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="classified"
                  name="Auto classified"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="review"
                  name="Human review"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Panel>
      </div>
    </>
  );
}

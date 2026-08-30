import {
  Activity,
  Boxes,
  FilePlus2,
  GitBranch,
  LayoutDashboard,
  ListChecks,
  RefreshCcw,
  ScrollText,
  Settings,
  Sparkles,
  Table2,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: typeof Activity;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, description: "Operational overview" },
  { label: "Incidents", to: "/incidents", icon: ListChecks, description: "MAIN table records" },
  { label: "Cluster Explorer", to: "/cluster-explorer", icon: GitBranch, description: "Service → group → cluster" },
  { label: "Cluster Management", to: "/cluster-management", icon: Boxes, description: "CLUSTER table" },
  { label: "Candidate Clusters", to: "/candidate-clusters", icon: Sparkles, description: "Awaiting review" },
  { label: "MAIN Intelligence", to: "/main-intelligence", icon: Table2, description: "Seeded vs candidate" },
  { label: "Create Incident", to: "/create-incident", icon: FilePlus2, description: "Predict and finalize" },
  { label: "AI/ML Predictions", to: "/predictions", icon: Activity, description: "Model performance" },
  { label: "ServiceNow Sync", to: "/servicenow-sync", icon: RefreshCcw, description: "Integration state" },
  { label: "Audit & Activity", to: "/audit", icon: ScrollText, description: "Decision trail" },
  { label: "Settings", to: "/settings", icon: Settings, description: "Thresholds & policy" },
];

export const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  "/": {
    title: "Incident Intelligence Dashboard",
    subtitle: "Monitor incident classification, clustering, emerging patterns and AI/ML performance.",
  },
  "/incidents": { title: "Incidents", subtitle: "All incidents stored in the ServiceNow MAIN table." },
  "/cluster-explorer": { title: "Cluster Explorer", subtitle: "Navigate service, assignment group, cluster and incident relationships." },
  "/cluster-management": { title: "Cluster Management", subtitle: "Records held in the ServiceNow CLUSTER table." },
  "/candidate-clusters": { title: "Candidate Clusters", subtitle: "Emerging patterns awaiting human approval." },
  "/main-intelligence": { title: "MAIN Incident Intelligence", subtitle: "Clusters detected from incidents currently in MAIN." },
  "/create-incident": { title: "Create Incident", subtitle: "Capture, classify and cluster a new incident." },
  "/predictions": { title: "AI/ML Predictions", subtitle: "Classification accuracy, confidence distribution and model performance." },
  "/servicenow-sync": { title: "ServiceNow Sync", subtitle: "Integration health between this platform and ServiceNow." },
  "/audit": { title: "Audit & Activity", subtitle: "Every AI prediction, human decision and synchronization event." },
  "/settings": { title: "Settings", subtitle: "Confidence thresholds, clustering policy and integration configuration." },
};

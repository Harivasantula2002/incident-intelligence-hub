/**
 * Deterministic golden-dataset generator.
 * This module is the ONLY place mock records are produced; every consumer
 * goes through the service layer in `src/services/api.ts`.
 */
import type {
  AuditEvent,
  Cluster,
  Incident,
  IncidentState,
  Priority,
  SyncEvent,
} from "@/types";

export interface Taxonomy {
  service: string;
  assignmentGroups: string[];
  categories: {
    name: string;
    subcategories: string[];
  }[];
}

export const TAXONOMY: Taxonomy[] = [
  {
    service: "Collaboration",
    assignmentGroups: ["Collaboration Services", "Messaging Operations"],
    categories: [
      { name: "Email", subcategories: ["Delivery", "Mailbox", "Distribution List"] },
      { name: "Teams", subcategories: ["Meetings", "Channels", "Audio / Video"] },
      { name: "SharePoint", subcategories: ["Permissions", "Sync", "Site Access"] },
    ],
  },
  {
    service: "Identity and Access Management",
    assignmentGroups: ["Identity Engineering", "Access Administration"],
    categories: [
      { name: "Authentication", subcategories: ["MFA", "Password Reset", "SSO"] },
      { name: "Authorization", subcategories: ["Role Assignment", "Group Membership"] },
      { name: "Account Lifecycle", subcategories: ["Provisioning", "Deprovisioning"] },
    ],
  },
  {
    service: "Network",
    assignmentGroups: ["Network Engineering", "Network Operations"],
    categories: [
      { name: "VPN", subcategories: ["Authentication", "Connectivity", "Performance"] },
      { name: "Wireless", subcategories: ["Coverage", "Association", "Roaming"] },
      { name: "LAN / WAN", subcategories: ["Latency", "Circuit Down", "Routing"] },
    ],
  },
  {
    service: "End User Computing",
    assignmentGroups: ["Desktop Support", "Endpoint Engineering"],
    categories: [
      { name: "Hardware", subcategories: ["Laptop", "Peripheral", "Docking Station"] },
      { name: "Operating System", subcategories: ["Boot Failure", "Patching", "Profile"] },
      { name: "Software", subcategories: ["Installation", "Licensing", "Crash"] },
    ],
  },
  {
    service: "Virtual Desktop / AVD",
    assignmentGroups: ["Virtual Desktop Engineering", "AVD Operations"],
    categories: [
      { name: "Session", subcategories: ["Disconnect", "Slow Logon", "Black Screen"] },
      { name: "Host Pool", subcategories: ["Capacity", "Image Update", "Scaling"] },
      { name: "Profile", subcategories: ["FSLogix", "Roaming", "Storage"] },
    ],
  },
];

export const SERVICES = TAXONOMY.map((t) => t.service);

export function categoriesFor(service: string) {
  return TAXONOMY.find((t) => t.service === service)?.categories.map((c) => c.name) ?? [];
}

export function subcategoriesFor(service: string, category: string) {
  return (
    TAXONOMY.find((t) => t.service === service)?.categories.find((c) => c.name === category)
      ?.subcategories ?? []
  );
}

export function assignmentGroupsFor(service: string) {
  return TAXONOMY.find((t) => t.service === service)?.assignmentGroups ?? [];
}

export const ALL_ASSIGNMENT_GROUPS = TAXONOMY.flatMap((t) => t.assignmentGroups);

const CLUSTER_BLUEPRINTS: {
  code: string;
  name: string;
  service: string;
  group: string;
  category: string;
  subcategory: string;
  seeded: boolean;
  candidate?: boolean;
  suggested?: [string, string];
}[] = [
  { code: "NET-VPN-001", name: "VPN Authentication Failures", service: "Network", group: "Network Engineering", category: "VPN", subcategory: "Authentication", seeded: true },
  { code: "NET-VPN-002", name: "VPN Connection Drops", service: "Network", group: "Network Engineering", category: "VPN", subcategory: "Connectivity", seeded: true },
  { code: "NET-VPN-003", name: "VPN Performance Degradation", service: "Network", group: "Network Operations", category: "VPN", subcategory: "Performance", seeded: true },
  { code: "NET-WIF-001", name: "Wireless Roaming Instability", service: "Network", group: "Network Operations", category: "Wireless", subcategory: "Roaming", seeded: true },
  { code: "NET-WAN-001", name: "Branch Circuit Outages", service: "Network", group: "Network Operations", category: "LAN / WAN", subcategory: "Circuit Down", seeded: true },
  { code: "IAM-AUT-001", name: "MFA Push Notification Failures", service: "Identity and Access Management", group: "Identity Engineering", category: "Authentication", subcategory: "MFA", seeded: true },
  { code: "IAM-AUT-002", name: "SSO Session Expiry Loops", service: "Identity and Access Management", group: "Identity Engineering", category: "Authentication", subcategory: "SSO", seeded: true },
  { code: "IAM-AUT-003", name: "Password Reset Portal Errors", service: "Identity and Access Management", group: "Access Administration", category: "Authentication", subcategory: "Password Reset", seeded: true },
  { code: "IAM-AUZ-001", name: "Role Assignment Propagation Delays", service: "Identity and Access Management", group: "Access Administration", category: "Authorization", subcategory: "Role Assignment", seeded: true },
  { code: "IAM-LIF-001", name: "Joiner Provisioning Backlog", service: "Identity and Access Management", group: "Access Administration", category: "Account Lifecycle", subcategory: "Provisioning", seeded: true },
  { code: "COL-EML-001", name: "External Mail Delivery Delays", service: "Collaboration", group: "Messaging Operations", category: "Email", subcategory: "Delivery", seeded: true },
  { code: "COL-EML-002", name: "Shared Mailbox Access Errors", service: "Collaboration", group: "Collaboration Services", category: "Email", subcategory: "Mailbox", seeded: true },
  { code: "COL-TMS-001", name: "Teams Meeting Audio Drops", service: "Collaboration", group: "Collaboration Services", category: "Teams", subcategory: "Audio / Video" , seeded: true },
  { code: "COL-TMS-002", name: "Teams Channel Sync Failures", service: "Collaboration", group: "Collaboration Services", category: "Teams", subcategory: "Channels", seeded: true },
  { code: "COL-SPO-001", name: "SharePoint Sync Client Errors", service: "Collaboration", group: "Collaboration Services", category: "SharePoint", subcategory: "Sync", seeded: true },
  { code: "EUC-HDW-001", name: "Docking Station Display Failures", service: "End User Computing", group: "Desktop Support", category: "Hardware", subcategory: "Docking Station", seeded: true },
  { code: "EUC-HDW-002", name: "Laptop Battery Degradation", service: "End User Computing", group: "Desktop Support", category: "Hardware", subcategory: "Laptop", seeded: true },
  { code: "EUC-OSS-001", name: "Patch Cycle Boot Failures", service: "End User Computing", group: "Endpoint Engineering", category: "Operating System", subcategory: "Patching", seeded: true },
  { code: "EUC-SFT-001", name: "Application Licensing Blocks", service: "End User Computing", group: "Endpoint Engineering", category: "Software", subcategory: "Licensing", seeded: true },
  { code: "EUC-SFT-002", name: "Office Application Crashes", service: "End User Computing", group: "Desktop Support", category: "Software", subcategory: "Crash", seeded: true },
  { code: "AVD-SES-001", name: "AVD Session Disconnects", service: "Virtual Desktop / AVD", group: "AVD Operations", category: "Session", subcategory: "Disconnect", seeded: true },
  { code: "AVD-SES-002", name: "Slow AVD Logon Times", service: "Virtual Desktop / AVD", group: "Virtual Desktop Engineering", category: "Session", subcategory: "Slow Logon", seeded: true },
  { code: "AVD-SES-003", name: "AVD Black Screen on Connect", service: "Virtual Desktop / AVD", group: "AVD Operations", category: "Session", subcategory: "Black Screen", seeded: true },
  { code: "AVD-HPL-001", name: "Host Pool Capacity Exhaustion", service: "Virtual Desktop / AVD", group: "Virtual Desktop Engineering", category: "Host Pool", subcategory: "Capacity", seeded: true },
  { code: "AVD-PRF-001", name: "FSLogix Profile Attach Failures", service: "Virtual Desktop / AVD", group: "Virtual Desktop Engineering", category: "Profile", subcategory: "FSLogix", seeded: true },
  { code: "NET-WIF-002", name: "Campus Wireless Coverage Gaps", service: "Network", group: "Network Operations", category: "Wireless", subcategory: "Coverage", seeded: true },
  { code: "IAM-AUZ-002", name: "Group Membership Drift", service: "Identity and Access Management", group: "Access Administration", category: "Authorization", subcategory: "Group Membership", seeded: true },
  { code: "COL-EML-003", name: "Distribution List Update Failures", service: "Collaboration", group: "Messaging Operations", category: "Email", subcategory: "Distribution List", seeded: true },
  { code: "EUC-OSS-002", name: "Roaming Profile Corruption", service: "End User Computing", group: "Endpoint Engineering", category: "Operating System", subcategory: "Profile", seeded: true },
  { code: "AVD-HPL-002", name: "Golden Image Update Regressions", service: "Virtual Desktop / AVD", group: "Virtual Desktop Engineering", category: "Host Pool", subcategory: "Image Update", seeded: true },
  { code: "NET-LAN-002", name: "Datacenter Routing Flaps", service: "Network", group: "Network Engineering", category: "LAN / WAN", subcategory: "Routing", seeded: true },
  { code: "COL-TMS-003", name: "Teams Meeting Join Failures", service: "Collaboration", group: "Collaboration Services", category: "Teams", subcategory: "Meetings", seeded: true },
  { code: "IAM-LIF-002", name: "Leaver Deprovisioning Gaps", service: "Identity and Access Management", group: "Access Administration", category: "Account Lifecycle", subcategory: "Deprovisioning", seeded: true },
  { code: "EUC-HDW-003", name: "Peripheral Driver Conflicts", service: "End User Computing", group: "Desktop Support", category: "Hardware", subcategory: "Peripheral", seeded: true },
  { code: "AVD-PRF-002", name: "Profile Storage Quota Breaches", service: "Virtual Desktop / AVD", group: "AVD Operations", category: "Profile", subcategory: "Storage", seeded: true },
  { code: "COL-SPO-002", name: "SharePoint Permission Inheritance Issues", service: "Collaboration", group: "Collaboration Services", category: "SharePoint", subcategory: "Permissions", seeded: true },
  { code: "NET-WAN-003", name: "WAN Latency Spikes", service: "Network", group: "Network Operations", category: "LAN / WAN", subcategory: "Latency", seeded: true },
  { code: "IAM-AUT-004", name: "Legacy SSO Client Failures", service: "Identity and Access Management", group: "Identity Engineering", category: "Authentication", subcategory: "SSO", seeded: true },

  // Candidate (emerging) clusters — MAIN only, not yet in CLUSTER table
  {
    code: "NET-VPN-004", name: "VPN Certificate Validation Issues", service: "Network", group: "Network Engineering",
    category: "VPN", subcategory: "Authentication", seeded: false, candidate: true,
    suggested: ["VPN Certificate Validation Issues", "Corporate VPN Certificate Problems"],
  },
  {
    code: "AVD-SES-004", name: "AVD Multi-Monitor Rendering Faults", service: "Virtual Desktop / AVD", group: "AVD Operations",
    category: "Session", subcategory: "Black Screen", seeded: false, candidate: true,
    suggested: ["AVD Multi-Monitor Rendering Faults", "Virtual Desktop Display Rendering Errors"],
  },
  {
    code: "IAM-AUT-005", name: "MFA Enrollment Device Binding Errors", service: "Identity and Access Management", group: "Identity Engineering",
    category: "Authentication", subcategory: "MFA", seeded: false, candidate: true,
    suggested: ["MFA Enrollment Device Binding Errors", "Authenticator Device Registration Failures"],
  },
  {
    code: "COL-TMS-004", name: "Teams Live Event Streaming Failures", service: "Collaboration", group: "Collaboration Services",
    category: "Teams", subcategory: "Meetings", seeded: false, candidate: true,
    suggested: ["Teams Live Event Streaming Failures", "Collaboration Broadcast Streaming Issues"],
  },
  {
    code: "EUC-SFT-003", name: "VDI Client Update Rollback Loops", service: "End User Computing", group: "Endpoint Engineering",
    category: "Software", subcategory: "Installation", seeded: false, candidate: true,
    suggested: ["VDI Client Update Rollback Loops", "Endpoint Client Upgrade Failures"],
  },
  {
    code: "NET-WIF-003", name: "Guest Wireless Onboarding Failures", service: "Network", group: "Network Operations",
    category: "Wireless", subcategory: "Association", seeded: false, candidate: true,
    suggested: ["Guest Wireless Onboarding Failures", "Visitor Network Association Errors"],
  },
  {
    code: "EUC-OSS-003", name: "Endpoint Encryption Recovery Prompts", service: "End User Computing", group: "Endpoint Engineering",
    category: "Operating System", subcategory: "Boot Failure", seeded: false, candidate: true,
    suggested: ["Endpoint Encryption Recovery Prompts", "Disk Encryption Boot Recovery Issues"],
  },
];

const SYMPTOMS: Record<string, string[]> = {
  Authentication: [
    "Unable to authenticate to corporate VPN",
    "VPN login authentication failure",
    "Authentication rejected when connecting to VPN gateway",
    "Repeated credential prompts on VPN client",
  ],
  Connectivity: [
    "VPN tunnel drops after a few minutes",
    "Corporate VPN disconnects repeatedly",
    "Unstable VPN connection from home office",
  ],
  Performance: [
    "VPN throughput extremely slow",
    "High latency over corporate VPN",
    "File transfers time out while on VPN",
  ],
  MFA: [
    "MFA push notification never arrives",
    "Unable to approve multi-factor prompt",
    "Authenticator app not receiving requests",
  ],
  SSO: [
    "Single sign-on redirect loop on internal portal",
    "SSO session expires immediately after login",
  ],
  "Password Reset": ["Self-service password reset portal returns an error", "Password reset link invalid"],
  "Role Assignment": ["Requested role not applied after approval", "Role assignment pending for 48 hours"],
  "Group Membership": ["User missing from security group", "Group membership not reflected in application"],
  Provisioning: ["New joiner account not created", "Provisioning workflow stuck in pending"],
  Deprovisioning: ["Leaver account still active", "Access not revoked after termination"],
  Delivery: ["Outbound email to external domain delayed", "Messages queued for several hours"],
  Mailbox: ["Cannot open shared mailbox", "Shared mailbox permissions missing"],
  "Distribution List": ["Distribution list membership update failing", "Cannot send to distribution list"],
  Meetings: ["Unable to join scheduled Teams meeting", "Teams live event fails to start"],
  Channels: ["Teams channel files not syncing", "Channel messages missing"],
  "Audio / Video": ["Audio drops during Teams calls", "Camera not detected in Teams meeting"],
  Permissions: ["SharePoint site permission inheritance broken", "Access denied on SharePoint library"],
  Sync: ["OneDrive sync client stuck on processing changes", "SharePoint library will not sync"],
  "Site Access": ["Cannot access SharePoint site collection"],
  Laptop: ["Laptop battery drains within an hour", "Laptop will not charge"],
  Peripheral: ["External keyboard not recognised", "Printer driver conflict on endpoint"],
  "Docking Station": ["External monitors not detected through dock", "Dock loses network connection"],
  "Boot Failure": ["Device prompts for encryption recovery key at boot", "Endpoint fails to boot after update"],
  Patching: ["Endpoint fails to complete monthly patch cycle", "Patch installation rolls back"],
  Profile: ["User profile fails to load", "Roaming profile corrupted after logoff"],
  Installation: ["Application install fails with error code", "Client upgrade rolls back repeatedly"],
  Licensing: ["Application reports licence not assigned", "Licence activation blocked"],
  Crash: ["Office application crashes on launch", "Application closes unexpectedly when saving"],
  Disconnect: ["AVD session disconnects intermittently", "Virtual desktop drops session during use"],
  "Slow Logon": ["AVD logon takes more than five minutes", "Slow sign-in to virtual desktop"],
  "Black Screen": ["Black screen after connecting to AVD host", "Multi-monitor layout renders blank"],
  Capacity: ["No AVD session hosts available", "Host pool at maximum capacity"],
  "Image Update": ["Applications missing after golden image update"],
  Scaling: ["Host pool scaling plan not triggering"],
  FSLogix: ["FSLogix profile container fails to attach", "Temporary profile issued on AVD logon"],
  Roaming: ["Wireless roaming causes session drops", "Profile does not roam between hosts"],
  Storage: ["Profile storage quota exceeded"],
  Coverage: ["No wireless signal in meeting rooms", "Weak Wi-Fi coverage on floor 4"],
  Association: ["Device cannot associate with guest wireless", "Guest onboarding portal fails"],
  Latency: ["High latency to datacenter applications"],
  "Circuit Down": ["Branch office circuit is down", "Site offline after carrier fault"],
  Routing: ["Routing flaps between datacenter cores"],
};

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE_DATE = new Date("2026-08-29T18:40:00Z").getTime();
const DAY = 86_400_000;

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)] as T;
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}

function buildExplanations(service: string, category: string, subcategory: string, group: string) {
  return [
    `Incident description contains symptoms associated with ${category} ${subcategory.toLowerCase()}.`,
    `Historical incidents with similar language were assigned to ${group}.`,
    `Semantic similarity to previous ${service} → ${category} incidents is high.`,
    "The ML classifier and the AI reasoning layer produced consistent outcomes.",
  ];
}

function buildPipeline(
  rand: () => number,
  classificationStatus: string,
  membership: string,
  synced: boolean,
): Incident["pipeline"] {
  const done = (label: string, offset: number) => ({
    label,
    status: "complete" as const,
    timestamp: new Date(BASE_DATE - offset).toISOString(),
  });
  const steps: Incident["pipeline"] = [
    done("Incident Created", 60_000 * 12),
    done("Classification Started", 60_000 * 11),
    done("AI Classification", 60_000 * 10),
    done("ML Classification", 60_000 * 9),
    done("Classification Decision", 60_000 * 8),
    done("Similarity Search", 60_000 * 7),
    {
      label: "Cluster Prediction",
      status: membership === "unclustered" ? "complete" : "complete",
      timestamp: new Date(BASE_DATE - 60_000 * 6).toISOString(),
    },
    {
      label: "Human Review",
      status:
        classificationStatus === "auto_approved"
          ? "complete"
          : rand() > 0.5
            ? "active"
            : "pending",
    },
    { label: "ServiceNow Sync", status: synced ? "complete" : "pending" },
  ];
  return steps;
}

export interface Dataset {
  incidents: Incident[];
  clusters: Cluster[];
  audit: AuditEvent[];
  syncEvents: SyncEvent[];
}

let cache: Dataset | null = null;

export function buildDataset(): Dataset {
  if (cache) return cache;
  const rand = mulberry32(20260829);
  const incidents: Incident[] = [];
  const clusters: Cluster[] = [];

  const seededBlueprints = CLUSTER_BLUEPRINTS.filter((b) => b.seeded);
  const candidateBlueprints = CLUSTER_BLUEPRINTS.filter((b) => b.candidate);

  const TOTAL = 650;
  let counter = 1000;
  const nextId = () => `INC${String(++counter).padStart(6, "0")}`;

  const clusterMembers = new Map<string, string[]>();

  const makeIncident = (
    blueprint: (typeof CLUSTER_BLUEPRINTS)[number] | null,
    membership: Incident["membership"],
  ): Incident => {
    const service = blueprint?.service ?? pick(rand, SERVICES);
    const tax = TAXONOMY.find((t) => t.service === service)!;
    const categoryName = blueprint?.category ?? pick(rand, tax.categories).name;
    const catDef = tax.categories.find((c) => c.name === categoryName)!;
    const subcategory = blueprint?.subcategory ?? pick(rand, catDef.subcategories);
    const group = blueprint?.group ?? pick(rand, tax.assignmentGroups);
    const symptomPool = SYMPTOMS[subcategory] ?? [`${categoryName} issue reported by user`];
    const shortDescription = pick(rand, symptomPool);

    const base = membership === "in_cluster" ? 82 : membership === "candidate" ? 66 : 48;
    const classificationConfidence = Math.min(
      99,
      Math.max(31, round(base + rand() * 16 - (membership === "unclustered" ? rand() * 12 : 0))),
    );
    const clusterConfidence =
      membership === "in_cluster"
        ? round(84 + rand() * 13)
        : membership === "candidate"
          ? round(72 + rand() * 12)
          : round(18 + rand() * 32);

    let classificationStatus: Incident["classificationStatus"];
    if (classificationConfidence >= 80) classificationStatus = rand() > 0.85 ? "human_approved" : "auto_approved";
    else if (classificationConfidence >= 60) classificationStatus = rand() > 0.7 ? "human_corrected" : "review_required";
    else classificationStatus = "human_required";

    const state = pick<IncidentState>(rand, ["New", "In Progress", "In Progress", "Resolved", "Closed"]);
    const priority = pick<Priority>(rand, ["P1", "P2", "P2", "P3", "P3", "P4"]);
    const createdOffset = Math.floor(rand() * 90 * DAY);
    const synced = classificationStatus === "auto_approved" ? rand() > 0.1 : rand() > 0.6;

    const id = nextId();
    const jitter = () => round(Math.max(30, Math.min(99, classificationConfidence + rand() * 8 - 4)));

    const incident: Incident = {
      id,
      createdAt: new Date(BASE_DATE - createdOffset).toISOString(),
      updatedAt: new Date(BASE_DATE - Math.floor(rand() * createdOffset)).toISOString(),
      state,
      priority,
      service,
      category: categoryName,
      subcategory,
      assignmentGroup: group,
      shortDescription,
      description: `${shortDescription}. The user reports the issue started recently and is repeatable. Restarting the client and reconnecting from a different network did not resolve the behaviour. The impact prevents the user from completing normal work activities, and a workaround has not been identified locally.`,
      subDescription: `Symptoms align with known ${categoryName} → ${subcategory} behaviour in ${service}. Comparable historical incidents were resolved by ${group} within the standard resolution window.`,
      clusterId: membership === "unclustered" ? null : (blueprint?.code ?? null),
      clusterName: membership === "unclustered" ? null : (blueprint?.name ?? null),
      membership,
      classificationConfidence,
      clusterConfidence,
      classificationStatus,
      predictions: [
        { field: "Service", value: service, confidence: jitter() },
        { field: "Category", value: categoryName, confidence: jitter() },
        { field: "Subcategory", value: subcategory, confidence: jitter() },
        { field: "Assignment Group", value: group, confidence: jitter() },
      ],
      explanations: buildExplanations(service, categoryName, subcategory, group),
      pipeline: buildPipeline(rand, classificationStatus, membership, synced),
      syncedWithServiceNow: synced,
    };
    incidents.push(incident);
    if (blueprint) {
      const list = clusterMembers.get(blueprint.code) ?? [];
      list.push(id);
      clusterMembers.set(blueprint.code, list);
    }
    return incident;
  };

  // Candidate clusters: small emerging groups (3-6 incidents)
  for (const bp of candidateBlueprints) {
    const size = 3 + Math.floor(rand() * 3);
    for (let i = 0; i < size; i++) makeIncident(bp, "candidate");
  }

  // Unclustered noise
  for (let i = 0; i < 24; i++) makeIncident(null, "unclustered");

  // Remaining incidents distributed across seeded clusters
  while (incidents.length < TOTAL) {
    const bp = seededBlueprints[incidents.length % seededBlueprints.length]!;
    makeIncident(bp, "in_cluster");
  }

  for (const bp of CLUSTER_BLUEPRINTS) {
    const ids = clusterMembers.get(bp.code) ?? [];
    const createdOffset = bp.seeded ? Math.floor(rand() * 120 * DAY) : Math.floor(rand() * 6 * DAY);
    clusters.push({
      id: bp.code,
      name: bp.name,
      service: bp.service,
      assignmentGroup: bp.group,
      category: bp.category,
      incidentCount: ids.length,
      averageSimilarity: bp.seeded ? round(86 + rand() * 10) : round(78 + rand() * 9),
      createdAt: new Date(BASE_DATE - createdOffset).toISOString(),
      updatedAt: new Date(BASE_DATE - Math.floor(rand() * 3 * DAY)).toISOString(),
      status: bp.seeded ? "active" : "candidate",
      inClusterTable: bp.seeded,
      suggestedNames: bp.suggested,
      incidentIds: ids,
    });
  }

  // Two retired/merged historical clusters
  clusters.push(
    {
      id: "NET-VPN-000", name: "Legacy VPN Client Issues", service: "Network", assignmentGroup: "Network Engineering",
      category: "VPN", incidentCount: 18, averageSimilarity: 81, createdAt: new Date(BASE_DATE - 300 * DAY).toISOString(),
      updatedAt: new Date(BASE_DATE - 40 * DAY).toISOString(), status: "merged", inClusterTable: true, incidentIds: [],
    },
    {
      id: "EUC-HDW-000", name: "Windows 10 Hardware Faults", service: "End User Computing", assignmentGroup: "Desktop Support",
      category: "Hardware", incidentCount: 26, averageSimilarity: 79, createdAt: new Date(BASE_DATE - 380 * DAY).toISOString(),
      updatedAt: new Date(BASE_DATE - 70 * DAY).toISOString(), status: "retired", inClusterTable: true, incidentIds: [],
    },
  );

  const audit: AuditEvent[] = [];
  const actions = [
    "AI prediction generated",
    "Human approved AI recommendation",
    "Category corrected by analyst",
    "Cluster created",
    "Cluster approved",
    "Cluster renamed",
    "Cluster pushed to ServiceNow",
    "Incident synchronized",
    "Cluster rejected",
  ];
  for (let i = 0; i < 60; i++) {
    const inc = incidents[Math.floor(rand() * incidents.length)]!;
    const action = pick(rand, actions);
    const isCluster = action.startsWith("Cluster");
    const cl = clusters[Math.floor(rand() * clusters.length)]!;
    audit.push({
      id: `AUD-${1000 + i}`,
      timestamp: new Date(BASE_DATE - i * 37 * 60_000).toISOString(),
      entityId: isCluster ? cl.id : inc.id,
      entityType: isCluster ? "cluster" : "incident",
      action,
      previousValue: action.includes("corrected") ? pick(rand, ["Hardware", "Software", "Other"]) : undefined,
      aiPrediction: isCluster ? cl.name : inc.category,
      finalValue: isCluster ? cl.name : inc.category,
      confidence: round(60 + rand() * 39),
      user: pick(rand, ["admin", "a.novak", "s.patel", "m.oconnor", "system"]),
    });
  }

  const syncEvents: SyncEvent[] = [
    { id: "s1", timestamp: new Date(BASE_DATE - 2 * 60_000).toISOString(), message: "INC001245 synchronized successfully", level: "success" },
    { id: "s2", timestamp: new Date(BASE_DATE - 4 * 60_000).toISOString(), message: "Cluster NET-VPN-004 queued for seeding", level: "info" },
    { id: "s3", timestamp: new Date(BASE_DATE - 9 * 60_000).toISOString(), message: "INC001244 updated in MAIN", level: "info" },
    { id: "s4", timestamp: new Date(BASE_DATE - 16 * 60_000).toISOString(), message: "Batch classification results written (42 records)", level: "success" },
    { id: "s5", timestamp: new Date(BASE_DATE - 31 * 60_000).toISOString(), message: "Retry succeeded for INC001198 after transient timeout", level: "success" },
    { id: "s6", timestamp: new Date(BASE_DATE - 55 * 60_000).toISOString(), message: "ServiceNow API returned 429 — backing off", level: "error" },
  ];

  cache = { incidents, clusters, audit, syncEvents };
  return cache;
}

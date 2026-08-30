# Incident Intelligence Hub

# Build a Professional Enterprise AI/ML ServiceNow Incident Intelligence Platform

Build a **production-quality, professional enterprise web application UI** for an **AI/ML-powered ServiceNow Incident Classification, Similarity and Clustering Platform**.

This is NOT a generic dashboard and should NOT look like a simple CRUD application.

The application is designed for an enterprise IT service-management environment where users create ServiceNow incidents, but users may select the wrong **Service, Category, Subcategory, or Assignment Group**.

The platform uses **both AI and ML** to:

1. Predict the correct Service.

2. Predict the correct Category.

3. Predict the correct Subcategory.

4. Predict the correct Assignment Group.

5. Find similar historical incidents.

6. Determine whether an incident belongs to an existing cluster.

7. Detect potential new/emerging clusters.

8. Suggest two possible names for emerging clusters using AI.

9. Allow humans to review/approve AI recommendations.

10. Push approved clusters/incidents into the ServiceNow CLUSTER table.

11. Keep ServiceNow and this UI synchronized.

The UI must communicate **trust, accuracy, explainability, operational control, and enterprise readiness**.

---

# 1. Overall Product Concept

Application name:

**Incident Intelligence**

Subtitle:

**AI-Powered Incident Classification & Cluster Intelligence**

The application should have a modern enterprise IT operations visual language.

Think of the quality level of:

* ServiceNow enterprise dashboards

* Datadog

* Splunk

* Microsoft Azure portal

* modern ITSM platforms

* enterprise observability platforms

Do NOT make it look like:

* a startup landing page

* a generic analytics template

* a basic Bootstrap admin dashboard

* a flashy AI website

* a cryptocurrency dashboard

The UI should be:

* professional

* clean

* modern

* information-dense but not cluttered

* highly usable

* enterprise-oriented

* responsive

* accessible

* consistent

* scalable to thousands of incidents and clusters

---

# 2. Main Application Layout

Use a persistent left sidebar navigation.

Sidebar:

### Logo

**Incident Intelligence**

Use a simple professional icon representing:

* incidents

* intelligence

* network/connection

* AI

Do not use an overly futuristic robot icon.

---

### Sidebar Navigation

1. **Dashboard**

2. **Incidents**

3. **Cluster Explorer**

4. **Cluster Management**

5. **Candidate Clusters**

6. **Create Incident**

7. **AI/ML Predictions**

8. **ServiceNow Sync**

9. **Audit & Activity**

10. **Settings**

At the bottom:

* System status

* ServiceNow connection status

* AI/ML engine status

* User profile

---

# 3. Global Top Header

Top header should contain:

### Left

Current page title and breadcrumb.

Example:

Dashboard

or:

Cluster Explorer / Network / VPN

### Right

* Global search

* Notifications

* ServiceNow connection indicator

* User profile/avatar

* Settings icon

Global search should eventually support searching:

* Incident ID

* Short Description

* Cluster ID

* Cluster Name

* Assignment Group

* Service

---

# 4. Design System

Use a professional enterprise design system.

Preferred visual direction:

* light theme by default

* white/very light gray background

* dark navy/charcoal text

* subtle borders

* moderate rounded corners

* restrained shadows

* strong visual hierarchy

* professional status badges

Avoid excessive gradients.

Avoid excessive glassmorphism.

Avoid huge cards.

Avoid oversized typography.

Use color primarily to communicate status.

Suggested semantic colors:

### Green

Approved / Active / In Cluster / Healthy

### Amber

Candidate / Pending / Review Required / Medium confidence

### Red

Failed / Rejected / Low confidence / Error

### Blue

AI prediction / Information / Processing

### Gray

Inactive / Unclustered / Neutral

Do not rely only on color. Every status should also have text or an icon.

---

# 5. Dashboard

Create a professional executive/operations dashboard.

Page title:

**Incident Intelligence Dashboard**

Subtitle:

**Monitor incident classification, clustering, emerging patterns and AI/ML performance.**

Top KPI cards:

### Total Incidents

Example:

**650**

Subtitle:

All incidents in MAIN

---

### Active Clusters

Example:

**38**

Subtitle:

Clusters in CLUSTER table

---

### Candidate Clusters

Example:

**7**

Subtitle:

Awaiting review

---

### Unclustered Incidents

Example:

**24**

Subtitle:

No sufficiently similar cluster

---

### AI Classification Accuracy

Example:

**94.2%**

Subtitle:

Current validation accuracy

---

### Human Review Required

Example:

**31**

Subtitle:

Incidents awaiting review

---

# 6. Dashboard Charts

Include useful enterprise charts.

### Incident Distribution by Service

Horizontal bar chart.

Example:

Collaboration

130

Identity & Access Management

130

Network

130

End User Computing

130

Virtual Desktop / AVD

130

---

### Incident Distribution by State

Donut or bar chart:

* New

* In Progress

* Resolved

* Closed

---

### Cluster Distribution

Show:

* Active clusters

* Candidate clusters

* Unclustered

* Recently created clusters

---

### AI Confidence Distribution

Show:

* 80–100% Auto Approval

* 60–79% AI Recommendation + Human Review

* <60% Human Classification

Clearly explain the workflow.

---

# 7. Important Confidence Policy

The UI must implement and visually communicate these rules:

### 80% or higher

**Auto Approval**

AI + ML prediction can be automatically approved.

Display:

**High Confidence — Auto Approved**

Use a green status badge.

---

### 60%–79%

**AI Recommendation + Human Review**

Display:

**Medium Confidence — Review Required**

Use an amber status badge.

---

### Below 60%

**Human Classification Required**

Display:

**Low Confidence — Human Decision Required**

Use a red/amber status badge.

---

The confidence score should be shown as:

**94%**

not:

**0.94**

unless technical details are explicitly shown.

---

# 8. Incidents Page

Create a complete incident management page.

Page title:

**Incidents**

Tabs:

### All Incidents

All incidents stored in MAIN.

### AI Review Required

Incidents requiring human review.

### Candidate Cluster

Incidents associated with emerging/candidate clusters.

### Unclustered

Incidents that don't sufficiently match an existing cluster.

### Recently Processed

Recently processed AI/ML incidents.

---

# 9. Incident Table

Use a professional data table.

Columns:

* Incident ID

* Created Date

* State

* Priority

* Service

* Category

* Subcategory

* Assignment Group

* Short Description

* Cluster

* Classification Confidence

* Cluster Confidence

* Status

* Actions

Do NOT make the table visually overwhelming.

Use:

* sortable columns

* filtering

* pagination

* column visibility

* search

* row hover

* sticky header

---

# 10. Incident Detail Page

Clicking an incident should open a detailed incident view.

Example:

**INC001245**

Top section:

Status:

**In Progress**

Priority:

**P2**

Classification:

**AI Approved**

Cluster:

**VPN Authentication Failures**

---

## Incident Information

Display:

Service:

Network

Category:

VPN

Subcategory:

Authentication

Assignment Group:

Network Engineering

---

## User Report

### Short Description

Unable to authenticate to corporate VPN.

### Description

Show the complete detailed user description.

### Sub-description

Show the AI-generated contextual enrichment.

Clearly label it:

**AI-generated contextual information**

Do not make the sub-description appear to be user-written.

---

# 11. AI Classification Panel

Create a visually distinct panel:

## AI + ML Classification

Show:

| Field            | Prediction          | Confidence |

| ---------------- | ------------------- | ---------- |

| Service          | Network             | 96%        |

| Category         | VPN                 | 94%        |

| Subcategory      | Authentication      | 91%        |

| Assignment Group | Network Engineering | 93%        |

Show an overall classification confidence.

Example:

**94% — High Confidence**

Status:

**Auto Approved**

---

# 12. Explainability

Below the predictions, show:

### Why did the system make this prediction?

Example:

* Incident description contains symptoms associated with VPN authentication.

* Historical incidents with similar language were assigned to Network Engineering.

* The semantic similarity to previous VPN authentication incidents is high.

* The ML classifier and AI reasoning are consistent.

Do NOT expose chain-of-thought.

Only show concise, safe, user-facing reasoning/evidence.

---

# 13. Similar Incidents

Every incident detail page should contain:

## Similar Historical Incidents

Show top 5 similar incidents.

Example:

INC001034

VPN login authentication failure

**94% similar**

Network → VPN → Authentication

---

INC001089

Unable to authenticate to VPN

**91% similar**

Network → VPN → Authentication

---

Each result should be clickable.

This is important because the application is not only a clustering system; it is also a **similarity intelligence system**.

---

# 14. Cluster Prediction Section

After classification and similarity analysis:

## Cluster Prediction

Example:

**Predicted Cluster**

VPN Authentication Failures

Cluster ID:

NET-VPN-001

Similarity:

93%

Status:

**Existing Cluster**

Buttons:

**View Cluster**

and:

**View Similar Incidents**

---

# 15. Candidate / Emerging Cluster

When an incident does not sufficiently match an existing cluster, show:

## Emerging Cluster Detected

Example:

**4 related incidents detected**

Status:

**Candidate Cluster**

Do not automatically create an active cluster.

Show:

### AI Suggested Cluster Names

Option 1:

**VPN Certificate Validation Issues**

Option 2:

**Corporate VPN Certificate Problems**

Each should have a radio button.

Allow user to:

* select option 1

* select option 2

* enter custom cluster name

Buttons:

**Approve & Create Cluster**

**Keep as Candidate**

**Reject**

---

# 16. Candidate Cluster Rules

Candidate clusters should be visually separated from active clusters.

Candidate cluster example:

```text

Candidate Cluster

VPN Certificate Validation Issues

4 incidents

Similarity: 84%

Created: Aug 29, 2026

Status: Awaiting Human Review

```

Actions:

**Review**

**Approve**

**Rename**

**Reject**

---

# 17. Cluster Explorer

This is one of the most important screens.

Page title:

**Cluster Explorer**

Use a hierarchical navigation:

```text

Service

   ↓

Assignment Group

   ↓

Cluster

   ↓

Incidents

```

Example:

```text

Network

 └── Network Engineering

      ├── VPN Authentication Failures

      │      ├── INC001001

      │      ├── INC001034

      │      └── INC001089

      │

      ├── VPN Connection Drops

      │      ├── INC001120

      │      └── INC001131

      │

      └── VPN Performance Issues

```

Make the hierarchy interactive.

Clicking a service expands it.

Clicking an assignment group expands it.

Clicking a cluster opens cluster details.

---

# 18. Cluster Management

Create a dedicated page:

**Cluster Management**

This represents the actual **CLUSTER table**.

Use tabs:

### Active Clusters

Clusters currently stored in the ServiceNow CLUSTER table.

### Recently Created

Recently seeded clusters.

### Merged / Retired

Historical cluster records.

Each cluster card/table row should show:

* Cluster ID

* Cluster Name

* Service

* Assignment Group

* Incident Count

* Average Similarity

* Created Date

* Last Updated

* Status

Example:

```text

NET-VPN-001

VPN Authentication Failures

Network

Network Engineering

47 incidents

Average similarity: 91%

ACTIVE

```

---

# 19. MAIN Table Cluster View

Create another important screen based specifically on the MAIN table.

Page title:

**MAIN Incident Intelligence**

This page should show all clusters detected from incidents currently in MAIN.

Split the interface into two tabs/pages:

## Tab 1 — In CLUSTER TABLE

Green status indicator.

Label:

**In CLUSTER TABLE**

Show clusters that have already been approved/pushed to the CLUSTER table.

---

## Tab 2 — Candidate / Remaining Clusters

Label:

**Candidate Clusters**

Show clusters that exist only in MAIN and have NOT yet been seeded into CLUSTER.

Each candidate should have:

**Push to CLUSTER TABLE**

button.

---

# 20. Push to CLUSTER Table Workflow

When the user clicks:

**Push to CLUSTER TABLE**

do NOT immediately perform the operation without confirmation.

Open a confirmation modal.

Example:

### Seed Cluster

You are about to move this cluster into the active CLUSTER table.

Cluster:

VPN Certificate Validation Issues

Cluster ID:

NET-VPN-004

Incidents:

4

Service:

Network

Assignment Group:

Network Engineering

Actions:

**Cancel**

**Confirm & Seed**

---

After confirmation:

Show progress:

**Seeding cluster into ServiceNow...**

Then:

**Cluster successfully seeded.**

Update:

MAIN:

Cluster Status → Approved / Seeded

CLUSTER:

New cluster record created

UI:

Candidate cluster moves into Active Clusters.

---

# 21. IMPORTANT: ServiceNow Synchronization

Create a dedicated page:

**ServiceNow Sync**

Show:

### Connection Status

**Connected**

### Last Synchronization

Today, 18:32

### MAIN Table

650 incidents

### CLUSTER Table

38 active clusters

### Pending Synchronization

3 records

Provide buttons:

**Sync Now**

**Refresh**

Show sync activity.

Example:

```text

18:32:10

INC001245 synchronized successfully

18:32:08

Cluster NET-VPN-004 created

18:31:55

INC001244 updated

```

---

# 22. Create Incident from UI

Create a professional incident creation workflow.

Page:

**Create Incident**

Form fields:

### User Input

Short Description

Description

Sub-description

---

### Incident Information

Service dropdown

Category dropdown

Subcategory dropdown

Assignment Group dropdown

Priority

State

The dropdown values should be dependent where appropriate.

For example:

Service:

Network

Then Category options should be relevant to Network.

Then Subcategory options should depend on Category.

---

# 23. AI Predict Button

The main action should be:

**AI + ML Predict**

When clicked:

Show a processing state:

```text

Analyzing incident...

✓ Processing description

✓ Generating semantic representation

✓ Comparing historical incidents

✓ Running ML classification

✓ Running AI classification

✓ Evaluating predictions

```

Do NOT fake actual backend processing.

Build the UI so the frontend can later connect to real backend APIs.

---

# 24. Prediction Review Screen

After prediction:

Show:

```text

AI + ML Prediction

Service

Network

96%

Category

VPN

94%

Subcategory

Authentication

91%

Assignment Group

Network Engineering

93%

```

Then show:

### Decision

**High Confidence — Auto Approval**

or:

**Medium Confidence — Human Review Required**

or:

**Low Confidence — Human Classification Required**

---

# 25. Finalize Incident

Provide:

**Finalize Incident**

button.

Once finalized, the system should perform the clustering step.

Show:

```text

Incident finalized.

Running cluster intelligence...

```

Then:

### Cluster Prediction

Existing Cluster:

VPN Authentication Failures

Similarity:

93%

Buttons:

**Push to ServiceNow**

**Cancel**

---

# 26. Push to ServiceNow

When the user clicks:

**Push to ServiceNow**

show confirmation:

```text

Push Incident to ServiceNow?

Incident:

INC001301

Classification:

Network

VPN

Authentication

Network Engineering

Cluster:

VPN Authentication Failures

Confidence:

93%

[Cancel]

[Push to ServiceNow]

```

After success:

```text

✓ Incident successfully pushed to ServiceNow

```

---

# 27. Real-Time ServiceNow Incident Flow

The UI must visually support this future workflow:

```text

ServiceNow Incident Created

          ↓

Incident becomes "In Progress"

          ↓

Backend detects state change

          ↓

AI + ML Classification

          ↓

Service

Category

Subcategory

Assignment Group

          ↓

Similarity Search

          ↓

Cluster Prediction

          ↓

Existing Cluster

OR

Candidate Cluster

          ↓

Human Review if required

```

The frontend should have status indicators showing where an incident currently is in this pipeline.

---

# 28. Processing Status

For every incident, support a processing timeline:

```text

Incident Created                 ✓

Classification Started           ✓

AI Classification                ✓

ML Classification                ✓

Classification Decision          ✓

Similarity Search                ✓

Cluster Prediction               ✓

Human Review                     Pending

ServiceNow Sync                  Pending

```

This should be shown as a clean vertical timeline.

---

# 29. AI/ML Predictions Page

Create:

**AI/ML Predictions**

Dashboard containing:

### Classification Accuracy

Service

Category

Subcategory

Assignment Group

### Confidence Distribution

High

Medium

Low

### Human Review Rate

### Auto Approval Rate

### Prediction Acceptance Rate

### Model Performance

Include placeholder charts that can later consume real backend data.

---

# 30. Audit & Activity

Create an enterprise audit page.

Track:

* AI prediction

* human correction

* cluster creation

* cluster approval

* cluster rejection

* cluster rename

* cluster push to ServiceNow

* incident updates

* synchronization events

Example:

```text

INC001245

Category changed

Previous:

Hardware

AI Prediction:

Network

Final:

Network

Confidence:

91%

Action:

Human Approved

User:

admin

Timestamp:

18:32

```

Do NOT expose internal chain-of-thought.

---

# 31. Notifications

Support notification types:

### AI Review Required

"12 incidents require human classification review."

### Candidate Cluster

"New candidate cluster detected with 4 related incidents."

### Sync Success

"Cluster NET-VPN-004 successfully synchronized."

### Sync Failure

"ServiceNow synchronization failed."

---

# 32. Search and Filters

Provide global and page-level filtering.

Filters:

* Service

* Category

* Subcategory

* Assignment Group

* Priority

* State

* Cluster

* Cluster Status

* Classification Status

* Confidence range

* Created Date

Search should support:

* Incident ID

* Cluster ID

* Cluster Name

* Description keywords

---

# 33. Empty States

Create professional empty states.

Example:

### No Candidate Clusters

"All detected clusters have been reviewed."

### No Similar Incidents

"No sufficiently similar historical incidents were found."

### No Search Results

"No incidents match your current filters."

Do not show blank white space.

---

# 34. Loading States

Use skeleton loaders rather than spinning loaders everywhere.

For AI processing use a meaningful step indicator.

Example:

```text

AI + ML Analysis

✓ Reading incident

✓ Generating embeddings

● Comparing historical incidents

○ Evaluating cluster

○ Preparing recommendation

```

---

# 35. Error States

Professional error messages.

Example:

**ServiceNow synchronization failed**

"Unable to synchronize the incident with ServiceNow. The incident remains safely stored locally and can be retried."

Buttons:

**Retry**

**View Details**

Do not expose raw stack traces to normal users.

---

# 36. Mock Data

For the initial UI implementation, use realistic mock data based on the following golden dataset structure:

650 incidents

Services:

* Collaboration

* Identity and Access Management

* Network

* End User Computing

* Virtual Desktop / AVD

Use realistic categories, subcategories, assignment groups and cluster names.

The UI should be designed so mock data can easily be replaced by REST APIs later.

Do NOT hard-code the UI architecture around mock data.

Create clean service/API abstraction layers.

---

# 37. Backend/API Ready

The frontend should be designed for future FastAPI integration.

Do not build the UI assuming that all data is static.

Create an API service layer such as:

```text

/api/v1/incidents

/api/v1/incidents/{id}

/api/v1/clusters

/api/v1/clusters/{id}

/api/v1/clusters/candidates

/api/v1/classification/predict

/api/v1/clustering/predict

/api/v1/servicenow/sync

/api/v1/servicenow/push

```

Use mock implementations initially, but keep the architecture ready for real API integration.

---

# 38. Important Business Rules

The UI must respect these rules:

### Rule 1

Every incident exists in the **MAIN table**.

### Rule 2

Only approved/seeded clusters are placed into the **CLUSTER table**.

### Rule 3

Not every incident must belong to an existing cluster.

### Rule 4

Unrelated incidents should remain **Unclustered/Noise**.

### Rule 5

Small emerging groups can remain as **Candidate Clusters**.

### Rule 6

Candidate clusters require human approval before becoming active clusters.

### Rule 7

AI should suggest **two cluster names** for a new emerging cluster.

### Rule 8

Human users can choose either AI suggestion or enter their own name.

### Rule 9

Classification uses **both AI and ML**, not only an LLM.

### Rule 10

Confidence determines the workflow:

```text

80–100%

→ Auto Approval

60–79%

→ AI Recommendation + Human Review

<60%

→ Human Classification

```

### Rule 11

Do not force every incident into a cluster.

### Rule 12

ServiceNow and the application UI must remain synchronized.

---

# 39. Data Relationship Visualization

Where appropriate, visually communicate:

```text

SERVICE

   ↓

ASSIGNMENT GROUP

   ↓

CLUSTER

   ↓

INCIDENTS

```

Example:

```text

Network

│

└── Network Engineering

    │

    ├── VPN Authentication Failures

    │   ├── INC001001

    │   ├── INC001002

    │   └── INC001003

    │

    └── VPN Connection Drops

        ├── INC001004

        └── INC001005

```

This hierarchy is central to the product.

---

# 40. Responsive Design

Desktop is the primary target because this is an enterprise operations application.

Still support:

* laptop

* tablet

* smaller desktop screens

On smaller screens:

* collapse sidebar

* convert large tables into responsive cards

* preserve important incident information

* maintain accessible actions

---

# 41. Accessibility

Use:

* accessible contrast

* keyboard navigation

* clear focus states

* tooltips where needed

* semantic buttons

* accessible dialogs

* meaningful labels

* don't rely on color alone

---

# 42. Technical Quality

Use a clean component architecture.

Suggested structure:

```text

src/

  components/

    layout/

    dashboard/

    incidents/

    clusters/

    predictions/

    servicenow/

    common/

  pages/

    Dashboard

    Incidents

    IncidentDetail

    ClusterExplorer

    ClusterManagement

    CandidateClusters

    CreateIncident

    Predictions

    ServiceNowSync

    Audit

  services/

    api

    incidents

    clusters

    predictions

    servicenow

  hooks/

  types/

  utils/

```

Use reusable components for:

* StatusBadge

* ConfidenceBadge

* ConfidenceBar

* IncidentCard

* IncidentTable

* ClusterCard

* ClusterTree

* PredictionPanel

* SimilarIncidentList

* ConfirmationModal

* ProcessingTimeline

* EmptyState

* ErrorState

---

# 43. Avoid These UI Problems

Do NOT:

* use excessive gradients

* use excessive animations

* use giant AI robot graphics

* use neon colors

* use cryptocurrency-style dashboards

* overload the screen with cards

* show raw JSON to normal users

* show raw API responses

* expose chain-of-thought

* make every action destructive

* create unnecessary popups

* use random dummy labels

* hard-code mock data directly inside components

* make the interface look like a basic CRUD admin panel

---

# 44. Primary User Journey

The most important journey must feel extremely polished:

```text

User creates incident

        ↓

AI + ML Predict

        ↓

Prediction displayed

        ↓

Confidence calculated

        ↓

Auto approval / Human review

        ↓

Finalize

        ↓

Cluster prediction

        ↓

Existing cluster?

       / \

     YES  NO

      ↓    ↓

 Existing  Candidate

 Cluster   Cluster

             ↓

       AI suggests 2 names

             ↓

        Human approval

             ↓

        Push to CLUSTER

             ↓

        ServiceNow sync

```

Make this workflow visually obvious throughout the application.

---

# 45. Final Product Feel

The final result should feel like a **real enterprise AI product that could be demonstrated to an IT leadership team**.

A manager should immediately understand:

1. How many incidents exist.

2. How many are classified automatically.

3. How many require human review.

4. Which clusters are active.

5. Which new clusters are emerging.

6. Which incidents are unclustered.

7. How AI/ML confidence is performing.

8. What requires attention.

9. What has been synchronized with ServiceNow.

An IT analyst should immediately be able to:

1. Find an incident.

2. Understand its AI/ML classification.

3. See why the classification was made.

4. Find similar historical incidents.

5. See the predicted cluster.

6. Review candidate clusters.

7. Approve/reject/rename clusters.

8. Push approved data to ServiceNow.

The UI should prioritize **clarity, trust, explainability and operational efficiency** over visual decoration.

Build the first version with realistic mock data and fully interactive navigation, tables, filters, modals, tabs, prediction workflows, cluster workflows and ServiceNow synchronization states.

Make all backend-dependent operations clearly abstracted behind services so the existing FastAPI backend can be integrated later without redesigning the UI.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/069ec265-412e-4f94-be0c-f5f6da27f06e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

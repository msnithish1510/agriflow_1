# AGRIFlow System Architecture Document 🏗️
### SIH 2026 Problem Statement SIH26033: AI-Driven Pre-Market Agricultural Coordination

---

## 1. System Overview Architecture

AGRIFlow utilizes a decoupled 4-Tier Architecture designed for high throughput, low latency spatial queries, and multi-farmer order aggregation.

```
+-----------------------------------------------------------------------------------+
|                                  FRONTEND LAYER                                   |
|  +-----------------------------------+     +-----------------------------------+  |
|  |     Flutter Mobile Application    |     |      Next.js Web Command Center   |  |
|  |  (Farmers, Consumers, Logistics)  |     |   (Bulk Buyers, FPOs, Admin Dash)  |  |
|  +-----------------+-----------------+     +-----------------+-----------------+  |
+--------------------|-----------------------------------------|--------------------+
                     | HTTP REST / WebSockets / FCM            | HTTP REST API
                     v                                         v
+-----------------------------------------------------------------------------------+
|                                   API GATEWAY LAYER                               |
|  +-----------------------------------------------------------------------------+  |
|  |                       Python FastAPI Application Router                     |  |
|  |     CORS | Role-Based Access Control (RBAC) | Pydantic Request Validation    |  |
|  +-------------------------------------+---------------------------------------+  |
+----------------------------------------|------------------------------------------+
                                         | Internal Service Invocation
                                         v
+-----------------------------------------------------------------------------------+
|                                 SERVICES CORE LAYER                               |
|  +---------------------+ +----------------------+ +----------------------------+  |
|  |   Matching Engine   | |   Price Breakdown    | |    GIS & Spatial Service   |  |
|  | (Multi-Farmer Pool) | | (Net-Realization)    | | (PostGIS Proximity Query) |  |
|  +----------+----------+ +----------+-----------+ +-------------+--------------+  |
|             |                       |                         |                   |
|             v                       v                         v                   |
|  +---------------------+ +----------------------+ +----------------------------+  |
|  | AI Forecasting Engine| | Route Optimizer     | | FCM Notification Engine    |  |
|  | (XGBoost/Scikit)    | | (Google OR-Tools)  | | (Firebase Push Service)  |  |
|  +---------------------+ +----------------------+ +----------------------------+  |
+----------------------------------------|------------------------------------------+
                                         | Persistence & Query Execution
                                         v
+-----------------------------------------------------------------------------------+
|                                DATABASE & DATA TIER                               |
|  +-----------------------------------------------------------------------------+  |
|  |                           PostgreSQL DB + PostGIS                           |  |
|  |  - Spatial Point Indexes (GIST) for Lat/Lng Coordinates                     |  |
|  |  - Relational Schemas: Users, Demands, Expected Supply, Stock, Matches      |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Layer Detailed Specifications

### A. Frontend Layer
- **Mobile Experience (Flutter)**:
  - Role-optimized screens for Farmers (expected harvest input, current stock listing, net realization calculator) and Consumers (post requirements, view indicative urban price breakdown).
  - Offline-first caching for rural connectivity resilience.
- **Web Command Center (Next.js 14 / React 18)**:
  - Bulk buyer dashboard for future demand posting, crop availability tracking, and automated multi-farmer aggregated order confirmation.
  - Interactive Leaflet/OpenStreetMap geospatial visualizer displaying crop supply-demand regional balance.

### B. API Gateway Layer (FastAPI)
- **Asynchronous I/O**: High concurrency endpoints built on ASGI.
- **Pydantic Validation**: Strong request typing preventing malformed payloads.
- **JWT & Role-Based Access Control (RBAC)**: Enforces permissions across 6 system roles:
  - `Farmer`: Declare expected harvest, list stock, respond to consumer demands.
  - `FPO`: Aggregate member farmer yields, submit bulk supply declarations.
  - `BulkBuyer`: Post future demand requirements, discover stock, confirm matched orders.
  - `Consumer`: Post direct household demand, view urban price breakdowns.
  - `LogisticsPartner`: Accept route assignments, view optimized pickup/drop stops.
  - `Admin`: Oversee platform health, audit price margins, monitor supply-demand heatmaps.

### C. Services Core Layer

#### 1. Pre-Market Matching Engine (`matching_engine.py`)
- **Pre-Market Workflow (Rural Model)**:
  - When a Bulk Buyer posts a `DemandPost` (e.g., 50,000 kg Tomatoes required in Pune by Sept 20):
  - System queries `ExpectedSupply` records within a $R$-km radius (default 100km).
  - Multi-Farmer Aggregator pools yield from multiple smallholder farmers (e.g. Farmer A: 10,000kg, Farmer B: 25,000kg, FPO C: 15,000kg) to fulfill the 50,000 kg order.
  - Generates an `OrderMatch` record with match score calculated as:
    $$\text{Score} = w_1 \cdot \text{ProximityScore} + w_2 \cdot \text{DateAlignment} + w_3 \cdot \text{PerishabilityScore}$$

#### 2. AI Demand & Price Guidance Service (`ai_forecasting.py`)
- **XGBoost / Scikit-learn Regressor**:
  - Predicts expected demand volume (in Metric Tons) and recommended target price ($\text{INR/kg}$) by analyzing:
    - Historical district market arrivals.
    - Seasonal harvest cycles.
    - Regional climate & rainfall indicators.
  - Computes **Farmer Net Realization**:
    $$\text{Net Realization} = \text{Agreed Price per kg} - (\text{Collection Cost} + \text{Logistics Share})$$

#### 3. Urban Price Transparency Engine (`price_transparency.py`)
- **Calculates Indicative Price Breakdown**:
  $$\begin{aligned}
  P_{\text{farmer}} &= \text{Direct payout to Farmer/FPO} \\
  C_{\text{handling}} &= \text{Grading, sorting, cold storage packaging} \\
  T_{\text{transport}} &= \text{Distance-based refrigerated/freight transport} \\
  M_{\text{margin}} &= \text{Audited local intermediary/market margin} \\
  F_{\text{platform}} &= \text{Nominal AGRIFlow coordination fee (1-2\%)} \\
  P_{\text{consumer}} &= P_{\text{farmer}} + C_{\text{handling}} + T_{\text{transport}} + M_{\text{margin}} + F_{\text{platform}}
  \end{aligned}$$

#### 4. Logistics & Route Optimization Service (`route_optimizer.py`)
- **Google OR-Tools VRPTW (Vehicle Routing Problem with Time Windows)**:
  - Solves optimal multi-stop pickup routes for aggregated farmer orders.
  - Minimizes total transit distance while enforcing vehicle weight capacities and harvest freshness time windows.

---

## 3. Database Entity Relationship Overview

```
 [User] (Roles: Farmer, FPO, Buyer, Consumer, Logistics)
   │
   ├─── (1:N) ─── [ExpectedSupply]  ────┐
   │                                    │
   ├─── (1:N) ─── [AvailableStock]   ───┼─── (M:N via Aggregation) ───> [OrderMatch]
   │                                    │                                  │
   ├─── (1:N) ─── [DemandPost]       ───┘                                  │ (1:1)
   │                                                                       v
   └─── (1:N) ─── [ShipmentRoute] <───────────────────────────────── [PriceBreakdown]
```

---

## 4. End-to-End Workflow Data Flow

### Demand-Driven Flow (Rural & Urban Bulk)
```
Bulk Buyer -> Posts Future Demand (Crop, Qty, Target Date, Location)
    │
    ▼
FastAPI API Router -> Stores DemandPost in PostgreSQL
    │
    ▼
GIS Service -> Identifies Eligible Farmers/FPOs within Radius
    │
    ▼
Notification Service -> Fires Push Alerts to Nearby Farmers
    │
    ▼
Farmers -> Submit ExpectedSupply (Qty, Harvest Date)
    │
    ▼
Matching Engine -> Pools Multi-Farmer Supply -> Generates OrderMatch
    │
    ▼
Price Engine -> Calculates Indicative Price Breakdown & Net Realization
    │
    ▼
OR-Tools Optimizer -> Generates Multi-Pickup Route for Logistics Partner
```

---

## 5. Next Development Phases

1. **Phase 2 (Core Logic & Solver Verification)**:
   - Connect live PostgreSQL/PostGIS DB migrations.
   - Train baseline XGBoost models on historical Agmarknet crop dataset.
   - Integrate full OR-Tools distance matrix solver with OpenStreetMap Routing API.

2. **Phase 3 (Mobile & Dashboard UI Integration)**:
   - Complete Flutter farmer harvest declaration UI with multilingual support (Hindi, Marathi, Telugu, Punjabi).
   - Integrate Web GIS Map layers in Next.js command dashboard.

3. **Phase 4 (Pilot Testing & Field Verification)**:
   - Execute pilot simulation with 100 simulated farmers and 5 bulk buyers in Maharashtra agri-clusters (Nashik, Solapur).

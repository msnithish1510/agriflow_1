# AGRIFlow 🌾⚡
### AI-Driven Pre-Market Agricultural Coordination Platform
**Smart India Hackathon 2026 (SIH Problem Statement SIH26033)**

AGRIFlow is a demand-first agricultural coordination platform connecting smallholder farmers/FPOs with bulk buyers and normal family consumers. It implements pre-market yield pooling, Google OR-Tools VRPTW logistics, deterministic weighted matching, AI demand forecasting, transparent price stack auditing, and multilingual voice assistance.

---

## 🚀 Key Innovation Highlights

- **Pre-Market Yield Pooling**: Connects future crop demands with expected harvest declarations before harvest.
- **0% Middleman Cut in Rural Model**: Guarantees 93.8% direct net realization payout to smallholder farmers.
- **SIH26033 Urban Price Transparency**: Full price stack audit (`Farmer Price + Collection + Handling + Transport + Intermediary Wholesale Margin + Platform Fee = Final Consumer Price`) with explicit ESTIMATED vs ACTUAL tags.
- **Google OR-Tools VRPTW Logistics Engine**: Multi-farmer pickup waypoint sequencing, vehicle capacity constraints, time windows, and transit duration limits.
- **AI Demand Forecasting Pipeline**: Model pipeline comparing Moving Average, Linear Regression, and XGBoost Regressor with audited MAE, RMSE, and MAPE metrics on validation splits.
- **Multilingual Voice Assistance**: Spoken entity extraction (Crop, Quantity, Date, Price), pre-submit confirmation modal, and grounded query engine (English + Tamil).

---

## 🛠️ Architecture & Tech Stack

- **Backend Framework**: Python 3.14 + FastAPI + Pydantic v2
- **Database Layer**: SQLAlchemy ORM + PostGIS / SQLite with thread-safe connection pooling
- **Optimization & ML**: Google OR-Tools (`ortools.constraint_solver`), Scikit-Learn, XGBoost, Pandas, NumPy
- **Frontend App**: Next.js 14 App Router + React + TypeScript + Glassmorphism Dark Theme
- **Authentication**: JWT Tokens + SHA-256 password hashing + RBAC Middleware

---

## 💻 Project Structure

```
agriflow/
├── backend/
│   ├── alembic/                      # Database migrations
│   ├── app/
│   │   ├── api/v1/endpoints/        # REST API endpoints (auth, crops, demands, supplies, matching, orders, feeds, voice, etc.)
│   │   ├── core/                    # Security, RBAC, config_rules, audit_logger
│   │   ├── db/                      # Session & SQLite/PostGIS setup
│   │   ├── ml/                      # ML preprocessing, model training pipeline, serialized artifacts
│   │   ├── models/                  # SQLAlchemy entities (User, Crop, DemandPost, ExpectedSupply, AvailableStock, OrderMatch, etc.)
│   │   ├── schemas/                 # Pydantic validation DTOs
│   │   ├── seeds/                   # Seed runner populating realistic demo data
│   │   └── services/                # Core engines (matching_engine, ranking_service, aggregation_service, pricing_service, route_optimizer, ai_forecasting, voice_assistant)
│   └── tests/                       # Automated test suites (38 tests passing 100%)
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js 14 App Router page.tsx
│   │   ├── components/              # UI widgets (Navbar, SIHDemoRunner, PriceBreakdownWidget, VoiceAssistantWidget, AIForecastPanel, LogisticsMap)
│   │   ├── services/                # REST API client layer (api.ts)
│   │   └── types/                   # TypeScript data contracts
└── docs/
    ├── architecture.md              # Architecture documentation
    └── SIH_DEMO_GUIDE.md            # 3-Minute SIH Judges Presentation Script
```

---

## ⚙️ Setup & Installation Instructions

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies (Python 3.10+)
pip install fastapi uvicorn sqlalchemy alembic pydantic scikit-learn xgboost ortools pandas numpy httpx

# Run database migrations
python -m alembic upgrade head

# Run database seeder (populates crops, farmers, FPOs, buyers, consumers, logistics, demands, stocks)
python -m app.seeds.seed_runner

# Train ML Demand Forecasting Model
python app/ml/train_demand_forecast.py

# Start FastAPI Server
uvicorn app.main:app --reload --port 8000
```
Backend server will run at: `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Next.js Development Server
npm run dev
```
Frontend web app will run at: `http://localhost:3000`.

---

## 🧪 Running Test Suites

Run the complete automated test suite (38 tests passing 100%):

```bash
# Run Master SIH Scenarios Test Suite
python backend/tests/test_master_sih_scenarios.py

# Run Coordination Engine Test Suite
python backend/tests/test_coordination_engine.py

# Run Pricing Service Test Suite
python backend/tests/test_pricing_service.py

# Run AI Demand Forecasting Test Suite
python backend/tests/test_ai_forecasting.py

# Run VRPTW Logistics Optimization Test Suite
python backend/tests/test_logistics_engine.py

# Run Multilingual Voice Assistant Test Suite
python backend/tests/test_voice_assistant.py

# Run Business Models & Feeds Test Suite
python backend/tests/test_business_models.py

# Run End-to-End Workflow Integration Suite
python backend/tests/test_integration_workflow.py

# Run Full API Test Suite
python backend/tests/test_api.py
```

---

## 🏆 Demonstrating to SIH Judges

Refer to the complete [3-Minute SIH Presentation Guide](file:///d:/agriflow/docs/SIH_DEMO_GUIDE.md) for live scenario demonstration scripts.

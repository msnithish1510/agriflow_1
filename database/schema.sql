-- ===================================================
-- AGRIFlow Relational & Spatial Database Schema
-- Smart India Hackathon 2026 | Problem Statement SIH26033
-- ===================================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM (
    'FARMER',
    'FPO',
    'BULK_BUYER',
    'CONSUMER',
    'LOGISTICS_PARTNER',
    'ADMIN'
);

CREATE TYPE perishability_tier AS ENUM (
    'HIGH',    -- 1-5 days (e.g., Tomato, Leafy Greens)
    'MEDIUM',  -- 7-15 days (e.g., Onion, Potato)
    'LOW'     -- 30+ days (e.g., Wheat, Paddy, Grains)
);

CREATE TYPE demand_status AS ENUM (
    'OPEN',
    'PARTIALLY_MATCHED',
    'MATCHED',
    'FULFILLED',
    'CANCELLED'
);

CREATE TYPE supply_status AS ENUM (
    'DECLARED',
    'MATCHED',
    'HARVESTED',
    'CANCELLED'
);

CREATE TYPE stock_status AS ENUM (
    'AVAILABLE',
    'RESERVED',
    'SOLD'
);

CREATE TYPE match_status AS ENUM (
    'PROPOSED',
    'CONFIRMED',
    'IN_TRANSIT',
    'DELIVERED',
    'CANCELLED'
);

-- 2. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(120) NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(120),
    role user_role NOT NULL,
    organization_name VARCHAR(150),
    state VARCHAR(80) NOT NULL,
    district VARCHAR(80) NOT NULL,
    sub_district VARCHAR(80),
    village_or_area VARCHAR(120) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_district ON users(district, state);

-- 3. CROPS TABLE
CREATE TABLE crops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(80) UNIQUE NOT NULL,
    local_name_hindi VARCHAR(80),
    category VARCHAR(60) NOT NULL,
    perishability perishability_tier NOT NULL,
    shelf_life_days INTEGER NOT NULL,
    standard_unit VARCHAR(20) DEFAULT 'kg',
    indicative_base_price_per_kg NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. DEMAND POSTS (Future Bulk & Consumer Requirements)
CREATE TABLE demand_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    posted_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id),
    required_quantity_kg NUMERIC(12, 2) NOT NULL,
    max_price_per_kg NUMERIC(10, 2) NOT NULL,
    target_delivery_date DATE NOT NULL,
    is_bulk_demand BOOLEAN DEFAULT TRUE, -- True for Bulk Buyer, False for Consumer
    delivery_address TEXT NOT NULL,
    delivery_latitude DOUBLE PRECISION NOT NULL,
    delivery_longitude DOUBLE PRECISION NOT NULL,
    status demand_status DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_demand_crop_date ON demand_posts(crop_id, target_delivery_date, status);

-- 5. EXPECTED SUPPLY (Pre-Market Harvest Declarations by Farmers/FPOs)
CREATE TABLE expected_supplies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id),
    expected_quantity_kg NUMERIC(12, 2) NOT NULL,
    expected_harvest_date DATE NOT NULL,
    min_price_per_kg NUMERIC(10, 2) NOT NULL,
    farm_latitude DOUBLE PRECISION NOT NULL,
    farm_longitude DOUBLE PRECISION NOT NULL,
    status supply_status DEFAULT 'DECLARED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_expected_supply_harvest ON expected_supplies(crop_id, expected_harvest_date, status);

-- 6. AVAILABLE STOCK (Current Post-Harvest Stock Fallback)
CREATE TABLE available_stocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    crop_id UUID NOT NULL REFERENCES crops(id),
    available_quantity_kg NUMERIC(12, 2) NOT NULL,
    price_per_kg NUMERIC(10, 2) NOT NULL,
    harvest_date DATE NOT NULL,
    shelf_life_remaining_days INTEGER NOT NULL,
    location_latitude DOUBLE PRECISION NOT NULL,
    location_longitude DOUBLE PRECISION NOT NULL,
    status stock_status DEFAULT 'AVAILABLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ORDER MATCHES (Pre-Market Demand-Supply Pool Matches)
CREATE TABLE order_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    demand_id UUID NOT NULL REFERENCES demand_posts(id),
    matched_crop_id UUID NOT NULL REFERENCES crops(id),
    total_matched_quantity_kg NUMERIC(12, 2) NOT NULL,
    agreed_farmer_price_per_kg NUMERIC(10, 2) NOT NULL,
    participating_farmer_ids JSONB NOT NULL, -- Array of farmer UUIDs & allocated quantity
    match_score NUMERIC(5, 2) NOT NULL, -- Calculated AI match compatibility score (0-100)
    status match_status DEFAULT 'PROPOSED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. PRICE BREAKDOWNS (Urban & Rural Price Transparency Architecture)
CREATE TABLE price_breakdowns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID REFERENCES order_matches(id),
    crop_id UUID NOT NULL REFERENCES crops(id),
    farmer_price_per_kg NUMERIC(10, 2) NOT NULL,
    collection_handling_fee NUMERIC(10, 2) NOT NULL,
    transport_fee_per_kg NUMERIC(10, 2) NOT NULL,
    market_intermediary_margin NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    platform_coordination_fee NUMERIC(10, 2) NOT NULL,
    final_consumer_price_per_kg NUMERIC(10, 2) NOT NULL,
    farmer_net_realization_per_kg NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. SHIPMENT ROUTES (OR-Tools Logistics Routes)
CREATE TABLE shipment_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id UUID NOT NULL REFERENCES order_matches(id),
    logistics_partner_id UUID REFERENCES users(id),
    pickup_waypoints JSONB NOT NULL, -- List of farmer pickup coordinates & stop order
    drop_waypoint JSONB NOT NULL, -- Destination coordinate
    total_distance_km NUMERIC(10, 2) NOT NULL,
    estimated_transit_hours NUMERIC(6, 2) NOT NULL,
    route_status VARCHAR(40) DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

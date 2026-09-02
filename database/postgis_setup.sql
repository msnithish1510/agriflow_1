-- ==========================================
-- AGRIFlow PostGIS Geospatial Extension Setup
-- SIH 2026 Problem Statement SIH26033
-- ==========================================

-- Enable PostGIS spatial extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper function to calculate geodesic distance in km between two lat/lng points
CREATE OR REPLACE FUNCTION get_distance_km(
    lat1 DOUBLE PRECISION,
    lng1 DOUBLE PRECISION,
    lat2 DOUBLE PRECISION,
    lng2 DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
BEGIN
    RETURN ST_DistanceSphere(
        ST_MakePoint(lng1, lat1),
        ST_MakePoint(lng2, lat2)
    ) / 1000.0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

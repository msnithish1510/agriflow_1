export type UserRole = 'FARMER' | 'FPO' | 'BULK_BUYER' | 'CONSUMER' | 'LOGISTICS_PARTNER' | 'ADMIN';
export type PerishabilityTier = 'HIGH' | 'MEDIUM' | 'LOW';
export type QualityGrade = 'GRADE_A' | 'GRADE_B' | 'ORGANIC' | 'EXPORT';
export type MatchStatus = 'PROPOSED' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export interface User {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  role: UserRole;
  organization_name?: string;
  state: string;
  district: string;
  sub_district?: string;
  village_or_area: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface Crop {
  id: string;
  name: string;
  local_name_hindi?: string;
  category: string;
  perishability: PerishabilityTier;
  shelf_life_days: number;
  standard_unit: string;
  indicative_base_price_per_kg: number;
}

export interface DemandPost {
  id: string;
  posted_by_user_id: string;
  crop_id: string;
  required_quantity_kg: number;
  max_price_per_kg: number;
  target_delivery_date: string;
  quality_requirement: QualityGrade;
  is_bulk_demand: boolean;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  status: string;
  created_at?: string;
}

export interface ExpectedSupply {
  id: string;
  farmer_id: string;
  crop_id: string;
  expected_quantity_kg: number;
  expected_harvest_date: string;
  min_price_per_kg: number;
  quality_grade: QualityGrade;
  farm_latitude: number;
  farm_longitude: number;
  status: string;
  created_at?: string;
}

export interface AvailableStock {
  id: string;
  farmer_id: string;
  crop_id: string;
  available_quantity_kg: number;
  price_per_kg: number;
  harvest_date: string;
  shelf_life_remaining_days: number;
  quality_grade: QualityGrade;
  location_latitude: number;
  location_longitude: number;
  status: string;
  created_at?: string;
}

export interface OrderMatch {
  id: string;
  demand_id?: string;
  buyer_id: string;
  matched_crop_id: string;
  total_matched_quantity_kg: number;
  agreed_farmer_price_per_kg: number;
  total_amount_inr: number;
  participating_farmer_ids: Array<{
    farmer_id: string;
    farmer_name?: string;
    allocated_quantity_kg: number;
    price_per_kg?: number;
  }>;
  match_score: number;
  status: MatchStatus;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: string;
  is_read: boolean;
  related_entity_id?: string;
  created_at: string;
}

export interface PriceBreakdownData {
  farmer_price_per_kg: number;
  collection_handling_fee: number;
  transport_fee_per_kg: number;
  market_intermediary_margin: number;
  platform_coordination_fee: number;
  final_consumer_price_per_kg: number;
  farmer_net_realization_per_kg: number;
  breakdown_percentages: {
    farmer_share: number;
    handling_share: number;
    transport_share: number;
    intermediary_share: number;
    platform_share: number;
  };
}

export interface FarmerDashboardSummary {
  farmer_name: string;
  role: string;
  district: string;
  state: string;
  total_expected_declarations_count: number;
  total_expected_quantity_kg: number;
  total_current_stock_count: number;
  total_available_stock_kg: number;
  status: string;
}

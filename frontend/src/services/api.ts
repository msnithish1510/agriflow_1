import { 
  Crop, DemandPost, ExpectedSupply, AvailableStock, OrderMatch, NotificationItem, 
  PriceBreakdownData, FarmerDashboardSummary 
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
}

// ----------------------------------------------------
// Auth API
// ----------------------------------------------------
export async function loginUser(phoneNumber: string, password: string = 'demo123') {
  const formData = new URLSearchParams();
  formData.append('username', phoneNumber);
  formData.append('password', password);

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString()
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  setAuthToken(data.access_token);
  return data;
}

export async function fetchCurrentProfile() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return await res.json();
}

// ----------------------------------------------------
// Crops Catalog API
// ----------------------------------------------------
export async function fetchCrops(): Promise<Crop[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/crops/`);
    if (!res.ok) throw new Error('Failed to fetch crops');
    const data = await res.json();
    return data.items || data;
  } catch (error) {
    console.warn('API fallback for crops catalog');
    return [
      { id: 'crop-tomato', name: 'Tomato', category: 'Vegetable', perishability: 'HIGH', shelf_life_days: 5, standard_unit: 'kg', indicative_base_price_per_kg: 25.0 },
      { id: 'crop-onion', name: 'Onion', category: 'Vegetable', perishability: 'MEDIUM', shelf_life_days: 15, standard_unit: 'kg', indicative_base_price_per_kg: 22.0 },
      { id: 'crop-potato', name: 'Potato', category: 'Tubers', perishability: 'MEDIUM', shelf_life_days: 30, standard_unit: 'kg', indicative_base_price_per_kg: 18.0 },
      { id: 'crop-wheat', name: 'Wheat', category: 'Grains', perishability: 'LOW', shelf_life_days: 180, standard_unit: 'kg', indicative_base_price_per_kg: 22.5 },
      { id: 'crop-moong', name: 'Moong (Green Gram)', category: 'Pulses', perishability: 'LOW', shelf_life_days: 120, standard_unit: 'kg', indicative_base_price_per_kg: 75.0 }
    ];
  }
}

// ----------------------------------------------------
// Expected Supply & Available Stock API
// ----------------------------------------------------
export async function fetchExpectedSupplies(params: string = ''): Promise<{ total: number; items: ExpectedSupply[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/supplies/expected?${params}`);
    if (!res.ok) throw new Error('Failed to fetch expected supplies');
    return await res.json();
  } catch (error) {
    return { total: 0, items: [] };
  }
}

export async function createExpectedSupply(payload: any): Promise<ExpectedSupply> {
  const res = await fetch(`${API_BASE_URL}/supplies/expected`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create expected supply');
  return await res.json();
}

export async function fetchAvailableStocks(params: string = ''): Promise<{ total: number; items: AvailableStock[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/supplies/stock?${params}`);
    if (!res.ok) throw new Error('Failed to fetch stock items');
    return await res.json();
  } catch (error) {
    return { total: 0, items: [] };
  }
}

export async function createAvailableStock(payload: any): Promise<AvailableStock> {
  const res = await fetch(`${API_BASE_URL}/supplies/stock`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create available stock');
  return await res.json();
}

// ----------------------------------------------------
// Demand Posts API
// ----------------------------------------------------
export async function fetchDemands(params: string = ''): Promise<{ total: number; items: DemandPost[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/demands/?${params}`);
    if (!res.ok) throw new Error('Failed to fetch demand posts');
    return await res.json();
  } catch (error) {
    return { total: 0, items: [] };
  }
}

export async function createDemand(payload: any): Promise<DemandPost> {
  const res = await fetch(`${API_BASE_URL}/demands/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create demand post');
  return await res.json();
}

// ----------------------------------------------------
// Orders & Matching API
// ----------------------------------------------------
export async function runMatching(demandId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/matching/run`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ demand_id: demandId, max_radius_km: 150.0 })
  });
  if (!res.ok) throw new Error('Matching engine failed');
  return await res.json();
}

export async function createOrder(payload: any): Promise<OrderMatch> {
  const res = await fetch(`${API_BASE_URL}/orders/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create order');
  return await res.json();
}

export async function fetchOrders(params: string = ''): Promise<{ total: number; items: OrderMatch[] }> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/?${params}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
  } catch (error) {
    return { total: 0, items: [] };
  }
}

export async function updateOrderStatus(orderId: string, status: string): Promise<OrderMatch> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return await res.json();
}

// ----------------------------------------------------
// Role Specific APIs
// ----------------------------------------------------
export async function fetchFarmerDashboard(): Promise<FarmerDashboardSummary> {
  const res = await fetch(`${API_BASE_URL}/farmers/me/dashboard`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch farmer dashboard');
  return await res.json();
}

export async function createDirectConsumerOrder(farmerId: string, cropId: string, quantityKg: number, pricePerKg: number): Promise<OrderMatch> {
  const res = await fetch(
    `${API_BASE_URL}/consumers/direct-order?farmer_id=${farmerId}&crop_id=${cropId}&quantity_kg=${quantityKg}&agreed_price_per_kg=${pricePerKg}`,
    { method: 'POST', headers: getHeaders() }
  );
  if (!res.ok) throw new Error('Failed to place consumer order');
  return await res.json();
}

export async function fetchLogisticsJobs(): Promise<OrderMatch[]> {
  const res = await fetch(`${API_BASE_URL}/logistics/available-jobs`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch logistics jobs');
  return await res.json();
}

export async function acceptLogisticsJob(orderId: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/logistics/accept-job/${orderId}`, { method: 'POST', headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to accept job');
  return await res.json();
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications/`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function markNotificationRead(id: string): Promise<NotificationItem> {
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: 'PATCH', headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to mark read');
  return await res.json();
}

export async function fetchAdvisoryGuidance(cropName: string, district: string = 'Nashik') {
  try {
    const res = await fetch(`${API_BASE_URL}/price-transparency/guidance?crop_name=${cropName}&district=${district}`);
    if (!res.ok) throw new Error('Failed to fetch guidance');
    return await res.json();
  } catch (error) {
    return {
      crop_name: cropName,
      advisory_notice: 'Price guidance is strictly advisory. Farmers retain full pricing autonomy.',
      suggested_price_range: { min_price_per_kg: 22.5, max_price_per_kg: 28.0, recommended_target_price_per_kg: 25.0 }
    };
  }
}

export async function fetchNetRealizationCalculator(grossPrice: number, distanceKm: number, perishability: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/price-transparency/net-realization?gross_buyer_price=${grossPrice}&distance_km=${distanceKm}&perishability=${perishability}`);
    if (!res.ok) throw new Error('Failed to fetch net realization');
    return await res.json();
  } catch (error) {
    const transport = Math.round(distanceKm * 0.04 * 100) / 100;
    const handling = 1.50;
    const spoilage = Math.round(grossPrice * 0.03 * 100) / 100;
    const platform = Math.round(grossPrice * 0.015 * 100) / 100;
    const net = Math.round((grossPrice - transport - handling - spoilage - platform) * 100) / 100;
    return {
      gross_buyer_price_per_kg: grossPrice,
      deductions: { transport_cost: transport, handling_cost: handling, expected_spoilage_cost: spoilage, platform_fee: platform, total_deductions_per_kg: Math.round((transport + handling + spoilage + platform) * 100) / 100 },
      estimated_farmer_net_realization_per_kg: net,
      net_realization_percentage: Math.round((net / grossPrice) * 1000) / 10
    };
  }
}

export async function fetchBuyerComparison(farmerAskPrice: number = 24.0) {
  try {
    const res = await fetch(`${API_BASE_URL}/price-transparency/buyer-comparison?farmer_ask_price=${farmerAskPrice}`);
    if (!res.ok) throw new Error('Failed to fetch comparison');
    return await res.json();
  } catch (error) {
    return {
      comparison_matrix: [
        { buyer_name: 'Reliance Retail DC', offered_price_per_kg: 30.0, distance_km: 45.0, estimated_net_realization_per_kg: 25.70, net_percentage: 85.7 },
        { buyer_name: 'DeHaat Direct Hub', offered_price_per_kg: 29.5, distance_km: 20.0, estimated_net_realization_per_kg: 26.10, net_percentage: 88.5 },
        { buyer_name: 'Local APMC Trader', offered_price_per_kg: 26.0, distance_km: 12.0, estimated_net_realization_per_kg: 22.80, net_percentage: 87.6 }
      ]
    };
  }
}

export async function fetchPriceBreakdown(
  farmerPrice: number,
  perishability: string = 'HIGH',
  distanceKm: number = 25.0,
  isUrban: boolean = true
): Promise<PriceBreakdownData> {
  try {
    const res = await fetch(`${API_BASE_URL}/price-transparency/urban-breakdown?farmer_price=${farmerPrice}&perishability=${perishability}&distance_km=${distanceKm}&is_urban=${isUrban}`);
    if (!res.ok) throw new Error('Failed to fetch price breakdown');
    const data = await res.json();
    return {
      farmer_price_per_kg: Number(data.farmer_price_per_kg ?? farmerPrice),
      collection_handling_fee: Number(data.collection_handling_fee ?? 0),
      transport_fee_per_kg: Number(data.transport_fee_per_kg ?? 0),
      market_intermediary_margin: Number(data.market_intermediary_margin ?? 0),
      platform_coordination_fee: Number(data.platform_coordination_fee ?? 0),
      final_consumer_price_per_kg: Number(data.final_consumer_price_per_kg ?? farmerPrice),
      farmer_net_realization_per_kg: Number(data.farmer_net_realization_per_kg ?? farmerPrice),
      breakdown_percentages: {
        farmer_share: Number(data.breakdown_percentages?.farmer_share ?? 0),
        handling_share: Number(data.breakdown_percentages?.handling_share ?? 0),
        transport_share: Number(data.breakdown_percentages?.transport_share ?? 0),
        intermediary_share: Number(data.breakdown_percentages?.intermediary_share ?? 0),
        platform_share: Number(data.breakdown_percentages?.platform_share ?? 0)
      }
    };
  } catch (error) {
    const fallback = await fetchUrbanBreakdownModel(farmerPrice, perishability, distanceKm, isUrban);
    const breakdown = fallback.breakdown_items && Array.isArray(fallback.breakdown_items) ? fallback.breakdown_items : [];
    const farmerShare = breakdown.find((item: any) => item.component === 'Farmer/FPO Price')?.amount ?? farmerPrice;
    const handlingShare = breakdown.find((item: any) => item.component === 'Collection' || item.component === 'Handling & Grading')?.amount ?? 0;
    const transportShare = breakdown.find((item: any) => item.component === 'Transport Logistics')?.amount ?? 0;
    const marginShare = breakdown.find((item: any) => item.component === 'Market Margin')?.amount ?? 0;
    const platformShare = breakdown.find((item: any) => item.component === 'Platform Fee')?.amount ?? 0;
    const finalPrice = Number(fallback.final_consumer_price_per_kg ?? (farmerPrice + handlingShare + transportShare + marginShare + platformShare));
    const total = finalPrice || farmerPrice || 1;
    return {
      farmer_price_per_kg: Number(farmerPrice),
      collection_handling_fee: Number(handlingShare),
      transport_fee_per_kg: Number(transportShare),
      market_intermediary_margin: Number(marginShare),
      platform_coordination_fee: Number(platformShare),
      final_consumer_price_per_kg: Number(finalPrice),
      farmer_net_realization_per_kg: Number(farmerShare),
      breakdown_percentages: {
        farmer_share: Number(((farmerShare / total) * 100) || 0),
        handling_share: Number(((handlingShare / total) * 100) || 0),
        transport_share: Number(((transportShare / total) * 100) || 0),
        intermediary_share: Number(((marginShare / total) * 100) || 0),
        platform_share: Number(((platformShare / total) * 100) || 0)
      }
    };
  }
}

export async function fetchUrbanBreakdownModel(farmerPrice: number, perishability: string, distanceKm: number, isUrban: boolean) {
  try {
    const res = await fetch(`${API_BASE_URL}/price-transparency/urban-breakdown?farmer_price=${farmerPrice}&perishability=${perishability}&distance_km=${distanceKm}&is_urban=${isUrban}`);
    if (!res.ok) throw new Error('Failed to fetch urban breakdown');
    return await res.json();
  } catch (error) {
    return {
      farmer_price_per_kg: farmerPrice,
      final_consumer_price_per_kg: farmerPrice + 5.50,
      breakdown_items: [
        { component: 'Farmer/FPO Price', amount: farmerPrice, type: 'ACTUAL', description: 'Direct payout guaranteed to smallholder farmer' },
        { component: 'Collection', amount: 1.00, type: 'ESTIMATED', description: 'Local aggregation hub collection cost' },
        { component: 'Handling & Grading', amount: 1.50, type: 'ESTIMATED', description: 'Sorting and protective packaging' },
        { component: 'Transport Logistics', amount: 2.00, type: 'ESTIMATED', description: 'Refrigerated/freight transit cost' },
        { component: 'Market Margin', amount: 2.00, type: 'ESTIMATED', description: 'Urban wholesale distribution markup' },
        { component: 'Platform Fee', amount: 0.50, type: 'ACTUAL', description: 'AGRIFlow coordination fee' }
      ]
    };
  }
}

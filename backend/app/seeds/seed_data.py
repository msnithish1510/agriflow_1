"""
AGRIFlow Realistic Indian Agricultural Seed Data Generator (SIH 2026 Phase 2)
Populates 20 Farmers, 5 FPOs, 10 Bulk Buyers, 30 Consumers, 10 Logistics Partners,
8 Crops, Pre-Market Future Demands, Expected Harvest Declarations, Current Stocks, Orders, and Notifications.
"""

from datetime import date, timedelta
from app.core.security import get_password_hash
from app.models.entities import UserRole, PerishabilityTier, QualityGrade, DemandStatus, SupplyStatus, StockStatus, MatchStatus, NotificationType

CROPS_SEED = [
    {"id": "crop-tomato", "name": "Tomato", "local_name_hindi": "टमाटर", "category": "Vegetable", "perishability": PerishabilityTier.HIGH, "shelf_life_days": 5, "indicative_base_price_per_kg": 25.0},
    {"id": "crop-onion", "name": "Onion", "local_name_hindi": "प्याज", "category": "Vegetable", "perishability": PerishabilityTier.MEDIUM, "shelf_life_days": 15, "indicative_base_price_per_kg": 22.0},
    {"id": "crop-potato", "name": "Potato", "local_name_hindi": "आलू", "category": "Tubers", "perishability": PerishabilityTier.MEDIUM, "shelf_life_days": 30, "indicative_base_price_per_kg": 18.0},
    {"id": "crop-wheat", "name": "Wheat", "local_name_hindi": "गेहूं", "category": "Grains", "perishability": PerishabilityTier.LOW, "shelf_life_days": 180, "indicative_base_price_per_kg": 22.5},
    {"id": "crop-paddy", "name": "Paddy (Rice)", "local_name_hindi": "धान (चावल)", "category": "Grains", "perishability": PerishabilityTier.LOW, "shelf_life_days": 180, "indicative_base_price_per_kg": 26.0},
    {"id": "crop-moong", "name": "Moong (Green Gram)", "local_name_hindi": "मूंग", "category": "Pulses", "perishability": PerishabilityTier.LOW, "shelf_life_days": 120, "indicative_base_price_per_kg": 75.0},
    {"id": "crop-cotton", "name": "Cotton", "local_name_hindi": "कपास", "category": "Fiber", "perishability": PerishabilityTier.LOW, "shelf_life_days": 365, "indicative_base_price_per_kg": 62.0},
    {"id": "crop-soybean", "name": "Soybean", "local_name_hindi": "सोयाबीन", "category": "Oilseed", "perishability": PerishabilityTier.LOW, "shelf_life_days": 120, "indicative_base_price_per_kg": 48.0}
]

# Admin user
ADMIN_SEED = {
    "id": "usr-admin-01",
    "full_name": "AGRIFlow System Admin",
    "phone_number": "+91-9900000000",
    "email": "admin@agriflow.in",
    "role": UserRole.ADMIN,
    "organization_name": "AGRIFlow SIH2026 Admin",
    "state": "Delhi",
    "district": "New Delhi",
    "village_or_area": "Connaught Place",
    "pincode": "110001",
    "latitude": 28.6139,
    "longitude": 77.2090
}

# 20 Farmers across major agri hubs
FARMERS_SEED = [
    {"id": f"usr-farm-{i+1:02d}", "full_name": f"Farmer {name}", "phone_number": f"+91-98230111{i+1:02d}", "role": UserRole.FARMER, "village_or_area": village, "district": dist, "state": state, "pincode": pin, "latitude": lat, "longitude": lng}
    for i, (name, village, dist, state, pin, lat, lng) in enumerate([
        ("Ramesh Patil", "Pimpalgaon", "Nashik", "Maharashtra", "422209", 20.1741, 73.9871),
        ("Suresh Deshmukh", "Niphad", "Nashik", "Maharashtra", "422303", 20.0768, 74.1082),
        ("Ganesh Kadam", "Manchar", "Pune", "Maharashtra", "410503", 19.0006, 73.9443),
        ("Sunil Pawar", "Baramati", "Pune", "Maharashtra", "413102", 18.1517, 74.5778),
        ("Gurpreet Singh", "Payal", "Khanna", "Punjab", "141401", 30.7021, 76.2201),
        ("Harmanpreet Kaur", "Samrala", "Khanna", "Punjab", "141114", 30.8354, 76.1912),
        ("Venkat Reddy", "Tenali", "Guntur", "Andhra Pradesh", "522201", 16.2430, 80.6400),
        ("Koteswara Rao", "Mangalagiri", "Guntur", "Andhra Pradesh", "522503", 16.4304, 80.5517),
        ("Mahadev Shinde", "Mohol", "Solapur", "Maharashtra", "413213", 17.7028, 75.6486),
        ("Anandrao Jadhav", "Pandharpur", "Solapur", "Maharashtra", "413304", 17.6775, 75.3236),
        ("Ningappa Gowda", "Maddur", "Mandya", "Karnataka", "571428", 12.5847, 77.0456),
        ("Shivanna H", "Srirangapatna", "Mandya", "Karnataka", "571438", 12.4224, 76.6828),
        ("Kailash Choudhary", "Mhow", "Indore", "Madhya Pradesh", "453441", 22.5542, 75.7582),
        ("Vikram Patel", "Sanwer", "Indore", "Madhya Pradesh", "453551", 22.9754, 75.8341),
        ("Bhavsinh Parmar", "Bardoli", "Surat", "Gujarat", "394601", 21.1215, 73.1147),
        ("Jayesh Patel", "Mahuva", "Bhavnagar", "Gujarat", "364290", 21.0914, 71.7631),
        ("Ramswaroop Saini", "Chomu", "Jaipur", "Rajasthan", "303702", 27.1683, 75.7208),
        ("Hanuman Sahay", "Phulera", "Jaipur", "Rajasthan", "303338", 26.8775, 75.2412),
        ("Subhash Yadav", "Barabanki", "Ayodhya Region", "Uttar Pradesh", "225001", 26.9271, 81.1834),
        ("Santosh Verma", "Malihabad", "Lucknow", "Uttar Pradesh", "226102", 26.9214, 80.7103)
    ])
]

# 5 FPOs
FPOS_SEED = [
    {"id": "usr-fpo-01", "full_name": "Sahyadri Farmers Producer Co. Ltd", "phone_number": "+91-9922022001", "role": UserRole.FPO, "organization_name": "Sahyadri Agro FPO", "village_or_area": "Mohadi", "district": "Nashik", "state": "Maharashtra", "pincode": "422207", "latitude": 20.0891, "longitude": 73.8542},
    {"id": "usr-fpo-02", "full_name": "Krishna Valley Farmer Producer Org", "phone_number": "+91-9922022002", "role": UserRole.FPO, "organization_name": "Krishna Valley FPO", "village_or_area": "Sangli Rural", "district": "Sangli", "state": "Maharashtra", "pincode": "416416", "latitude": 16.8524, "longitude": 74.5815},
    {"id": "usr-fpo-03", "full_name": "Punjab Grain Growers FPO", "phone_number": "+91-9914022003", "role": UserRole.FPO, "organization_name": "Punjab Grain FPO", "village_or_area": "Khanna Mandi", "district": "Khanna", "state": "Punjab", "pincode": "141401", "latitude": 30.7050, "longitude": 76.2250},
    {"id": "usr-fpo-04", "full_name": "Andhra Chilli & Pulses Farmers Co-Op", "phone_number": "+91-9948022004", "role": UserRole.FPO, "organization_name": "Guntur Agri FPO", "village_or_area": "Guntur East", "district": "Guntur", "state": "Andhra Pradesh", "pincode": "522001", "latitude": 16.3067, "longitude": 80.4365},
    {"id": "usr-fpo-05", "full_name": "Malwa Organic Farmers Producer Ltd", "phone_number": "+91-9926022005", "role": UserRole.FPO, "organization_name": "Malwa Organic FPO", "village_or_area": "Rau", "district": "Indore", "state": "Madhya Pradesh", "pincode": "453331", "latitude": 22.6318, "longitude": 75.8049}
]

# 10 Bulk Buyers
BUYERS_SEED = [
    {"id": f"usr-buy-{i+1:02d}", "full_name": name, "phone_number": f"+91-9800033{i+1:02d}", "role": UserRole.BULK_BUYER, "organization_name": org, "village_or_area": area, "district": dist, "state": state, "pincode": pin, "latitude": lat, "longitude": lng}
    for i, (name, org, area, dist, state, pin, lat, lng) in enumerate([
        ("Reliance Retail Sourcing", "Reliance Retail", "Bhosari DC", "Pune", "Maharashtra", "411026", 18.6298, 73.8477),
        ("DeHaat Direct Procurement", "DeHaat Agri", "Vashi APMC", "Navi Mumbai", "Maharashtra", "400703", 19.0748, 73.0033),
        ("ITC Agri Business", "ITC e-Choupal", "Pithampur Plant", "Indore", "Madhya Pradesh", "454775", 22.6144, 75.6811),
        ("BigBasket Direct Sourcing", "BigBasket", "Whitefield Hub", "Bengaluru", "Karnataka", "560066", 12.9698, 77.7500),
        ("Mother Dairy Safal", "Mother Dairy Safal", "Mangolpuri Plant", "Delhi NCR", "Delhi", "110083", 28.6921, 77.0850),
        ("Adani Wilmar Grain Sourcing", "Adani Wilmar", "Mundra Logistics", "Kutch", "Gujarat", "370421", 22.8395, 69.7121),
        ("McCain Foods India", "McCain Foods", "Mehsana Plant", "Mehsana", "Gujarat", "384002", 23.5880, 72.3693),
        ("NinjaCart Agri Supply", "NinjaCart", "Kukatpally FC", "Hyderabad", "Telangana", "500072", 17.4849, 78.4138),
        ("Haldiram Raw Sourcing", "Haldiram", "Noida Sector 63", "Gautam Buddha Nagar", "Uttar Pradesh", "201301", 28.6273, 77.3772),
        ("WayCool Foods Sourcing", "WayCool Foods", "Koyambedu Hub", "Chennai", "Tamil Nadu", "600107", 13.0694, 80.1948)
    ])
]

# 30 Consumers across rural & urban districts
CONSUMERS_SEED = [
    {"id": f"usr-con-{i+1:02d}", "full_name": f"Consumer {name}", "phone_number": f"+91-9876044{i+1:02d}", "role": UserRole.CONSUMER, "village_or_area": area, "district": dist, "state": state, "pincode": pin, "latitude": lat, "longitude": lng}
    for i, (name, area, dist, state, pin, lat, lng) in enumerate([
        (f"Household {idx+1}", f"Area #{idx+1}", "Pune" if idx<6 else ("Nashik" if idx<12 else ("Indore" if idx<18 else ("Guntur" if idx<24 else "Khanna"))), "Maharashtra" if idx<12 else ("Madhya Pradesh" if idx<18 else ("Andhra Pradesh" if idx<24 else "Punjab")), "411001", 18.5204 + (idx*0.01), 73.8567 + (idx*0.01))
        for idx in range(30)
    ])
]

# 10 Logistics Partners
LOGISTICS_SEED = [
    {"id": f"usr-log-{i+1:02d}", "full_name": f"Logistics Fleet {name}", "phone_number": f"+91-9899055{i+1:02d}", "role": UserRole.LOGISTICS_PARTNER, "organization_name": org, "village_or_area": area, "district": dist, "state": state, "pincode": pin, "latitude": lat, "longitude": lng}
    for i, (name, org, area, dist, state, pin, lat, lng) in enumerate([
        ("ColdChain Express", "ColdChain India", "Pimpalgaon Hub", "Nashik", "Maharashtra", "422209", 20.1741, 73.9871),
        ("Kisan Transport Co", "Kisan Logistics", "Chakan Industrial Area", "Pune", "Maharashtra", "410501", 18.7606, 73.8640),
        ("SpeedAgri Logistics", "SpeedAgri", "Khanna Grains Terminal", "Khanna", "Punjab", "141401", 30.7021, 76.2201),
        ("Deccan Cold Freight", "Deccan Cold", "Autonagar", "Guntur", "Andhra Pradesh", "522001", 16.3067, 80.4365),
        ("Malwa Agri Express", "Malwa Express", "Dewas Naka", "Indore", "Madhya Pradesh", "452010", 22.7533, 75.8937),
        ("Gujarat Kisan Freight", "Gujarat Kisan", "Mahi Bypass", "Surat", "Gujarat", "395003", 21.1702, 72.8311),
        ("Rajasthan Agri Dispatch", "Rajasthan Dispatch", "VKI Area", "Jaipur", "Rajasthan", "302013", 26.9855, 75.7725),
        ("Avadh Logistics", "Avadh Freight", "Transport Nagar", "Lucknow", "Uttar Pradesh", "226012", 26.7820, 80.8935),
        ("Southern Agri Haulers", "Southern Haulers", "Peenya Industrial", "Bengaluru", "Karnataka", "560058", 13.0324, 77.5204),
        ("Capital Agri Logistics", "Capital Agri", "Azadpur APMC", "Delhi NCR", "Delhi", "110033", 28.7161, 77.1700)
    ])
]

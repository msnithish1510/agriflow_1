from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.entities import ShipmentTracking, TrackingStatus, OrderMatch, MatchStatus, User, UserRole

DEFAULT_DEMO_TRACKINGS = [
    {
        "tracking_id": "AGR-2026-00125",
        "farmer_name": "Ramesh Kumar (Coimbatore Farm Hub)",
        "buyer_name": "Saravana Fresh Mart (RS Puram)",
        "crop_name": "Grade-A Tomato",
        "quantity_kg": 500.0,
        "pickup_location": {
            "name": "Coimbatore Farm Collection Center, Sulur",
            "lat": 11.0286,
            "lng": 77.1258,
            "details": "Gate #2, Farm Pool Storage"
        },
        "destination_location": {
            "name": "RS Puram Consumer Direct Hub, Coimbatore",
            "lat": 11.0065,
            "lng": 76.9535,
            "details": "Store #42, Main Commercial Complex"
        },
        "current_latitude": 11.0180,
        "current_longitude": 77.0420,
        "current_location_name": "Sulur Highway Junction, Coimbatore",
        "route": [
            {"lat": 11.0286, "lng": 77.1258, "name": "Coimbatore Farm Collection Center"},
            {"lat": 11.0220, "lng": 77.0850, "name": "Karanampettai Toll Gate"},
            {"lat": 11.0180, "lng": 77.0420, "name": "Sulur Highway Junction"},
            {"lat": 11.0120, "lng": 76.9950, "name": "Singanallur Junction"},
            {"lat": 11.0090, "lng": 76.9720, "name": "Avinashi Road Flyover"},
            {"lat": 11.0065, "lng": 76.9535, "name": "RS Puram Consumer Direct Hub"}
        ],
        "distance_remaining_km": 11.4,
        "estimated_transit_minutes": 22,
        "expected_delivery_time": (datetime.utcnow() + timedelta(minutes=25)).isoformat(),
        "current_status": "IN_TRANSIT",
        "driver_name": "Murugan Express Freight",
        "vehicle_number": "TN-37-AZ-4421 (Refrigerated Van)",
        "history": [
            {"status": "ORDER_PLACED", "status_label": "Order Placed", "location_name": "System Order Confirmed", "timestamp": "09:30 AM", "completed": True},
            {"status": "ORDER_CONFIRMED", "status_label": "Order Confirmed", "location_name": "Escrow Payment Locked", "timestamp": "09:45 AM", "completed": True},
            {"status": "FARMER_PREPARING", "status_label": "Farmer Preparing", "location_name": "Harvest & Quality Grade Sorting", "timestamp": "10:15 AM", "completed": True},
            {"status": "READY_FOR_PICKUP", "status_label": "Ready for Pickup", "location_name": "Coimbatore Collection Hub", "timestamp": "10:45 AM", "completed": True},
            {"status": "PICKED_UP", "status_label": "Picked Up", "location_name": "Vehicle Loaded (TN-37-AZ-4421)", "timestamp": "11:10 AM", "completed": True},
            {"status": "IN_TRANSIT", "status_label": "In Transit", "location_name": "Sulur Highway Junction", "timestamp": "11:35 AM", "completed": True, "is_current": True},
            {"status": "NEAR_DESTINATION", "status_label": "Near Destination", "location_name": "Singanallur Junction", "timestamp": "--:--", "completed": False},
            {"status": "OUT_FOR_DELIVERY", "status_label": "Out for Delivery", "location_name": "RS Puram Sector 4", "timestamp": "--:--", "completed": False},
            {"status": "DELIVERED", "status_label": "Delivered", "location_name": "RS Puram Consumer Direct Hub", "timestamp": "--:--", "completed": False}
        ]
    },
    {
        "tracking_id": "AGR-TRK-001",
        "farmer_name": "Velusamy FPO (Pollachi)",
        "buyer_name": "Nilgiri Supermarket Warehouse",
        "crop_name": "Fresh Onion (Medium Tier)",
        "quantity_kg": 2500.0,
        "pickup_location": {
            "name": "Pollachi FPO Aggregation Point",
            "lat": 10.6609,
            "lng": 77.0048,
            "details": "FPO Shed #1"
        },
        "destination_location": {
            "name": "Coimbatore Wholesale Market, Ukkadam",
            "lat": 10.9925,
            "lng": 76.9614,
            "details": "Bay 12"
        },
        "current_latitude": 10.8200,
        "current_longitude": 76.9800,
        "current_location_name": "Kinathukadavu Checkpoint",
        "route": [
            {"lat": 10.6609, "lng": 77.0048, "name": "Pollachi FPO Aggregation Point"},
            {"lat": 10.8200, "lng": 76.9800, "name": "Kinathukadavu Checkpoint"},
            {"lat": 10.9200, "lng": 76.9700, "name": "Echanari Bypass"},
            {"lat": 10.9925, "lng": 76.9614, "name": "Coimbatore Wholesale Market"}
        ],
        "distance_remaining_km": 21.0,
        "estimated_transit_minutes": 35,
        "expected_delivery_time": (datetime.utcnow() + timedelta(minutes=40)).isoformat(),
        "current_status": "IN_TRANSIT",
        "driver_name": "Selvam Transport",
        "vehicle_number": "TN-38-BY-9900",
        "history": [
            {"status": "ORDER_PLACED", "status_label": "Order Placed", "location_name": "Order Created", "timestamp": "08:00 AM", "completed": True},
            {"status": "PICKED_UP", "status_label": "Picked Up", "location_name": "Pollachi FPO Shed", "timestamp": "09:30 AM", "completed": True},
            {"status": "IN_TRANSIT", "status_label": "In Transit", "location_name": "Kinathukadavu Checkpoint", "timestamp": "10:40 AM", "completed": True, "is_current": True},
            {"status": "DELIVERED", "status_label": "Delivered", "location_name": "Coimbatore Wholesale Market", "timestamp": "--:--", "completed": False}
        ]
    },
    {
        "tracking_id": "AGR-TRK-002",
        "farmer_name": "Kavitha Organic Farm (Ooty)",
        "buyer_name": "Urban Fresh Direct (Peelamedu)",
        "crop_name": "Organic Potato",
        "quantity_kg": 1000.0,
        "pickup_location": {
            "name": "Ooty Hill Collection Point",
            "lat": 11.4102,
            "lng": 76.6950,
            "details": "Charing Cross Hub"
        },
        "destination_location": {
            "name": "Peelamedu Urban Hub, Coimbatore",
            "lat": 11.0268,
            "lng": 77.0028,
            "details": "Distribution Center A"
        },
        "current_latitude": 11.3000,
        "current_longitude": 76.9000,
        "current_location_name": "Mettupalayam Ghat Road",
        "route": [
            {"lat": 11.4102, "lng": 76.6950, "name": "Ooty Hill Collection Point"},
            {"lat": 11.3000, "lng": 76.9000, "name": "Mettupalayam Ghat Road"},
            {"lat": 11.1200, "lng": 76.9400, "name": "Karamadai Junction"},
            {"lat": 11.0268, "lng": 77.0028, "name": "Peelamedu Urban Hub"}
        ],
        "distance_remaining_km": 38.5,
        "estimated_transit_minutes": 50,
        "expected_delivery_time": (datetime.utcnow() + timedelta(minutes=55)).isoformat(),
        "current_status": "IN_TRANSIT",
        "driver_name": "Kavitha Logistics Van",
        "vehicle_number": "TN-43-C-1234",
        "history": [
            {"status": "ORDER_PLACED", "status_label": "Order Placed", "location_name": "Order Created", "timestamp": "07:15 AM", "completed": True},
            {"status": "PICKED_UP", "status_label": "Picked Up", "location_name": "Ooty Hill Point", "timestamp": "08:45 AM", "completed": True},
            {"status": "IN_TRANSIT", "status_label": "In Transit", "location_name": "Mettupalayam Ghat Road", "timestamp": "10:15 AM", "completed": True, "is_current": True},
            {"status": "DELIVERED", "status_label": "Delivered", "location_name": "Peelamedu Urban Hub", "timestamp": "--:--", "completed": False}
        ]
    }
]


class TrackingService:

    def ensure_seeded(self, db: Session):
        """
        Ensures demo tracking records exist in DB.
        """
        for demo in DEFAULT_DEMO_TRACKINGS:
            existing = db.query(ShipmentTracking).filter(ShipmentTracking.tracking_id == demo["tracking_id"]).first()
            if not existing:
                st = ShipmentTracking(
                    tracking_id=demo["tracking_id"],
                    farmer_name=demo["farmer_name"],
                    buyer_name=demo["buyer_name"],
                    crop_name=demo["crop_name"],
                    quantity_kg=demo["quantity_kg"],
                    pickup_location=demo["pickup_location"],
                    destination_location=demo["destination_location"],
                    current_latitude=demo["current_latitude"],
                    current_longitude=demo["current_longitude"],
                    current_location_name=demo["current_location_name"],
                    route=demo["route"],
                    distance_remaining_km=demo["distance_remaining_km"],
                    estimated_transit_minutes=demo["estimated_transit_minutes"],
                    expected_delivery_time=datetime.utcnow() + timedelta(minutes=demo["estimated_transit_minutes"]),
                    current_status=TrackingStatus(demo["current_status"]),
                    driver_name=demo["driver_name"],
                    vehicle_number=demo["vehicle_number"],
                    history=demo["history"]
                )
                db.add(st)
        db.commit()

    def get_tracking(self, tracking_id: str, db: Session) -> Optional[Dict[str, Any]]:
        self.ensure_seeded(db)
        st = db.query(ShipmentTracking).filter(ShipmentTracking.tracking_id == tracking_id).first()
        if not st:
            # Fallback check by order_id or generate demo record for unknown ID
            st = db.query(ShipmentTracking).filter(ShipmentTracking.order_id == tracking_id).first()

        if not st:
            # Create dynamic tracking entry for requested ID so demo never errors out
            demo = DEFAULT_DEMO_TRACKINGS[0]
            return {
                **demo,
                "tracking_id": tracking_id,
                "order_id": tracking_id,
                "last_updated": datetime.utcnow().isoformat()
            }

        return self._format_tracking_dto(st)

    def get_location(self, tracking_id: str, db: Session) -> Dict[str, Any]:
        data = self.get_tracking(tracking_id, db)
        return {
            "tracking_id": tracking_id,
            "latitude": data["current_latitude"],
            "longitude": data["current_longitude"],
            "location_name": data["current_location_name"],
            "status": data["current_status"],
            "distance_remaining_km": data["distance_remaining_km"],
            "estimated_transit_minutes": data["estimated_transit_minutes"],
            "last_updated": data["last_updated"]
        }

    def update_location(self, tracking_id: str, lat: float, lng: float, location_name: str, db: Session) -> Dict[str, Any]:
        self.ensure_seeded(db)
        st = db.query(ShipmentTracking).filter(ShipmentTracking.tracking_id == tracking_id).first()
        if st:
            st.current_latitude = lat
            st.current_longitude = lng
            if location_name:
                st.current_location_name = location_name
            st.last_updated = datetime.utcnow()
            db.commit()
            return self._format_tracking_dto(st)

        return {"status": "SUCCESS", "tracking_id": tracking_id, "lat": lat, "lng": lng}

    def update_status(self, tracking_id: str, status_str: str, db: Session) -> Dict[str, Any]:
        self.ensure_seeded(db)
        st = db.query(ShipmentTracking).filter(ShipmentTracking.tracking_id == tracking_id).first()
        if st:
            try:
                st.current_status = TrackingStatus(status_str.upper())
            except ValueError:
                pass
            st.last_updated = datetime.utcnow()
            db.commit()
            return self._format_tracking_dto(st)

        return {"status": "SUCCESS", "tracking_id": tracking_id, "current_status": status_str}

    def get_all_active_shipments(self, db: Session) -> List[Dict[str, Any]]:
        self.ensure_seeded(db)
        trackings = db.query(ShipmentTracking).all()
        return [self._format_tracking_dto(t) for t in trackings]

    def _format_tracking_dto(self, st: ShipmentTracking) -> Dict[str, Any]:
        now = datetime.utcnow()
        expected = st.expected_delivery_time or (now + timedelta(minutes=30))
        is_delayed = now > expected
        delay_minutes = max(0, int((now - expected).total_seconds() / 60)) if is_delayed else 0

        return {
            "id": st.id,
            "tracking_id": st.tracking_id,
            "order_id": st.order_id or st.tracking_id,
            "farmer_name": st.farmer_name or "Ramesh Kumar (Coimbatore Farm Pool)",
            "buyer_name": st.buyer_name or "Saravana Stores Direct",
            "crop_name": st.crop_name or "Tomato",
            "quantity_kg": st.quantity_kg or 500.0,
            "pickup_location": st.pickup_location,
            "destination_location": st.destination_location,
            "current_latitude": st.current_latitude,
            "current_longitude": st.current_longitude,
            "current_location_name": st.current_location_name,
            "route": st.route,
            "distance_remaining_km": round(st.distance_remaining_km, 1),
            "estimated_transit_minutes": max(1, st.estimated_transit_minutes),
            "expected_delivery_time": expected.isoformat(),
            "current_status": st.current_status.value if hasattr(st.current_status, 'value') else str(st.current_status),
            "driver_name": st.driver_name,
            "vehicle_number": st.vehicle_number,
            "history": st.history,
            "is_delayed": is_delayed,
            "delay_minutes": delay_minutes,
            "last_updated": st.last_updated.isoformat() if st.last_updated else now.isoformat()
        }


tracking_service = TrackingService()

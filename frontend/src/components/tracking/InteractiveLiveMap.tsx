"use client";

import React, { useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RefreshCw } from 'lucide-react';

interface Waypoint {
  lat: number;
  lng: number;
  name: string;
}

interface InteractiveLiveMapProps {
  pickup: { name: string; lat: number; lng: number; details?: string };
  destination: { name: string; lat: number; lng: number; details?: string };
  currentLocation: { lat: number; lng: number; location_name: string };
  route: Waypoint[];
  vehicleNumber?: string;
  driverName?: string;
}

/**
 * Interactive Leaflet + OpenStreetMap component.
 * Dynamically loads Leaflet CSS & JS safely for SSR.
 * Renders 🌾 Pickup, 🚚 Vehicle, and 📍 Destination markers with polyline route.
 */
export const InteractiveLiveMap: React.FC<InteractiveLiveMapProps> = ({
  pickup,
  destination,
  currentLocation,
  route,
  vehicleNumber = "TN-37-AZ-4421",
  driverName = "Murugan Express",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const polylineRef = useRef<any>(null);

  // Initialize Map & Leaflet
  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    // Load Leaflet CSS dynamically if not present
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    import('leaflet').then((L) => {
      if (!mapContainerRef.current) return;

      // Clear existing map instance if re-initializing
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Default center around vehicle or midpoint
      const centerLat = currentLocation.lat || pickup.lat;
      const centerLng = currentLocation.lng || pickup.lng;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 12,
        zoomControl: false,
      });

      // Add OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | AGRIFlow AI',
        maxZoom: 19,
      }).addTo(map);

      // Custom Leaflet Icons using DivIcons with rich emoji & badge styling
      const createDivIcon = (emoji: string, label: string, bgGradient: string) => {
        return L.divIcon({
          className: 'custom-map-icon',
          html: `
            <div style="
              display: flex;
              align-items: center;
              gap: 6px;
              background: ${bgGradient};
              color: white;
              padding: 6px 12px;
              border-radius: 20px;
              font-family: system-ui, -apple-system, sans-serif;
              font-size: 12px;
              font-weight: 700;
              box-shadow: 0 4px 14px rgba(0,0,0,0.35);
              border: 2px solid #ffffff;
              white-space: nowrap;
              transform: translate(-50%, -50%);
            ">
              <span style="font-size: 16px;">${emoji}</span>
              <span>${label}</span>
            </div>
          `,
          iconSize: [120, 36],
          iconAnchor: [60, 18],
        });
      };

      const farmerIcon = createDivIcon('🌾', 'Farmer Pickup', 'linear-gradient(135deg, #059669, #10b981)');
      const vehicleIcon = createDivIcon('🚚', 'In Transit Vehicle', 'linear-gradient(135deg, #d97706, #f59e0b)');
      const destIcon = createDivIcon('📍', 'Destination', 'linear-gradient(135deg, #2563eb, #3b82f6)');

      // Add Farmer Pickup Marker
      const pickupMarker = L.marker([pickup.lat, pickup.lng], { icon: farmerIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #059669;">🌾 Farmer Pickup Point</strong><br/>
            <b>${pickup.name}</b><br/>
            <small style="color: #64748b;">${pickup.details || 'Coimbatore Farm Collection Center'}</small>
          </div>
        `);

      // Add Destination Marker
      const destMarker = L.marker([destination.lat, destination.lng], { icon: destIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 4px;">
            <strong style="color: #2563eb;">📍 Delivery Destination</strong><br/>
            <b>${destination.name}</b><br/>
            <small style="color: #64748b;">${destination.details || 'Consumer / Buyer Point'}</small>
          </div>
        `);

      // Add Vehicle Marker
      const vehMarker = L.marker([currentLocation.lat, currentLocation.lng], { icon: vehicleIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; padding: 6px; min-width: 160px;">
            <strong style="color: #d97706; font-size: 14px;">🚚 Delivery Vehicle</strong><br/>
            <div style="margin-top: 4px; font-weight: 700; color: #1e293b;">${currentLocation.location_name}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Vehicle: ${vehicleNumber}</div>
            <div style="font-size: 11px; color: #64748b;">Driver: ${driverName}</div>
          </div>
        `);

      markersRef.current = {
        pickup: pickupMarker,
        destination: destMarker,
        vehicle: vehMarker,
      };

      // Draw Route Polyline
      const waypoints = route && route.length > 0
        ? route.map(w => [w.lat, w.lng] as [number, number])
        : [[pickup.lat, pickup.lng], [currentLocation.lat, currentLocation.lng], [destination.lat, destination.lng]];

      const polyline = L.polyline(waypoints as any, {
        color: '#10b981',
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 6',
      }).addTo(map);

      polylineRef.current = polyline;

      // Fit map bounds to show route
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng],
        [currentLocation.lat, currentLocation.lng],
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Smoothly update vehicle position when props change
  useEffect(() => {
    if (markersRef.current.vehicle && currentLocation.lat && currentLocation.lng) {
      markersRef.current.vehicle.setLatLng([currentLocation.lat, currentLocation.lng]);

      // Update popup content
      markersRef.current.vehicle.setPopupContent(`
        <div style="font-family: sans-serif; padding: 4px;">
          <strong style="color: #d97706;">🚚 Active Shipment Vehicle</strong><br/>
          <b>${currentLocation.location_name}</b><br/>
          <small>Vehicle: ${vehicleNumber}</small><br/>
          <small>Driver: ${driverName}</small>
        </div>
      `);
    }
  }, [currentLocation.lat, currentLocation.lng, currentLocation.location_name, vehicleNumber, driverName]);

  // Controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleFitRoute = () => {
    if (mapInstanceRef.current && window.L) {
      const bounds = window.L.latLngBounds([
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng],
        [currentLocation.lat, currentLocation.lng],
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '380px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
      {/* Map Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '380px', background: '#0f172a' }} />

      {/* Map Overlay Controls */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={handleZoomIn}
          aria-label="Zoom In"
          title="Zoom In"
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f8fafc',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          aria-label="Zoom Out"
          title="Zoom Out"
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f8fafc',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={handleFitRoute}
          aria-label="Fit Route"
          title="Fit Entire Route"
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34d399',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* Map Legend Bar */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        right: '16px',
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '12px',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.8rem',
        color: '#f8fafc',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🌾</span>
          <span style={{ fontWeight: 600, color: '#34d399' }}>Farmer Pickup</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🚚</span>
          <span style={{ fontWeight: 600, color: '#fbbf24' }}>Current Vehicle</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>📍</span>
          <span style={{ fontWeight: 600, color: '#60a5fa' }}>Destination</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ display: 'inline-block', width: '20px', height: '3px', background: '#10b981', borderRadius: '2px', border: '1px dashed #ffffff' }}></span>
          <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Delivery Route</span>
        </div>
      </div>
    </div>
  );
};

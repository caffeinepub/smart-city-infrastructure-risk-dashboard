import React, { useEffect, useRef } from 'react';
import { Infrastructure } from '../backend';
import { getRiskLevelKey, getStructureTypeKey, getHealthScore } from '../lib/utils';

interface InfrastructureMapProps {
  infrastructure: Infrastructure[];
  height?: string;
}

// Use unknown types since leaflet is loaded via CDN script tag
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeafletInstance = any;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L: any;
  }
}

export default function InfrastructureMap({ infrastructure, height = '500px' }: InfrastructureMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletInstance>(null);
  const markersRef = useRef<LeafletInstance>(null);
  const heatLayerRef = useRef<LeafletInstance>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const L = window.L;
    if (!L) return;

    const map = L.map(mapRef.current, {
      center: [40.7128, -74.006],
      zoom: 12,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = null;
      heatLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const L = window.L;
    if (!L || !mapInstanceRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();
    if (heatLayerRef.current) {
      mapInstanceRef.current.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (infrastructure.length === 0) return;

    const riskColors: Record<string, string> = {
      high: '#ef4444',
      moderate: '#f59e0b',
      low: '#22c55e',
    };

    infrastructure.forEach(infra => {
      const riskKey = getRiskLevelKey(infra.riskLevel);
      const typeKey = getStructureTypeKey(infra.structureType);
      const health = getHealthScore(infra.riskScore);
      const color = riskColors[riskKey] || '#6b7280';
      const currentYear = new Date().getFullYear();
      const maintYear = currentYear + Number(infra.age);

      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: 28px; height: 28px;
          background: ${color}22;
          border: 2px solid ${color};
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 8px ${color}66;
          font-size: 12px;
        ">${typeKey === 'bridge' ? '🌉' : '🛣️'}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([infra.location.latitude, infra.location.longitude], { icon });

      marker.bindPopup(`
        <div style="font-family: JetBrains Mono, monospace; min-width: 200px;">
          <div style="font-size: 13px; font-weight: bold; margin-bottom: 8px; color: #00D9FF;">${infra.name}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px;">
            <div style="color: #8899aa;">Type</div><div>${typeKey === 'bridge' ? 'Bridge' : 'Road'}</div>
            <div style="color: #8899aa;">Area</div><div>${infra.location.area}</div>
            <div style="color: #8899aa;">Risk Score</div><div style="color: ${color}; font-weight: bold;">${(infra.riskScore * 100).toFixed(1)}</div>
            <div style="color: #8899aa;">Risk Level</div><div style="color: ${color}; font-weight: bold; text-transform: uppercase;">${riskKey}</div>
            <div style="color: #8899aa;">Health</div><div style="color: #22c55e;">${health}%</div>
            <div style="color: #8899aa;">Maint. Year</div><div style="color: #FFB800;">${maintYear}</div>
          </div>
        </div>
      `);

      markersRef.current.addLayer(marker);
    });

    // Heatmap layer using leaflet.heat (loaded via CDN)
    const heatPoints = infrastructure.map(infra => [
      infra.location.latitude,
      infra.location.longitude,
      infra.riskScore,
    ]);

    if (typeof L.heatLayer === 'function') {
      const heat = L.heatLayer(heatPoints, {
        radius: 35,
        blur: 20,
        maxZoom: 17,
        gradient: { 0.3: '#22c55e', 0.6: '#f59e0b', 1.0: '#ef4444' },
      });
      heat.addTo(mapInstanceRef.current);
      heatLayerRef.current = heat;
    }

    // Fit bounds to show all markers
    if (infrastructure.length > 0) {
      const bounds = L.latLngBounds(
        infrastructure.map((i: Infrastructure) => [i.location.latitude, i.location.longitude])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [infrastructure]);

  return (
    <div className="relative rounded-lg overflow-hidden border border-border card-glow" style={{ height }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

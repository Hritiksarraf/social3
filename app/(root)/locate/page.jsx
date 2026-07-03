"use client";

import { MapContainer, TileLayer, Marker, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { useState, useEffect, useMemo } from 'react';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { PlayIcon } from '@components/icons';

function collegeIcon(name) {
  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;">
        <span style="padding:6px 12px;border-radius:999px;background:linear-gradient(135deg,#7857FF,#FF0073);font-weight:800;font-size:11px;color:#fff;white-space:nowrap;box-shadow:0 8px 18px -6px rgba(120,87,255,0.9);">🎓 ${name}</span>
        <span style="width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid #7857FF;margin-top:4px;"></span>
      </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 7],
  });
}

function stationIcon() {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center;">
        <span class="yv-map-pulse" style="position:absolute;width:36px;height:36px;border-radius:50%;background:rgba(255,0,115,0.35);"></span>
        <span style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#FF0073,#7857FF);display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px -4px rgba(255,0,115,0.9);border:2px solid #fff;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h3l3-8 4 16 3-8h5"></path></svg>
        </span>
      </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

function haversine(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

const ShowRadioTowers = ({ zoomLevel, college }) => {
  const router = useRouter();
  const [showTowers, setShowTowers] = useState(false);
  const towers = college.radioStations.map((station) => ({
    lat: station.lat,
    lng: station.lng,
    name: station.name,
  }));

  useEffect(() => {
    setShowTowers(zoomLevel > 14);
  }, [zoomLevel]);

  const handleClick = (tower) => {
    router.push(`/search/posts/${encodeURIComponent(tower?.name)}`);
  };

  return (
    <>
      {showTowers &&
        towers.map((tower, index) => (
          <Marker
            key={index}
            position={[tower.lat, tower.lng]}
            icon={stationIcon()}
            eventHandlers={{ click: () => handleClick(tower) }}
          >
            <Tooltip>{tower.name}</Tooltip>
          </Marker>
        ))}
    </>
  );
};

const CollegeMarker = ({ college }) => {
  const [zoomLevel, setZoomLevel] = useState(10);
  const map = useMap();

  const handleClick = () => {
    map.setView([college.lat, college.lng], 15);
    setZoomLevel(15);
  };

  useMapEvents({
    zoomend: (e) => setZoomLevel(e.target._zoom),
  });

  return (
    <Marker position={[college.lat, college.lng]} icon={collegeIcon(college.name)} eventHandlers={{ click: handleClick }}>
      <ShowRadioTowers zoomLevel={zoomLevel} college={college} />
    </Marker>
  );
};

const Locate = () => {
  const router = useRouter();
  const colleges = useQuery(api.colleges.getAll);
  const mapCenter = [13.0115, 74.7943];

  const nearbyStations = useMemo(() => {
    if (!colleges) return [];
    const all = colleges.flatMap((college) =>
      college.radioStations.map((s) => ({
        ...s,
        collegeName: college.name,
        distance: haversine({ lat: mapCenter[0], lng: mapCenter[1] }, s),
      }))
    );
    return all.sort((a, b) => a.distance - b.distance).slice(0, 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colleges]);

  if (colleges === undefined) {
    return null;
  }

  return (
    <div className="relative rounded-[26px] overflow-hidden border border-white/[0.08]">
      <MapContainer center={mapCenter} zoom={10} style={{ height: "640px", width: "100%", background: "#0f1622" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap contributors'
        />
        {colleges.map((college, index) => (
          <CollegeMarker college={college} key={index} />
        ))}
      </MapContainer>

      {nearbyStations.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-surface-1 border-t border-white/[0.08] rounded-t-[26px] px-4 pt-3 pb-4 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.8)] z-[400]">
          <div className="w-10 h-[5px] rounded bg-white/[0.18] mx-auto mb-3.5" />
          <p className="font-display font-extrabold text-[15px] mb-2.5">
            {nearbyStations.length} station{nearbyStations.length > 1 ? "s" : ""} near you
          </p>
          <div className="flex flex-col gap-2">
            {nearbyStations.map((station, i) => (
              <button
                key={i}
                onClick={() => router.push(`/search/posts/${encodeURIComponent(station.name)}`)}
                className="flex items-center gap-3 bg-base-1 rounded-2xl p-3 text-left"
              >
                <span
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #FF0073, #7857FF)" }}
                >
                  <PlayIcon size={16} color="#fff" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-[14px] truncate">{station.name}</p>
                  <p className="text-[11px] text-ink-3">{station.collegeName} · {station.distance.toFixed(1)} km</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Locate;

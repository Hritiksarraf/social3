"use client"; 

import { MapContainer, TileLayer, Marker, Tooltip, useMap, useMapEvents, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { useRouter } from 'next/navigation';


// Tower Icon for radio stations
const towerIcon = new L.Icon({
    iconUrl: 'https://imgs.search.brave.com/OHi7ZCZk6zTxB-uDNv0Y-DKWWewRCBxdwV49fK22USk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA2LzYwLzI5Lzc5/LzM2MF9GXzY2MDI5/NzkxNV9QcmtpZHgy/STh5OU1pN1NOYUQ1/TmpKWGZOQ1F1NmxV/ci5qcGc', 
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Custom marker icon for colleges
const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});

// Component to show radio towers near the college
const ShowRadioTowers = ({ zoomLevel, college }) => {
    const router = useRouter()
    const [showTowers, setShowTowers] = useState(false);
    const towers = college.radioStations.map((station) => ({
        lat: station.lat,
        lng: station.lng,
        name: station.name
    }));
    const handleClick = (tower) => {
        const name = encodeURIComponent(tower?.name)
        router.push(`/search/posts/${name}`)
    };
    
    // Show towers only if zoom level > 14
    useEffect(() => {
        if (zoomLevel > 14) {
            setShowTowers(true);
        } else {
            setShowTowers(false);
        }
    }, [zoomLevel]);
    
    return (
        <>
        {showTowers &&
            towers.map((tower, index) => (
                <Marker key={index} position={[tower.lat, tower.lng]} icon={towerIcon} eventHandlers={{
                    click: () => handleClick(tower)
                }}>
                    <Tooltip>{tower.name}</Tooltip>
                </Marker>
            ))
        }
    </>
  );
};

// Main Component to display individual college marker
const MainComponent = ({ college }) => {
    const [zoomLevel, setZoomLevel] = useState(10);
    const map = useMap();
    
    const handleClick = () => {
        map.setView([college.lat, college.lng], 15); 
        setZoomLevel(15);
    };
    
    useMapEvents({
        zoomend: (e) => {
            setZoomLevel(e.target._zoom);
        }
    });

    return (
        <Marker 
            position={[college.lat, college.lng]} 
            icon={customMarkerIcon}
            eventHandlers={{
                click: handleClick
            }}
        >
            <Tooltip>{college.name}</Tooltip>
            <Popup>{college.name}</Popup>
            <ShowRadioTowers zoomLevel={zoomLevel} college={college} />
        </Marker>
    );
};

// Main Locate component
const Locate = () => {
    const [colleges, setColleges] = useState([]);
    const mapCenter = [13.0115, 74.7943]; 

    useEffect(() => {
        // Fetching colleges from the backend API
        const fetchColleges = async () => {
            try {
                const response = await fetch('/api/maps/college',{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                setColleges(data);
            } catch (error) {
                console.error("Error fetching colleges:", error);
            }
        };

        fetchColleges();
    }, []);

    return (
        <MapContainer center={mapCenter} zoom={10} style={{ height: "700px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            {colleges.map((college, index) => (
                <MainComponent college={college} key={index} />
            ))}
        </MapContainer>
    );
};

export default Locate;

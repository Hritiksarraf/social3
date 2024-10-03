"use client"
import { MapContainer, TileLayer, Marker, Tooltip, useMap, useMapEvents, Popup } from 'react-leaflet';
import { useState } from 'react';

// Location data
const locations = [
    { lat: 13.0115, lng: 74.7943, name: "NITK" },  // NITK, Surathkal
    { lat: 12.9716, lng: 79.1594, name: "VIT" },   // VIT, Vellore
    { lat: 13.2357, lng: 74.7421, name: "NITTE" }, // NITTE, Karkala
    { lat: 52.4882, lng: -1.8864, name: "Birmingham Institute of Technology" } // Birmingham Institute of Technology, UK
];

const towerIcon = new L.Icon({
    iconUrl: 'https://imgs.search.brave.com/OHi7ZCZk6zTxB-uDNv0Y-DKWWewRCBxdwV49fK22USk/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA2LzYwLzI5Lzc5/LzM2MF9GXzY2MDI5/NzkxNV9QcmtpZHgy/STh5OU1pN1NOYUQ1/TmpKWGZOQ1F1NmxV/ci5qcGc', // Tower icon URL
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const ShowRadioTowers = ({ zoomLevel, college }) => {
    const [showTowers, setShowTowers] = useState(false);
    const towers = [
        { lat: college.lat + 0.001, lng: college.lng + 0.001 },  
        { lat: college.lat + 0.0015, lng: college.lng + 0.0015 },
        { lat: college.lat + 0.001, lng: college.lng - 0.001 },
        { lat: college.lat - 0.0015, lng: college.lng - 0.0015 },
        { lat: college.lat - 0.001, lng: college.lng + 0.001 }
    ];
    
    // Show towers only if zoom level > 14
    if (zoomLevel > 14 && !showTowers) {
        setShowTowers(true);
    } else if (zoomLevel <= 14 && showTowers) {
        setShowTowers(false);
    }
    
    return (
        <>
        {showTowers &&
            towers.map((tower, index) => (
                <Marker key={index} position={[tower.lat, tower.lng]} icon={towerIcon}>
                <Tooltip>Radio Station {index + 1}</Tooltip>
            </Marker>
            ))
        }
    </>
  );
};
const MainComponent=({college})=>{
    
    const [zoomLevel, setZoomLevel] = useState(10); // Initial zoom level
    const map = useMap();
    
    const handleClick = (college) => {
        map.setView([college.lat,college.lng], 15); 
        setZoomLevel(15)
    };
    useMapEvents({
        zoomend: (e) => {
          setZoomLevel(e.target._zoom);  // Update zoom level on zoom change
        }
    });

    return(
        <Marker 
        position={[college.lat, college.lng]} 
        icon={customMarkerIcon}
        eventHandlers={{
            click:()=>  handleClick(college)
        }}
    >
    <Tooltip>{college.name}</Tooltip>
    <Popup>{college.name}</Popup>
    <ShowRadioTowers zoomLevel={zoomLevel} college={college} />
    </Marker>
    )
}
const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});



// Main Locate component
const Locate = () => {
    const mapCenter=[13.0115, 74.7943]; 
    return (
        <MapContainer  center={mapCenter} zoom={10} style={{ height: "700px", width: "100%" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            {locations.map((college, index) => (
                <MainComponent college={college} key={index}/>
            ))}
            </MapContainer>
    );
};

export default Locate;

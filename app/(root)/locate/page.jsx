"use client"
import { MapContainer, TileLayer, Marker, Popup,useMap,Tooltip   } from 'react-leaflet';
import { LocationOn } from "@mui/icons-material";

// Location data
const locations = [
    { lat: 13.0115, lng: 74.7943, name: "NITK" },  // NITK, Surathkal
    { lat: 12.9716, lng: 79.1594, name: "VIT" },   // VIT, Vellore
    { lat: 13.2357, lng: 74.7421, name: "NITTE" }, // NITTE, Karkala
    { lat: 52.4882, lng: -1.8864, name: "Birmingham Institute of Technology" } // Birmingham Institute of Technology, UK
];
const customMarkerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
});

// Zoom Component to handle marker clicks
const Zoom = ({ position }) => {
    const map = useMap();
    const location=position
    const handleClick = () => {
        map.setView(position, 15); // Set the view to the clicked position with a zoom level of 15
    };

    return (
        <Marker icon={customMarkerIcon} position={[position.lat,position.lng]} eventHandlers={{ click: handleClick }}>
            <Tooltip>{location.name}</Tooltip>
            <Popup>{location.name}</Popup>
        </Marker>
    );
};

// Main Locate component
const Locate = () => {
    const center = [13.0115, 74.7943]; // Center on NITK
    console.log("hello")
    return (
        <div className='flex w-full h-screen items-start justify-center text-slate-50'>
            <div className='w-[80%] h-[80%] flex  justify-start items-center'>
                <MapContainer center={center} zoom={10} className='w-full h-full'> 
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {locations.map((location, index) => (
                        <Zoom key={index} position={location    } />
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default Locate;

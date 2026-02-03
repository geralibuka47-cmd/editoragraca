import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    center: [number, number];
    zoom?: number;
    markerLabel?: string;
}

const Map: React.FC<MapProps> = ({ center, zoom = 13, markerLabel }) => {
    return (
        <div className="h-full w-full rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    {markerLabel && (
                        <Popup>
                            {markerLabel}
                        </Popup>
                    )}
                </Marker>
            </MapContainer>
        </div>
    );
};

export default Map;

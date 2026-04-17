import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + React (standard issue with bundlers)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const defaultCenter = [12.9716, 77.5946];

const AegisMapNode = ({ center = { lat: 12.9716, lng: 77.5946 }, zoom = 14, markers = [] }) => {
  const position = [center.lat, center.lng];

  return (
    <div className="w-full h-full min-h-[300px] rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer 
        center={position} 
        zoom={zoom} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker 
            key={index} 
            position={[marker.position.lat, marker.position.lng]}
          >
            <Popup>
              <div className="font-bold">{marker.title}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Visual Overlay */}
      <div className="absolute top-4 left-4 z-[1000]">
         <div className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-500 shadow-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Aegis Clinical GIS Node Active
         </div>
      </div>
    </div>
  );
};

export default AegisMapNode;

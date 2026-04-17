import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Activity, Hospital, User, Navigation } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Fix for default Leaflet icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons using Lucide & L.divIcon
const createCustomIcon = (IconComponent, color) => {
  return L.divIcon({
    html: renderToString(
      <div style={{ 
        color: color, 
        backgroundColor: 'rgba(255,255,255,0.9)', 
        padding: '8px', 
        borderRadius: '12px', 
        border: `2px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <IconComponent size={20} />
      </div>
    ),
    className: 'custom-map-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });
};

const ambulanceIcon = createCustomIcon(Navigation, '#0ea5e9'); // Sky 500
const hospitalIcon = createCustomIcon(Hospital, '#4f46e5'); // Indigo 600
const patientIcon = createCustomIcon(User, '#f43f5e'); // Rose 500

const MapAutoCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, 13);
  }, [center, map]);
  return null;
};

const AmbulanceMap = ({ 
  ambulancePos, 
  hospitalPos, 
  patientPos, 
  patientData 
}) => {
  const [route, setRoute] = useState([]);

  useEffect(() => {
    if (ambulancePos && patientPos) {
      setRoute([ambulancePos, patientPos]);
    }
  }, [ambulancePos, patientPos]);

  const mapCenter = patientPos || hospitalPos || [12.9716, 77.5946];

  return (
    <div className="w-full h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl relative">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapAutoCenter center={mapCenter} />

        {/* 🚑 Ambulance Marker */}
        {ambulancePos && (
          <Marker position={ambulancePos} icon={ambulanceIcon}>
            <Popup className="custom-popup">
              <div className="font-sans p-2">
                <p className="text-[10px] font-black uppercase text-sky-500 mb-1">Active Unit</p>
                <p className="font-bold text-slate-900">Ambulance #AECS-04</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 🏥 Hospital Marker */}
        {hospitalPos && (
          <Marker position={hospitalPos} icon={hospitalIcon}>
            <Popup>
               <div className="font-sans p-2">
                <p className="text-[10px] font-black uppercase text-indigo-500 mb-1">Medical Hub</p>
                <p className="font-bold text-slate-900">Dr. Chandramma Dayananda Sagar</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 👤 Patient Marker */}
        {patientPos && (
          <Marker position={patientPos} icon={patientIcon}>
            <Popup>
              <div className="font-sans p-2">
                <p className="text-[10px] font-black uppercase text-rose-500 mb-1">Rescue Target</p>
                <p className="font-bold text-slate-900">{patientData?.name || 'Inbound Patient'}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-1">SEVERITY: {patientData?.severity || 'HIGH'}</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* 🛰️ Routing Polyline */}
        {route.length > 1 && (
          <Polyline 
            positions={route} 
            pathOptions={{ 
              color: '#0ea5e9', 
              weight: 4, 
              dashArray: '10, 10',
              opacity: 0.6
            }} 
          />
        )}
      </MapContainer>

      {/* 🧩 Mini Overlay for Patient Data (Pickup Interface) */}
      {patientData && (
        <div className="absolute top-6 right-6 z-[1000] w-64 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-right-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-rose-400">Patient Pickup</p>
                <p className="font-black text-white">{patientData.name}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
               <div className="flex justify-between text-[11px] font-bold">
                 <span className="text-slate-400">Age/Sex</span>
                 <span className="text-white">{patientData.age}Y | {patientData.gender}</span>
               </div>
               <div className="flex justify-between text-[11px] font-bold">
                 <span className="text-slate-400">Condition</span>
                 <span className="text-rose-400">{patientData.severity} Severity</span>
               </div>
            </div>

            <button className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-sky-500/20 active:scale-95">
              Confirm Pickup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbulanceMap;

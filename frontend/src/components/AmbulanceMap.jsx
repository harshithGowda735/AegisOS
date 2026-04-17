import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom professional SVG icons
const ambulanceIcon = L.divIcon({
  html: `<div style="filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.1));">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="34" height="34" rx="17" fill="white"/>
            <path d="M19 13V15M19 9V11M16 12H13M13 12L12 9H5L3 13V18H5C5 19.1046 5.89543 20 7 20C8.10457 20 9 19.1046 9 18H15C15 19.1046 15.8954 20 17 20C18.1046 20 19 19.1046 19 18H20V12H16Z" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M7 18C7.55228 18 8 17.5523 8 17C8 16.4477 7.55228 16 7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44772 18 7 18Z" fill="#e11d48"/>
            <path d="M17 18C17.5523 18 18 17.5523 18 17C18 16.4477 17.5523 16 17 16C16.4477 16 16 16.4477 16 17C16 17.5523 16.4477 18 17 18Z" fill="#e11d48"/>
          </svg>
        </div>`,
  className: '', iconSize: [34, 34], iconAnchor: [17, 17]
});

const patientIcon = L.divIcon({
  html: `<div style="filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.1));">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="34" height="34" rx="17" fill="white"/>
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>`,
  className: '', iconSize: [34, 34], iconAnchor: [17, 17]
});

const hospitalIcon = L.divIcon({
  html: `<div style="filter: drop-shadow(0 4px 6px rgb(0 0 0 / 0.1));">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="34" height="34" rx="17" fill="white"/>
            <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>`,
  className: '', iconSize: [34, 34], iconAnchor: [17, 17]
});

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => { if (center) map.flyTo(center, 14); }, [center, map]);
  return null;
};

const AmbulanceMap = ({ ambulanceLoc, patientLoc, hospitalLoc, hospitals = [], fleet = [] }) => {
  const center = patientLoc ? [patientLoc.lat, patientLoc.lng] : [12.9716, 77.5946];
  return (
    <div className="w-full h-full min-h-[400px] rounded-[2rem] overflow-hidden relative">
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {patientLoc && <Marker position={[patientLoc.lat, patientLoc.lng]} icon={patientIcon} />}
        {ambulanceLoc && <Marker position={[ambulanceLoc.lat, ambulanceLoc.lng]} icon={ambulanceIcon} />}
        {fleet.map(amb => (
          <Marker key={amb._id} position={[amb.location.lat, amb.location.lng]} icon={ambulanceIcon} opacity={amb.status === 'Available' ? 1 : 0.6} />
        ))}
        {hospitals.map(h => (
          <Marker key={h._id} position={[h.coordinates.lat, h.coordinates.lng]} icon={hospitalIcon} />
        ))}
        {hospitalLoc && <Marker position={[hospitalLoc.lat, hospitalLoc.lng]} icon={hospitalIcon} />}
        <MapUpdater center={ambulanceLoc ? [ambulanceLoc.lat, ambulanceLoc.lng] : null} />
      </MapContainer>
    </div>
  );
};
export default AmbulanceMap;

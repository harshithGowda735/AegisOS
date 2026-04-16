import React from 'react';
import { 
  APIProvider, 
  Map, 
  Marker
} from '@vis.gl/react-google-maps';

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946
};

// 🎨 Pro-Level Aegis Silver Theme (In-Code)
const mapStyles = [
  { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#dadada" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
  { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
  { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
];

const AegisMapNode = ({ center = defaultCenter, zoom = 14, markers = [] }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY || 'AIzaSyDyam294Xfoz2XdvlmsVycZ0XGLZ_3I-kg';

  return (
    <div className="w-full h-full min-h-[300px] rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm relative">
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          styles={mapStyles}
          disableDefaultUI={true}
          zoomControl={true}
          // ⚠️ mapId removed to allow in-code styling. 
          // Advanced Markers are disabled to prevent the style conflict.
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={marker.position}
              title={marker.title}
            />
          ))}
        </Map>
      </APIProvider>
      
      {/* Visual Overlay */}
      <div className="absolute top-4 left-4 z-10">
         <div className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-500 shadow-sm flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            AI Geographic Node Active
         </div>
      </div>
    </div>
  );
};

export default AegisMapNode;

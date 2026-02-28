import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom icons for different marker types
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const driverIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Sub-component that uses useMap hook to control map view
const MapController = ({ markers, currentPosition }) => {
  const map = useMap();
  const hasInitialFit = useRef(false);

  useEffect(() => {
    if (!map) return;

    const validMarkers = (markers || []).filter(
      (m) => m && typeof m.lat === 'number' && typeof m.lng === 'number'
    );

    const hasUser =
      currentPosition &&
      typeof currentPosition.lat === 'number' &&
      typeof currentPosition.lng === 'number' &&
      // Ignore default/fallback coordinates
      !(currentPosition.lat === -3.745 && currentPosition.lng === -38.523);

    if (validMarkers.length > 0 && hasUser) {
      // Fit bounds to include both user position and all markers
      const allPoints = [
        [currentPosition.lat, currentPosition.lng],
        ...validMarkers.map((m) => [m.lat, m.lng]),
      ];

      try {
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds.pad(0.15), { maxZoom: 16, animate: true, duration: 1.0 });
        hasInitialFit.current = true;
      } catch (e) {
        console.warn('fitBounds failed:', e.message);
      }
    } else if (validMarkers.length > 0) {
      // Only markers, no valid user position yet — center on first marker
      try {
        map.flyTo([validMarkers[0].lat, validMarkers[0].lng], 15, { animate: true, duration: 1.0 });
        hasInitialFit.current = true;
      } catch (e) {
        console.warn('flyTo marker failed:', e.message);
      }
    } else if (hasUser && !hasInitialFit.current) {
      // No markers yet, but user position is available — center on user once
      try {
        map.flyTo([currentPosition.lat, currentPosition.lng], 15, { animate: true, duration: 1.0 });
        hasInitialFit.current = true;
      } catch (e) {
        console.warn('flyTo user failed:', e.message);
      }
    }
  }, [
    markers,
    map,
    currentPosition?.lat,
    currentPosition?.lng,
  ]);

  return null;
};

// Accept `markers` prop: array of { lat, lng, popup, type }
const LiveTracking = ({ markers = [] }) => {
  const [currentPosition, setCurrentPosition] = useState({ lat: -3.745, lng: -38.523 });

  useEffect(() => {
    if (!navigator.geolocation) return;

    const update = (position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({ lat: latitude, lng: longitude });
    };

    navigator.geolocation.getCurrentPosition(update, (err) => {
      console.warn('Geolocation error:', err.message);
    });

    const watchId = navigator.geolocation.watchPosition(update, (err) => {
      console.warn('watchPosition error:', err.message);
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <MapContainer
      center={[currentPosition.lat, currentPosition.lng]}
      zoom={15}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapController markers={markers} currentPosition={currentPosition} />

      {/* User marker */}
      <Marker position={[currentPosition.lat, currentPosition.lng]} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Other markers (drivers, destinations, etc.) */}
      {markers.map((m, idx) =>
        m && typeof m.lat === 'number' && typeof m.lng === 'number' ? (
          <Marker key={`marker-${idx}`} position={[m.lat, m.lng]} icon={driverIcon}>
            {m.popup && <Popup>{m.popup}</Popup>}
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
};

export default LiveTracking;
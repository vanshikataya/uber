import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Build an inline-SVG data-URI marker so we never hit external image hosts
const makeSvgIcon = (fill) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
    <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="${fill}" stroke="#fff" stroke-width="1.5"/>
    <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
  </svg>`;
  return new L.DivIcon({
    html: svg,
    className: '',            // remove default leaflet-div-icon styling
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const userIcon        = makeSvgIcon('#2563eb'); // blue
const driverIcon      = makeSvgIcon('#dc2626'); // red
const destinationIcon = makeSvgIcon('#16a34a'); // green

// Sub-component that uses useMap hook to control map view
const MapController = ({ markers, currentPosition, routeCoordinates }) => {
  const map = useMap();
  const hasInitialFit = useRef(false);

  // Fix tiles not rendering when container size isn't final at mount
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const validMarkers = (markers || []).filter(
      (m) => m && typeof m.lat === 'number' && typeof m.lng === 'number'
    );

    const hasUser =
      currentPosition &&
      typeof currentPosition.lat === 'number' &&
      typeof currentPosition.lng === 'number' &&
      !(currentPosition.lat === -3.745 && currentPosition.lng === -38.523);

    // If we have a route, fit to the route bounds
    if (routeCoordinates && routeCoordinates.length > 1) {
      try {
        const allPoints = [...routeCoordinates];
        if (hasUser) allPoints.push([currentPosition.lat, currentPosition.lng]);
        validMarkers.forEach((m) => allPoints.push([m.lat, m.lng]));
        const bounds = L.latLngBounds(allPoints);
        map.fitBounds(bounds.pad(0.12), { maxZoom: 16, animate: true, duration: 1.0 });
        hasInitialFit.current = true;
        return;
      } catch (e) {
        console.warn('Route fitBounds failed:', e.message);
      }
    }

    if (validMarkers.length > 0 && hasUser) {
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
      try {
        map.flyTo([validMarkers[0].lat, validMarkers[0].lng], 15, { animate: true, duration: 1.0 });
        hasInitialFit.current = true;
      } catch (e) {
        console.warn('flyTo marker failed:', e.message);
      }
    } else if (hasUser && !hasInitialFit.current) {
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
    routeCoordinates,
    currentPosition?.lat,
    currentPosition?.lng,
  ]);

  return null;
};

// Accept props: markers, routeCoordinates, pickupCoords, destinationCoords
const LiveTracking = ({ markers = [], routeCoordinates = [], pickupCoords = null, destinationCoords = null }) => {
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

      <MapController markers={markers} currentPosition={currentPosition} routeCoordinates={routeCoordinates} />

      {/* Route polyline */}
      {routeCoordinates && routeCoordinates.length > 1 && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{ color: '#000', weight: 5, opacity: 0.8 }}
        />
      )}

      {/* Pickup marker (green) */}
      {pickupCoords && typeof pickupCoords.lat === 'number' && (
        <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={userIcon}>
          <Popup>Pickup</Popup>
        </Marker>
      )}

      {/* Destination marker (green) */}
      {destinationCoords && typeof destinationCoords.lat === 'number' && (
        <Marker position={[destinationCoords.lat, destinationCoords.lng]} icon={destinationIcon}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {/* User marker */}
      <Marker position={[currentPosition.lat, currentPosition.lng]} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {/* Other markers (drivers, etc.) */}
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
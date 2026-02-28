const axios = require('axios');
const captainModel = require('../models/captain.model');

// ======== OpenStreetMap / OSRM implementation ========

// 📍 Nominatim requires a User-Agent header (policy):
const headers = { 'User-Agent': 'uber-clone/1.0 (+https://yourapp.example.com)' };

// Simple cache for autocomplete suggestions to reduce API calls (5 min TTL)
const suggestionCache = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (input) => `suggestions_${input.toLowerCase()}`;
const isCacheValid = (timestamp) => Date.now() - timestamp < CACHE_TTL;

// 🔹 Geocode (address → lat/lng) and autocomplete using Nominatim
module.exports.getAddressCoordinate = async (address) => {
  if (!address) throw new Error('Address is required');

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;
  const resp = await axios.get(url, { headers });
  if (!resp.data || resp.data.length === 0) {
    throw new Error('No results from geocoder');
  }
  const { lat, lon } = resp.data[0];
  return { lat: parseFloat(lat), lng: parseFloat(lon) };
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) throw new Error('Query is required');

  const cacheKey = getCacheKey(input);
  
  // Check cache first
  if (suggestionCache[cacheKey] && isCacheValid(suggestionCache[cacheKey].timestamp)) {
    console.log(`✅ Cache hit for "${input}"`);
    return suggestionCache[cacheKey].data;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(input)}`;
    const resp = await axios.get(url, { headers });
    const suggestions = resp.data.map(place => place.display_name).filter(Boolean);
    
    // Store in cache
    suggestionCache[cacheKey] = {
      data: suggestions,
      timestamp: Date.now()
    };
    
    console.log(`📡 Nominatim query for "${input}" - cached ${suggestions.length} results`);
    return suggestions;
  } catch (error) {
    // If Nominatim fails (e.g., rate limit), return cached data if available
    if (suggestionCache[cacheKey]) {
      console.log(`⚠️ Nominatim error, returning stale cache for "${input}"`);
      return suggestionCache[cacheKey].data;
    }
    throw error;
  }
};

// 🔹 Distance & travel time using OSRM public service
module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) throw new Error('Origin and destination are required');

  // helper: convert whatever we got into {lat,lng}
  const toLatLng = async (p) => {
    if (p && typeof p === 'object' && p.lat != null && p.lng != null) {
      return p;
    }

    if (typeof p === 'string') {
      // if string looks like coords "lng,lat" or "lat,lng" allow
      const match = p.match(/^-?\d+(?:\.\d+)?,\s*-?\d+(?:\.\d+)?$/);
      if (match) {
        const parts = p.split(',').map(s => parseFloat(s.trim()));
        // assume order lng,lat for OSRM URLs
        return { lat: parts[1], lng: parts[0] };
      }
      // otherwise treat as address and geocode
      return await module.exports.getAddressCoordinate(p);
    }

    throw new Error('Invalid origin/destination format');
  };

  const ori = await toLatLng(origin);
  const dest = await toLatLng(destination);
  const o = `${ori.lng},${ori.lat}`;
  const d = `${dest.lng},${dest.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${o};${d}?overview=false`;
  const resp = await axios.get(url);
  if (!resp.data.routes || resp.data.routes.length === 0) {
    throw new Error('No route found');
  }
  const leg = resp.data.routes[0].legs[0];
  return {
    distance: { text: `${(leg.distance / 1000).toFixed(1)} km`, value: leg.distance },
    duration: { text: `${Math.ceil(leg.duration / 60)} mins`, value: leg.duration }
  };
};

// 🔹 Get captains within a radius (unchanged)
module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
  if (!lat || !lng || !radius) {
    throw new Error('Latitude, longitude and radius are required');
  }

  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius / 6371]
      }
    }
  });

  return captains;
};

// 🔹 Get full route geometry (for drawing on map)
module.exports.getRouteGeometry = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error('Pickup and destination are required');
  }

  const ori = typeof pickup === 'string' ? await module.exports.getAddressCoordinate(pickup) : pickup;
  const dest = typeof destination === 'string' ? await module.exports.getAddressCoordinate(destination) : destination;

  const o = `${ori.lng},${ori.lat}`;
  const d = `${dest.lng},${dest.lat}`;
  const url = `https://router.project-osrm.org/route/v1/driving/${o};${d}?overview=full&geometries=geojson`;
  const resp = await axios.get(url);
  if (!resp.data.routes || resp.data.routes.length === 0) {
    throw new Error('No route found');
  }
  const route = resp.data.routes[0];
  // Convert GeoJSON [lng,lat] to [lat,lng] for Leaflet
  const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  return {
    coordinates,
    pickup: ori,
    destination: dest,
    distance: route.legs[0].distance,
    duration: route.legs[0].duration
  };
};

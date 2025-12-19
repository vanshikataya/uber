const axios = require('axios');
const captainModel = require('../models/captain.model');

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

// 🔹 Get coordinates for an address
module.exports.getAddressCoordinate = async (address) => {
    if (!address) throw new Error("Address is required");

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log("📍 Geocode API response:", response.data);

        if (response.data.status === 'OK') {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat, // ✅ fixed typo (was ltd)
                lng: location.lng
            };
        } else {
            throw new Error(response.data.error_message || `Geocode API Error: ${response.data.status}`);
        }
    } catch (error) {
        console.error("❌ Error in getAddressCoordinate:", error.message);
        throw new Error("Unable to fetch coordinates");
    }
};

// 🔹 Get distance and duration between two points
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log("📍 Distance Matrix API response:", response.data);

        if (response.data.status === 'OK') {
            const element = response.data.rows[0].elements[0];

            if (element.status === 'ZERO_RESULTS') {
                throw new Error('No routes found between origin and destination');
            }

            return element; // { distance: {text, value}, duration: {text, value}, status }
        } else {
            throw new Error(response.data.error_message || `Distance Matrix API Error: ${response.data.status}`);
        }
    } catch (err) {
        console.error("❌ Error in getDistanceTime:", err.message);
        throw new Error("Unable to fetch distance and time");
    }
};

// 🔹 Get autocomplete suggestions
module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        console.log("📍 Places Autocomplete API response:", response.data);

        if (response.data.status === 'OK') {
            return response.data.predictions
                .map(prediction => prediction.description)
                .filter(Boolean);
        } else {
            throw new Error(response.data.error_message || `Places API Error: ${response.data.status}`);
        }
    } catch (err) {
        console.error("❌ Error in getAutoCompleteSuggestions:", err.message);
        throw new Error("Unable to fetch suggestions");
    }
};

// 🔹 Get captains within a radius
module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
    if (!lat || !lng || !radius) {
        throw new Error("Latitude, longitude and radius are required");
    }

    // radius in km
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius / 6371] // ✅ Mongo expects [lng, lat], not [lat, lng]
            }
        }
    });

    return captains;
};

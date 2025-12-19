const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  try {
    const coordinates = await mapService.getAddressCoordinate(address);
    res.status(200).json(coordinates);
  } catch (error) {
    console.error("❌ Error fetching coordinates:", error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch coordinates', error: error.message });
  }
};

module.exports.getDistanceTime = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { origin, destination } = req.query;

  try {
    const distanceTime = await mapService.getDistanceTime(origin, destination);
    res.status(200).json(distanceTime);
  } catch (err) {
    console.error("❌ Error fetching distance/time:", err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to fetch distance/time', error: err.message });
  }
};

module.exports.getAutoCompleteSuggestions = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { input } = req.query;

  try {
    const suggestions = await mapService.getAutoCompleteSuggestions(input);
    res.status(200).json(suggestions);
  } catch (err) {
    console.error("❌ Error fetching autocomplete suggestions:", err.response?.data || err.message);
    res.status(500).json({ message: 'Failed to fetch autocomplete suggestions', error: err.message });
  }
};

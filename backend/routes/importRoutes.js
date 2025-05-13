const express = require('express');
const router = express.Router();
const importController = require('../controllers/importController');

// Rutas para importación
router.post('/restaurants', importController.importRestaurants);
router.get('/locations', importController.getSuggestedLocations);

module.exports = router;
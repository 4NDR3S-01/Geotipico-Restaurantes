const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { cacheMiddleware } = require('../middleware/cacheMiddleware');

// Middleware de validación para parámetros de búsqueda
const validateSearchParams = (req, res, next) => {
  // Validar parámetros de geolocalización
  if (req.query.lat || req.query.lng) {
    const { lat, lng } = req.query;
    
    if ((lat && !lng) || (!lat && lng)) {
      return res.status(400).json({ 
        error: 'Si proporciona una coordenada, debe proporcionar ambas (lat y lng)'
      });
    }
    
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) {
      return res.status(400).json({ 
        error: 'Las coordenadas deben ser números válidos'
      });
    }
    
    if (Math.abs(parseFloat(lat)) > 90 || Math.abs(parseFloat(lng)) > 180) {
      return res.status(400).json({ 
        error: 'Coordenadas fuera de rango válido'
      });
    }
  }
  
  // Validar rating
  if (req.query.rating && (isNaN(parseFloat(req.query.rating)) || parseFloat(req.query.rating) < 0 || parseFloat(req.query.rating) > 5)) {
    return res.status(400).json({ 
      error: 'El rating debe ser un número entre 0 y 5'
    });
  }
  
  // Validar distancia
  if (req.query.distance && (isNaN(parseInt(req.query.distance)) || parseInt(req.query.distance) <= 0)) {
    return res.status(400).json({ 
      error: 'La distancia debe ser un número entero positivo'
    });
  }
  
  next();
};

// Validación para parámetros ID
const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  
  // ID MongoDB: 24 caracteres hexadecimales
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ 
      error: 'Formato de ID inválido' 
    });
  }
  
  next();
};

// Rutas con caché y validación
router.get('/', validateSearchParams, cacheMiddleware(300), restaurantController.getRestaurants);
router.get('/specialties', cacheMiddleware(3600), restaurantController.getSpecialties);
router.get('/stats', cacheMiddleware(600), restaurantController.getRestaurantStats);
router.get('/:id', validateIdParam, cacheMiddleware(300), restaurantController.getRestaurantById);

module.exports = router;
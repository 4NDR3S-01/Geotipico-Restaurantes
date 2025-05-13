const Restaurant = require('../models/Restaurant');
const osmService = require('../services/osmService');

/**
 * Importa restaurantes desde OpenStreetMap con manejo de errores mejorado
 */
exports.importRestaurants = async (req, res, next) => {
  try {
    const { lat = -0.9676533, lng = -80.7089101, radius = 5000 } = req.body;
    
    // Validación avanzada
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng)) || isNaN(parseInt(radius))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Coordenadas o radio inválidos' 
      });
    }
    
    // Validar rangos de coordenadas
    if (Math.abs(parseFloat(lat)) > 90 || Math.abs(parseFloat(lng)) > 180) {
      return res.status(400).json({ 
        success: false, 
        message: 'Coordenadas fuera de rango válido' 
      });
    }
    
    // Validar radio
    if (parseInt(radius) < 100 || parseInt(radius) > 50000) {
      return res.status(400).json({ 
        success: false, 
        message: 'El radio debe estar entre 100 y 50000 metros' 
      });
    }
    
    console.log(`Iniciando importación desde: ${lat}, ${lng}, radio: ${radius}m`);
    
    // Obtener restaurantes desde OpenStreetMap con manejo de errores
    let restaurants;
    try {
      restaurants = await osmService.getRestaurantsByLocation(
        { lat: parseFloat(lat), lng: parseFloat(lng) }, 
        parseInt(radius)
      );
    } catch (error) {
      return res.status(500).json({ 
        success: false,
        message: `Error obteniendo datos: ${error.message}` 
      });
    }
    
    if (!restaurants || restaurants.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No se encontraron restaurantes en esta ubicación',
        total: 0,
        new: 0,
        updated: 0
      });
    }
    
    // Estadísticas de procesamiento
    let stats = { new: 0, updated: 0, failed: 0, total: restaurants.length, skipped: 0 };
    
    // Procesar cada restaurante con mejor manejo de errores
    for (const place of restaurants) {
      try {
        // Validar datos mínimos requeridos
        if (!place.name || !isValidCoordinates([place.lng, place.lat])) {
          stats.skipped++;
          continue;
        }
        
        // Buscar si ya existe por osm_id o por nombre+ubicación
        let existingRestaurant = null;
        
        if (place.osm_id) {
          existingRestaurant = await Restaurant.findOne({ osm_id: place.osm_id });
        }
        
        // Si no lo encontró por ID, buscar por proximidad y nombre similar
        if (!existingRestaurant && place.coordinates?.coordinates) {
          existingRestaurant = await Restaurant.findOne({
            coordinates: {
              $near: {
                $geometry: place.coordinates,
                $maxDistance: 50 // 50 metros de tolerancia
              }
            },
            name: { $regex: new RegExp(`^${place.name.split(' ')[0]}`, 'i') }
          });
        }
        
        if (existingRestaurant) {
          // Actualizar
          await Restaurant.findByIdAndUpdate(existingRestaurant._id, {
            ...place,
            // Preservar campos importantes que no queremos sobrescribir
            rating: Math.max(place.rating, existingRestaurant.rating)
          });
          stats.updated++;
        } else {
          // Crear nuevo
          await Restaurant.create(place);
          stats.new++;
        }
      } catch (error) {
        console.error(`Error procesando: ${place?.name || 'desconocido'}`, error.message);
        stats.failed++;
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Importación completada: ${stats.new} nuevos, ${stats.updated} actualizados, ${stats.skipped} omitidos`,
      total: restaurants.length,
      ...stats
    });
  } catch (error) {
    console.error('Error en importación:', error);
    next(error);
  }
};

// Función auxiliar para validar coordenadas
function isValidCoordinates(coordinates) {
  return Array.isArray(coordinates) && 
         coordinates.length === 2 &&
         !isNaN(coordinates[0]) && 
         !isNaN(coordinates[1]) &&
         Math.abs(coordinates[0]) <= 180 && 
         Math.abs(coordinates[1]) <= 90;
}

/**
 * Obtiene ubicaciones sugeridas para importación
 */
exports.getSuggestedLocations = async (_req, res) => {
  // Ubicaciones preseleccionadas en Manta con descripciones añadidas
  const locations = [
    { 
      name: "Centro de Manta", 
      lat: -0.9484, 
      lng: -80.7359,
      description: "Zona comercial y administrativa" 
    },
    { 
      name: "Playa Murciélago", 
      lat: -0.9436, 
      lng: -80.7378,
      description: "Zona turística y gastronómica junto al mar" 
    },
    { 
      name: "Tarqui", 
      lat: -0.9509, 
      lng: -80.7612,
      description: "Barrio tradicional con gastronomía local" 
    },
    { 
      name: "Mall del Pacífico", 
      lat: -0.9623, 
      lng: -80.7086,
      description: "Centro comercial y zona de restaurantes"
    },
    { 
      name: "Los Esteros", 
      lat: -0.9596, 
      lng: -80.6882,
      description: "Barrio residencial con oferta gastronómica variada"
    }
  ];
  
  res.json({ locations });
};
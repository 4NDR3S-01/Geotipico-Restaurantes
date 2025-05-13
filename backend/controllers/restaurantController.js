const Restaurant = require('../models/Restaurant');

/**
 * Obtiene restaurantes con filtros opcionales
 */
exports.getRestaurants = async (req, res, next) => {
  try {
    const {
      specialty,
      priceRange,
      rating,
      search,
      lat,
      lng,
      distance = 10000
    } = req.query;

    // Construir filtros
    const filters = {};
    
    if (specialty) {
      filters.specialties = { $in: specialty.split(',') };
    }
    
    if (priceRange) {
      filters.priceRange = { $in: priceRange.split(',') };
    }
    
    if (rating) {
      filters.rating = { $gte: parseFloat(rating) };
    }
    
    if (search) {
      const regex = new RegExp(search, 'i');
      filters.$or = [
        { name: regex },
        { description: regex },
        { specialties: regex },
        { address: regex },
      ];
    }
    
    // Búsqueda geoespacial
    if (lat && lng) {
      filters.coordinates = {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(distance)
        }
      };
    }

    // Ejecutar consulta con proyección
    const restaurants = await Restaurant.find(filters);
    
    // Formatear respuesta
    const formattedRestaurants = restaurants.map(r => ({
      id: r._id,
      name: r.name,
      description: r.description,
      image: r.image,
      lat: r.lat || r.coordinates?.coordinates?.[1] || null,
      lng: r.lng || r.coordinates?.coordinates?.[0] || null,
      address: r.address,
      priceRange: r.priceRange,
      rating: r.rating,
      specialties: r.specialties || [],
      horario: r.horario,
      telefono: r.telefono,
      city: r.city
    }));
    
    // Filtrar restaurantes sin coordenadas
    const validRestaurants = formattedRestaurants.filter(r => 
      r.lat !== null && r.lng !== null
    );
    
    res.json({ 
      count: validRestaurants.length,
      restaurants: validRestaurants
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un restaurante por ID
 */
exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurante no encontrado' });
    }
    
    res.json(restaurant);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todas las especialidades disponibles
 */
exports.getSpecialties = async (_req, res, next) => {
  try {
    const specialties = await Restaurant.distinct('specialties');
    res.json(specialties);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene estadísticas de restaurantes
 */
exports.getRestaurantStats = async (_req, res, next) => {
  try {
    const totalRestaurants = await Restaurant.countDocuments();
    
    const averageRatingResult = await Restaurant.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]);
    
    const averageRating = averageRatingResult.length > 0 
      ? Math.round(averageRatingResult[0].avgRating * 10) / 10
      : 0;
    
    // Distribución de precios
    const priceDistribution = { '$': 0, '$$': 0, '$$$': 0, '$$$$': 0 };
    
    const priceResults = await Restaurant.aggregate([
      { $group: { _id: "$priceRange", count: { $sum: 1 } } }
    ]);
    
    priceResults.forEach(result => {
      if (result._id && priceDistribution.hasOwnProperty(result._id)) {
        priceDistribution[result._id] = result.count;
      }
    });
    
    res.json({
      totalRestaurants,
      averageRating,
      priceDistribution
    });
  } catch (error) {
    next(error);
  }
};
const fetch = require('node-fetch');
const osmtogeojson = require('osmtogeojson');

// Configuración global
const DEFAULT_TIMEOUT = 10000; // 10 segundos para prevenir cuelgues
const MAX_PLACES = 100; // Limitar cantidad de resultados

// Cache para evitar consultas repetidas
const requestCache = new Map();
const CACHE_DURATION = 3600000; // 1 hora en milisegundos

/**
 * Obtiene restaurantes desde OpenStreetMap con manejo de errores mejorado
 */
exports.getRestaurantsByLocation = async (location = { lat: -0.9676533, lng: -80.7089101 }, radius = 5000) => {
  try {
    console.log(`Buscando lugares en: ${location.lat}, ${location.lng}, radio: ${radius}m`);
    
    // Clave para caché
    const cacheKey = `${location.lat},${location.lng},${radius}`;
    
    // Verificar caché
    if (requestCache.has(cacheKey)) {
      const cachedData = requestCache.get(cacheKey);
      if (cachedData.timestamp + CACHE_DURATION > Date.now()) {
        console.log('Usando datos en caché para esta ubicación');
        return cachedData.data;
      }
      requestCache.delete(cacheKey);
    }
    
    // Construir consulta Overpass con límite de tamaño
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"~"restaurant|cafe|fast_food|bar"](around:${radius},${location.lat},${location.lng});
        way["amenity"~"restaurant|cafe|fast_food|bar"](around:${radius},${location.lat},${location.lng});
        relation["amenity"~"restaurant|cafe|fast_food|bar"](around:${radius},${location.lat},${location.lng});
      );
      out body center ${MAX_PLACES};
      >;
      out skel qt;
    `;
    
    // Realizar petición a Overpass API con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);
    
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(overpassQuery),
      signal: controller.signal
    }).finally(() => clearTimeout(timeoutId));
    
    if (!response.ok) {
      throw new Error(`Error en Overpass API: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Convertir a GeoJSON
    const geojson = osmtogeojson(data);
    
    // Procesar y formatear resultados
    const places = geojson.features
      .filter(feature => feature.properties?.tags && feature.properties.tags.name)
      .map(feature => {
        const tags = feature.properties.tags;
        
        // Obtener coordenadas según el tipo de geometría
        let coordinates = [0, 0];
        if (feature.geometry.type === 'Point') {
          coordinates = feature.geometry.coordinates;
        } else if (feature.geometry.type === 'Polygon' && feature.geometry.coordinates[0]?.length > 0) {
          // Para polígonos, usar el centroide
          const points = feature.geometry.coordinates[0];
          const sumX = points.reduce((sum, point) => sum + point[0], 0);
          const sumY = points.reduce((sum, point) => sum + point[1], 0);
          coordinates = [sumX / points.length, sumY / points.length];
        } else if (feature.geometry.coordinates && feature.geometry.coordinates.length > 0) {
          coordinates = Array.isArray(feature.geometry.coordinates[0]) 
            ? feature.geometry.coordinates[0] 
            : feature.geometry.coordinates;
        }
        
        // Verificar que las coordenadas sean válidas
        if (!isValidCoordinates(coordinates)) {
          console.warn(`Coordenadas inválidas para: ${tags.name}`);
          return null;
        }
        
        return {
          osm_id: `${feature.id}`,
          name: tags.name || 'Restaurante sin nombre',
          description: generateDescription(tags),
          address: formatAddress(tags) || 'Dirección no disponible',
          coordinates: {
            type: 'Point',
            coordinates: [coordinates[0], coordinates[1]] // [lng, lat]
          },
          lat: coordinates[1], // Latitud es coordenada Y
          lng: coordinates[0], // Longitud es coordenada X
          priceRange: determinePriceRange(tags),
          rating: generateRating(tags),
          specialties: determineSpecialties(tags),
          image: selectImage(tags),
          horario: formatOpeningHours(tags.opening_hours),
          telefono: tags.phone || tags['contact:phone'] || 'No disponible',
          city: tags['addr:city'] || 'Manta',
          source: 'openstreetmap'
        };
      })
      .filter(Boolean); // Eliminar valores nulos
    
    // Almacenar en caché
    requestCache.set(cacheKey, {
      data: places,
      timestamp: Date.now()
    });
    
    console.log(`Se encontraron ${places.length} lugares en OpenStreetMap`);
    return places;
  } catch (error) {
    console.error('Error obteniendo datos de OSM:', error);
    
    // Si es un error de timeout, proporcionar mensaje específico
    if (error.name === 'AbortError') {
      throw new Error('La consulta a OpenStreetMap tardó demasiado tiempo. Intenta reducir el radio de búsqueda.');
    }
    
    throw new Error(`Error obteniendo datos de OpenStreetMap: ${error.message}`);
  }
};

// Función para validar coordenadas
function isValidCoordinates(coordinates) {
  return Array.isArray(coordinates) && 
         coordinates.length === 2 &&
         !isNaN(coordinates[0]) && 
         !isNaN(coordinates[1]) &&
         Math.abs(coordinates[0]) <= 180 && 
         Math.abs(coordinates[1]) <= 90;
}

/**
 * Funciones auxiliares
 */

// Genera una descripción basada en etiquetas
function generateDescription(tags) {
  const tipos = {
    'restaurant': 'un restaurante',
    'cafe': 'una cafetería',
    'bar': 'un bar',
    'fast_food': 'un local de comida rápida'
  };
  
  const tipo = tipos[tags.amenity] || 'un establecimiento';
  let description = `${tags.name} es ${tipo}`;
  
  if (tags.cuisine) {
    description += ` especializado en ${translateCuisine(tags.cuisine)}`;
  }
  
  if (tags['addr:city'] || tags['addr:suburb']) {
    const ubicacion = tags['addr:city'] || tags['addr:suburb'] || 'Manta';
    description += ` ubicado en ${ubicacion}`;
  }
  
  return `${description}, donde podrás disfrutar de una gran experiencia gastronómica.`;
}

// Formatea la dirección
function formatAddress(tags) {
  const parts = [];
  
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:suburb']) parts.push(tags['addr:suburb']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  
  if (parts.length > 0) {
    return parts.join(', ');
  }
  
  // Si no hay dirección estructurada, buscar otras etiquetas
  return tags.address || '';
}

// Determina el rango de precios
function determinePriceRange(tags) {
  if (tags['price:range']) return tags['price:range'];
  
  // Asignación estimada según tipo
  switch (tags.amenity) {
    case 'fast_food': return '$';
    case 'restaurant': 
      if (tags.cuisine && ['seafood', 'steak_house', 'japanese'].includes(tags.cuisine)) {
        return '$$$';
      }
      return '$$';
    case 'cafe': return '$$';
    default: return '$$';
  }
}

// Genera una calificación simulada pero realista
function generateRating(tags) {
  // Base de calificación
  let baseRating = 3.5;
  
  // Si tiene sitio web o teléfono, probablemente sea un establecimiento más profesional
  if (tags.website || tags.phone || tags['contact:phone']) {
    baseRating += 0.5;
  }
  
  // Si está en una ubicación turística, ajustar rating
  if (tags['tourism'] === 'yes' || tags['addr:suburb'] === 'Playa Murciélago') {
    baseRating += 0.3;
  }
  
  // Agregar un poco de variabilidad aleatoria (±0.5)
  const randomFactor = (Math.random() - 0.5);
  let finalRating = baseRating + randomFactor;
  
  // Asegurar que esté en un rango válido (1-5) y redondear a un decimal
  finalRating = Math.max(1, Math.min(5, finalRating));
  return parseFloat(finalRating.toFixed(1));
}

// Determina especialidades basadas en etiquetas
function determineSpecialties(tags) {
  const specialties = [];
  
  // Determinar por tipo de amenidad
  if (tags.amenity === 'restaurant') specialties.push('Restaurante');
  if (tags.amenity === 'cafe') specialties.push('Café');
  if (tags.amenity === 'fast_food') specialties.push('Comida Rápida');
  if (tags.amenity === 'bar') specialties.push('Bar');
  
  // Obtener especialidades de la cocina
  if (tags.cuisine) {
    const cuisines = tags.cuisine.split(';').map(c => translateCuisine(c.trim()));
    specialties.push(...cuisines);
  }
  
  // Añadir cocina local si está en Ecuador
  if (specialties.length === 0 || Math.random() < 0.3) {
    specialties.push('Comida manabita');
  }
  
  return [...new Set(specialties)].filter(Boolean);
}

// Traducir tipos de cocina
function translateCuisine(cuisine) {
  const translations = {
    'regional': 'Comida regional',
    'international': 'Comida internacional',
    'seafood': 'Mariscos',
    'mexican': 'Comida mexicana',
    'italian': 'Comida italiana',
    'chinese': 'Comida china',
    'japanese': 'Comida japonesa',
    'burger': 'Hamburguesas',
    'pizza': 'Pizza',
    'steak': 'Carnes',
    'fish': 'Pescado',
    'coffee': 'Café',
    'sandwich': 'Sándwiches',
    'american': 'Comida americana',
    'peruvian': 'Comida peruana'
  };
  
  return translations[cuisine.toLowerCase()] || cuisine;
}

// Formatea horarios de apertura
function formatOpeningHours(openingHours) {
  if (!openingHours) return 'Horario no disponible';
  return openingHours;
}

// Selecciona una imagen adecuada
function selectImage(tags) {
  // Imágenes de ejemplo - En producción usaríamos imágenes reales o generadas
  const imagePool = [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500"
  ];
  
  // Determinista basado en el nombre para obtener siempre la misma imagen
  const nameSum = tags.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const index = nameSum % imagePool.length;
  
  return imagePool[index];
}
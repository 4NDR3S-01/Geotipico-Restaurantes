// Caché en memoria con límite de tamaño
const cache = new Map();
const MAX_CACHE_SIZE = 100; // límite de entradas en caché

/**
 * Middleware para cachear respuestas con control de tamaño
 * @param {number} duration - Duración de caché en segundos
 */
exports.cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Solo cachear solicitudes GET
    if (req.method !== 'GET') {
      return next();
    }
    
    // Usar la URL completa como clave de caché
    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    
    // Devolver respuesta cacheada si es válida
    if (cachedResponse && cachedResponse.expiry > Date.now()) {
      return res.json(cachedResponse.data);
    }
    
    // Si la caché es muy grande, eliminar las entradas más antiguas
    if (cache.size >= MAX_CACHE_SIZE) {
      // Encontrar las entradas más antiguas
      const entries = [...cache.entries()];
      const oldestEntries = entries
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, Math.floor(MAX_CACHE_SIZE / 4)); // Eliminar 25% más antiguas
      
      // Eliminar entradas antiguas
      oldestEntries.forEach(entry => cache.delete(entry[0]));
    }
    
    // Interceptar la función json para cachear la respuesta
    const originalJson = res.json;
    res.json = function(data) {
      // Almacenar en caché antes de enviar
      cache.set(key, {
        data,
        expiry: Date.now() + (duration * 1000),
        timestamp: Date.now()
      });
      
      // Continuar con el flujo normal
      return originalJson.call(this, data);
    };
    
    next();
  };
};
/**
 * Servicio API para comunicación con el backend
 * Maneja todas las peticiones HTTP a la API
 */

// URL base de la API (configurable según entorno)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Función auxiliar para manejar errores de fetch
const handleResponse = async (response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    } catch (error) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  }
  return response.json();
};

// Servicio de restaurantes
export const restaurantService = {
  // Obtener todos los restaurantes con filtros opcionales
  getAll: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`${API_URL}/restaurants?${queryParams}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo restaurantes:', error);
      throw error;
    }
  },

  // Obtener un restaurante por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/restaurants/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error(`Error obteniendo restaurante con ID ${id}:`, error);
      throw error;
    }
  },

  // Obtener todas las especialidades disponibles
  getSpecialties: async () => {
    try {
      const response = await fetch(`${API_URL}/specialties`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo especialidades:', error);
      throw error;
    }
  },
  
  // Obtener estadísticas de restaurantes
  getStats: async () => {
    try {
      const response = await fetch(`${API_URL}/restaurants/stats`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      throw error;
    }
  }
};

// Servicio de importación
export const importService = {
  // Obtener ubicaciones sugeridas para importación
  getLocations: async () => {
    try {
      const response = await fetch(`${API_URL}/import/locations`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo ubicaciones:', error);
      throw error;
    }
  },
  
  // Importar restaurantes por ubicación
  importByLocation: async (locationData) => {
    try {
      const response = await fetch(`${API_URL}/import/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(locationData)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error importando restaurantes:', error);
      throw error;
    }
  }
};

// Crear objeto para exportar
const apiServices = {
  restaurantService,
  importService
};

export default apiServices;
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Restaurant } from '@/types';

interface GoogleMapFallbackProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  restaurants?: Restaurant[];
  className?: string;
  showViewToggle?: boolean;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  selectedRestaurant?: Restaurant;
}

const GoogleMapFallback: React.FC<GoogleMapFallbackProps> = ({
  center = { lat: 18.4861, lng: -69.9312 },
  zoom = 13,
  restaurants = [],
  className = '',
  showViewToggle = true,
  onRestaurantClick,
  selectedRestaurant
}) => {
  const { t } = useLanguage();
  const [showList, setShowList] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  // Crear marcadores para mostrar en el mapa
  const createMarkersUrl = useCallback(() => {
    const baseUrl = 'https://www.google.com/maps/embed/v1/view';
    const apiKey = 'AIzaSyDVbX4Ra_eV6AhtrHFKgqRiRYfRHGsmf_s';
    
    let url = `${baseUrl}?key=${apiKey}&center=${center.lat},${center.lng}&zoom=${zoom}`;
    
    // Si hay un restaurante seleccionado, centramos el mapa en él con mayor zoom
    if (selectedRestaurant) {
      // Usar la API de place para mostrar el marcador específico
      url = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(selectedRestaurant.name + ' ' + selectedRestaurant.address)}&zoom=${Math.min(zoom + 3, 18)}`;
    }
    
    return url;
  }, [center, zoom, selectedRestaurant]);

  // Memoizar la URL para evitar recreaciones innecesarias
  const mapsUrl = createMarkersUrl();

  // Función para manejar errores del mapa
  const handleMapError = useCallback(() => {
    setMapError(true);
    if (retryCount < maxRetries) {
      console.log(`Reintentando cargar el mapa (intento ${retryCount + 1}/${maxRetries})`);
      setTimeout(() => {
        setMapError(false);
        setRetryCount(prev => prev + 1);
      }, 2000); // Retry después de 2 segundos
    }
  }, [retryCount, maxRetries]);

  // Función para manejar la carga exitosa del mapa
  const handleMapLoad = useCallback(() => {
    setMapError(false);
    setRetryCount(0);
    console.log('Mapa cargado correctamente');
  }, []);

  return (
    <div className={`relative ${className}`}>
      {showViewToggle && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setShowList(!showList)}
            className="bg-white shadow-lg px-3 py-2 rounded-lg text-sm hover:bg-gray-50"
          >
            {showList ? t('map.showMap') : t('map.showList')}
          </button>
        </div>
      )}

      {!showList ? (
        <div className="w-full h-full">
          {mapError && retryCount >= maxRetries ? (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <div className="text-center p-4">
                <div className="text-red-500 mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Error al cargar el mapa</h3>
                <p className="text-sm text-gray-600 mb-4">No se pudo conectar con Google Maps</p>
                <button
                  onClick={() => {
                    setMapError(false);
                    setRetryCount(0);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <iframe
              src={mapsUrl}
              className="w-full h-full rounded-lg border-0"
              style={{ minHeight: '400px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={selectedRestaurant ? `Ubicación de ${selectedRestaurant.name}` : "Mapa de establecimientos"}
              key={`${selectedRestaurant?.id || 'general-map'}-${retryCount}`} // Forzar re-render cuando cambie
              onLoad={handleMapLoad}
              onError={handleMapError}
            />
          )}
          
          {/* Overlay con información del restaurante seleccionado */}
          {selectedRestaurant && (
            <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg p-3 max-w-xs z-10">
              <h4 className="font-semibold text-sm">{selectedRestaurant.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{selectedRestaurant.address}</p>
              {selectedRestaurant.rating && (
                <p className="text-xs text-yellow-600 mt-1">
                  ⭐ {selectedRestaurant.rating}/5
                </p>
              )}
              <button
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedRestaurant.lat},${selectedRestaurant.lng}`;
                  window.open(url, '_blank');
                }}
                className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
              >
                🗺️ Obtener direcciones
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
          <h4 className="font-semibold mb-3">Establecimientos</h4>
          {restaurants.length > 0 ? (
            <div className="space-y-3">
              {restaurants.map((restaurant) => (
                <div 
                  key={restaurant.id} 
                  className={`border rounded-lg p-3 transition-all ${
                    selectedRestaurant?.id === restaurant.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${onRestaurantClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={() => onRestaurantClick?.(restaurant)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium">{restaurant.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">{restaurant.address}</p>
                      {restaurant.rating && (
                        <p className="text-sm text-yellow-600 mt-1">
                          ⭐ {restaurant.rating}/5
                        </p>
                      )}
                      {restaurant.distance && (
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {restaurant.distance.toFixed(1)} km
                        </p>
                      )}
                      {/* Mostrar tipo de establecimiento */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {restaurant.types.slice(0, 3).map((type, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {type === 'restaurant' ? '🍽️ Restaurante' :
                             type === 'bar' ? '🍺 Bar' :
                             type === 'cafe' ? '☕ Café' :
                             type === 'seafood' ? '🦐 Mariscos' :
                             type === 'ecuadorian_cuisine' ? '🇪🇨 Ecuatoriano' :
                             type === 'night_club' ? '🌙 Discoteca' :
                             type === 'food' ? '🍕 Comida' :
                             type}
                          </span>
                        ))}
                      </div>
                    </div>
                    {selectedRestaurant?.id === restaurant.id && (
                      <div className="ml-2">
                        <span className="text-blue-600 text-sm">📍 Seleccionado</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <a
                      href={`https://www.google.com/maps?q=${restaurant.lat},${restaurant.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ver en Maps →
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Cómo llegar →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay establecimientos para mostrar</p>
          )}
        </div>
      )}

      {/* Nota sobre el mapa */}
      <div className="absolute bottom-4 left-4 bg-white/90 p-2 rounded shadow-lg text-xs max-w-xs">
        <p className="text-gray-600">
          💡 <strong>Mapa interactivo:</strong> {selectedRestaurant ? 'Mostrando ubicación seleccionada' : 'Haz clic en un establecimiento para verlo en el mapa'}
        </p>
      </div>
    </div>
  );
};

export default GoogleMapFallback;

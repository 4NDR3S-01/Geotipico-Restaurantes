'use client';

import { Restaurant } from '@/types';

interface SimpleMapProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  onRestaurantClick?: (restaurant: Restaurant) => void;
}

export const SimpleMap = ({ restaurants, center, onRestaurantClick }: SimpleMapProps) => {
  const defaultCenter = center || { lat: -0.9526, lng: -80.7320 }; // Manta, Ecuador

  return (
    <section aria-label="Lista de restaurantes" className="w-full h-full">
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border border-gray-200 p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            📍 Restaurantes en Manta
          </h3>
          <p className="text-sm text-gray-600">
            Centro: {defaultCenter.lat.toFixed(4)}, {defaultCenter.lng.toFixed(4)}
          </p>
        </div>
        
        <div className="max-h-96 overflow-y-auto space-y-2">
          {restaurants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🍽️</div>
              <p>No hay restaurantes para mostrar</p>
            </div>
          ) : (
            restaurants.map((restaurant) => (
              <button
                key={restaurant.id}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-3 cursor-pointer hover:shadow-md transition-shadow text-left"
                onClick={() => onRestaurantClick?.(restaurant)}
                type="button"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {restaurant.name}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      📍 {restaurant.address}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      {restaurant.rating && (
                        <span className="text-xs text-yellow-600">
                          ⭐ {restaurant.rating}
                        </span>
                      )}
                      {restaurant.distance && (
                        <span className="text-xs text-blue-600">
                          📏 {restaurant.distance.toFixed(1)} km
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    <div>{restaurant.lat.toFixed(4)}</div>
                    <div>{restaurant.lng.toFixed(4)}</div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600">⚠️</span>
            <div className="text-xs text-yellow-800">
              <p className="font-medium">Mapa en modo de desarrollo</p>
              <p className="mt-1">
                Para ver el mapa interactivo, configura una clave válida de Google Maps API en el archivo .env.local
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

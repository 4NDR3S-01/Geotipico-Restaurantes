'use client';

import { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
// import { MapWrapper } from '@/components/maps/MapWrapper';
import { Restaurant } from '@/types';

const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'La Marinera',
    address: 'Malecón Escénico, Manta',
    lat: -0.9526,
    lng: -80.7320,
    rating: 4.5,
    types: ['restaurant', 'seafood'],
    distance: 0.5
  },
  {
    id: '2',
    name: 'El Dorado',
    address: 'Av. 4 de Noviembre, Manta',
    lat: -0.9450,
    lng: -80.7280,
    rating: 4.2,
    types: ['restaurant', 'local'],
    distance: 1.2
  },
  {
    id: '3',
    name: 'Mariscos Don Juan',
    address: 'Calle 15, Manta',
    lat: -0.9600,
    lng: -80.7400,
    rating: 4.7,
    types: ['restaurant', 'seafood'],
    distance: 2.1
  }
];

export default function DemoPage() {
  const { addNotification } = useNotifications();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const showNotification = (type: 'info' | 'success' | 'warning' | 'error') => {
    const messages = {
      info: {
        title: 'Información',
        message: 'Esta es una notificación informativa'
      },
      success: {
        title: '¡Éxito!',
        message: 'Operación completada correctamente'
      },
      warning: {
        title: 'Advertencia',
        message: 'Ten cuidado con esta acción'
      },
      error: {
        title: 'Error',
        message: 'Algo salió mal, por favor intenta de nuevo'
      }
    };

    addNotification({
      ...messages[type],
      type,
      read: false
    });
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    addNotification({
      title: 'Restaurante seleccionado',
      message: `Has seleccionado ${restaurant.name}`,
      type: 'info',
      read: false
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Demo: Mapa y Notificaciones
        </h1>

        {/* Panel de notificaciones de prueba */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Probar Notificaciones</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => showNotification('info')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Mostrar Info
            </button>
            <button
              onClick={() => showNotification('success')}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Mostrar Éxito
            </button>
            <button
              onClick={() => showNotification('warning')}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Mostrar Advertencia
            </button>
            <button
              onClick={() => showNotification('error')}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Mostrar Error
            </button>
          </div>
        </div>

        {/* Información del restaurante seleccionado */}
        {selectedRestaurant && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold mb-2">Restaurante Seleccionado</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedRestaurant.name}</h3>
                <p className="text-gray-600">{selectedRestaurant.address}</p>
                {selectedRestaurant.rating && (
                  <p className="text-yellow-600">⭐ {selectedRestaurant.rating}/5</p>
                )}
              </div>
              <div className="text-sm text-gray-500">
                <p>Latitud: {selectedRestaurant.lat}</p>
                <p>Longitud: {selectedRestaurant.lng}</p>
                {selectedRestaurant.distance && (
                  <p>Distancia: {selectedRestaurant.distance} km</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mapa */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Mapa de Restaurantes</h2>
          {/* <div className="h-96 w-full">
            <MapWrapper
              restaurants={mockRestaurants}
              zoom={13}
              onRestaurantClick={handleRestaurantClick}
            />
          </div> */}
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-blue-800 mb-3">
            📋 Estado de la configuración
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Google Maps API Key:</span>
              <span className={`font-semibold ${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'text-green-600' : 'text-red-600'}`}>
                {(() => {
                  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return 'No configurada ✗';
                  if (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.length > 30) return 'Configurada ✓';
                  return 'Incompleta ⚠️';
                })()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Modo de mapa:</span>
              <span className="font-semibold text-blue-600">
                {(() => {
                  const hasValidKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && 
                                     process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.length > 30;
                  return hasValidKey ? 'Google Maps' : 'Modo desarrollo';
                })()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Restaurantes cargados:</span>
              <span className="font-semibold text-green-600">{mockRestaurants.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

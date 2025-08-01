'use client';

import { useState } from 'react';
import { GoogleMap } from '@/components/maps/GoogleMap';
import { NotificationDemo } from '@/components/NotificationDemo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Restaurant } from '@/types';
import { MapPin } from 'lucide-react';

// Datos de ejemplo para restaurantes en Manta
const sampleRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'El Pescador',
    address: 'Malecón de Manta, Ecuador',
    lat: -0.9526,
    lng: -80.7320,
    rating: 4.5,
    price_level: 2,
    types: ['restaurant', 'seafood'],
    photos: [],
  },
  {
    id: '2',
    name: 'Mariscos Doña Rosa',
    address: 'Av. 4 de Noviembre, Manta',
    lat: -0.9500,
    lng: -80.7280,
    rating: 4.3,
    price_level: 1,
    types: ['restaurant', 'seafood'],
    photos: [],
  },
  {
    id: '3',
    name: 'Restaurante El Faro',
    address: 'Puerto de Manta, Ecuador',
    lat: -0.9560,
    lng: -80.7350,
    rating: 4.7,
    price_level: 3,
    types: ['restaurant', 'seafood', 'fine_dining'],
    photos: [],
  },
];

export default function TestPage() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Página de Prueba - Sistema de Notificaciones y Mapa
          </h1>
          <p className="text-gray-600">
            Prueba las notificaciones y verifica que el mapa funcione correctamente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Notificaciones */}
          <div className="lg:col-span-1">
            <NotificationDemo />
            
            {/* Información del restaurante seleccionado */}
            {selectedRestaurant && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Restaurante Seleccionado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold">{selectedRestaurant.name}</h3>
                  <p className="text-sm text-gray-600">{selectedRestaurant.address}</p>
                  {selectedRestaurant.rating && (
                    <p className="text-sm">⭐ {selectedRestaurant.rating}/5</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mapa */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle>Mapa de Restaurantes en Manta</CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <GoogleMap
                  restaurants={sampleRestaurants}
                  center={{ lat: -0.9526, lng: -80.7320 }}
                  zoom={14}
                  onRestaurantClick={setSelectedRestaurant}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
          >
            Volver a la página principal
          </Button>
        </div>
      </div>
    </div>
  );
}

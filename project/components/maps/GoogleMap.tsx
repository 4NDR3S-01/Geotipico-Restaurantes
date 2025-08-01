'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Restaurant } from '@/types';


interface GoogleMapProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  apiKey: string | undefined;
}

export const GoogleMap = ({ restaurants, center, zoom = 14, onRestaurantClick, apiKey }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const markersRef = useRef<any[]>([]);

  // Default center to Manta, Ecuador
  const defaultCenter = useMemo(() => ({ lat: -0.9526, lng: -80.7320 }), []);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    const initMap = () => {
      try {
        if (!mapRef.current) return;

        const mapCenter = center || userLocation || defaultCenter;
        const gmaps = (window as any).google.maps;
        
        if (!gmaps) {
          setError('Google Maps no se pudo cargar correctamente');
          setLoading(false);
          return;
        }

        const googleMap = new gmaps.Map(mapRef.current, {
          center: mapCenter,
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'on' }],
            },
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'simplified' }],
            },
          ],
        });

        setMap(googleMap);
        setError(null);
        setLoading(false);

        // Add user location marker
        if (userLocation) {
          new gmaps.Marker({
            position: userLocation,
            map: googleMap,
            icon: {
              path: gmaps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
            title: 'Tu ubicación',
          });
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Error al inicializar el mapa');
        setLoading(false);
      }
    };

    // Depuración: mostrar el estado de la API key
    console.log('[GoogleMap] apiKey:', apiKey);

    // Si el script ya existe, solo espera a que cargue y llama a initMap
    const existingScript = document.querySelector('script[data-google-maps-script]');
    if ((window as any).google?.maps) {
      initMap();
    } else if (existingScript) {
      // Si el script ya está en el DOM pero google.maps aún no está disponible, espera a que cargue
      existingScript.addEventListener('load', initMap);
      existingScript.addEventListener('error', (err) => {
        console.error('Failed to load Google Maps API (ya en DOM):', err);
        setError('No se pudo cargar la API de Google Maps. Verifica tu clave de API y conexión a internet.');
        setLoading(false);
      });
    } else {
      if (!apiKey) {
        setError('Google Maps API key no está configurada. Por favor verifica tu archivo .env.local');
        setLoading(false);
        return;
      }
      if (apiKey.length < 30) {
        setError('Google Maps API key parece estar incompleta. Verifica que tienes la clave completa en .env.local');
        setLoading(false);
        return;
      }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-google-maps-script', 'true');
      script.onload = initMap;
      script.onerror = (err) => {
        console.error('Failed to load Google Maps API:', err);
        setError('No se pudo cargar la API de Google Maps. Verifica tu clave de API y conexión a internet.');
        setLoading(false);
      };
      document.head.appendChild(script);
    }
  }, [center, zoom, userLocation, defaultCenter, apiKey]);

  useEffect(() => {
    if (!map) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add restaurant markers
    restaurants.forEach((restaurant) => {
      const gmaps = (window as any).google.maps;
      const marker = new gmaps.Marker({
        position: { lat: restaurant.lat, lng: restaurant.lng },
        map,
        title: restaurant.name,
        icon: {
          path: gmaps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: '#FF6B6B',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 1,
        },
      });
      markersRef.current.push(marker);

      const infoWindow = new gmaps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold">${restaurant.name}</h3>
            <p class="text-sm text-gray-600">${restaurant.address}</p>
            ${restaurant.rating ? `<p class="text-sm">⭐ ${restaurant.rating}</p>` : ''}
            ${restaurant.distance ? `<p class="text-sm">${restaurant.distance.toFixed(1)} km</p>` : ''}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        onRestaurantClick?.(restaurant);
      });
    });
  }, [map, restaurants, onRestaurantClick]);

  if (loading) {
    return (
      <section aria-label="Mapa de restaurantes" className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-label="Mapa de restaurantes" className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full bg-red-50 rounded-lg border border-red-200">
          <div className="text-center p-6">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar el mapa</h3>
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Mapa de restaurantes" className="w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </section>
  );
};
'use client';

import { useEffect, useRef, useState } from 'react';
import { Restaurant } from '@/types';

interface GoogleMapProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onRestaurantClick?: (restaurant: Restaurant) => void;
  apiKey?: string;
}

export const GoogleMap = ({
  restaurants,
  center,
  zoom = 13,
  onRestaurantClick,
  apiKey,
}: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const markersRef = useRef<any[]>([]);

  const defaultCenter = { lat: -0.9526, lng: -80.7320 }; // Manta, Ecuador

  // Get user location
  useEffect(() => {
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
          setUserLocation(defaultCenter);
        }
      );
    } else {
      setUserLocation(defaultCenter);
    }
  }, []);

  useEffect(() => {
    const initMap = () => {
      try {
        if (!mapRef.current) return;

        const mapCenter = center || userLocation || defaultCenter;
        const gmaps = (window as any).google?.maps;
        
        if (!gmaps) {
          setError('Google Maps no se pudo cargar. Esto puede deberse a un bloqueador de anuncios o extensión del navegador.');
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
        setError('Error al inicializar el mapa. Verifica tu configuración.');
        setLoading(false);
      }
    };

    // Verificar si la API key está configurada
    const effectiveApiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!effectiveApiKey) {
      setError('Google Maps API key no está configurada. Verifica tu archivo .env');
      setLoading(false);
      return;
    }

    if (effectiveApiKey.length < 30) {
      setError('Google Maps API key parece estar incompleta. Verifica que tienes la clave completa.');
      setLoading(false);
      return;
    }

    // Si Google Maps ya está cargado
    if ((window as any).google?.maps) {
      initMap();
      return;
    }

    // Verificar si el script ya existe
    const existingScript = document.querySelector('script[data-google-maps-script]');
    if (existingScript) {
      // Si el script ya está en el DOM, esperar a que cargue
      const handleLoad = () => {
        initMap();
        existingScript.removeEventListener('load', handleLoad);
        existingScript.removeEventListener('error', handleError);
      };
      
      const handleError = (err: any) => {
        console.error('Failed to load Google Maps API:', err);
        setError('No se pudo cargar la API de Google Maps. Verifica tu clave de API, conexión a internet, o desactiva bloqueadores de anuncios.');
        setLoading(false);
        existingScript.removeEventListener('load', handleLoad);
        existingScript.removeEventListener('error', handleError);
      };
      
      existingScript.addEventListener('load', handleLoad);
      existingScript.addEventListener('error', handleError);
      
      // Si ya se cargó
      if ((window as any).google?.maps) {
        handleLoad();
      }
      
      // Timeout para manejar casos donde el script no responde
      setTimeout(() => {
        if (loading && !map) {
          setError('Tiempo de espera agotado. Verifica que no hay bloqueadores de anuncios activos.');
          setLoading(false);
        }
      }, 10000);
    } else {
      // Crear nuevo script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${effectiveApiKey}&libraries=places&loading=async`;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-google-maps-script', 'true');
      
      script.onload = () => {
        // Esperar un poco para asegurar que la API esté lista
        setTimeout(initMap, 100);
      };
      
      script.onerror = (err) => {
        console.error('Failed to load Google Maps API:', err);
        setError('No se pudo cargar la API de Google Maps. Verifica tu clave de API, conexión a internet, o desactiva bloqueadores de anuncios.');
        setLoading(false);
      };
      
      document.head.appendChild(script);
      
      // Timeout para manejar casos donde el script no responde
      setTimeout(() => {
        if (loading && !map) {
          setError('Tiempo de espera agotado al cargar Google Maps. Verifica que no hay bloqueadores de anuncios activos.');
          setLoading(false);
        }
      }, 10000);
    }
  }, [center, zoom, userLocation, apiKey, loading, map]);

  useEffect(() => {
    if (!map) return;

    // Clear previous markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add restaurant markers
    restaurants.forEach((restaurant) => {
      const gmaps = (window as any).google?.maps;
      if (!gmaps) return;

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

      // Create info window
      const infoWindow = new gmaps.InfoWindow({
        content: `
          <div class="p-3">
            <h3 class="font-semibold text-lg">${restaurant.name}</h3>
            <p class="text-sm text-gray-600 mt-1">${restaurant.address}</p>
            ${restaurant.rating ? `<p class="text-sm mt-1">⭐ ${restaurant.rating}/5</p>` : ''}
            ${restaurant.distance ? `<p class="text-sm mt-1">📍 ${restaurant.distance.toFixed(1)} km de distancia</p>` : ''}
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando mapa...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-label="Mapa de restaurantes" className="w-full h-full">
        <div className="flex items-center justify-center w-full h-full bg-red-50 rounded-lg border border-red-200">
          <div className="text-center p-6 max-w-lg">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar el mapa</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">Posibles soluciones:</h4>
                <ul className="text-xs text-yellow-700 space-y-1 text-left">
                  <li>• Desactiva temporalmente tu bloqueador de anuncios (AdBlock, uBlock, etc.)</li>
                  <li>• Verifica que tu navegador permite contenido de Google Maps</li>
                  <li>• Intenta en modo incógnito/privado</li>
                  <li>• Revisa la configuración de privacidad del navegador</li>
                </ul>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Reintentar
                </button>
                <button
                  onClick={() => {
                    // Cambiar a vista de lista
                    const listTab = document.querySelector('[role="tab"][aria-controls*="list"]') as HTMLElement;
                    if (listTab) listTab.click();
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Ver Lista
                </button>
              </div>
              <p className="text-xs text-red-500">
                Si el problema persiste, usa la vista de lista mientras solucionas el problema del mapa
              </p>
            </div>
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

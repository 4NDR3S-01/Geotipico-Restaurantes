'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface GoogleMapNewProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  restaurants?: any[];
  userLocation?: { lat: number; lng: number };
  className?: string;
  onMapLoad?: (map: any) => void;
  showViewToggle?: boolean;
  apiKey?: string;
}

const GoogleMapNew: React.FC<GoogleMapNewProps> = ({
  center,
  zoom = 13,
  restaurants = [],
  userLocation,
  className = '',
  onMapLoad,
  showViewToggle = true,
  apiKey
}) => {
  const { t } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const defaultCenter = { lat: 18.4861, lng: -69.9312 }; // República Dominicana

  const addDebugInfo = (info: string) => {
    console.log('[GoogleMap Debug]:', info);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  useEffect(() => {
    let isComponentMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initMap = () => {
      addDebugInfo('Iniciando inicialización del mapa');
      
      if (!mapRef.current) {
        addDebugInfo('Error: No se encontró la referencia del contenedor del mapa');
        return;
      }

      if (!isComponentMounted) {
        addDebugInfo('Componente desmontado, cancelando inicialización');
        return;
      }

      const gmaps = (window as any).google?.maps;
      if (!gmaps) {
        addDebugInfo('Error: Google Maps API no está disponible');
        setError('Google Maps API no está disponible');
        setLoading(false);
        return;
      }

      try {
        const mapCenter = center || userLocation || defaultCenter;
        addDebugInfo(`Creando mapa con centro: ${JSON.stringify(mapCenter)}`);

        const googleMap = new gmaps.Map(mapRef.current, {
          center: mapCenter,
          zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        addDebugInfo('Mapa creado exitosamente');
        setMap(googleMap);
        setLoading(false);
        setError(null);

        if (onMapLoad) {
          onMapLoad(googleMap);
        }

        // Agregar marcador de ubicación del usuario
        if (userLocation) {
          addDebugInfo('Agregando marcador de usuario');
          new gmaps.Marker({
            position: userLocation,
            map: googleMap,
            title: 'Tu ubicación',
            icon: {
              path: gmaps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });
        }

      } catch (err) {
        addDebugInfo(`Error al crear el mapa: ${err}`);
        setError(`Error al crear el mapa: ${err}`);
        setLoading(false);
      }
    };

    const loadGoogleMapsScript = () => {
      const effectiveApiKey = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      addDebugInfo(`Verificando API key: ${effectiveApiKey ? 'Presente' : 'Ausente'}`);
      
      if (!effectiveApiKey) {
        setError('API key de Google Maps no configurada');
        setLoading(false);
        return;
      }

      // Verificar si Google Maps ya está cargado
      if ((window as any).google?.maps) {
        addDebugInfo('Google Maps ya está disponible');
        initMap();
        return;
      }

      // Verificar si ya existe un script de Google Maps
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
      if (existingScript) {
        addDebugInfo('Script de Google Maps ya existe, esperando carga');
        
        const checkIfLoaded = () => {
          if ((window as any).google?.maps) {
            addDebugInfo('Google Maps cargado desde script existente');
            initMap();
          } else {
            addDebugInfo('Esperando a que Google Maps esté disponible...');
            setTimeout(checkIfLoaded, 500);
          }
        };
        
        checkIfLoaded();
        return;
      }

      // Crear nuevo script
      addDebugInfo('Creando nuevo script de Google Maps');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${effectiveApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        addDebugInfo('Script de Google Maps cargado exitosamente');
        setTimeout(() => {
          if (isComponentMounted) {
            initMap();
          }
        }, 100);
      };
      
      script.onerror = (err) => {
        addDebugInfo(`Error al cargar script: ${err}`);
        setError('Error al cargar Google Maps API');
        setLoading(false);
      };
      
      document.head.appendChild(script);
    };

    // Iniciar carga
    addDebugInfo('Iniciando carga de Google Maps');
    loadGoogleMapsScript();

    // Timeout de seguridad
    timeoutId = setTimeout(() => {
      if (loading && isComponentMounted) {
        addDebugInfo('Timeout alcanzado - forzando modo de error');
        setError('Tiempo de espera agotado al cargar Google Maps');
        setLoading(false);
      }
    }, 8000);

    return () => {
      addDebugInfo('Limpiando componente');
      isComponentMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [center, zoom, userLocation, apiKey]);

  if (error) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 ${className}`}>
        <div className="text-center text-red-600 mb-4">
          <h3 className="font-semibold">Error al cargar el mapa</h3>
          <p className="text-sm mt-2">{error}</p>
        </div>
        
        {showViewToggle && (
          <div className="mb-4">
            <button
              onClick={() => setShowList(!showList)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {showList ? t('map.showMap') : t('map.showList')}
            </button>
          </div>
        )}

        {showList && (
          <div className="space-y-2">
            <h4 className="font-semibold">Restaurantes:</h4>
            {restaurants.length > 0 ? (
              restaurants.map((restaurant, index) => (
                <div key={index} className="bg-white p-3 rounded border">
                  <h5 className="font-medium">{restaurant.name}</h5>
                  <p className="text-sm text-gray-600">{restaurant.address}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay restaurantes para mostrar</p>
            )}
          </div>
        )}

        {/* Información de debug */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600">
            Información de debug ({debugInfo.length} entradas)
          </summary>
          <div className="mt-2 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded text-xs">
            {debugInfo.map((info, index) => (
              <div key={index} className="mb-1">{info}</div>
            ))}
          </div>
        </details>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando mapa...</p>
          <div className="mt-2 text-xs text-gray-500">
            {debugInfo.length > 0 && debugInfo[debugInfo.length - 1]}
          </div>
        </div>
      </div>
    );
  }

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

      <div 
        ref={mapRef} 
        className={`w-full h-full rounded-lg ${showList ? 'hidden' : ''}`}
        style={{ minHeight: '400px' }}
      />

      {showList && (
        <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
          <h4 className="font-semibold mb-3">Restaurantes</h4>
          {restaurants.length > 0 ? (
            <div className="space-y-3">
              {restaurants.map((restaurant, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <h5 className="font-medium">{restaurant.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{restaurant.address}</p>
                  {restaurant.rating && (
                    <p className="text-sm text-yellow-600 mt-1">
                      ⭐ {restaurant.rating}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No hay restaurantes para mostrar</p>
          )}
        </div>
      )}

      {/* Debug info siempre visible en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <details className="absolute bottom-4 left-4 bg-white/90 p-2 rounded shadow-lg text-xs max-w-xs">
          <summary className="cursor-pointer">Debug ({debugInfo.length})</summary>
          <div className="max-h-32 overflow-y-auto mt-1">
            {debugInfo.slice(-10).map((info, index) => (
              <div key={index} className="mb-1">{info}</div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default GoogleMapNew;

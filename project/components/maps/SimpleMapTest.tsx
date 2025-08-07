'use client';

import { useEffect, useRef, useState } from 'react';

interface SimpleMapTestProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const SimpleMapTest: React.FC<SimpleMapTestProps> = ({
  center = { lat: 18.4861, lng: -69.9312 },
  zoom = 13,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Inicializando...');
  const [debug, setDebug] = useState<string[]>([]);

  const addDebug = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const debugMsg = `${timestamp}: ${msg}`;
    console.log(debugMsg);
    setDebug(prev => [...prev.slice(-10), debugMsg]); // Mantener solo los últimos 10
  };

  useEffect(() => {
    let isComponentMounted = true;
    
    const initializeMap = () => {
      addDebug('🚀 Iniciando inicialización del mapa');
      
      if (!mapRef.current) {
        addDebug('❌ Ref del mapa no disponible');
        return;
      }
      
      if (!isComponentMounted) {
        addDebug('⚠️ Componente desmontado, cancelando');
        return;
      }
      
      const googleMaps = (window as any).google?.maps;
      if (!googleMaps) {
        addDebug('❌ Google Maps API no disponible');
        setStatus('Error: Google Maps no cargado');
        return;
      }
      
      addDebug('✅ Google Maps API disponible');
      
      try {
        addDebug(`📍 Creando mapa en: ${center.lat}, ${center.lng}`);
        
        const map = new googleMaps.Map(mapRef.current, {
          center: center,
          zoom: zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });
        
        addDebug('✅ Mapa creado exitosamente');
        setStatus('Mapa cargado correctamente');
        
        // Agregar marcador de prueba
        const marker = new googleMaps.Marker({
          position: center,
          map: map,
          title: 'Ubicación de prueba'
        });
        
        addDebug('✅ Marcador agregado');
        
      } catch (error) {
        addDebug(`❌ Error creando mapa: ${error}`);
        setStatus(`Error: ${error}`);
      }
    };

    const loadGoogleMapsAPI = () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        addDebug('❌ API Key no encontrada');
        setStatus('Error: API Key no configurada');
        return;
      }
      
      addDebug(`🔑 API Key encontrada: ${apiKey.substring(0, 10)}...`);
      
      // Verificar si ya está cargado
      if ((window as any).google?.maps) {
        addDebug('✅ Google Maps ya está disponible');
        initializeMap();
        return;
      }
      
      // Limpiar scripts existentes
      const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      if (existingScripts.length > 0) {
        addDebug(`🗑️ Removiendo ${existingScripts.length} scripts existentes`);
        existingScripts.forEach(script => script.remove());
      }
      
      // Crear nuevo script
      addDebug('📥 Cargando script de Google Maps...');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      
      script.onload = () => {
        addDebug('📦 Script cargado - esperando disponibilidad...');
        
        // Esperar hasta que la API esté disponible
        let attempts = 0;
        const checkAvailability = () => {
          attempts++;
          if ((window as any).google?.maps) {
            addDebug(`✅ API disponible después de ${attempts} intentos`);
            if (isComponentMounted) {
              initializeMap();
            }
          } else if (attempts < 50) { // 5 segundos máximo
            setTimeout(checkAvailability, 100);
          } else {
            addDebug('⏰ Timeout esperando disponibilidad de la API');
            setStatus('Timeout: API no disponible');
          }
        };
        
        checkAvailability();
      };
      
      script.onerror = (err) => {
        addDebug(`❌ Error cargando script: ${err}`);
        setStatus('Error cargando script de Google Maps');
      };
      
      document.head.appendChild(script);
      setStatus('Cargando Google Maps...');
    };

    // Iniciar proceso
    addDebug('🎬 Iniciando carga de Google Maps');
    loadGoogleMapsAPI();
    
    // Cleanup
    return () => {
      addDebug('🧹 Limpiando componente');
      isComponentMounted = false;
    };
  }, [center.lat, center.lng, zoom]);

  return (
    <div className={`relative ${className}`}>
      {/* Estado del mapa */}
      <div className="absolute top-2 left-2 bg-white bg-opacity-90 px-3 py-1 rounded shadow z-10">
        <span className="text-sm font-medium">{status}</span>
      </div>
      
      {/* Contenedor del mapa */}
      <div 
        ref={mapRef} 
        className="w-full h-full bg-gray-200 rounded"
        style={{ minHeight: '300px' }}
      />
      
      {/* Panel de debug */}
      <details className="absolute bottom-2 left-2 bg-white bg-opacity-95 p-2 rounded shadow max-w-xs text-xs z-10">
        <summary className="cursor-pointer font-medium">
          Debug ({debug.length})
        </summary>
        <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
          {debug.map((msg, index) => (
            <div key={index} className="text-xs font-mono">
              {msg}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

export default SimpleMapTest;

'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TestGoogleApiPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [apiKey] = useState('AIzaSyDVbX4Ra_eV6AhtrHFKgqRiRYfRHGsmf_s');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(message);
  };

  const testApiKeyValidity = async () => {
    addLog('🔍 Probando validez de la API key...');
    
    try {
      // Test 1: Probar con Geocoding API (más simple)
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=Santo+Domingo&key=${apiKey}`;
      addLog(`📡 Probando Geocoding API: ${geocodeUrl.substring(0, 80)}...`);
      
      const response = await fetch(`/api/test-google-api?url=${encodeURIComponent(geocodeUrl)}`);
      const result = await response.json();
      
      if (result.success) {
        addLog('✅ API key es válida - Geocoding funcionó');
      } else {
        addLog(`❌ Error en Geocoding: ${result.error}`);
      }
    } catch (error) {
      addLog(`❌ Error de red: ${error}`);
    }
  };

  const testJavaScriptApi = () => {
    addLog('🔍 Probando carga de JavaScript API...');
    
    // Limpiar scripts existentes
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    existingScripts.forEach(script => {
      addLog(`🗑️ Removiendo script existente: ${script.src}`);
      script.remove();
    });
    
    const script = document.createElement('script');
    const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initTestMap`;
    script.src = scriptUrl;
    
    addLog(`📡 Cargando script: ${scriptUrl.substring(0, 80)}...`);
    
    // Definir callback global
    (window as any).initTestMap = () => {
      addLog('✅ JavaScript API cargada exitosamente');
      addLog(`📍 Google Maps disponible: ${!!(window as any).google?.maps}`);
      
      if ((window as any).google?.maps) {
        addLog('✅ Objeto google.maps está disponible');
        try {
          // Intentar crear un mapa simple
          const mapDiv = document.createElement('div');
          mapDiv.style.width = '100px';
          mapDiv.style.height = '100px';
          document.body.appendChild(mapDiv);
          
          const map = new (window as any).google.maps.Map(mapDiv, {
            center: { lat: 18.4861, lng: -69.9312 },
            zoom: 10
          });
          
          addLog('✅ Mapa de prueba creado exitosamente');
          document.body.removeChild(mapDiv);
        } catch (error) {
          addLog(`❌ Error creando mapa de prueba: ${error}`);
        }
      }
    };
    
    script.onload = () => {
      addLog('📥 Script onload disparado');
    };
    
    script.onerror = (error) => {
      addLog(`❌ Error cargando script: ${error}`);
    };
    
    setTimeout(() => {
      if (!(window as any).google?.maps) {
        addLog('⏰ Timeout: API no se cargó en 10 segundos');
      }
    }, 10000);
    
    document.head.appendChild(script);
  };

  const testNetworkConnectivity = async () => {
    addLog('🌐 Probando conectividad de red...');
    
    try {
      // Test básico de conectividad
      const response = await fetch('https://www.google.com', { 
        mode: 'no-cors',
        timeout: 5000 
      } as any);
      addLog('✅ Conectividad a Google.com OK');
    } catch (error) {
      addLog(`❌ Error de conectividad: ${error}`);
    }
    
    try {
      // Test específico de Maps API
      const mapsResponse = await fetch('https://maps.googleapis.com', { 
        mode: 'no-cors',
        timeout: 5000 
      } as any);
      addLog('✅ Conectividad a maps.googleapis.com OK');
    } catch (error) {
      addLog(`❌ Error conectando a Maps API: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Test de Google Maps API</h1>
      
      <div className="mb-6 space-y-2">
        <p><strong>API Key:</strong> {apiKey.substring(0, 10)}...{apiKey.substring(-5)}</p>
        <p><strong>Longitud:</strong> {apiKey.length} caracteres</p>
      </div>
      
      <div className="space-x-4 mb-6">
        <Button onClick={testApiKeyValidity}>
          Test API Key Validez
        </Button>
        <Button onClick={testJavaScriptApi}>
          Test JavaScript API
        </Button>
        <Button onClick={testNetworkConnectivity}>
          Test Conectividad
        </Button>
        <Button onClick={clearLogs} variant="outline">
          Limpiar Logs
        </Button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Logs de Diagnóstico:</h3>
        <div className="max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">Haz clic en un botón para comenzar las pruebas...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="font-mono text-sm mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Nota:</strong> Este test ayuda a diagnosticar problemas específicos con la API de Google Maps.</p>
        <p>Si todos los tests pasan, el problema podría ser específico del componente del mapa.</p>
      </div>
    </div>
  );
}

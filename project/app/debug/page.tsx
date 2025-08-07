'use client';

import { useState, useEffect } from 'react';
import GoogleMapNew from '@/components/maps/GoogleMapNew';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MapDebugPage() {
  const [apiKeyStatus, setApiKeyStatus] = useState<string>('Verificando...');
  const [googleApiStatus, setGoogleApiStatus] = useState<string>('Verificando...');
  const [networkStatus, setNetworkStatus] = useState<string>('Verificando...');

  useEffect(() => {
    // Verificar API key
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (apiKey) {
      setApiKeyStatus(`✅ Presente (${apiKey.substring(0, 10)}...)`);
    } else {
      setApiKeyStatus('❌ No encontrada');
    }

    // Verificar estado de Google API
    const checkGoogleApi = () => {
      if ((window as any).google?.maps) {
        setGoogleApiStatus('✅ Cargada y disponible');
      } else {
        setGoogleApiStatus('❌ No cargada');
      }
    };

    checkGoogleApi();
    const interval = setInterval(checkGoogleApi, 1000);

    // Verificar conectividad de red
    fetch('https://maps.googleapis.com/maps/api/js?key=test', { mode: 'no-cors' })
      .then(() => setNetworkStatus('✅ Conectado a Google'))
      .catch(() => setNetworkStatus('❌ Error de conectividad'));

    return () => clearInterval(interval);
  }, []);

  const testDirectLoad = () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const testUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    
    console.log('Testing direct load:', testUrl);
    
    const script = document.createElement('script');
    script.src = testUrl;
    script.onload = () => console.log('✅ Script loaded successfully');
    script.onerror = (err) => console.error('❌ Script failed to load:', err);
    document.head.appendChild(script);
  };

  const clearAllScripts = () => {
    const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    scripts.forEach(script => script.remove());
    console.log(`Removed ${scripts.length} Google Maps scripts`);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug del Mapa de Google</h1>
        
        {/* Diagnóstico del Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>API Key</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{apiKeyStatus}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Google API</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{googleApiStatus}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Red</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{networkStatus}</p>
            </CardContent>
          </Card>
        </div>

        {/* Controles de Prueba */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button onClick={testDirectLoad} variant="outline">
            Probar Carga Directa
          </Button>
          <Button onClick={clearAllScripts} variant="destructive">
            Limpiar Scripts y Recargar
          </Button>
          <Button onClick={() => window.location.reload()} variant="secondary">
            Recargar Página
          </Button>
        </div>

        {/* Mapa de Prueba */}
        <Card>
          <CardHeader>
            <CardTitle>Mapa de Prueba con Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <GoogleMapNew
                center={{ lat: 18.4861, lng: -69.9312 }}
                zoom={13}
                className="h-full"
                restaurants={[
                  {
                    id: '1',
                    name: 'Restaurante de Prueba',
                    address: 'Santo Domingo, RD',
                    lat: 18.4861,
                    lng: -69.9312,
                    rating: 4.5,
                  }
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Información del Navegador</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            <p><strong>Idioma:</strong> {navigator.language}</p>
            <p><strong>Online:</strong> {navigator.onLine ? '✅' : '❌'}</p>
            <p><strong>Cookie Habilitadas:</strong> {navigator.cookieEnabled ? '✅' : '❌'}</p>
            <p><strong>JavaScript:</strong> ✅ Habilitado</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

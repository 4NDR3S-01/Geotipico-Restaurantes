'use client';

import SimpleMapTest from '@/components/maps/SimpleMapTest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SimpleTestPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Prueba Simple del Mapa</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Google con Debug Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <SimpleMapTest
              center={{ lat: 18.4861, lng: -69.9312 }}
              zoom={13}
              className="h-full"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-sm text-gray-600 space-y-2">
        <p><strong>Instrucciones:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Observa el estado en la esquina superior izquierda del mapa</li>
          <li>Abre el panel de "Debug" en la esquina inferior izquierda</li>
          <li>Revisa la consola del navegador para más detalles</li>
          <li>Si el mapa se queda en "Cargando...", hay un problema con la API</li>
        </ul>
      </div>
    </div>
  );
}

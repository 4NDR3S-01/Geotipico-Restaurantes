'use client';

import { useEffect, useRef, useState } from 'react';
import { Restaurant } from '@/types';

interface GoogleMapProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onRestaurantClick?: (restaurant: Restaurant) => void;
}

export const GoogleMap = ({ restaurants, center, zoom = 14, onRestaurantClick }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null); // Usar 'any' para evitar el error de espacio de nombres 'google'
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const markersRef = useRef<any[]>([]);

  // Default center to Manta, Ecuador
  const defaultCenter = { lat: -0.9526, lng: -80.7320 };

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
      if (!mapRef.current) return;

      const mapCenter = center || userLocation || defaultCenter;
      const gmaps = (window as any).google.maps;
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

      // Add user location marker
      if (userLocation) {
        new gmaps.Marker({
          position: userLocation,
          map: googleMap,
          icon: {
            url: '/api/placeholder/32/32',
            scaledSize: new gmaps.Size(32, 32),
          },
          title: 'Tu ubicación',
        });
      }
    };

    if ((window as any).google && (window as any).google.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [center, zoom, userLocation]);

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
          url: '/api/placeholder/24/24',
          scaledSize: new gmaps.Size(24, 24),
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

  return (
    <div className="w-full h-full" role="region" aria-label="Mapa de restaurantes">
      <div ref={mapRef} className="w-full h-full rounded-lg" />
    </div>
  );
};
'use client';

import { GoogleMap } from './GoogleMap';
// import { SimpleMap } from './SimpleMap';
import { Restaurant } from '@/types';

interface MapWrapperProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onRestaurantClick?: (restaurant: Restaurant) => void;
}

export const MapWrapper = ({ restaurants, center, zoom, onRestaurantClick }: MapWrapperProps) => {
  const hasValidApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && 
                         process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.length > 30;

  if (hasValidApiKey) {
    return (
      <GoogleMap
        restaurants={restaurants}
        center={center}
        zoom={zoom}
        onRestaurantClick={onRestaurantClick}
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      />
    );
  }

  // return (
  //   <SimpleMap
  //     restaurants={restaurants}
  //     center={center}
  //     onRestaurantClick={onRestaurantClick}
  //   />
  // );
};

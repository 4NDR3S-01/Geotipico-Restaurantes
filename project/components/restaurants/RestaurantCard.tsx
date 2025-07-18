'use client';

import { Restaurant } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: () => void;
}

export const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  const { t } = useLanguage();

  const getPriceLevel = (level?: number) => {
    if (!level) return '';
    return '$'.repeat(level);
  };

  const getStatusColor = (isOpen?: boolean) => {
    if (isOpen === undefined) return 'gray';
    return isOpen ? 'green' : 'red';
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 h-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Restaurante ${restaurant.name}, ${restaurant.address}${restaurant.rating ? `, calificación ${restaurant.rating} estrellas` : ''}${restaurant.distance ? `, a ${restaurant.distance.toFixed(1)} km de distancia` : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {restaurant.name}
          </CardTitle>
          {restaurant.rating && (
            <div className="flex items-center space-x-1" aria-label={`${restaurant.rating} estrellas`}>
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{restaurant.rating}</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span className="line-clamp-1">{restaurant.address}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Distance */}
        {restaurant.distance && (
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true"></div>
            <span>{restaurant.distance.toFixed(1)} km {t('restaurant.distance')}</span>
          </div>
        )}

        {/* Price Level */}
        {restaurant.price_level && (
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" aria-hidden="true" />
            <span className="font-medium">{getPriceLevel(restaurant.price_level)}</span>
          </div>
        )}

        {/* Opening Hours */}
        {restaurant.opening_hours && (
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <Badge 
              variant="outline" 
              className={`text-xs ${
                restaurant.opening_hours.open_now 
                  ? 'text-green-700 border-green-300 bg-green-50' 
                  : 'text-red-700 border-red-300 bg-red-50'
              }`}
              aria-label={restaurant.opening_hours.open_now ? 'Abierto ahora' : 'Cerrado ahora'}
            >
              {restaurant.opening_hours.open_now ? t('restaurant.open') : t('restaurant.closed')}
            </Badge>
          </div>
        )}

        {/* Restaurant Types */}
        {restaurant.types && restaurant.types.length > 0 && (
          <div className="flex flex-wrap gap-1" role="list" aria-label="Tipos de cocina">
            {restaurant.types.slice(0, 3).map((type) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type.replace(/_/g, ' ')}
              </Badge>
            ))}
            {restaurant.types.length > 3 && (
              <Badge variant="outline" className="text-xs" aria-label={`${restaurant.types.length - 3} tipos más`}>
                +{restaurant.types.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
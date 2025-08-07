'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Star, 
  Phone, 
  Clock, 
  Navigation, 
  ExternalLink,
  Share2,
  Heart,
  DollarSign
} from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  price_level?: number;
  types?: string[];
  photos?: string[];
  phone?: string;
  website?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
}

interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onClose?: () => void;
  userLocation?: { lat: number; lng: number };
}

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  restaurant,
  onClose,
  userLocation
}) => {
  const { t } = useLanguage();
  const [isFavorite, setIsFavorite] = useState(false);

  const getPriceLevelDisplay = (priceLevel?: number) => {
    if (!priceLevel) return null;
    return '$'.repeat(priceLevel);
  };

  const getDirectionsUrl = () => {
    if (userLocation) {
      return `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${restaurant.lat},${restaurant.lng}`;
    }
    return `https://www.google.com/maps/place/${restaurant.lat},${restaurant.lng}`;
  };

  const getGoogleMapsUrl = () => {
    return `https://www.google.com/maps/place/${restaurant.name}/@${restaurant.lat},${restaurant.lng},17z`;
  };

  const shareRestaurant = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: `¡Mira este restaurante que encontré! ${restaurant.name} - ${restaurant.address}`,
          url: getGoogleMapsUrl()
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(`${restaurant.name} - ${restaurant.address} - ${getGoogleMapsUrl()}`);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold mb-2">{restaurant.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.address}</span>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              {restaurant.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{restaurant.rating}</span>
                  <span className="text-gray-500">/5</span>
                </div>
              )}
              
              {restaurant.price_level && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">
                    {getPriceLevelDisplay(restaurant.price_level)}
                  </span>
                </div>
              )}
              
              {restaurant.opening_hours?.open_now !== undefined && (
                <Badge variant={restaurant.opening_hours.open_now ? "default" : "secondary"}>
                  <Clock className="w-3 h-3 mr-1" />
                  {restaurant.opening_hours.open_now ? t('restaurant.open') : t('restaurant.closed')}
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFavorite(!isFavorite)}
              className={isFavorite ? 'text-red-500' : ''}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="outline" size="sm" onClick={shareRestaurant}>
              <Share2 className="w-4 h-4" />
            </Button>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tipos de cocina */}
        {restaurant.types && restaurant.types.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">{t('restaurant.cuisine')}</h4>
            <div className="flex flex-wrap gap-1">
              {restaurant.types.slice(0, 4).map((type, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {type.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Información de contacto */}
        <div className="space-y-3">
          <h4 className="font-medium">{t('restaurant.contact')}</h4>
          
          {restaurant.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <a 
                href={`tel:${restaurant.phone}`}
                className="text-blue-600 hover:underline"
              >
                {restaurant.phone}
              </a>
            </div>
          )}
          
          {restaurant.website && (
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <a 
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {t('restaurant.website')}
              </a>
            </div>
          )}
        </div>

        <Separator />

        {/* Horarios */}
        {restaurant.opening_hours?.weekday_text && (
          <div>
            <h4 className="font-medium mb-2">{t('restaurant.hours')}</h4>
            <div className="space-y-1 text-sm">
              {restaurant.opening_hours.weekday_text.slice(0, 3).map((hours, index) => (
                <div key={index} className="text-gray-600">
                  {hours}
                </div>
              ))}
              {restaurant.opening_hours.weekday_text.length > 3 && (
                <details className="text-gray-600">
                  <summary className="cursor-pointer text-blue-600">
                    {t('restaurant.seeAllHours')}
                  </summary>
                  <div className="mt-1 space-y-1">
                    {restaurant.opening_hours.weekday_text.slice(3).map((hours, index) => (
                      <div key={index + 3}>
                        {hours}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        )}

        <Separator />

        {/* Botones de acción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button 
            onClick={() => window.open(getDirectionsUrl(), '_blank')}
            className="w-full"
          >
            <Navigation className="w-4 h-4 mr-2" />
            {t('restaurant.getDirections')}
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => window.open(getGoogleMapsUrl(), '_blank')}
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            {t('restaurant.viewOnMaps')}
          </Button>
        </div>

        {/* Reseñas */}
        {restaurant.reviews && restaurant.reviews.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-medium mb-3">{t('restaurant.reviews')}</h4>
              <div className="space-y-3">
                {restaurant.reviews.slice(0, 2).map((review, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{review.author_name}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {review.text}
                    </p>
                  </div>
                ))}
                {restaurant.reviews.length > 2 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(getGoogleMapsUrl(), '_blank')}
                  >
                    {t('restaurant.seeAllReviews')} ({restaurant.reviews.length})
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantDetails;

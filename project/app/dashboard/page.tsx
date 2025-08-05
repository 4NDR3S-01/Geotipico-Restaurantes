'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Restaurant } from '@/types';
import GoogleMapFallback from '@/components/maps/GoogleMapFallback';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
import RestaurantDetails from '@/components/restaurants/RestaurantDetails';
import { SearchBar } from '@/components/search/SearchBar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, List, Filter, Loader2, User } from 'lucide-react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const router = useRouter();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchRestaurants();
    }
  }, [userLocation]);

  useEffect(() => {
    filterRestaurants();
  }, [restaurants, searchQuery, activeFilters]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newLocation);
          
          // Solo mostrar notificación de éxito si no es la ubicación por defecto
          if (Math.abs(newLocation.lat - (-0.9526)) > 0.01) {
            addNotification({
              title: t('dashboard.location.success.title'),
              message: t('dashboard.location.success.message'),
              type: 'success',
              read: false,
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Manta center if geolocation fails
          const defaultLocation = { lat: -0.9526, lng: -80.7320 };
          setUserLocation(defaultLocation);
          addNotification({
            title: t('dashboard.location.unavailable.title'),
            message: t('dashboard.location.unavailable.message'),
            type: 'warning',
            read: false,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos de cache
        }
      );
    } else {
      const defaultLocation = { lat: -0.9526, lng: -80.7320 };
      setUserLocation(defaultLocation);
      addNotification({
        title: t('dashboard.location.unsupported.title'),
        message: t('dashboard.location.unsupported.message'),
        type: 'error',
        read: false,
      });
    }
  };

  const fetchRestaurants = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
      // Datos de muestra con información completa para demostrar el componente
      const sampleRestaurants: Restaurant[] = [
        {
          id: '1',
          name: 'El Pescador de Manta',
          address: 'Malecón de Manta, Av. Flavio Reyes, Manta, Ecuador',
          lat: userLocation.lat + 0.01,
          lng: userLocation.lng + 0.01,
          rating: 4.5,
          price_level: 3,
          types: ['restaurant', 'seafood', 'ecuadorian_cuisine'],
          photos: [],
          phone: '+593 5 262-1234',
          website: 'https://elpescadordemanta.com',
          opening_hours: {
            open_now: true,
            weekday_text: [
              'Lunes: 11:00 AM - 10:00 PM',
              'Martes: 11:00 AM - 10:00 PM',
              'Miércoles: 11:00 AM - 10:00 PM',
              'Jueves: 11:00 AM - 10:00 PM',
              'Viernes: 11:00 AM - 11:00 PM',
              'Sábado: 11:00 AM - 11:00 PM',
              'Domingo: 11:00 AM - 9:00 PM'
            ]
          },
          reviews: [
            {
              author_name: 'Carlos M.',
              rating: 5,
              text: 'Excelente restaurant! Los mariscos son fresquísimos y el ambiente es muy acogedor.',
              time: Date.now() - 86400000
            },
            {
              author_name: 'María S.',
              rating: 4,
              text: 'La parrillada de mariscos es espectacular. Recomendado 100%.',
              time: Date.now() - 172800000
            }
          ]
        },
        {
          id: '2',
          name: 'Mariscos Doña Rosa',
          address: 'Av. 4 de Noviembre y Calle 15, Manta, Ecuador',
          lat: userLocation.lat - 0.005,
          lng: userLocation.lng + 0.008,
          rating: 4.3,
          price_level: 2,
          types: ['restaurant', 'seafood', 'local_cuisine'],
          photos: [],
          phone: '+593 5 262-5678',
          opening_hours: {
            open_now: false,
            weekday_text: [
              'Lunes: 10:00 AM - 9:00 PM',
              'Martes: 10:00 AM - 9:00 PM',
              'Miércoles: 10:00 AM - 9:00 PM',
              'Jueves: 10:00 AM - 9:00 PM',
              'Viernes: 10:00 AM - 10:00 PM',
              'Sábado: 10:00 AM - 10:00 PM',
              'Domingo: Cerrado'
            ]
          },
          reviews: [
            {
              author_name: 'Luis P.',
              rating: 4,
              text: 'Muy buena comida casera y precios justos. El ceviche es excelente.',
              time: Date.now() - 259200000
            }
          ]
        },
        {
          id: '3',
          name: 'Restaurant El Faro',
          address: 'Puerto de Manta, Terminal Pesquero, Manta, Ecuador',
          lat: userLocation.lat + 0.008,
          lng: userLocation.lng - 0.012,
          rating: 4.7,
          price_level: 4,
          types: ['restaurant', 'seafood', 'fine_dining', 'romantic'],
          photos: [],
          phone: '+593 5 262-9999',
          website: 'https://elfaromanta.ec',
          opening_hours: {
            open_now: true,
            weekday_text: [
              'Lunes: 12:00 PM - 11:00 PM',
              'Martes: 12:00 PM - 11:00 PM',
              'Miércoles: 12:00 PM - 11:00 PM',
              'Jueves: 12:00 PM - 11:00 PM',
              'Viernes: 12:00 PM - 12:00 AM',
              'Sábado: 12:00 PM - 12:00 AM',
              'Domingo: 12:00 PM - 10:00 PM'
            ]
          },
          reviews: [
            {
              author_name: 'Ana T.',
              rating: 5,
              text: 'Una experiencia gastronómica increíble. La vista al mar es espectacular.',
              time: Date.now() - 86400000
            },
            {
              author_name: 'Roberto L.',
              rating: 5,
              text: 'El mejor restaurant de Manta sin duda. Calidad y servicio excepcionales.',
              time: Date.now() - 172800000
            },
            {
              author_name: 'Patricia R.',
              rating: 4,
              text: 'Muy elegante y la comida deliciosa, aunque un poco costoso.',
              time: Date.now() - 345600000
            }
          ]
        },
        {
          id: '4',
          name: 'Bar La Terraza',
          address: 'Calle 13 y Av. 2, Manta, Ecuador',
          lat: userLocation.lat - 0.008,
          lng: userLocation.lng - 0.005,
          rating: 4.2,
          price_level: 2,
          types: ['bar', 'night_club', 'drinks'],
          photos: [],
          phone: '+593 5 262-3456',
          opening_hours: {
            open_now: true,
            weekday_text: [
              'Lunes: 6:00 PM - 2:00 AM',
              'Martes: 6:00 PM - 2:00 AM',
              'Miércoles: 6:00 PM - 2:00 AM',
              'Jueves: 6:00 PM - 3:00 AM',
              'Viernes: 6:00 PM - 4:00 AM',
              'Sábado: 6:00 PM - 4:00 AM',
              'Domingo: 6:00 PM - 12:00 AM'
            ]
          },
          reviews: [
            {
              author_name: 'Diego R.',
              rating: 4,
              text: 'Excelente ambiente, buena música y cocteles deliciosos.',
              time: Date.now() - 86400000
            }
          ]
        },
        {
          id: '5',
          name: 'Café Central',
          address: 'Av. 4 de Noviembre y Calle 12, Manta, Ecuador',
          lat: userLocation.lat + 0.003,
          lng: userLocation.lng + 0.004,
          rating: 4.4,
          price_level: 1,
          types: ['cafe', 'bakery', 'breakfast'],
          photos: [],
          phone: '+593 5 262-7890',
          website: 'https://cafecentral.ec',
          opening_hours: {
            open_now: true,
            weekday_text: [
              'Lunes: 6:00 AM - 8:00 PM',
              'Martes: 6:00 AM - 8:00 PM',
              'Miércoles: 6:00 AM - 8:00 PM',
              'Jueves: 6:00 AM - 8:00 PM',
              'Viernes: 6:00 AM - 9:00 PM',
              'Sábado: 7:00 AM - 9:00 PM',
              'Domingo: 7:00 AM - 7:00 PM'
            ]
          },
          reviews: [
            {
              author_name: 'Carmen L.',
              rating: 5,
              text: 'El mejor café de Manta! Los pasteles son deliciosos y el ambiente muy acogedor.',
              time: Date.now() - 172800000
            },
            {
              author_name: 'José M.',
              rating: 4,
              text: 'Perfecto para desayunos. El café es de excelente calidad.',
              time: Date.now() - 259200000
            }
          ]
        },
        {
          id: '6',
          name: 'Discoteca Oceano',
          address: 'Malecón Escénico, Manta, Ecuador',
          lat: userLocation.lat + 0.015,
          lng: userLocation.lng + 0.002,
          rating: 4.0,
          price_level: 3,
          types: ['night_club', 'bar', 'dancing'],
          photos: [],
          phone: '+593 5 262-4567',
          opening_hours: {
            open_now: false,
            weekday_text: [
              'Lunes: Cerrado',
              'Martes: Cerrado',
              'Miércoles: Cerrado',
              'Jueves: 9:00 PM - 4:00 AM',
              'Viernes: 9:00 PM - 5:00 AM',
              'Sábado: 9:00 PM - 5:00 AM',
              'Domingo: Cerrado'
            ]
          },
          reviews: [
            {
              author_name: 'Andrea V.',
              rating: 4,
              text: 'Buena música electrónica y ambiente. Los fines de semana está muy animado.',
              time: Date.now() - 345600000
            }
          ]
        },
        {
          id: '7',
          name: 'Pizzería Mamma Mía',
          address: 'Av. 105 y Calle 104, Manta, Ecuador',
          lat: userLocation.lat - 0.012,
          lng: userLocation.lng + 0.015,
          rating: 4.3,
          price_level: 2,
          types: ['restaurant', 'pizza', 'italian_cuisine'],
          photos: [],
          phone: '+593 5 262-8901',
          opening_hours: {
            open_now: true,
            weekday_text: [
              'Lunes: 5:00 PM - 11:00 PM',
              'Martes: 5:00 PM - 11:00 PM',
              'Miércoles: 5:00 PM - 11:00 PM',
              'Jueves: 5:00 PM - 11:00 PM',
              'Viernes: 5:00 PM - 12:00 AM',
              'Sábado: 12:00 PM - 12:00 AM',
              'Domingo: 12:00 PM - 10:00 PM'
            ]
          },
          reviews: [
            {
              author_name: 'Marco P.',
              rating: 4,
              text: 'Las pizzas están muy buenas, masa delgada y ingredientes frescos.',
              time: Date.now() - 172800000
            }
          ]
        },
        {
          id: '8',
          name: 'Karaoke Golden',
          address: 'Calle 15 y Av. 3, Manta, Ecuador',
          lat: userLocation.lat + 0.006,
          lng: userLocation.lng - 0.008,
          rating: 3.9,
          price_level: 2,
          types: ['bar', 'karaoke', 'entertainment'],
          photos: [],
          phone: '+593 5 262-6543',
          opening_hours: {
            open_now: true,
            weekday_text: [
              'Lunes: Cerrado',
              'Martes: 7:00 PM - 2:00 AM',
              'Miércoles: 7:00 PM - 2:00 AM',
              'Jueves: 7:00 PM - 3:00 AM',
              'Viernes: 7:00 PM - 4:00 AM',
              'Sábado: 7:00 PM - 4:00 AM',
              'Domingo: 7:00 PM - 1:00 AM'
            ]
          },
          reviews: [
            {
              author_name: 'Sofía T.',
              rating: 4,
              text: 'Muy divertido para ir con amigos. Buena selección de canciones.',
              time: Date.now() - 259200000
            }
          ]
        }
      ];

      const restaurantsWithDistance = sampleRestaurants.map((restaurant: Restaurant) => ({
        ...restaurant,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          restaurant.lat,
          restaurant.lng
        ),
      }));

      // Ordenar por distancia
      restaurantsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      setRestaurants(restaurantsWithDistance);
      
      addNotification({
        title: t('dashboard.restaurants.loaded.title'),
        message: t('dashboard.restaurants.loaded.message'),
        type: 'success',
        read: false,
      });

      /* API call original - comentado para usar datos de muestra
      const response = await fetch(
        `/api/restaurants?lat=${userLocation.lat}&lng=${userLocation.lng}&radius=5000`
      );
      const data = await response.json();
      
      if (data.restaurants) {
        // Calculate distances
        const restaurantsWithDistance = data.restaurants.map((restaurant: Restaurant) => ({
          ...restaurant,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            restaurant.lat,
            restaurant.lng
          ),
        }));

        // Ordenar por distancia (tipado explícito)
        restaurantsWithDistance.sort((a: Restaurant, b: Restaurant) => (a.distance || 0) - (b.distance || 0));
        
        setRestaurants(restaurantsWithDistance);
        
        addNotification({
          title: t('dashboard.restaurants.loaded.title'),
          message: t('dashboard.restaurants.loaded.message'),
          type: 'success',
          read: false,
        });
      }
      */
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      addNotification({
        title: t('dashboard.restaurants.error.title'),
        message: t('dashboard.restaurants.error.message'),
        type: 'error',
        read: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filterRestaurants = () => {
    let filtered = restaurants;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.types.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Type filters
    if (activeFilters.length > 0) {
      filtered = filtered.filter(restaurant =>
        activeFilters.some(filter =>
          restaurant.types.some(type => type.toLowerCase().includes(filter.toLowerCase()))
        )
      );
    }

    setFilteredRestaurants(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label={t('dashboard.loading.aria')}>
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">{t('dashboard.loading')}</span>
      </div>
    );
  }

  // Obtener la API key de Google Maps solo en build/SSR
  // const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Ya no se usa con GoogleMapFallback

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        <div className="sr-only">
          <h1>{t('dashboard.sr.title')}</h1>
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {`${t('dashboard.welcome')} ${user.name || user.email}!`}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            placeholder={t('search.placeholder')}
          />
        </div>
        <Tabs defaultValue="map" className="w-full" aria-label={t('dashboard.tabs.aria')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map" className="flex items-center space-x-2" aria-label={t('dashboard.tabs.map.aria')}>
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>{t('dashboard.tabs.map')}</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center space-x-2" aria-label={t('dashboard.tabs.list.aria')}>
              <List className="h-4 w-4" aria-hidden="true" />
              <span>{t('dashboard.tabs.list')}</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="map" className="mt-6" role="tabpanel" aria-label="Panel de mapa">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardContent className="p-4 h-full" role="application" aria-label="Mapa interactivo de restaurantes">
                    {userLocation ? (
                      <GoogleMapFallback
                        restaurants={filteredRestaurants}
                        center={userLocation}
                        className="h-full"
                        showViewToggle={true}
                        onRestaurantClick={handleRestaurantClick}
                        selectedRestaurant={selectedRestaurant || undefined}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full" role="status" aria-label="Cargando mapa">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2 sr-only">{t('map.loading')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              <aside className="space-y-4" aria-label="Panel lateral de información">
                {selectedRestaurant && (
                  <RestaurantDetails 
                    restaurant={selectedRestaurant} 
                    userLocation={userLocation || undefined}
                    onClose={() => setSelectedRestaurant(null)}
                  />
                )}

                <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between" id="nearby-restaurants">
                        {t('dashboard.nearby.title')}
                        <Badge variant="secondary" aria-label={t('dashboard.nearby.count')}>
                          {filteredRestaurants.length}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                  <CardContent aria-labelledby="nearby-restaurants">
                    <ScrollArea className="h-[400px]" role="region" aria-label="Lista de restaurantes cercanos">
                          {loading ? (
                            <div className="flex items-center justify-center py-8" role="status" aria-label={t('dashboard.loading.restaurants.aria')}>
                              <Loader2 className="h-6 w-6 animate-spin" />
                              <span className="sr-only">{t('dashboard.loading.restaurants')}</span>
                            </div>
                          ) : (
                            <div className="space-y-3" role="list">
                              {filteredRestaurants.slice(0, 5).map((restaurant) => (
                                <button
                                  key={restaurant.id}
                                  type="button"
                                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full text-left"
                                  onClick={() => handleRestaurantClick(restaurant)}
                                  aria-label={t('dashboard.select.restaurant')}
                                  role="listitem"
                                >
                                  <h4 className="font-medium" id={`restaurant-${restaurant.id}`}>{restaurant.name}</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {restaurant.distance?.toFixed(1)} km {t('restaurant.distance')}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </TabsContent>
          <TabsContent value="list" className="mt-6" role="tabpanel" aria-label="Panel de lista">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="region" aria-label="Lista completa de restaurantes">
              {loading ? (
                <div className="col-span-full flex items-center justify-center py-12" role="status" aria-label="Cargando restaurantes">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2 sr-only">Cargando restaurantes...</span>
                </div>
              ) : filteredRestaurants.length === 0 ? (
                <div className="col-span-full text-center py-12" role="status">
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('dashboard.noresults')}
                  </p>
                </div>
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id}
                    restaurant={restaurant}
                    onClick={() => handleRestaurantClick(restaurant)}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
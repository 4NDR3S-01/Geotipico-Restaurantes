'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Restaurant } from '@/types';
import { GoogleMap } from '@/components/maps/GoogleMap';
import { RestaurantCard } from '@/components/restaurants/RestaurantCard';
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
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Manta center if geolocation fails
          setUserLocation({ lat: -0.9526, lng: -80.7320 });
          addNotification({
            title: 'Ubicación no disponible',
            message: 'Se utilizará la ubicación predeterminada de Manta',
            type: 'warning',
            read: false,
          });
        }
      );
    } else {
      setUserLocation({ lat: -0.9526, lng: -80.7320 });
      addNotification({
        title: 'Geolocalización no soportada',
        message: 'Tu navegador no soporta geolocalización',
        type: 'error',
        read: false,
      });
    }
  };

  const fetchRestaurants = async () => {
    if (!userLocation) return;

    setLoading(true);
    try {
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
          title: 'Restaurantes cargados',
          message: `Se encontraron ${restaurantsWithDistance.length} restaurantes cerca de ti`,
          type: 'success',
          read: false,
        });
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      addNotification({
        title: 'Error al cargar restaurantes',
        message: 'No se pudieron cargar los restaurantes. Intenta nuevamente.',
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
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Cargando">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="sr-only">Cargando dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        <div className="sr-only">
          <h1>Dashboard de Restaurantes</h1>
        </div>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido, {user.name}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Descubre restaurantes increíbles cerca de ti
          </p>
        </div>

        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            placeholder={t('search.placeholder')}
          />
        </div>

        <Tabs defaultValue="map" className="w-full" aria-label="Vista de restaurantes">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map" className="flex items-center space-x-2" aria-label="Vista de mapa">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center space-x-2" aria-label="Vista de lista">
              <List className="h-4 w-4" aria-hidden="true" />
              <span>Lista</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-6" role="tabpanel" aria-label="Panel de mapa">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardContent className="p-4 h-full" role="application" aria-label="Mapa interactivo de restaurantes">
                    {userLocation ? (
                      <GoogleMap
                        restaurants={filteredRestaurants}
                        center={userLocation}
                        onRestaurantClick={handleRestaurantClick}
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg" id="selected-restaurant">Restaurante Seleccionado</CardTitle>
                    </CardHeader>
                    <CardContent aria-labelledby="selected-restaurant">
                      <RestaurantCard restaurant={selectedRestaurant} />
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between" id="nearby-restaurants">
                      Restaurantes Cerca
                      <Badge variant="secondary" aria-label={`${filteredRestaurants.length} restaurantes encontrados`}>
                        {filteredRestaurants.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent aria-labelledby="nearby-restaurants">
                    <ScrollArea className="h-[400px]" role="region" aria-label="Lista de restaurantes cercanos">
                      {loading ? (
                        <div className="flex items-center justify-center py-8" role="status" aria-label="Cargando restaurantes">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span className="sr-only">Cargando restaurantes...</span>
                        </div>
                      ) : (
                        <div className="space-y-3" role="list">
                          {filteredRestaurants.slice(0, 5).map((restaurant) => (
                            <div
                              key={restaurant.id}
                              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              onClick={() => handleRestaurantClick(restaurant)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleRestaurantClick(restaurant);
                                }
                              }}
                              tabIndex={0}
                              role="listitem button"
                              aria-label={`Seleccionar ${restaurant.name}`}
                            >
                              <h4 className="font-medium" id={`restaurant-${restaurant.id}`}>{restaurant.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {restaurant.distance?.toFixed(1)} km {t('restaurant.distance')}
                              </p>
                            </div>
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
                    No se encontraron restaurantes con los filtros seleccionados
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
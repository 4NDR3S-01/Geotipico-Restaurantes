import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MapView from '../components/MapView';
import FilterPanel from '../components/FilterPanel';
import { restaurantService } from '../services/api';
import '../styles/MapComponent.css';

export default function Mapa() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    specialty: searchParams.get('specialty') || '',
    priceRange: searchParams.get('priceRange') || '',
    rating: parseFloat(searchParams.get('rating') || 0),
  });

  // Cargar especialidades cuando se monta el componente
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const data = await restaurantService.getSpecialties();
        setSpecialties(data);
      } catch (err) {
        console.error("Error al cargar especialidades:", err);
      }
    };

    const loadStats = async () => {
      try {
        const statsData = await restaurantService.getStats();
        setStats(statsData);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
      }
    };

    loadSpecialties();
    loadStats();
  }, []);

  // Sincronizar cambios en filtros con la URL
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (filters.search) newParams.set('search', filters.search);
    if (filters.specialty) newParams.set('specialty', filters.specialty);
    if (filters.priceRange) newParams.set('priceRange', filters.priceRange);
    if (filters.rating > 0) newParams.set('rating', filters.rating.toString());
    setSearchParams(newParams);
  }, [filters, setSearchParams]);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const apiFilters = {
        search: filters.search || undefined,
        specialty: filters.specialty || undefined,
        priceRange: filters.priceRange || undefined,
        rating: filters.rating > 0 ? filters.rating : undefined,
        sort: '-rating'
      };
      const result = await restaurantService.getAll(apiFilters);
      setRestaurants(result.restaurants || []);
      setError(null);
    } catch (err) {
      console.error("Error al cargar restaurantes:", err);
      setError('Error al cargar restaurantes. Por favor intente nuevamente.');
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Cargar restaurantes cuando cambian los filtros
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  // Función para manejar cambios en los filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    // Al cambiar un filtro, deseleccionamos cualquier restaurante seleccionado
    if (selectedRestaurant) {
      setSelectedRestaurant(null);
    }
  };

  // Función para resetear todos los filtros
  const handleResetFilters = () => {
    setFilters({
      search: '',
      specialty: '',
      priceRange: '',
      rating: 0
    });
    setSelectedRestaurant(null);
    setSearchParams({});
  };

  return (
    <div className="container map-page">
      <div className="map-header">
        <h1>Restaurantes de Manta</h1>
        <p>Explora la gastronomía costera ecuatoriana</p>
        
        {stats && stats.priceDistribution && (
          <div className="stats-banner">
            <div className="stat-item">
              <span className="stat-value">{stats.totalRestaurants || 0}</span>
              <span className="stat-label">Restaurantes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.averageRating || 0}★</span>
              <span className="stat-label">Calificación media</span>
            </div>
            <div className="stat-item price-distribution">
              <span className="price-stat">
                <span className="price-label">$</span>
                <span className="price-count">{stats.priceDistribution['$'] || 0}</span>
              </span>
              <span className="price-stat">
                <span className="price-label">$$</span>
                <span className="price-count">{stats.priceDistribution['$$'] || 0}</span>
              </span>
              <span className="price-stat">
                <span className="price-label">$$$</span>
                <span className="price-count">{stats.priceDistribution['$$$'] || 0}</span>
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="map-content">
        <FilterPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          specialties={specialties}
          selectedRestaurant={selectedRestaurant}
          restaurants={restaurants}
          onSelectRestaurant={setSelectedRestaurant}
          isLoading={loading}
        />
        
        <div className="main-content">
          {loading && <div className="loading-overlay"><div className="loader"></div></div>}
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={fetchRestaurants}>Reintentar</button>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {restaurants.length === 0 ? (
                <div className="no-results">
                  <h3>No se encontraron restaurantes</h3>
                  <p>Intenta cambiar los filtros de búsqueda</p>
                  <button onClick={handleResetFilters}>Limpiar filtros</button>
                </div>
              ) : (
                <MapView 
                  restaurants={restaurants}
                  selectedRestaurant={selectedRestaurant}
                  onSelectRestaurant={setSelectedRestaurant}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
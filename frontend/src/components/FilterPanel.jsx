import React from 'react';
import PropTypes from 'prop-types';
import '../styles/FilterPanel.css';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onResetFilters, 
  specialties,
  selectedRestaurant,
  restaurants,
  onSelectRestaurant,
  isLoading,
  activeFiltersCount
}) => {
  // Establecer icono según el tipo de filtro activo
  const renderFilterIcon = (type) => {
    switch(type) {
      case 'specialty': return '🍽️';
      case 'price': return '💰';
      case 'rating': return '⭐';
      default: return '🔍';
    }
  };
  
  // Renderizar mensaje cuando no hay resultados
  const renderNoResults = () => (
    <div className="no-results">
      <div className="no-results-icon">🔍</div>
      <p>No se encontraron restaurantes con estos filtros.</p>
      <button 
        onClick={onResetFilters} 
        className="reset-filters-btn"
        style={{ margin: '0 auto' }}
      >
        Limpiar filtros
      </button>
    </div>
  );

  return (
    <div className="filter-panel">
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      
      <div className="filter-header">
        <h3>
          <span>Filtros</span>
          {activeFiltersCount > 0 && <span className="active-filters-badge">{activeFiltersCount}</span>}
        </h3>
        {activeFiltersCount > 0 && (
          <button 
            className="reset-filters-btn" 
            onClick={onResetFilters}
            aria-label="Limpiar filtros"
          >
            <span>Limpiar</span> <span>✕</span>
          </button>
        )}
      </div>
      
      {/* Buscador */}
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Buscar restaurantes..."
          className="search-input"
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      {/* Filtro de especialidad */}
      <div className="filter-group">
        <label htmlFor="specialty">
          <span className="filter-icon">{renderFilterIcon('specialty')}</span>
          Especialidad:
        </label>
        <select 
          name="specialty" 
          id="specialty" 
          value={filters.specialty || ''}
          onChange={(e) => onFilterChange('specialty', e.target.value)}
          disabled={isLoading}
        >
          <option value="">Todas las especialidades</option>
          {specialties.map((specialty) => (
            <option key={specialty} value={specialty}>{specialty}</option>
          ))}
        </select>
      </div>
      
      {/* Filtro de precio */}
      <div className="filter-group">
        <label id="price-range-label">
          <span className="filter-icon">{renderFilterIcon('price')}</span>
          Precio:
        </label>
        <div 
          className="price-filter-buttons" 
          aria-labelledby="price-range-label"
          role="radiogroup"
        >
          <button 
            className={`price-button ${filters.priceRange === '$' ? 'active' : ''}`}
            onClick={() => onFilterChange('priceRange', filters.priceRange === '$' ? '' : '$')}
            disabled={isLoading}
            role="radio"
            aria-checked={filters.priceRange === '$'}
          >
            $
            <span className="tooltip">Económico</span>
          </button>
          <button 
            className={`price-button ${filters.priceRange === '$$' ? 'active' : ''}`}
            onClick={() => onFilterChange('priceRange', filters.priceRange === '$$' ? '' : '$$')}
            disabled={isLoading}
            role="radio"
            aria-checked={filters.priceRange === '$$'}
          >
            $$
            <span className="tooltip">Moderado</span>
          </button>
          <button 
            className={`price-button ${filters.priceRange === '$$$' ? 'active' : ''}`}
            onClick={() => onFilterChange('priceRange', filters.priceRange === '$$$' ? '' : '$$$')}
            disabled={isLoading}
            role="radio"
            aria-checked={filters.priceRange === '$$$'}
          >
            $$$
            <span className="tooltip">Costoso</span>
          </button>
        </div>
      </div>
      
      {/* Filtro de valoración */}
      <div className="filter-group">
        <label htmlFor="rating-slider">
          <span className="filter-icon">{renderFilterIcon('rating')}</span>
          Valoración mínima:
        </label>
        <div className="rating-slider-container">
          <input 
            type="range" 
            id="rating-slider"
            min="0" 
            max="5" 
            step="0.5" 
            value={filters.rating || 0}
            onChange={(e) => onFilterChange('rating', parseFloat(e.target.value))}
            disabled={isLoading}
            className="rating-slider"
            aria-valuemin="0"
            aria-valuemax="5"
            aria-valuenow={filters.rating || 0}
          />
          <div className="rating-value">
            {filters.rating > 0 ? (
              <span>{filters.rating}+ <span className="star-icon">★</span></span>
            ) : (
              <span>Todas</span>
            )}
          </div>
        </div>
      </div>
      
      {/* Lista de restaurantes */}
      <div className="restaurants-list">
        <h3>
          <span>Resultados</span> 
          <span className="count-badge">{restaurants.length}</span>
        </h3>
        
        {restaurants.length > 0 ? (
          restaurants.slice(0, 10).map((restaurant) => (
            <button
              key={restaurant.id}
              className={`restaurant-item ${selectedRestaurant?.id === restaurant.id ? 'selected' : ''}`}
              onClick={() => onSelectRestaurant(restaurant)}
              aria-pressed={selectedRestaurant?.id === restaurant.id}
              aria-label={`Ver ${restaurant.name}`}
            >
              <div className="item-image">
                <img src={restaurant.image} alt={restaurant.name} />
              </div>
              <div className="item-info">
                <h4 className="item-name">{restaurant.name}</h4>
                <div className="item-meta">
                  <div className="item-rating">
                    <span className="star-icon">★</span> 
                    {restaurant.rating.toFixed(1)}
                  </div>
                  <span className="item-price">{restaurant.priceRange}</span>
                </div>
                <p className="item-address">{restaurant.address}</p>
              </div>
            </button>
          ))
        ) : (
          renderNoResults()
        )}
        
        {restaurants.length > 10 && (
          <p className="more-results">
            Y {restaurants.length - 10} más...
          </p>
        )}
      </div>
    </div>
  );
};

FilterPanel.propTypes = {
  filters: PropTypes.shape({
    specialty: PropTypes.string,
    priceRange: PropTypes.string,
    rating: PropTypes.number,
    search: PropTypes.string
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  specialties: PropTypes.arrayOf(PropTypes.string),
  selectedRestaurant: PropTypes.object,
  restaurants: PropTypes.arrayOf(PropTypes.object),
  onSelectRestaurant: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  activeFiltersCount: PropTypes.number
};

FilterPanel.defaultProps = {
  specialties: [],
  restaurants: [],
  isLoading: false,
  activeFiltersCount: 0
};

export default FilterPanel;
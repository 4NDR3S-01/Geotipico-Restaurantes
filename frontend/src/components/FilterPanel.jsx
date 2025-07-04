import React, { useState, useEffect, useRef } from 'react';
import '../styles/FilterPanel.css';

const MANTA_COORDS = { lat: -0.9676533, lng: -80.7089101 };
const POPULAR_RESTAURANTS = [
  'Chavcecito Restaurant',
  'Diverzu de Grupo Zurita',
  'Hostal Costa Azul',
  'Tía Manta Cuba',
  'Estadio Jocay de Manta'
];

const FilterPanel = ({ search, setSearch, category, setCategory, loading }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteService = useRef(null);

  useEffect(() => {
    if (!window.google?.maps) return;
    if (!autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (search.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    autocompleteService.current.getPlacePredictions(
      {
        input: search,
        location: new window.google.maps.LatLng(MANTA_COORDS.lat, MANTA_COORDS.lng),
        radius: 4000,
        types: [category],
        componentRestrictions: { country: 'ec' }
      },
      (predictions) => {
        setSuggestions(predictions ? predictions.filter(p => p.types.includes(category)) : []);
      }
    );
  }, [search, category]);

  const handleSuggestionClick = (text) => {
    setSearch(text);
    setShowSuggestions(false);
  };

  return (
    <aside className="filters-sidebar">
      <h2 className="filters-title">Filtrar lugares</h2>
      <div className="filter-group" style={{ position: 'relative', marginBottom: '1.2rem' }}>
        <label htmlFor="search">Nombre</label>
        <div style={{ position: 'relative' }}>
          <span className="search-icon" aria-hidden="true" style={{ left: '0.9rem', top: '50%', transform: 'translateY(-50%)', position: 'absolute', zIndex: 2 }}>🔍</span>
          <input
            id="search"
            type="text"
            placeholder={`Buscar por nombre de ${category === 'restaurant' ? 'restaurante' : category}`}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            className="filter-input"
            style={{ paddingLeft: '2.7rem' }}
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map(s => (
                <li
                  key={s.place_id}
                  className="suggestion-item"
                  tabIndex={0}
                  onClick={() => handleSuggestionClick(s.description)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSuggestionClick(s.description);
                  }}
                >
                  {s.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="filter-group">
        <label htmlFor="category">Tipo</label>
        <select
          id="category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="restaurant">Restaurantes</option>
          <option value="bar">Bares</option>
          <option value="cafe">Cafeterías</option>
          <option value="bakery">Panaderías</option>
        </select>
        {/* Sugerencias populares */}
        {category === 'restaurant' && (
          <div style={{ marginTop: '0.7rem' }}>
            <div style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', marginBottom: 4 }}>Historial:</div>
            <ul className="popular-list">
              {POPULAR_RESTAURANTS.map((name) => (
                <li key={name}>
                  <span
                    className="popular-link"
                    tabIndex={0}
                    onClick={() => handleSuggestionClick(name)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSuggestionClick(name);
                    }}
                  >
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {loading && <div className="filter-loading">Cargando...</div>}
    </aside>
  );
};

export default FilterPanel;
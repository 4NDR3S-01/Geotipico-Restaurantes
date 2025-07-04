import React, { useState } from 'react';
import GoogleMapRestaurants from '../components/GoogleMapRestaurants';
import FilterPanel from '../components/FilterPanel';
import '../styles/MapComponent.css';

export default function Mapa() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('restaurant');

  return (
    <div className="container map-page">
      <div className="map-header">
        <h1>Restaurantes de Manta</h1>
        <p>Explora la gastronomía costera ecuatoriana</p>
      </div>
      <div className="map-content">
        <FilterPanel
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          loading={false}
        />
        <div className="main-content">
          <div className="map-container">
            <GoogleMapRestaurants search={search} category={category} />
          </div>
        </div>
      </div>
    </div>
  );
}
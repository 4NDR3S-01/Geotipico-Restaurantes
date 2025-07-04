
import React, { useState } from 'react';
import GoogleMapRestaurants from '../components/GoogleMapRestaurants';
import FilterPanel from '../components/FilterPanel';
import '../styles/MapComponent.css';
import { useTranslation } from 'react-i18next';


export default function Mapa() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('restaurant');
  const { t } = useTranslation();

  return (
    <div className="container map-page">
      <div className="map-header">
        <h1>{t('map.title')}</h1>
        <p>{t('map.subtitle')}</p>
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
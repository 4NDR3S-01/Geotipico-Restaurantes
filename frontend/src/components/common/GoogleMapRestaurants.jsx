
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';

// Import your Google Maps API key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const center = { lat: -0.9676533, lng: -80.7089101 };
const mapContainerStyle = { width: '100%', height: '100%' };
const libraries = ['places'];


export default function GoogleMapRestaurants({ search, category = 'restaurant' }) {
  const { t } = useTranslation();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [apiError, setApiError] = useState(false);
  const mapRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // Guardar instancia del mapa cuando esté listo
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMapReady(true);
  }, []);

  // Buscar lugares cercanos según tipo y búsqueda
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: center,
      radius: 4000,
      type: [category]
    };
    if (search && search.trim().length > 0) {
      request.keyword = search.trim();
    }
    setApiError(false);
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);
      } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        setPlaces([]);
      } else {
        setPlaces([]);
        setApiError(true); // Error real de la API
      }
    });
  }, [search, mapReady, category]);

  if (loadError) return <div>{t('map.error')}</div>;
  if (!isLoaded) return <div>{t('map.loading')}</div>;

  // Estilos popup modernos y adaptativos
  const popupStyle = {
    minWidth: 210,
    maxWidth: 260,
    padding: '1.1rem 1.2rem',
    borderRadius: 18,
    background: 'rgba(255,255,255,0.95)',
    boxShadow: '0 6px 32px rgba(0,150,199,0.13)',
    color: '#222',
    fontFamily: 'Inter, sans-serif',
    backdropFilter: 'blur(4px)'
  };
  const popupTitle = {
    fontSize: '1.15rem',
    fontWeight: 800,
    margin: 0,
    color: '#0096c7',
    marginBottom: 6
  };
  const popupText = {
    fontSize: '1rem',
    margin: '0.3rem 0',
    color: '#444'
  };
  const popupRating = {
    fontSize: '0.98rem',
    color: '#ffb700',
    fontWeight: 700
  };

  // Adaptar a tema oscuro
  if (document.documentElement.getAttribute('data-theme') === 'dark') {
    popupStyle.background = 'rgba(40,42,54,0.98)';
    popupStyle.color = '#f8f8f2';
    popupTitle.color = '#48cae4';
    popupText.color = '#c5c9de';
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={center}
        onLoad={onMapLoad}
      >
        {!apiError && places && places.length > 0 && places.map((place) => (
          <Marker
            key={place.place_id}
            position={{ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }}
            onClick={() => setSelected(place)}
            icon={{
              url: 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png',
              scaledSize: { width: 32, height: 32 }
            }}
          />
        ))}
        {selected && (
          <InfoWindow
            position={{
              lat: selected.geometry.location.lat(),
              lng: selected.geometry.location.lng()
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div style={popupStyle}>
              <h3 style={popupTitle}>{selected.name}</h3>
              <div style={popupText}>{selected.vicinity}</div>
              {selected.rating && <div style={popupRating}>⭐ {selected.rating}</div>}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      {/* Mensaje amigable si no hay resultados */}
      {!apiError && places && places.length === 0 && (
        <div style={{textAlign:'center',marginTop:24,color:'#888'}}>{t('map.no_results')}</div>
      )}
    </div>
  );
}

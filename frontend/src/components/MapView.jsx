import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  ZoomControl, 
  CircleMarker, 
  useMap
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../styles/MapView.css';

// Fix para los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

// Componente para actualizar el mapa cuando cambia el centro o zoom
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center?.[0] && center?.[1]) {
      map.flyTo(center, zoom || map.getZoom(), {
        animate: true,
        duration: 0.8
      });
    }
  }, [center, zoom, map]);
  
  return null;
};

// Genera un icono personalizado para el marcador
const createCustomIcon = (restaurant, isSelected) => {
  // Asignar color según rating
  let color;
  if (restaurant.rating >= 4.5) color = '#4CAF50';
  else if (restaurant.rating >= 4.0) color = '#8BC34A';
  else if (restaurant.rating >= 3.5) color = '#FFC107';
  else color = '#FF9800';
  
  // Aumentar tamaño si está seleccionado
  const scale = isSelected ? 1.2 : 1;
  const size = 36 * scale;
  
  // Definir estilos
  const border = isSelected ? '3px solid white' : '2px solid white';
  const boxShadow = isSelected ? '0 3px 10px rgba(0,0,0,0.4)' : '0 2px 5px rgba(0,0,0,0.2)';
  const pulsing = isSelected ? 'pulse 2s infinite' : 'none';
  
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background-color: ${color}; 
        border-radius: 50%; 
        display: flex; 
        justify-content: center; 
        align-items: center; 
        color: white; 
        font-weight: bold; 
        border: ${border}; 
        box-shadow: ${boxShadow};
        transition: all 0.3s ease;
        animation: ${pulsing};
      ">
        ${restaurant.priceRange}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size]
  });
};

// Componente principal del mapa
const MapView = ({ 
  restaurants = [], 
  selectedRestaurant, 
  onSelectRestaurant,
  initialCenter = [-0.9676533, -80.7089101],
  initialZoom = 14
}) => {
  const mapRef = useRef(null);
  const [mapInfo, setMapInfo] = useState({
    center: initialCenter,
    zoom: initialZoom
  });
  
  // Determinar centro del mapa según el restaurante seleccionado
  const mapCenter = useMemo(() => {
    if (selectedRestaurant?.lat && selectedRestaurant?.lng) {
      return [selectedRestaurant.lat, selectedRestaurant.lng];
    }
    return mapInfo.center;
  }, [selectedRestaurant, mapInfo.center]);
  
  // Determinar zoom según selección
  const zoom = useMemo(() => {
    return selectedRestaurant ? 16 : mapInfo.zoom;
  }, [selectedRestaurant, mapInfo.zoom]);
  
  // Manejar cambios en el mapa
  const handleMapMove = useCallback((mapState) => {
    setMapInfo({
      center: mapState.center,
      zoom: mapState.zoom
    });
  }, []);
  
  // Función para localizar usuario
  const handleLocateUser = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapRef.current?.flyTo([latitude, longitude], 15, {
            animate: true,
            duration: 2
          });
        },
        () => {
          alert("No se pudo obtener tu ubicación. Verifica los permisos.");
        }
      );
    } else {
      alert("Tu navegador no soporta geolocalización");
    }
  }, []);
  
  // Resetear vista del mapa
  const handleResetView = useCallback(() => {
    mapRef.current?.flyTo(initialCenter, initialZoom, {
      animate: true,
      duration: 1.5
    });
  }, [initialCenter, initialZoom]);
  
  // Componente de seguimiento de eventos del mapa
  const MapEvents = () => {
    const map = useMap();
    
    useEffect(() => {
      const onMoveEnd = () => {
        const center = map.getCenter();
        handleMapMove({
          center: [center.lat, center.lng],
          zoom: map.getZoom()
        });
      };
      
      map.on('moveend', onMoveEnd);
      return () => map.off('moveend', onMoveEnd);
    }, [map]);
    
    return null;
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={initialCenter} 
        zoom={initialZoom} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <MapUpdater center={mapCenter} zoom={zoom} />
        <MapEvents />
        
        {/* Círculos de fondo para los marcadores */}
        {restaurants
          .filter(r => r && typeof r.lat === 'number' && typeof r.lng === 'number')
          .map(restaurant => (
            <CircleMarker
              key={`circle-${restaurant.id}`}
              center={[restaurant.lat, restaurant.lng]}
              pathOptions={{ 
                fillColor: selectedRestaurant?.id === restaurant.id ? '#0096c7' : '#90caf9',
                fillOpacity: selectedRestaurant?.id === restaurant.id ? 0.2 : 0.1,
                stroke: false
              }}
              radius={selectedRestaurant?.id === restaurant.id ? 40 : 25}
            />
          ))}
        
        {/* Marcadores de restaurantes */}
        {restaurants
          .filter(r => r && typeof r.lat === 'number' && typeof r.lng === 'number')
          .map(restaurant => {
            const isSelected = selectedRestaurant?.id === restaurant.id;
            return (
              <Marker 
                key={restaurant.id} 
                position={[restaurant.lat, restaurant.lng]}
                icon={createCustomIcon(restaurant, isSelected)}
                eventHandlers={{
                  click: () => onSelectRestaurant(restaurant),
                }}
                zIndexOffset={isSelected ? 1000 : 0}
              >
                <Popup className="restaurant-popup">
                  <div className="popup-content">
                    <div 
                      className="popup-image" 
                      style={{ backgroundImage: `url(${restaurant.image})` }}
                    >
                      <h3>{restaurant.name}</h3>
                    </div>
                    <div className="popup-details">
                      <div className="popup-rating">
                        <span className="rating-stars">
                          {'★'.repeat(Math.floor(restaurant.rating))}
                          {'☆'.repeat(5 - Math.floor(restaurant.rating))}
                        </span>
                        <span className="rating-value">{restaurant.rating.toFixed(1)}</span>
                      </div>
                      <p className="popup-specialty">{restaurant.specialties.join(' • ')}</p>
                      <p className="popup-price">{restaurant.priceRange}</p>
                      <p className="popup-address">{restaurant.address}</p>
                    </div>
                    <div className="popup-actions">
                      <button 
                        onClick={() => onSelectRestaurant(restaurant)} 
                        className="btn-details"
                      >
                        Ver detalles
                      </button>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-directions"
                      >
                        Cómo llegar
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
      
      {/* Controles adicionales */}
      <div className="map-controls">
        <button 
          className="map-control-btn" 
          onClick={handleLocateUser}
          aria-label="Localizar mi posición"
          title="Mi ubicación"
        >
          <span role="img" aria-hidden="true">📍</span>
        </button>
        <button 
          className="map-control-btn" 
          onClick={handleResetView}
          aria-label="Restablecer vista"
          title="Vista completa"
        >
          <span role="img" aria-hidden="true">🌍</span>
        </button>
      </div>
    </div>
  );
};

MapView.propTypes = {
  restaurants: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    lat: PropTypes.number,
    lng: PropTypes.number,
    image: PropTypes.string,
    specialties: PropTypes.arrayOf(PropTypes.string),
    priceRange: PropTypes.string,
    rating: PropTypes.number
  })),
  selectedRestaurant: PropTypes.object,
  onSelectRestaurant: PropTypes.func.isRequired,
  initialCenter: PropTypes.arrayOf(PropTypes.number),
  initialZoom: PropTypes.number
};

export default MapView;
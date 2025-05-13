import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { importService } from '../services/api';
import '../styles/Admin.css';

const Admin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [customLocation, setCustomLocation] = useState({
    lat: '',
    lng: '',
    radius: 5000
  });
  const [importResult, setImportResult] = useState(null);

  // Cargar ubicaciones sugeridas
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await importService.getLocations();
        setLocations(data.locations);
      } catch (error) {
        console.error('Error cargando ubicaciones:', error);
        toast.error('Error cargando ubicaciones sugeridas');
      }
    };
    
    fetchLocations();
  }, []);

  // Manejar selección de ubicación
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setCustomLocation({
      lat: location.lat.toString(),
      lng: location.lng.toString(),
      radius: 5000
    });
  };

  // Manejar cambios en ubicación personalizada
  const handleCustomLocationChange = (e) => {
    const { name, value } = e.target;
    setCustomLocation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Iniciar importación
  const handleImport = async () => {
    if (!customLocation.lat || !customLocation.lng) {
      toast.error('Por favor ingresa coordenadas válidas');
      return;
    }
    
    setIsLoading(true);
    setImportResult(null);
    
    try {
      const result = await importService.importByLocation(customLocation);
      setImportResult(result);
      toast.success(result.message);
    } catch (error) {
      console.error('Error en importación:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cerrar sesión de administrador
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast.info('Has cerrado sesión como administrador');
    // La redirección la manejará el ProtectedRoute
    window.location.reload();
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <button onClick={handleLogout} className="logout-button">
          Cerrar sesión
        </button>
      </div>
      
      <div className="admin-card">
        <h2>Importar Restaurantes</h2>
        <p>
          Importa restaurantes desde OpenStreetMap utilizando ubicaciones
          predefinidas o ingresando coordenadas específicas.
        </p>
        <div className="info-box">
          <h4>Sobre los datos:</h4>
          <p>
            Los datos se obtienen de <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>, 
            una base de datos geográfica libre y editable. La calidad y cantidad de la información puede variar según la zona.
          </p>
          <p>
            <strong>Nota:</strong> La información se complementa automáticamente con descripciones generadas e imágenes representativas.
          </p>
        </div>
        
        <div className="locations-grid">
          {locations.map((location) => (
            <button
              key={location.name}
              className={`location-button ${selectedLocation?.name === location.name ? 'selected' : ''}`}
              onClick={() => handleLocationSelect(location)}
            >
              {location.name}
            </button>
          ))}
        </div>
        
        <div className="custom-location-form">
          <h3>{selectedLocation ? `Importar desde: ${selectedLocation.name}` : 'Ubicación personalizada'}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lat">Latitud:</label>
              <input
                type="text"
                id="lat"
                name="lat"
                value={customLocation.lat}
                onChange={handleCustomLocationChange}
                placeholder="-0.9676533"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lng">Longitud:</label>
              <input
                type="text"
                id="lng"
                name="lng"
                value={customLocation.lng}
                onChange={handleCustomLocationChange}
                placeholder="-80.7089101"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="radius">Radio de búsqueda (metros):</label>
            <input
              type="number"
              id="radius"
              name="radius"
              value={customLocation.radius}
              onChange={handleCustomLocationChange}
              min="100"
              max="10000"
            />
          </div>
          
          <button 
            className="import-button" 
            onClick={handleImport}
            disabled={isLoading}
          >
            {isLoading ? 'Importando...' : 'Importar Restaurantes'}
          </button>
        </div>
        
        {importResult && (
          <div className="import-result">
            <h3>Resultado de la importación</h3>
            <p className="import-message">{importResult.message}</p>
            <p>Total de registros procesados: {importResult.total}</p>
            <p>Nuevos: {importResult.new} | Actualizados: {importResult.updated}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
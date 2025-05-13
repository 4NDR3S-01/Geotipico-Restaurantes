import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">🍽️</div>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
        <p>¿Te gustaría volver a explorar los restaurantes de Manta?</p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">Volver al mapa</Link>
          <Link to="/about" className="btn-secondary">Acerca de Geotípico</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
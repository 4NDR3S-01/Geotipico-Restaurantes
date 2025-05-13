import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>Acerca de Geotípico</h1>
        <p className="subtitle">Descubriendo la gastronomía local de Manta</p>
      </div>
      
      <div className="about-content">
        <section className="about-section">
          <h2>Nuestra Misión</h2>
          <p>
            Geotípico nace con la misión de promover y destacar la rica gastronomía 
            de Manta, ayudando tanto a turistas como a locales a descubrir los mejores 
            restaurantes y platos típicos de la región.
          </p>
          <p>
            Queremos poner en valor la cultura culinaria manabita, facilitando el 
            acceso a información geolocalizada sobre restaurantes y sus especialidades.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Características</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Mapa Interactivo</h3>
              <p>
                Explora restaurantes en un mapa interactivo que te permite 
                visualizar opciones cercanas a tu ubicación.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Filtros Avanzados</h3>
              <p>
                Encuentra exactamente lo que buscas con filtros por especialidad, 
                rango de precios y calificación.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Gastronomía Local</h3>
              <p>
                Descubre platos típicos manabitas y los mejores restaurantes para 
                disfrutar de la cocina local.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Diseño Responsivo</h3>
              <p>
                Accede a Geotípico desde cualquier dispositivo, con una experiencia 
                optimizada para móviles y tablets.
              </p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <h2>Fuentes de Datos</h2>
          <p>
            Geotípico utiliza datos de OpenStreetMap, una plataforma colaborativa 
            de mapas libres y editables. Además, complementamos esta información 
            con datos recopilados de forma manual para asegurar la calidad y 
            relevancia de nuestra base de datos.
          </p>
          <div className="attribution">
            <a href="https://www.openstreetmap.org/about" target="_blank" rel="noopener noreferrer">
              © OpenStreetMap contributors
            </a>
          </div>
        </section>
        
        <section className="about-section">
          <h2>Contáctanos</h2>
          <p>
            ¿Tienes sugerencias, comentarios o quieres añadir tu restaurante? 
            Estaremos encantados de escucharte.
          </p>
          <a href="mailto:contacto@geotipico.com" className="contact-button">
            Envíanos un mensaje
          </a>
        </section>
      </div>
    </div>
  );
};

export default About;
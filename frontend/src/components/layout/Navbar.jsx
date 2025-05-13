import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import '../../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar estilos
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {/* <img src="/logo.svg" alt="Logo" className="navbar-logo-img" /> */}
          <span className="navbar-logo-text">Geotípico</span>
        </Link>

        <div className="navbar-actions">
          <ThemeToggle />
          
          <button 
            className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú de navegación"
            aria-expanded={menuOpen}
          >
            <span className="toggle-line"></span>
            <span className="toggle-line"></span>
            <span className="toggle-line"></span>
          </button>
        </div>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link 
                to="/mapa" 
                className={`navbar-link ${location.pathname === '/mapa' || location.pathname === '/' ? 'active' : ''}`}
              >
                Mapa
              </Link>
            </li>
            <li className="navbar-item">
              <Link 
                to="/about" 
                className={`navbar-link ${location.pathname === '/about' ? 'active' : ''}`}
              >
                Acerca del sistema
              </Link>
            </li>
            <li className="navbar-item">
              <Link 
                to="/admin" 
                className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}
              >
                Administracion
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import '../../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || localStorage.getItem('lang') || 'es');

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

  // Cambiar idioma y guardar preferencia
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {/* <img src="/logo.svg" alt="Logo" className="navbar-logo-img" /> */}
          <span className="navbar-logo-text">Geotípico</span>
        </Link>


        <div className={`navbar-menu${menuOpen ? ' active' : ''}`}> 
          <ul className="navbar-list">
            <li>
              <Link to="/mapa" className="navbar-link">
                <span role="img" aria-label="mapa" style={{marginRight:6}}>🗺️</span>{t('navbar.map')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="navbar-link">
                <span role="img" aria-label="about" style={{marginRight:6}}>ℹ️</span>{t('navbar.about')}
              </Link>
            </li>
            <li>
              <Link to="/login" className="navbar-link">
                <span role="img" aria-label="login" style={{marginRight:6}}>🔑</span>{t('navbar.login')}
              </Link>
            </li>
          </ul>
          <div className="navbar-utils">
            <select
              className="lang-select"
              value={language}
              onChange={handleLanguageChange}
              aria-label="Cambiar idioma"
            >
              <option value="es">ES</option>
              <option value="en">EN</option>
            </select>
            <ThemeToggle />
          </div>
        </div>

        <button
          className={`navbar-toggle${menuOpen ? ' active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
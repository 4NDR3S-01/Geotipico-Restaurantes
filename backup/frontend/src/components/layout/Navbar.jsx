import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGlobe, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/Navbar.css';
import { useFaqSearch } from '../../context/FaqSearchContext';
import { faqData } from '../../data/faqData';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || localStorage.getItem('lang') || 'es');
  const { faqSearch, setFaqSearch } = useFaqSearch();
  const navigate = useNavigate();
  
  const suggestions = useMemo(() => 
    faqSearch
      ? faqData.filter(item => t(item.q).toLowerCase().includes(faqSearch.toLowerCase()))
      : []
  , [faqSearch, t]);

  // Cerrar menú al cambiar de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Cambiar idioma y guardar preferencia
  const handleLanguageChange = useCallback((e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  }, [i18n]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {/* <img src="/logo.svg" alt="Logo" className="navbar-logo-img" /> */}
          <span className="navbar-logo-text">Geotípico</span>
        </Link>

        <div className={`navbar-menu${menuOpen ? ' active' : ''}`}> 
          <ul className="navbar-list">
            <li>
              <Link to="/" className="navbar-link">
                <span aria-hidden="true" style={{marginRight:6}}>🏠</span>{t('navbar.home', 'Inicio')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="navbar-link">
                <span aria-hidden="true" style={{marginRight:6}}>ℹ️</span>{t('navbar.about', 'Acerca de')}
              </Link>
            </li>
            <li>
              <Link to="/help" className="navbar-link">
                <span aria-hidden="true" style={{marginRight:6}}>❓</span>{t('navbar.help', 'Ayuda')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="navbar-link">
                <span aria-hidden="true" style={{marginRight:6}}>✉️</span>{t('navbar.contact', 'Contacto')}
              </Link>
            </li>
            <li>
              <Link to="/login" className="navbar-link">
                <span aria-hidden="true" style={{marginRight:6}}>👤</span>{t('navbar.login', 'Iniciar sesión')}
              </Link>
            </li>
          </ul>
          <div className="navbar-utils">
            <div className="navbar-search-wrapper">
              <span className="navbar-search-icon" aria-hidden="true">🔍</span>
              <input
                type="text"
                className="navbar-search"
                placeholder={t('navbar.search_placeholder', 'Buscar...')}
                value={faqSearch}
                onChange={e => setFaqSearch(e.target.value)}
                aria-label={t('navbar.search_aria', 'Buscar en preguntas frecuentes')}
                autoComplete="off"
              />
              {faqSearch && suggestions.length > 0 && (
                <ul className="navbar-suggestions-list">
                  {suggestions.slice(0,5).map((item, idx) => (
                    <button
                      key={item.q}
                      type="button"
                      className="navbar-suggestion-item"
                      onClick={() => {
                        navigate(`/help?q=${encodeURIComponent(item.q)}`);
                        setFaqSearch('');
                      }}
                    >
                      <span className="navbar-suggestion-icon">{item.icon}</span>
                      <span className="navbar-suggestion-text">{t(item.q)}</span>
                    </button>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Controles modernos de idioma y tema */}
            <div className="navbar-controls">
              <div className="navbar-control-group">
                <FaGlobe className="navbar-control-icon" />
                <select
                  className="navbar-language-select"
                  value={language}
                  onChange={handleLanguageChange}
                  aria-label="Cambiar idioma"
                >
                  <option value="es">ES</option>
                  <option value="en">EN</option>
                </select>
              </div>
              
              <button
                className="navbar-theme-toggle"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
                title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
              >
                {theme === 'dark' ? <FaSun /> : <FaMoon />}
              </button>
            </div>
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

export default React.memo(Navbar);
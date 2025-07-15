import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';
import '../../styles/Navbar.css';
import { useFaqSearch } from '../../context/FaqSearchContext';
import { faqData } from '../../data/faqData';

const Navbar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language || localStorage.getItem('lang') || 'es');
  const { faqSearch, setFaqSearch } = useFaqSearch();
  const navigate = useNavigate();
  const suggestions = faqSearch
    ? faqData.filter(item => t(item.q).toLowerCase().includes(faqSearch.toLowerCase()))
    : [];

  // Forzar re-render al cambiar el tema
  useEffect(() => {
    const observer = new window.MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
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
    <nav className="navbar" data-theme={theme}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {/* <img src="/logo.svg" alt="Logo" className="navbar-logo-img" /> */}
          <span className="navbar-logo-text">Geotípico</span>
        </Link>

        <div className={`navbar-menu${menuOpen ? ' active' : ''}`}> 
          <ul className="navbar-list">
            <li>
              <Link to="/" className="navbar-link">
                <span role="img" aria-label="home" style={{marginRight:6}}>🏠</span>{t('navbar.home', 'Inicio')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="navbar-link">
                <span role="img" aria-label="about" style={{marginRight:6}}>ℹ️</span>{t('navbar.about', 'Acerca de')}
              </Link>
            </li>
            <li>
              <Link to="/help" className="navbar-link">
                <span role="img" aria-label="help" style={{marginRight:6}}>❓</span>{t('navbar.help', 'Ayuda')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="navbar-link">
                <span role="img" aria-label="contact" style={{marginRight:6}}>✉️</span>{t('navbar.contact', 'Contacto')}
              </Link>
            </li>
            <li>
              <Link to="/login" className="navbar-link">
                <span role="img" aria-label="login" style={{marginRight:6}}>👤</span>{t('navbar.login', 'Iniciar sesión')}
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
                    <li
                      key={item.q}
                      className="navbar-suggestion-item"
                      tabIndex={0}
                      onClick={() => {
                        navigate(`/help?q=${encodeURIComponent(item.q)}`);
                        setFaqSearch('');
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          navigate(`/help?q=${encodeURIComponent(item.q)}`);
                          setFaqSearch('');
                        }
                      }}
                    >
                      <span className="navbar-suggestion-icon">{item.icon}</span>
                      <span className="navbar-suggestion-text">{t(item.q)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
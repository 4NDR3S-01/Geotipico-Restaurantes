import React, { useState } from 'react';
import { FaHome, FaSignOutAlt, FaBars, FaUser, FaGlobe, FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/dashboard.css';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const menuItems = [
  { label: 'Inicio', icon: <FaHome />, to: '/dashboard' },
  { label: 'Perfil', icon: <FaUser />, to: '/dashboard/profile' },
];

const Sidebar = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  
  // Estado para idioma
  const language = i18n.language || localStorage.getItem('lang') || 'es';

  // Cambiar idioma
  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('lang', lang);
  };

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}> 
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)} aria-label="Expandir/collapse sidebar">
          <FaBars />
        </button>
        {!collapsed && <span className="sidebar-logo">Geotípico</span>}
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`sidebar-link${location.pathname === item.to ? ' active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-label">{t(`sidebar.${item.label.toLowerCase()}`, item.label)}</span>}
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        {/* Controles de tema e idioma */}
        <div className="sidebar-controls">
          {/* Selector de idioma */}
          <div className="control-group">
            <div className="control-icon">
              <FaGlobe />
            </div>
            {!collapsed && (
              <select
                className="language-select"
                value={language}
                onChange={handleLanguageChange}
                aria-label="Cambiar idioma"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            )}
          </div>
          {/* Toggle de tema */}
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            <span className="control-icon">
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </span>
            {!collapsed && (
              <span className="theme-label">
                {theme === 'dark' ? 'Claro' : 'Oscuro'}
              </span>
            )}
          </button>
        </div>
        {/* Botón de logout */}
        <button 
          className="sidebar-link sidebar-logout" 
          onClick={onLogout} 
          tabIndex={0}
        >
          <span className="sidebar-icon">
            <FaSignOutAlt />
          </span>
          {!collapsed && <span className="sidebar-label">Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar; 
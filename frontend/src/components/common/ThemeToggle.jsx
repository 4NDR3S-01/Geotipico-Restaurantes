import React from 'react';
import '../../styles/ThemeToggle.css';

const ThemeToggle = () => {
  // Verificar tema actual
  const [isDarkTheme, setIsDarkTheme] = React.useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Cambiar tema
  const toggleTheme = () => {
    const newTheme = !isDarkTheme ? 'dark' : 'light';
    setIsDarkTheme(!isDarkTheme);
    
    // Aplicar tema al documento
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Guardar preferencia
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={isDarkTheme ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={isDarkTheme ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
    >
      <span className="toggle-icon">
        {isDarkTheme ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;
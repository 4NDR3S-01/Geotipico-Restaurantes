import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const adminAuth = localStorage.getItem('adminAuth');
    setIsAuthenticated(adminAuth === 'true');
    setIsLoading(false);
  }, []);
  
  // Manejar inicio de sesión exitoso
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  // Mostrar indicador de carga mientras se verifica
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }
  
  // Si está autenticado, mostrar el componente protegido
  return children;
};

export default ProtectedRoute;
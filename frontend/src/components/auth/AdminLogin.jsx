import React, { useState } from 'react';
import { toast } from 'react-toastify';
import '../../styles/AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // En un entorno real esto debería verificar contra el backend
    // Por ahora haremos una verificación simple
    setTimeout(() => {
      // Clave admin simple (en producción NUNCA hagas esto)
      // Usaría un sistema de autenticación real con JWT o similar
      if (password === 'geotipico2023') {
        localStorage.setItem('adminAuth', 'true');
        toast.success('Acceso concedido');
        onLoginSuccess();
      } else {
        toast.error('Contraseña incorrecta');
      }
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h2>🔒 Área Restringida</h2>
          <p>Panel de administración de Geotípico</p>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="password">Contraseña de administrador:</label>
            <input 
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              required
              autoComplete="current-password"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p>Esta área es solo para administradores del sitio.</p>
          <p>Si no eres administrador, por favor <a href="/mapa">vuelve al mapa</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
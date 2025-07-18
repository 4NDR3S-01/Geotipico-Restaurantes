import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/login.css';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const UserIcon = (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block', margin:'0 auto', color:'var(--primary-color)'}}>
    <circle cx="12" cy="8.5" r="4.5"/>
    <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"/>
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login, user } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <div className="login-outer">
        <div className="login-icon-wrapper">{UserIcon}</div>
        <h2 className="login-title">{t('login.title', 'Iniciar Sesión')}</h2>
        <form onSubmit={handleSubmit} className="login-form" autoComplete="on" aria-label={t('login.title', 'Iniciar Sesión')}>
          <div className="login-field">
            <label htmlFor="email">{t('login.email', 'Correo electrónico')}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder={t('login.email_placeholder', 'Tu correo electrónico')}
              aria-label={t('login.email', 'Correo electrónico')}
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">{t('login.password', 'Contraseña')}</label>
            <div className="input-adorned">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder={t('login.password_placeholder', 'Tu contraseña')}
                aria-label={t('login.password', 'Contraseña')}
                className="input-adorned-input"
              />
              <button
                type="button"
                className="input-adorned-btn"
                onClick={toggleShowPassword}
                aria-label={showPassword ? t('login.hide_password') : t('login.show_password')}
                tabIndex={0}
              >
                {showPassword ? (
                  <MdVisibilityOff size={22} style={{ verticalAlign: 'middle' }} />
                ) : (
                  <MdVisibility size={22} style={{ verticalAlign: 'middle' }} />
                )}
              </button>
            </div>
          </div>
          {error && <div className="error-message" role="alert">{error}</div>}
          <button type="submit" disabled={loading} aria-busy={loading} aria-disabled={loading}>
            {loading ? (
              <span className="login-loader">
                <span className="login-spinner"></span> {t('login.loading', 'Ingresando...')}
              </span>
            ) : t('login.button', 'Ingresar')}
          </button>
          <div className="login-links">
            <span
              className="login-link"
              onClick={() => navigate('/register')}
              tabIndex={0}
              role="button"
              onKeyDown={e => { if (e.key === 'Enter') navigate('/register'); }}
            >
              {t('login.no_account', '¿No tienes cuenta? Regístrate')}
            </span>
            <span
              className="login-link"
              onClick={() => navigate('/forgot-password')}
              tabIndex={0}
              role="button"
              onKeyDown={e => { if (e.key === 'Enter') navigate('/forgot-password'); }}
            >
              {t('login.forgot', '¿Olvidaste tu contraseña?')}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

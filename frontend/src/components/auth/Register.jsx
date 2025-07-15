import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/register.css';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { register as registerApi } from '../../api/auth';
import { useTranslation } from 'react-i18next';

const UserIcon = (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{display:'block', margin:'0 auto', color:'var(--primary-color)'}}>
    <circle cx="12" cy="8.5" r="4.5"/>
    <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"/>
  </svg>
);

const Register = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError(t('register.error_name', 'Por favor ingresa tu nombre y apellidos.'));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t('register.error_password_match', 'Las contraseñas no coinciden'));
      return;
    }
    setLoading(true);
    try {
      await registerApi({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password
      });
      setSuccess(t('register.success', 'Registro exitoso. Ahora puedes iniciar sesión.'));
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-outer">
        <div className="login-icon-wrapper">{UserIcon}</div>
        <h2 className="login-title" style={{marginBottom: '1.2rem'}}>{t('register.title', 'Crear cuenta')}</h2>
        <form onSubmit={handleSubmit} className="login-form" autoComplete="on" aria-label={t('register.aria', 'Registro de usuario')}>
          <div className="login-field">
            <label htmlFor="firstName">{t('register.first_name', 'Nombre')}</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              autoComplete="given-name"
              placeholder={t('register.first_name_placeholder', 'Tu nombre')}
              aria-label={t('register.first_name', 'Nombre')}
            />
          </div>
          <div className="login-field">
            <label htmlFor="lastName">{t('register.last_name', 'Apellidos')}</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              autoComplete="family-name"
              placeholder={t('register.last_name_placeholder', 'Tus apellidos')}
              aria-label={t('register.last_name', 'Apellidos')}
            />
          </div>
          <div className="login-field">
            <label htmlFor="email">{t('register.email', 'Correo electrónico')}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder={t('register.email_placeholder', 'Tu correo electrónico')}
              aria-label={t('register.email', 'Correo electrónico')}
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">{t('register.password', 'Contraseña')}</label>
            <div className="input-adorned">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder={t('register.password_placeholder', 'Crea una contraseña')}
                aria-label={t('register.password', 'Contraseña')}
                className="input-adorned-input"
              />
              <button
                type="button"
                className="input-adorned-btn"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? t('register.hide_password', 'Ocultar contraseña') : t('register.show_password', 'Mostrar contraseña')}
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
          <div className="login-field">
            <label htmlFor="confirmPassword">{t('register.confirm_password', 'Confirmar contraseña')}</label>
            <div className="input-adorned">
              <input
                type={showConfirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder={t('register.confirm_password_placeholder', 'Repite la contraseña')}
                aria-label={t('register.confirm_password', 'Confirmar contraseña')}
                className="input-adorned-input"
              />
              <button
                type="button"
                className="input-adorned-btn"
                onClick={() => setShowConfirm(v => !v)}
                aria-label={showConfirm ? t('register.hide_password', 'Ocultar contraseña') : t('register.show_password', 'Mostrar contraseña')}
                tabIndex={0}
              >
                {showConfirm ? (
                  <MdVisibilityOff size={22} style={{ verticalAlign: 'middle' }} />
                ) : (
                  <MdVisibility size={22} style={{ verticalAlign: 'middle' }} />
                )}
              </button>
            </div>
          </div>
          {error && <div className="error-message" role="alert">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" disabled={loading} aria-busy={loading} aria-disabled={loading} style={{marginTop:8}}>
            {loading ? (
              <span className="login-loader">
                <span className="login-spinner"></span> {t('register.loading', 'Registrando...')}
              </span>
            ) : t('register.button', 'Registrarse')}
          </button>
          <div className="login-links" style={{marginTop:'1.2rem'}}>
            <span
              className="login-link"
              onClick={() => navigate('/login')}
              tabIndex={0}
              role="button"
              onKeyDown={e => { if (e.key === 'Enter') navigate('/login'); }}
            >
              {t('register.login_link', '¿Ya tienes cuenta? Inicia sesión')}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styles/login.css';
import { resetPassword } from '../../api/auth';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const ResetPassword = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirm) {
      setError(t('reset.error_match', 'Las contraseñas no coinciden.'));
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(t('reset.success', 'Contraseña restablecida. Ahora puedes iniciar sesión.'));
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(t('reset.error', 'El enlace no es válido o expiró. Solicita uno nuevo.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-outer">
        <h2 className="login-title">{t('reset.title', 'Nueva contraseña')}</h2>
        {success ? (
          <div className="success-message" style={{textAlign:'center',marginTop:16}}>{success}</div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form" autoComplete="on" aria-label={t('reset.title', 'Nueva contraseña')}>
            <div className="login-field">
              <label htmlFor="password">{t('reset.password', 'Contraseña nueva')}</label>
              <div className="input-adorned">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder={t('reset.password_placeholder', 'Crea una nueva contraseña')}
                  aria-label={t('reset.password', 'Contraseña nueva')}
                  className="input-adorned-input"
                />
                <button
                  type="button"
                  className="input-adorned-btn"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? t('reset.hide_password', 'Ocultar contraseña') : t('reset.show_password', 'Mostrar contraseña')}
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
              <label htmlFor="confirm">{t('reset.confirm', 'Confirmar contraseña')}</label>
              <div className="input-adorned">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirm"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder={t('reset.confirm_placeholder', 'Repite la contraseña')}
                  aria-label={t('reset.confirm', 'Confirmar contraseña')}
                  className="input-adorned-input"
                />
                <button
                  type="button"
                  className="input-adorned-btn"
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? t('reset.hide_password', 'Ocultar contraseña') : t('reset.show_password', 'Mostrar contraseña')}
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
            <button type="submit" disabled={loading} aria-busy={loading} aria-disabled={loading}>
              {loading ? t('reset.loading', 'Restableciendo...') : t('reset.button', 'Restablecer contraseña')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword; 
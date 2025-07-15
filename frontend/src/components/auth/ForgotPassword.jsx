import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/login.css';
import { forgotPassword } from '../../api/auth';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(t('forgot.error', 'Ocurrió un error. Intenta de nuevo.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-outer">
        <h2 className="login-title">{t('forgot.title', 'Recuperar contraseña')}</h2>
        {sent ? (
          <div className="success-message" style={{textAlign:'center',marginTop:16}}>
            {t('forgot.sent', 'Si el correo existe, recibirás instrucciones para restablecer tu contraseña.')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="login-form" autoComplete="on" aria-label={t('forgot.title', 'Recuperar contraseña')}>
            <div className="login-field">
              <label htmlFor="email">{t('forgot.email', 'Correo electrónico')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder={t('forgot.email_placeholder', 'Tu correo electrónico')}
                aria-label={t('forgot.email', 'Correo electrónico')}
              />
            </div>
            {error && <div className="error-message" role="alert">{error}</div>}
            <button type="submit" disabled={loading} aria-busy={loading} aria-disabled={loading}>
              {loading ? t('forgot.loading', 'Enviando...') : t('forgot.button', 'Enviar instrucciones')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 
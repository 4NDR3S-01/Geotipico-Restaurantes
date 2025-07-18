import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { sendContact } from '../api/contact';
import '../styles/Contact.css';

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t('contact.error_name');
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = t('contact.error_email');
    if (!form.subject.trim()) errs.subject = t('contact.error_subject');
    if (!form.message.trim()) errs.message = t('contact.error_message');
    return errs;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setSent(false);
    setErrors({});
    try {
      await sendContact(form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setErrors({ server: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact">
      <div className="container">
        {/* Header Section */}
        <section className="contact-header animate-fade-in">
          <div className="contact-header-icon">✉️</div>
          <h1 className="contact-title">{t('contact.title', 'Contacto')}</h1>
          <p className="contact-subtitle">
            {t('contact.subtitle', '¿Tienes preguntas, sugerencias o quieres agregar tu restaurante? ¡Escríbenos!')}
          </p>
        </section>

        <div className="contact-content">
          {/* Form Section */}
          <section className="contact-form-section">
            {sent ? (
              <div className="contact-success animate-scale-in">
                <div className="contact-success-icon">✅</div>
                <h2 className="contact-success-title">{t('contact.success_title', '¡Mensaje enviado!')}</h2>
                <p className="contact-success-text">{t('contact.success', 'Gracias por contactarnos. Te responderemos pronto.')}</p>
              </div>
            ) : (
              <form className="contact-form animate-slide-in" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">{t('contact.name')}</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    value={form.name} 
                    onChange={handleChange} 
                    className={`form-input ${errors.name ? 'error' : ''}`} 
                    autoComplete="name"
                    placeholder={t('contact.name_placeholder', 'Tu nombre completo')}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">{t('contact.email')}</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={form.email} 
                    onChange={handleChange} 
                    className={`form-input ${errors.email ? 'error' : ''}`} 
                    autoComplete="email"
                    placeholder={t('contact.email_placeholder', 'tu@email.com')}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="subject" className="form-label">{t('contact.subject')}</label>
                  <input 
                    type="text" 
                    name="subject" 
                    id="subject" 
                    value={form.subject} 
                    onChange={handleChange} 
                    className={`form-input ${errors.subject ? 'error' : ''}`}
                    placeholder={t('contact.subject_placeholder', 'Asunto de tu mensaje')}
                  />
                  {errors.subject && <div className="form-error">{errors.subject}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">{t('contact.message')}</label>
                  <textarea 
                    name="message" 
                    id="message" 
                    rows={5} 
                    value={form.message} 
                    onChange={handleChange} 
                    className={`form-textarea ${errors.message ? 'error' : ''}`}
                    placeholder={t('contact.message_placeholder', 'Escribe tu mensaje aquí...')}
                  />
                  {errors.message && <div className="form-error">{errors.message}</div>}
                </div>

                <button 
                  type="submit" 
                  className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`} 
                  disabled={loading}
                >
                  {loading ? t('contact.sending') : t('contact.send')}
                </button>

                {errors.server && <div className="form-error mt-4">{errors.server}</div>}
              </form>
            )}
          </section>

          {/* Info Section */}
          <section className="contact-info-section animate-fade-in">
            <div className="contact-info-card">
              <h2 className="contact-info-title">{t('contact.info_title', 'Otras formas de contacto')}</h2>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <div className="contact-info-icon">📧</div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-label">Email</h3>
                    <a href="mailto:contacto@geotipico.com" className="contact-info-link">
                      contacto@geotipico.com
                    </a>
                  </div>
                </div>
                
                <div className="contact-info-item">
                  <div className="contact-info-icon">📱</div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-label">Instagram</h3>
                    <a 
                      href="https://instagram.com/geotipico" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="contact-info-link"
                    >
                      @geotipico
                    </a>
                  </div>
                </div>
                
                <div className="contact-info-item">
                  <div className="contact-info-icon">🌐</div>
                  <div className="contact-info-content">
                    <h3 className="contact-info-label">Facebook</h3>
                    <a 
                      href="https://facebook.com/geotipico" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="contact-info-link"
                    >
                      Geotipico
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact; 
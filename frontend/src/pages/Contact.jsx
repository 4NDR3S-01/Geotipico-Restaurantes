import React, { useState } from 'react';
import '../styles/Contact.css';
import { useTranslation } from 'react-i18next';

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
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrors({ server: data.error || 'Error al enviar. Intenta más tarde.' });
      }
    } catch (err) {
      setErrors({ server: 'Error de red. Intenta más tarde.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>{t('contact.title', 'Contacto')}</h1>
        <p className="contact-subtitle">{t('contact.subtitle', '¿Tienes preguntas, sugerencias o quieres agregar tu restaurante? ¡Escríbenos!')}</p>
      </div>
      <div className="contact-content">
        <form className="contact-form" onSubmit={handleSubmit} noValidate style={{ minHeight: 420 }}>
          {sent ? (
            <div className="contact-success" style={{marginTop: '2.5rem', marginBottom: '2.5rem', fontSize: '1.18rem'}}>
              {t('contact.success')}
            </div>
          ) : (
            <>
              <div className="contact-field">
                <label htmlFor="name">{t('contact.name')}</label>
                <input type="text" name="name" id="name" value={form.name} onChange={handleChange} className={errors.name ? 'error' : ''} autoComplete="name" />
                {errors.name && <span className="contact-error">{errors.name}</span>}
              </div>
              <div className="contact-field">
                <label htmlFor="email">{t('contact.email')}</label>
                <input type="email" name="email" id="email" value={form.email} onChange={handleChange} className={errors.email ? 'error' : ''} autoComplete="email" />
                {errors.email && <span className="contact-error">{errors.email}</span>}
              </div>
              <div className="contact-field">
                <label htmlFor="subject">{t('contact.subject')}</label>
                <input type="text" name="subject" id="subject" value={form.subject} onChange={handleChange} className={errors.subject ? 'error' : ''} />
                {errors.subject && <span className="contact-error">{errors.subject}</span>}
              </div>
              <div className="contact-field">
                <label htmlFor="message">{t('contact.message')}</label>
                <textarea name="message" id="message" rows={5} value={form.message} onChange={handleChange} className={errors.message ? 'error' : ''} />
                {errors.message && <span className="contact-error">{errors.message}</span>}
              </div>
              <button type="submit" className="contact-btn" disabled={loading}>{loading ? t('contact.sending') : t('contact.send')}</button>
              {errors.server && <div className="contact-error" style={{marginTop:8}}>{errors.server}</div>}
            </>
          )}
        </form>
        <div className="contact-info">
          <h2>{t('contact.info_title', 'Otras formas de contacto')}</h2>
          <ul className="contact-list">
            <li><span className="contact-icon">📧</span> Email: <a href="mailto:contacto@geotipico.com">contacto@geotipico.com</a></li>
            <li><span className="contact-icon">📱</span> Instagram: <a href="https://instagram.com/geotipico" target="_blank" rel="noopener noreferrer">@geotipico</a></li>
            <li><span className="contact-icon">🌐</span> Facebook: <a href="https://facebook.com/geotipico" target="_blank" rel="noopener noreferrer">Geotipico</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact; 
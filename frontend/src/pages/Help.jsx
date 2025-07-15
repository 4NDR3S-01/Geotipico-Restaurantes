import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/FAQ.css';
import { faqData } from '../data/faqData';
import { useLocation } from 'react-router-dom';

// const categoryLabels = {
//   general: 'General',
//   cuenta: 'Cuenta',
//   busqueda: 'Búsqueda',
//   contacto: 'Contacto',
//   soporte: 'Soporte',
//   seguridad: 'Seguridad',
//   privacidad: 'Privacidad',
//   notificaciones: 'Notificaciones',
//   costos: 'Costos',
//   idioma: 'Idioma',
//   contenido: 'Contenido',
//   accesibilidad: 'Accesibilidad',
//   movil: 'Móvil',
//   aporte: 'Aporte',
//   novedades: 'Novedades',
//   correo: 'Correo',
//   negocio: 'Negocio',
//   reseñas: 'Reseñas',
//   favoritos: 'Favoritos',
//   mapa: 'Mapa',
//   filtros: 'Filtros',
//   comunidad: 'Comunidad',
// };

const grouped = faqData.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {});

const Help = () => {
  const { t } = useTranslation();
  const [openCategory, setOpenCategory] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const location = useLocation();
  const questionRefs = useRef({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qKey = params.get('q');
    if (qKey) {
      const cat = Object.keys(grouped).find(cat => grouped[cat].some(item => item.q === qKey));
      if (cat) {
        setOpenCategory(cat);
        const idx = grouped[cat].findIndex(item => item.q === qKey);
        if (idx !== -1) setOpenIndex(idx);
        setTimeout(() => {
          const ref = questionRefs.current[`${cat}-${idx}`];
          if (ref) {
            ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
            ref.focus({ preventScroll: true });
          }
        }, 350);
      }
    }
    // eslint-disable-next-line
  }, [location.search]);

  const handleCategoryToggle = cat => {
    setOpenCategory(openCategory === cat ? null : cat);
    setOpenIndex(null);
  };

  const handleQuestionToggle = idx => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>{t('faq.title', 'Preguntas Frecuentes')}</h1>
        <p className="faq-subtitle">{t('faq.subtitle', 'Encuentra respuestas a las dudas más comunes sobre Geotípico.')}</p>
      </div>
      <div className="faq-categories-list">
        {Object.keys(grouped).map(cat => (
          <div className={`faq-category${openCategory === cat ? ' open' : ''}`} key={cat}>
            <button
              className="faq-category-title"
              onClick={() => handleCategoryToggle(cat)}
              aria-expanded={openCategory === cat}
              aria-controls={`faq-cat-panel-${cat}`}
              id={`faq-cat-header-${cat}`}
              type="button"
            >
              <span className="faq-category-label">{t(`faq.cat_${cat}`, cat)}</span>
              <span className="faq-category-arrow" aria-hidden="true">{openCategory === cat ? '▲' : '▼'}</span>
            </button>
            <div
              className="faq-category-panel"
              id={`faq-cat-panel-${cat}`}
              role="region"
              aria-labelledby={`faq-cat-header-${cat}`}
              style={{ display: openCategory === cat ? 'block' : 'none' }}
            >
              {grouped[cat].map((item, idx) => (
                <div className={`faq-item${openIndex === idx && openCategory === cat ? ' open' : ''}`} key={item.q} ref={el => questionRefs.current[`${cat}-${idx}`] = el} tabIndex={-1}>
                  <button
                    className="faq-question"
                    aria-expanded={openIndex === idx && openCategory === cat}
                    aria-controls={`faq-panel-${cat}-${idx}`}
                    id={`faq-header-${cat}-${idx}`}
                    onClick={() => handleQuestionToggle(idx)}
                    type="button"
                  >
                    <span className="faq-icon" aria-hidden="true">{item.icon}</span>
                    <span className="faq-q-text">{t(item.q)}</span>
                    <span className="faq-arrow" aria-hidden="true">{openIndex === idx && openCategory === cat ? '▲' : '▼'}</span>
                  </button>
                  <div
                    className="faq-answer"
                    id={`faq-panel-${cat}-${idx}`}
                    role="region"
                    aria-labelledby={`faq-header-${cat}-${idx}`}
                    style={{ display: openIndex === idx && openCategory === cat ? 'block' : 'none' }}
                  >
                    {t(item.a)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Help; 
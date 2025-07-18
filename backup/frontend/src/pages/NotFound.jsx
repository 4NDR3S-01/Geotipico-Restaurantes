
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';
import { useTranslation } from 'react-i18next';


const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">🍽️</div>
        <h1>{t('notfound.title')}</h1>
        <h2>{t('notfound.subtitle')}</h2>
        <p>{t('notfound.desc')}</p>
        <p>{t('notfound.suggestion')}</p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">{t('notfound.back_map')}</Link>
          <Link to="/about" className="btn-secondary">{t('notfound.about')}</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
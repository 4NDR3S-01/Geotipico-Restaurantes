import React from 'react';
import '../styles/About.css';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>{t('about.title')}</h1>
        <p className="subtitle">{t('about.subtitle')}</p>
      </div>
      <div className="about-content">
        <section className="about-section">
          <h2>{t('about.mission_title')}</h2>
          <p>{t('about.mission_1')}</p>
          <p>{t('about.mission_2')}</p>
        </section>
        <section className="about-section">
          <h2>{t('about.features_title')}</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>{t('about.feature_filters')}</h3>
              <p>{t('about.feature_filters_desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>{t('about.feature_gastronomy')}</h3>
              <p>{t('about.feature_gastronomy_desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>{t('about.feature_responsive')}</h3>
              <p>{t('about.feature_responsive_desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>{t('about.feature_map')}</h3>
              <p>{t('about.feature_map_desc')}</p>
            </div>
          </div>
        </section>
        <section className="about-section">
          <h2>{t('about.sources_title')}</h2>
          <p>{t('about.sources_desc')}</p>
          <div className="attribution">
            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">
              {t('about.attribution')}
            </a>
          </div>
        </section>
        <section className="about-section">
          <h2>{t('about.contact_title')}</h2>
          <p>{t('about.contact_desc')}</p>
          <a href="/contact" className="contact-button">
            {t('about.contact_button')}
          </a>
        </section>
      </div>
    </div>
  );
};

export default About;
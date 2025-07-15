import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/Home.css';

const Home = () => {
  const { t } = useTranslation();

  const missionBlocks = [
    {
      icon: '🌟',
      title: t('home.mission_title', 'Nuestra Misión'),
      text: t('home.mission_text', 'Promover y celebrar la riqueza culinaria manabita, conectando a turistas y locales con experiencias gastronómicas auténticas, responsables y memorables.')
    },
    {
      icon: '🚀',
      title: t('home.vision_title', 'Visión'),
      text: t('home.vision_text', 'Ser la plataforma líder en Ecuador para descubrir, valorar y preservar la cultura gastronómica local, impulsando el desarrollo ético y sostenible de la región.')
    },
    {
      icon: '🤝',
      title: t('home.why_title', '¿Por qué Geotípico?'),
      text: t('home.why_text', 'Porque creemos que la gastronomía es identidad, historia y motor de desarrollo. Aquí encontrarás información confiable, recomendaciones honestas y una comunidad apasionada por la buena mesa.')
    }
  ];

  const values = [
    { label: t('home.value_authenticity', 'Autenticidad'), desc: t('home.value_authenticity_desc', 'Promovemos lo genuino y típico de nuestra tierra.'), icon: '🔖' },
    { label: t('home.value_ethics', 'Ética'), desc: t('home.value_ethics_desc', 'Respetamos la cultura, el entorno y a las personas.'), icon: '🧭' },
    { label: t('home.value_innovation', 'Innovación'), desc: t('home.value_innovation_desc', 'Apostamos por la tecnología para conectar y crecer.'), icon: '💡' },
    { label: t('home.value_sustainability', 'Sostenibilidad'), desc: t('home.value_sustainability_desc', 'Apoyamos prácticas responsables y locales.'), icon: '🌱' },
    { label: t('home.value_collaboration', 'Colaboración'), desc: t('home.value_collaboration_desc', 'Creemos en el trabajo conjunto con la comunidad.'), icon: '🤲' },
  ];

  return (
    <div className="home-bg">
      <div className="home-container">
        <div className="home-header">
          <span className="home-header-icon">🍽️</span>
          <h1 className="home-title">{t('home.title', 'Bienvenido a Geotípico')}</h1>
          <p className="home-subtitle">{t('home.subtitle', 'Descubre, saborea y comparte la auténtica gastronomía de Manta y Manabí')}</p>
        </div>
        <div className="home-content">
          {/* Bloques principales */}
          {missionBlocks.map((block, i) => (
            <section
              key={block.title}
              className="home-section"
            >
              <span className="home-header-icon">{block.icon}</span>
              <h2 className="home-section-title">{block.title}</h2>
              <p className="home-section-text">{block.text}</p>
            </section>
          ))}
          {/* Valores */}
          <section className="home-values-section">
            <span className="home-header-icon">💎</span>
            <h2 className="home-section-title">{t('home.values_title', 'Nuestros Valores')}</h2>
            <ul className="home-values-list">
              {values.map(val => (
                <li key={val.label} className="home-value-badge">
                  <span className="home-value-icon">{val.icon}</span>
                  <span className="home-value-label">{val.label}</span>
                  <span className="home-value-desc">{val.desc}</span>
                </li>
              ))}
            </ul>
          </section>
          {/* CTA */}
          <section className="home-cta-section">
            <span className="home-header-icon" style={{color:'var(--text-light)'}}>🌊</span>
            <h2 className="home-cta-title">{t('home.cta_title', 'Únete a la experiencia')}</h2>
            <p className="home-cta-text">{t('home.cta_text', '¿Eres amante de la gastronomía, turista curioso o dueño de un restaurante?')} <br/> <strong>Geotípico</strong> {t('home.cta_text2', 'es tu espacio para descubrir, compartir y crecer juntos.')}</p>
            <a href="/contact" className="home-cta-btn">{t('home.cta_btn', 'Contáctanos y sé parte de la comunidad')}</a>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home; 
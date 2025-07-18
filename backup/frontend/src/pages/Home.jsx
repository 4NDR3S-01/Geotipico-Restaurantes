import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = React.memo(() => {
  const { t } = useTranslation();

  const heroData = useMemo(() => ({
    icon: '🍽️',
    title: t('home.hero_title', 'Descubre los Sabores Auténticos de Manabí'),
    subtitle: t('home.hero_subtitle', 'Tu guía gastronómica para explorar los restaurantes más emblemáticos y deliciosos de la región manabita.')
  }), [t]);

  const featuresData = useMemo(() => [
    {
      icon: '🗺️',
      title: t('home.feature_explore_title', 'Explora con Facilidad'),
      description: t('home.feature_explore_desc', 'Encuentra restaurantes cerca de ti con nuestro mapa interactivo y sistema de filtros avanzado.'),
      id: 'explore'
    },
    {
      icon: '⭐',
      title: t('home.feature_quality_title', 'Calidad Garantizada'),
      description: t('home.feature_quality_desc', 'Cada establecimiento es cuidadosamente seleccionado para ofrecerte solo las mejores experiencias culinarias.'),
      id: 'quality'
    },
    {
      icon: '🌱',
      title: t('home.feature_local_title', 'Apoyo Local'),
      description: t('home.feature_local_desc', 'Promovemos restaurantes locales que preservan la tradición gastronómica manabita con ingredientes frescos y recetas auténticas.'),
      id: 'local'
    }
  ], [t]);

  const valuesData = useMemo(() => [
    {
      icon: '🔖',
      title: t('home.value_authenticity_title', 'Autenticidad'),
      description: t('home.value_authenticity_desc', 'Celebramos lo genuino y típico de nuestra tierra manabita.'),
      id: 'authenticity'
    },
    {
      icon: '🌿',
      title: t('home.value_sustainability_title', 'Sostenibilidad'),
      description: t('home.value_sustainability_desc', 'Promovemos prácticas responsables con el medio ambiente.'),
      id: 'sustainability'
    },
    {
      icon: '🤝',
      title: t('home.value_community_title', 'Comunidad'),
      description: t('home.value_community_desc', 'Fortalecemos los lazos entre restaurantes y comensales.'),
      id: 'community'
    },
    {
      icon: '💡',
      title: t('home.value_innovation_title', 'Innovación'),
      description: t('home.value_innovation_desc', 'Usamos tecnología para mejorar tu experiencia gastronómica.'),
      id: 'innovation'
    }
  ], [t]);

  const statsData = useMemo(() => [
    {
      number: '150+',
      label: t('home.stats_restaurants', 'Restaurantes'),
      icon: '🏪',
      id: 'restaurants'
    },
    {
      number: '25+',
      label: t('home.stats_cities', 'Ciudades'),
      icon: '🌆',
      id: 'cities'
    },
    {
      number: '5000+',
      label: t('home.stats_reviews', 'Reseñas'),
      icon: '📝',
      id: 'reviews'
    },
    {
      number: '98%',
      label: t('home.stats_satisfaction', 'Satisfacción'),
      icon: '😊',
      id: 'satisfaction'
    }
  ], [t]);

  return (
    <main className="home" role="main" aria-label={t('home.page_label', 'Página principal de Geotípico Restaurantes')}>
      {/* Hero Section */}
      <header className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-icon" aria-hidden="true">
            {heroData.icon}
          </div>
          <h1 className="home-hero-title">
            {heroData.title}
          </h1>
          <p className="home-hero-subtitle">
            {heroData.subtitle}
          </p>
          <div className="home-hero-actions">
            <Link 
              to="/mapa" 
              className="btn btn-primary btn-lg home-hero-cta"
              aria-label={t('home.cta_explore_aria', 'Explorar restaurantes en el mapa')}
            >
              <span className="btn-icon" aria-hidden="true">🗺️</span>
              {t('home.cta_explore', 'Explorar Restaurantes')}
            </Link>
            <Link 
              to="/about" 
              className="btn btn-outline btn-lg home-hero-secondary"
              aria-label={t('home.cta_about_aria', 'Conocer más sobre nosotros')}
            >
              {t('home.cta_about', 'Conocer Más')}
            </Link>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="home-stats" aria-labelledby="stats-title">
        <div className="home-stats-container">
          <h2 id="stats-title" className="home-stats-title">
            {t('home.stats_title', 'Números que Hablan por Nosotros')}
          </h2>
          <div className="home-stats-grid">
            {statsData.map((stat) => (
              <div key={stat.id} className="home-stat-card">
                <div className="home-stat-icon" aria-hidden="true">
                  {stat.icon}
                </div>
                <div className="home-stat-number">
                  {stat.number}
                </div>
                <div className="home-stat-label">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features" aria-labelledby="features-title">
        <div className="home-features-container">
          <header className="home-features-header">
            <h2 id="features-title" className="home-features-title">
              {t('home.features_title', '¿Por qué Elegir Geotípico?')}
            </h2>
            <p className="home-features-subtitle">
              {t('home.features_subtitle', 'Descubre las ventajas que te ofrecemos para una experiencia gastronómica única')}
            </p>
          </header>
          <div className="home-features-grid">
            {featuresData.map((feature) => (
              <article key={feature.id} className="home-feature-card">
                <div className="home-feature-icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="home-feature-title">
                  {feature.title}
                </h3>
                <p className="home-feature-description">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="home-values" aria-labelledby="values-title">
        <div className="home-values-container">
          <header className="home-values-header">
            <h2 id="values-title" className="home-values-title">
              {t('home.values_title', 'Nuestros Valores')}
            </h2>
            <p className="home-values-subtitle">
              {t('home.values_subtitle', 'Los principios que guían nuestra misión de promover la gastronomía manabita')}
            </p>
          </header>
          <div className="home-values-grid">
            {valuesData.map((value) => (
              <article key={value.id} className="home-value-card">
                <div className="home-value-icon" aria-hidden="true">
                  {value.icon}
                </div>
                <h3 className="home-value-title">
                  {value.title}
                </h3>
                <p className="home-value-description">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="home-cta" aria-labelledby="cta-title">
        <div className="home-cta-container">
          <div className="home-cta-content">
            <h2 id="cta-title" className="home-cta-title">
              {t('home.cta_title', '¿Listo para Descubrir los Mejores Sabores?')}
            </h2>
            <p className="home-cta-description">
              {t('home.cta_description', 'Únete a miles de personas que ya han descubierto los restaurantes más auténticos de Manabí. ¡Tu próxima aventura culinaria te espera!')}
            </p>
            <div className="home-cta-actions">
              <Link 
                to="/mapa" 
                className="btn btn-primary btn-xl home-cta-primary"
                aria-label={t('home.cta_start_aria', 'Comenzar a explorar restaurantes')}
              >
                <span className="btn-icon" aria-hidden="true">🚀</span>
                {t('home.cta_start', 'Comenzar Ahora')}
              </Link>
              <Link 
                to="/contact" 
                className="btn btn-ghost btn-xl home-cta-secondary"
                aria-label={t('home.cta_contact_aria', 'Contactar con el equipo')}
              >
                {t('home.cta_contact', 'Contáctanos')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
});

Home.displayName = 'Home';

export default Home;

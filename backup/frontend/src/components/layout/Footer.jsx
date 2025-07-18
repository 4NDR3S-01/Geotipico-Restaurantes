import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../../styles/Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: t('footer.company', 'Empresa'),
      links: [
        { label: t('footer.about', 'Acerca de'), to: '/about' },
        { label: t('footer.contact', 'Contacto'), to: '/contact' },
        { label: t('footer.help', 'Ayuda'), to: '/help' },
      ]
    },
    {
      title: t('footer.legal', 'Legal'),
      links: [
        { label: t('footer.privacy', 'Privacidad'), to: '/privacy' },
        { label: t('footer.terms', 'Términos'), to: '/terms' },
        { label: t('footer.cookies', 'Cookies'), to: '/cookies' },
      ]
    },
    {
      title: t('footer.social', 'Social'),
      links: [
        { label: 'Instagram', href: 'https://instagram.com/geotipico', icon: <FaInstagram /> },
        { label: 'Twitter', href: 'https://twitter.com/geotipico', icon: <FaTwitter /> },
        { label: 'LinkedIn', href: 'https://linkedin.com/company/geotipico', icon: <FaLinkedin /> },
      ]
    }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Logo y descripción */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">🍽️</span>
              <span className="footer-logo-text">Geotípico</span>
            </Link>
            <p className="footer-description">
              {t('footer.description', 'Descubre, saborea y comparte la auténtica gastronomía de Manta y Manabí. Conectamos a turistas y locales con experiencias gastronómicas únicas y responsables.')}
            </p>
            <div className="footer-social">
              {footerLinks[2].links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-link"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Enlaces organizados */}
          <div className="footer-links">
            {footerLinks.slice(0, 2).map((section, index) => (
              <div key={index} className="footer-section">
                <h3 className="footer-section-title">{section.title}</h3>
                <ul className="footer-section-links">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={link.to} className="footer-link">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="footer-divider"></div>

        {/* Información legal y copyright */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>
              © {currentYear} Geotípico. {t('footer.rights', 'Todos los derechos reservados.')}
            </p>
            <p className="footer-made-with">
              {t('footer.made_with', 'Hecho con')} <FaHeart className="footer-heart" /> {t('footer.in_ecuador', 'en Ecuador')}
            </p>
          </div>
          
          <div className="footer-legal">
            <Link to="/privacy" className="footer-legal-link">
              {t('footer.privacy', 'Privacidad')}
            </Link>
            <span className="footer-legal-separator">•</span>
            <Link to="/terms" className="footer-legal-link">
              {t('footer.terms', 'Términos')}
            </Link>
            <span className="footer-legal-separator">•</span>
            <Link to="/cookies" className="footer-legal-link">
              {t('footer.cookies', 'Cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
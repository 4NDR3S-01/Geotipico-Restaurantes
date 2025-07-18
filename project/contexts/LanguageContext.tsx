'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  es: {
    'nav.home': 'Inicio',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'nav.help': 'Ayuda',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Registrarse',
    'nav.logout': 'Cerrar Sesión',
    'nav.dashboard': 'Dashboard',
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo Electrónico',
    'auth.password': 'Contraseña',
    'auth.name': 'Nombre',
    'auth.login.button': 'Iniciar Sesión',
    'auth.register.button': 'Registrarse',
    'auth.forgot.password': '¿Olvidaste tu contraseña?',
    'auth.reset.password': 'Restablecer contraseña',
    'auth.no.account': '¿No tienes cuenta?',
    'auth.have.account': '¿Ya tienes cuenta?',
    'home.title': 'Encuentra los Mejores Restaurantes en Manta',
    'home.subtitle': 'Descubre restaurantes cerca de ti con nuestra tecnología de geolocalización',
    'home.cta': 'Comenzar Ahora',
    'search.placeholder': 'Buscar restaurantes...',
    'search.filters': 'Filtros',
    'map.loading': 'Cargando mapa...',
    'restaurant.distance': 'distancia',
    'restaurant.open': 'Abierto',
    'restaurant.closed': 'Cerrado',
    'notifications.title': 'Notificaciones',
    'notifications.empty': 'No tienes notificaciones',
    'theme.light': 'Tema Claro',
    'theme.dark': 'Tema Oscuro',
    'language.spanish': 'Español',
    'language.english': 'English',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.help': 'Help',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.login.button': 'Login',
    'auth.register.button': 'Register',
    'auth.forgot.password': 'Forgot your password?',
    'auth.reset.password': 'Reset password',
    'auth.no.account': "Don't have an account?",
    'auth.have.account': 'Already have an account?',
    'home.title': 'Find the Best Restaurants in Manta',
    'home.subtitle': 'Discover restaurants near you with our geolocation technology',
    'home.cta': 'Get Started',
    'search.placeholder': 'Search restaurants...',
    'search.filters': 'Filters',
    'map.loading': 'Loading map...',
    'restaurant.distance': 'away',
    'restaurant.open': 'Open',
    'restaurant.closed': 'Closed',
    'notifications.title': 'Notifications',
    'notifications.empty': 'You have no notifications',
    'theme.light': 'Light Theme',
    'theme.dark': 'Dark Theme',
    'language.spanish': 'Español',
    'language.english': 'English',
  },
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
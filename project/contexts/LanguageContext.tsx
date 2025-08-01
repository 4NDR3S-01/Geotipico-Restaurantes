'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
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
    // Dashboard
    'dashboard.location.unavailable.title': 'Ubicación no disponible',
    'dashboard.location.unavailable.message': 'Se utilizará la ubicación predeterminada de Manta',
    'dashboard.location.unsupported.title': 'Geolocalización no soportada',
    'dashboard.location.unsupported.message': 'Tu navegador no soporta geolocalización',
    'dashboard.restaurants.loaded.title': 'Restaurantes cargados',
    'dashboard.restaurants.loaded.message': 'Se encontraron {count} restaurantes cerca de ti',
    'dashboard.restaurants.error.title': 'Error al cargar restaurantes',
    'dashboard.restaurants.error.message': 'No se pudieron cargar los restaurantes. Intenta nuevamente.',
    'dashboard.loading.aria': 'Cargando dashboard',
    'dashboard.loading': 'Cargando dashboard...',
    'dashboard.sr.title': 'Dashboard de Restaurantes',
    'dashboard.welcome': '¡Bienvenido',
    'dashboard.subtitle': 'Descubre restaurantes increíbles cerca de ti',
    'dashboard.tabs.aria': 'Vista de restaurantes',
    'dashboard.tabs.map.aria': 'Vista de mapa',
    'dashboard.tabs.map': 'Mapa',
    'dashboard.tabs.list.aria': 'Vista de lista',
    'dashboard.tabs.list': 'Lista',
    'dashboard.selected.title': 'Restaurante Seleccionado',
    'dashboard.nearby.title': 'Restaurantes Cerca',
    'dashboard.nearby.count': '{count} restaurantes encontrados',
    'dashboard.loading.restaurants.aria': 'Cargando restaurantes',
    'dashboard.loading.restaurants': 'Cargando restaurantes...',
    'dashboard.select.restaurant': 'Seleccionar {name}',
    'dashboard.noresults': 'No se encontraron restaurantes con los filtros seleccionados',
    // About
    'about.subtitle': 'Conoce más sobre nuestra misión de conectar a las personas con los mejores restaurantes de Manta',
    'about.card.location.title': 'Ubicación Precisa',
    'about.card.location.desc': 'Utilizamos tecnología GPS avanzada para mostrar restaurantes cerca de ti',
    'about.card.community.title': 'Comunidad Local',
    'about.card.community.desc': 'Apoyamos a los restaurantes locales de Manta y promovemos la gastronomía ecuatoriana',
    'about.card.easy.title': 'Fácil de Usar',
    'about.card.easy.desc': 'Interfaz intuitiva y moderna diseñada para una experiencia de usuario excepcional',
    'about.card.love.title': 'Hecho con Amor',
    'about.card.love.desc': 'Desarrollado por ecuatorianos para ecuatorianos, con pasión por la buena comida',
    // Ayuda
    'help.subtitle': 'Encuentra respuestas a las preguntas más frecuentes',
    'help.search.placeholder': 'Buscar en la ayuda...',
    'help.q.filters.a': 'Puedes usar los filtros haciendo clic en el botón de filtro junto a la barra de búsqueda. Selecciona el tipo de cocina, rango de precios y otras opciones para refinar tu búsqueda.',
    'help.q.favorites.q': '¿Puedo guardar restaurantes favoritos?',
    'help.q.favorites.a': 'Esta funcionalidad estará disponible en futuras actualizaciones. Por ahora, puedes tomar nota de los restaurantes que más te gusten.',
    'help.q.language.q': '¿Cómo cambio el idioma?',
    'help.q.language.a': 'Puedes cambiar el idioma haciendo clic en el botón del globo terráqueo en la parte superior derecha y seleccionando entre español o inglés.',
    'help.noresults': 'No se encontraron resultados para "{searchQuery}"',
    'help.noresults.suggestion': 'Intenta con otros términos de búsqueda',
    'help.contact.title': '¿No encontraste lo que buscabas?',
    'help.contact.desc': 'Si no pudiste encontrar la respuesta a tu pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.',
    'help.contact.email.label': 'Email:',
    'help.contact.phone.label': 'Teléfono:',
    // Registro
    'register.sr.title': 'Registrarse en Geotipicos',
    'register.back.home': 'Regresar al inicio',
    'register.subtitle': 'Crea tu cuenta para comenzar a explorar',
    'register.placeholder.name': 'Tu nombre completo',
    'register.placeholder.email': 'tu@email.com',
    'register.placeholder.password': 'Mínimo 6 caracteres',
    'register.hide.password': 'Ocultar contraseña',
    'register.show.password': 'Mostrar contraseña',
    'register.help.password': 'La contraseña debe tener al menos 6 caracteres',
    'register.strength.label': 'Fortaleza',
    'register.strength.0': 'Débil',
    'register.strength.1': 'Débil',
    'register.strength.2': 'Media',
    'register.strength.3': 'Fuerte',
    'register.strength.4': 'Muy fuerte',
    'register.loading': 'Creando cuenta...',
    'register.loading.message': 'Creando tu cuenta, por favor espera',
    'register.error.name.required': 'El nombre es obligatorio',
    'register.error.email.required': 'El email es obligatorio',
    'register.error.email.invalid': 'El email no es válido',
    'register.error.password.required': 'La contraseña es obligatoria',
    'register.error.password.length': 'La contraseña debe tener al menos 6 caracteres',
    'register.error.create': 'Error al crear la cuenta',
    'register.error.register': 'Error al registrar usuario',
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
    // Dashboard
    'dashboard.location.unavailable.title': 'Location unavailable',
    'dashboard.location.unavailable.message': 'Default location for Manta will be used',
    'dashboard.location.unsupported.title': 'Geolocation not supported',
    'dashboard.location.unsupported.message': 'Your browser does not support geolocation',
    'dashboard.restaurants.loaded.title': 'Restaurants loaded',
    'dashboard.restaurants.loaded.message': '{count} restaurants found near you',
    'dashboard.restaurants.error.title': 'Error loading restaurants',
    'dashboard.restaurants.error.message': 'Could not load restaurants. Please try again.',
    'dashboard.loading.aria': 'Loading dashboard',
    'dashboard.loading': 'Loading dashboard...',
    'dashboard.sr.title': 'Restaurants Dashboard',
    'dashboard.welcome': 'Welcome, ',
    'dashboard.subtitle': 'Discover amazing restaurants near you',
    'dashboard.tabs.aria': 'Restaurants view',
    'dashboard.tabs.map.aria': 'Map view',
    'dashboard.tabs.map': 'Map',
    'dashboard.tabs.list.aria': 'List view',
    'dashboard.tabs.list': 'List',
    'dashboard.selected.title': 'Selected Restaurant',
    'dashboard.nearby.title': 'Nearby Restaurants',
    'dashboard.nearby.count': '{count} restaurants found',
    'dashboard.loading.restaurants.aria': 'Loading restaurants',
    'dashboard.loading.restaurants': 'Loading restaurants...',
    'dashboard.select.restaurant': 'Select {name}',
    'dashboard.noresults': 'No restaurants found with the selected filters',
    // About
    'about.subtitle': 'Learn more about our mission to connect people with the best restaurants in Manta',
    'about.card.location.title': 'Accurate Location',
    'about.card.location.desc': 'We use advanced GPS technology to show restaurants near you',
    'about.card.community.title': 'Local Community',
    'about.card.community.desc': 'We support local restaurants in Manta and promote Ecuadorian gastronomy',
    'about.card.easy.title': 'Easy to Use',
    'about.card.easy.desc': 'Intuitive and modern interface designed for an exceptional user experience',
    'about.card.love.title': 'Made with Love',
    'about.card.love.desc': 'Developed by Ecuadorians for Ecuadorians, with a passion for good food',
    // Help
    'help.subtitle': 'Find answers to the most frequently asked questions',
    'help.search.placeholder': 'Search in help...',
    'help.q.filters.a': 'You can use the filters by clicking the filter button next to the search bar. Select cuisine type, price range, and other options to refine your search.',
    'help.q.favorites.q': 'Can I save favorite restaurants?',
    'help.q.favorites.a': 'This feature will be available in future updates. For now, you can take note of the restaurants you like the most.',
    'help.q.language.q': 'How do I change the language?',
    'help.q.language.a': 'You can change the language by clicking the globe button at the top right and selecting between Spanish or English.',
    'help.noresults': 'No results found for "{searchQuery}"',
    'help.noresults.suggestion': 'Try other search terms',
    'help.contact.title': 'Didn\'t find what you were looking for?',
    'help.contact.desc': 'If you couldn\'t find the answer to your question, feel free to contact us. We are here to help you.',
    'help.contact.email.label': 'Email:',
    'help.contact.phone.label': 'Phone:',
    // Register
    'register.sr.title': 'Register at Geotipicos',
    'register.back.home': 'Back to home',
    'register.subtitle': 'Create your account to start exploring',
    'register.placeholder.name': 'Your full name',
    'register.placeholder.email': 'your@email.com',
    'register.placeholder.password': 'Minimum 6 characters',
    'register.hide.password': 'Hide password',
    'register.show.password': 'Show password',
    'register.help.password': 'Password must be at least 6 characters',
    'register.strength.label': 'Strength',
    'register.strength.0': 'Weak',
    'register.strength.1': 'Weak',
    'register.strength.2': 'Medium',
    'register.strength.3': 'Strong',
    'register.strength.4': 'Very strong',
    'register.loading': 'Creating account...',
    'register.loading.message': 'Creating your account, please wait',
    'register.error.name.required': 'Name is required',
    'register.error.email.required': 'Email is required',
    'register.error.email.invalid': 'Email is not valid',
    'register.error.password.required': 'Password is required',
    'register.error.password.length': 'Password must be at least 6 characters',
    'register.error.create': 'Error creating account',
    'register.error.register': 'Error registering user',
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


  const contextValue = useMemo(() => {
    const t = (key: string): string => {
      return (translations[language] as Record<string, string>)[key] || key;
    };
    return {
      language,
      setLanguage: handleSetLanguage,
      t,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
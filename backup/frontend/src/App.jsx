import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/variables.css';
import './styles/global.css';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Loader from './components/common/Loader';

// Common components
import ErrorBoundary from './components/common/ErrorBoundary';

// Context
import { AuthProvider } from './context/AuthContext';
import { FaqSearchProvider } from './context/FaqSearchContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages - Lazy loading para mejorar performance
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Help = React.lazy(() => import('./pages/Help'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Mapa = React.lazy(() => import('./pages/Mapa'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Auth components - Lazy loading
const Login = React.lazy(() => import('./components/auth/login'));
const Register = React.lazy(() => import('./components/auth/Register'));
const ForgotPassword = React.lazy(() => import('./components/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./components/auth/ResetPassword'));

// Dashboard components - Lazy loading
const DashboardLayout = React.lazy(() => import('./components/dashboard/DashboardLayout'));
const DashboardHome = React.lazy(() => import('./components/dashboard/DashboardHome'));

function App() {
  const { i18n } = useTranslation();

  // Inicializar idioma al cargar la app
  useEffect(() => {
    // Aplicar idioma guardado
    const savedLang = localStorage.getItem('lang') || 'es';
    i18n.changeLanguage(savedLang);
    
    // Aplicar dirección del texto según idioma
    document.documentElement.dir = ['ar', 'he', 'fa'].includes(savedLang) ? 'rtl' : 'ltr';
    
    // Configurar atributos de idioma para accesibilidad
    document.documentElement.lang = savedLang;
  }, [i18n]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <FaqSearchProvider>
          <ErrorBoundary>
            <Router>
              <div className="App">
                {/* Skip link para accesibilidad */}
                <a href="#main-content" className="skip-link">
                  Saltar al contenido principal
                </a>
                
                <Navbar />
                
                <main id="main-content" className="main-content" role="main">
                  <Suspense fallback={
                    <div className="loader-container" style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      minHeight: '60vh' 
                    }}>
                      <Loader size="large" />
                    </div>
                  }>
                    <Routes>
                      {/* Rutas públicas */}
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/mapa" element={<Mapa />} />
                      
                      {/* Rutas de autenticación */}
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      
                      {/* Rutas del dashboard (protegidas) */}
                      <Route path="/dashboard" element={<DashboardLayout />}>
                        <Route index element={<DashboardHome />} />
                        <Route 
                          path="profile" 
                          element={
                            <div className="container" style={{ padding: 'var(--space-8)' }}>
                              <h1>Perfil del Usuario</h1>
                              <p>Contenido del perfil próximamente...</p>
                            </div>
                          } 
                        />
                      </Route>
                      
                      {/* Ruta 404 */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                
                <Footer />
                
                {/* Toast Container para notificaciones */}
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="light"
                />
              </div>
            </Router>
          </ErrorBoundary>
        </FaqSearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

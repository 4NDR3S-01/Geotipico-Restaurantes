'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Search, Clock, Star } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-label="Cargando aplicación">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <span className="sr-only">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main role="main">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="hero-title">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 id="hero-title" className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                {t('home.title')}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => router.push('/register')} 
                  className="text-lg px-8 py-3"
                  aria-label="Comenzar ahora - Crear cuenta"
                >
                  {t('home.cta')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => router.push('/login')} 
                  className="text-lg px-8 py-3"
                  aria-label="Iniciar sesión en cuenta existente"
                >
                  {t('nav.login')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="features-title">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 id="features-title" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                ¿Por qué elegir Manta Restaurants?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Descubre las mejores características de nuestra plataforma
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
              <Card className="text-center" role="listitem">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <CardTitle>Geolocalización</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Encuentra restaurantes cerca de tu ubicación con precisión GPS
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center" role="listitem">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
                  </div>
                  <CardTitle>Búsqueda Avanzada</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Filtra por tipo de cocina, precio, calificación y más
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center" role="listitem">
                <CardHeader>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" aria-hidden="true" />
                  </div>
                  <CardTitle>Tiempo Real</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Información actualizada de horarios y disponibilidad
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center" role="listitem">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" aria-hidden="true" />
                  </div>
                  <CardTitle>Calificaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Consulta reseñas y calificaciones de otros usuarios
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 dark:bg-blue-800" aria-labelledby="cta-title">
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="cta-title" className="text-3xl font-bold text-white mb-6">
              ¡Empieza a explorar ahora!
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Únete a miles de usuarios que ya descubren los mejores restaurantes de Manta
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => router.push('/register')} 
              className="text-lg px-8 py-3"
              aria-label="Crear cuenta gratuita"
            >
              Crear cuenta gratis
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('nav.about')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>{t('about.card.location.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.card.location.desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>{t('about.card.community.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.card.community.desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>{t('about.card.easy.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.card.easy.desc')}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>{t('about.card.love.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400">
                {t('about.card.love.desc')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Nuestra Historia
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                Manta Restaurants nació de la necesidad de conectar a los habitantes y visitantes 
                de Manta con los mejores restaurantes de la ciudad. Como manabitas, entendemos 
                la importancia de la gastronomía en nuestra cultura.
              </p>
              <p>
                Nuestra plataforma utiliza tecnología de geolocalización para ayudarte a descubrir 
                restaurantes cerca de ti, desde los tradicionales locales de mariscos hasta los 
                modernos restaurantes de cocina internacional.
              </p>
              <p>
                Creemos que cada comida es una oportunidad para crear memorias, y queremos ser 
                parte de esos momentos especiales conectándote con los lugares perfectos para 
                disfrutar de la mejor comida.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-teal-100 dark:from-blue-900 dark:to-teal-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Manta, Ecuador
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  El corazón de nuestra plataforma
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Nuestros Valores
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Transparencia
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mostramos información real y actualizada de todos los restaurantes
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Simplicidad
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hacemos que encontrar un buen restaurante sea fácil y rápido
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Compromiso Local
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Apoyamos el crecimiento y desarrollo de la gastronomía local
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, HelpCircle, MapPin, User, Settings } from 'lucide-react';

export default function HelpPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Primeros pasos',
      icon: <HelpCircle className="h-5 w-5" />,
      questions: [
        {
          question: '¿Cómo me registro en la plataforma?',
          answer: 'Para registrarte, haz clic en "Registrarse" en la esquina superior derecha, completa el formulario con tu nombre, email y contraseña. Una vez registrado, podrás acceder a todas las funcionalidades.',
        },
        {
          question: '¿Qué necesito para empezar a usar Manta Restaurants?',
          answer: 'Solo necesitas una cuenta gratuita y permitir el acceso a tu ubicación para obtener mejores resultados. La plataforma funciona en cualquier dispositivo con conexión a internet.',
        },
        {
          question: '¿Es necesario descargar una aplicación?',
          answer: 'No, Manta Restaurants es una aplicación web que funciona directamente en tu navegador. No necesitas descargar nada.',
        },
      ],
    },
    {
      id: 'location',
      title: 'Ubicación y mapas',
      icon: <MapPin className="h-5 w-5" />,
      questions: [
        {
          question: '¿Cómo funciona la geolocalización?',
          answer: 'Utilizamos tu ubicación GPS para mostrar restaurantes cercanos. Puedes permitir o denegar el acceso a la ubicación en cualquier momento desde la configuración de tu navegador.',
        },
        {
          question: '¿Qué hago si la ubicación no es precisa?',
          answer: 'Asegúrate de que tu dispositivo tenga activado el GPS y que hayas dado permisos de ubicación al navegador. También puedes actualizar tu ubicación haciendo clic en el botón de ubicación en el mapa.',
        },
        {
          question: '¿Puedo buscar restaurantes en otra ciudad?',
          answer: 'Actualmente nos enfocamos en Manta, pero estamos trabajando para expandir a otras ciudades de Ecuador próximamente.',
        },
      ],
    },
    {
      id: 'account',
      title: 'Cuenta y perfil',
      icon: <User className="h-5 w-5" />,
      questions: [
        {
          question: '¿Cómo cambio mi contraseña?',
          answer: 'Próximamente agregaremos la funcionalidad de cambio de contraseña. Por ahora, puedes contactarnos si necesitas ayuda con tu cuenta.',
        },
        {
          question: '¿Puedo eliminar mi cuenta?',
          answer: 'Sí, puedes solicitar la eliminación de tu cuenta contactándonos a través de la página de contacto.',
        },
        {
          question: '¿Mis datos están seguros?',
          answer: 'Sí, utilizamos encriptación para proteger tus datos y no compartimos tu información personal con terceros.',
        },
      ],
    },
    {
      id: 'features',
      title: 'Funcionalidades',
      icon: <Settings className="h-5 w-5" />,
      questions: [
        {
          question: '¿Cómo uso los filtros de búsqueda?',
          answer: 'Puedes usar los filtros haciendo clic en el botón de filtro junto a la barra de búsqueda. Selecciona el tipo de cocina, rango de precios y otras opciones para refinar tu búsqueda.',
        },
        {
          question: '¿Puedo guardar restaurantes favoritos?',
          answer: 'Esta funcionalidad estará disponible en futuras actualizaciones. Por ahora, puedes tomar nota de los restaurantes que más te gusten.',
        },
        {
          question: '¿Cómo cambio el idioma?',
          answer: 'Puedes cambiar el idioma haciendo clic en el botón del globo terráqueo en la parte superior derecha y seleccionando entre español o inglés.',
        },
      ],
    },
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('nav.help')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Encuentra respuestas a las preguntas más frecuentes
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar en la ayuda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-lg"
          />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {category.icon}
                  <span>{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`${category.id}-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCategories.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No se encontraron resultados para "{searchQuery}"
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}

        {/* Contact Support */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>¿No encontraste lo que buscabas?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Si no pudiste encontrar la respuesta a tu pregunta, no dudes en contactarnos. 
              Estamos aquí para ayudarte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                <span className="text-sm font-medium">contacto@mantarestaurants.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Teléfono:</span>
                <span className="text-sm font-medium">+593 99 123 4567</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
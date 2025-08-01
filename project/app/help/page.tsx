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
      title: t('help.category.getting_started'),
      icon: <HelpCircle className="h-5 w-5" />,
      questions: [
        {
          question: t('help.q.register.q'),
          answer: t('help.q.register.a'),
        },
        {
          question: t('help.q.requirements.q'),
          answer: t('help.q.requirements.a'),
        },
        {
          question: t('help.q.app.q'),
          answer: t('help.q.app.a'),
        },
      ],
    },
    {
      id: 'location',
      title: t('help.category.location'),
      icon: <MapPin className="h-5 w-5" />,
      questions: [
        {
          question: t('help.q.geolocation.q'),
          answer: t('help.q.geolocation.a'),
        },
        {
          question: t('help.q.inaccurate_location.q'),
          answer: t('help.q.inaccurate_location.a'),
        },
        {
          question: t('help.q.other_city.q'),
          answer: t('help.q.other_city.a'),
        },
      ],
    },
    {
      id: 'account',
      title: t('help.category.account'),
      icon: <User className="h-5 w-5" />,
      questions: [
        {
          question: t('help.q.change_password.q'),
          answer: t('help.q.change_password.a'),
        },
        {
          question: t('help.q.delete_account.q'),
          answer: t('help.q.delete_account.a'),
        },
        {
          question: t('help.q.data_security.q'),
          answer: t('help.q.data_security.a'),
        },
      ],
    },
    {
      id: 'features',
      title: t('help.category.features'),
      icon: <Settings className="h-5 w-5" />,
      questions: [
        {
          question: t('help.q.filters.q'),
          answer: t('help.q.filters.a'),
        },
        {
          question: t('help.q.favorites.q'),
          answer: t('help.q.favorites.a'),
        },
        {
          question: t('help.q.language.q'),
          answer: t('help.q.language.a'),
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
            {t('help.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder={t('help.search.placeholder')}
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
              {t('help.noresults')}{' '}{searchQuery}
            </p>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              {t('help.noresults.suggestion')}
            </p>
          </div>
        )}

        {/* Contact Support */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>{t('help.contact.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('help.contact.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{t('help.contact.email.label')}</span>
                <span className="text-sm font-medium">contacto@mantarestaurants.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{t('help.contact.phone.label')}</span>
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
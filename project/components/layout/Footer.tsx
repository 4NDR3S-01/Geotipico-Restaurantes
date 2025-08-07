'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Heart, MapPin } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl">Geotipicos</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>Manta, Ecuador</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.links.title')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">{t('nav.home')}</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">{t('nav.about')}</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</a></li>
              <li><a href="/help" className="hover:text-white transition-colors">{t('nav.help')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">{t('footer.legal.title')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/privacy" className="hover:text-white transition-colors">{t('footer.legal.privacy')}</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">{t('footer.legal.terms')}</a></li>
              <li><a href="/cookies" className="hover:text-white transition-colors">{t('footer.legal.cookies')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex items-center space-x-2 text-gray-400 text-sm mt-4 md:mt-0">
            <span>{t('footer.made')}</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>{t('footer.location')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
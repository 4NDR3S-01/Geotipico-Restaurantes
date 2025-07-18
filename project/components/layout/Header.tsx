'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, Globe, Bell, User, LogOut, Home, Info, Mail, HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import './HeaderMenuAnimations.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { notifications } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navigation = [
    { name: t('nav.home'), href: '/', icon: <Home className="h-4 w-4 mr-1" />, accessKey: 'i' },
    { name: t('nav.about'), href: '/about', icon: <Info className="h-4 w-4 mr-1" />, accessKey: 'n' },
    { name: t('nav.contact'), href: '/contact', icon: <Mail className="h-4 w-4 mr-1" />, accessKey: 'c' },
    { name: t('nav.help'), href: '/help', icon: <HelpCircle className="h-4 w-4 mr-1" />, accessKey: 'a' },
  ];

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };
  return (
    <header 
      className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            aria-label="Geotipicos - Ir a página principal"
          >
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              Geotipicos
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Navegación principal">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                accessKey={item.accessKey}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-2 py-1 flex items-center group header-animated-link"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9"
                  aria-label="Cambiar idioma"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => setLanguage('es')}
                  aria-label="Cambiar a español"
                >
                  🇪🇸 {t('language.spanish')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setLanguage('en')}
                  aria-label="Cambiar a inglés"
                >
                  🇺🇸 {t('language.english')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9"
                    aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`}
                  >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge 
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full text-xs flex items-center justify-center"
                        aria-hidden="true"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </div>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9"
                      aria-label={`Menú de usuario - ${user.name}`}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="focus:outline-none">
                        {t('nav.dashboard')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile/edit" className="flex items-center focus:outline-none">
                        <User className="h-4 w-4 mr-2" aria-hidden="true" />
                        Editar perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout}
                      aria-label="Cerrar sesión"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link href="/login" className="focus:outline-none">{t('nav.login')}</Link>
                </Button>
                <Button asChild>
                  <Link href="/register" className="focus:outline-none">{t('nav.register')}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div 
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-fade-slide-in"
            id="mobile-menu"
            role="navigation"
            aria-label="Navegación móvil"
          >
            <nav className="flex flex-col space-y-2" role="list">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  accessKey={item.accessKey}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center group header-animated-link"
                  onClick={() => setIsMenuOpen(false)}
                  role="listitem"
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="h-9 w-9"
                    aria-label={theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'}
                  >
                    {theme === 'light' ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
                    aria-label={`Cambiar a ${language === 'es' ? 'inglés' : 'español'}`}
                  >
                    {language === 'es' ? '🇺🇸 EN' : '🇪🇸 ES'}
                  </Button>
                </div>
                {user ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    aria-label="Cerrar sesión"
                  >
                    {t('nav.logout')}
                  </Button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/login" className="focus:outline-none">{t('nav.login')}</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/register" className="focus:outline-none">{t('nav.register')}</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
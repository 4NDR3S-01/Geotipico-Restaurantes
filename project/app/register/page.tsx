'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Home } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Nuevos estados para validación en tiempo real
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { register } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  // ISO 9241-11 - Eficacia: Validaciones precisas y completas
  const validateName = (value: string) => {
    if (!value.trim()) return t('register.error.name.required');
    if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
    if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(value.trim())) return 'El nombre solo puede contener letras y espacios';
    return '';
  };

  // ISO 9241-11 - Eficacia: Validación robusta de email
  const validateEmail = (value: string) => {
    if (!value) return t('register.error.email.required');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) return t('register.error.email.invalid');
    return '';
  };

  // ISO 9241-11 - Eficacia: Validación de seguridad de contraseña
  const validatePassword = (value: string) => {
    if (!value) return t('register.error.password.required');
    if (value.length < 6) return t('register.error.password.length');
    if (!/(?=.*[a-z])/.test(value)) return 'Debe contener al menos una letra minúscula';
    if (!/(?=.*\d)/.test(value)) return 'Debe contener al menos un número';
    return '';
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(validateName(e.target.value));
    setError('');
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value));
    setError('');
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(validatePassword(e.target.value));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Validar antes de enviar
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passErr);
    if (nameErr || emailErr || passErr) return;
    setLoading(true);

    try {
      const success = await register(name, email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Error al crear la cuenta');
      }
    } catch (err) {
      setError('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  // ISO 9241-11 - Eficiencia: Evaluación mejorada de fortaleza de contraseña
  const getPasswordStrength = (value: string) => {
    let score = 0;
    if (value.length >= 6) score++;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return Math.min(score, 5);
  };

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthLabels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte', 'Excelente'];
  const strengthColors = [
    'bg-red-500',
    'bg-red-400', 
    'bg-orange-400',
    'bg-yellow-400',
    'bg-green-400',
    'bg-green-600',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="sr-only">
        <h1>{t('register.sr.title')}</h1>
      </div>
      <div className="w-full max-w-md">
        <div className="flex justify-start mb-2">
          <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md">
            <Home className="h-4 w-4 mr-1" aria-hidden="true" />
            {t('register.back.home')}
          </Link>
        </div>
        <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <User className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-bold" id="register-title">{t('auth.register')}</CardTitle>
          <CardDescription>
            {t('register.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="register-title" noValidate>
            {error && (
              <Alert variant="destructive" role="alert" aria-live="polite">
                <AlertDescription>{t(error)}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              {/* ISO 9241-11 - Satisfacción: Etiquetas claras y descriptivas */}
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                {t('auth.name')} <span className="text-red-500" aria-label="obligatorio">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder={t('register.placeholder.name')}
                value={name}
                onChange={handleNameChange}
                required
                autoComplete="given-name"
                aria-describedby={nameError ? "name-error name-help" : "name-help"}
                aria-invalid={!!nameError}
                className={`h-12 ${nameError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'} focus:ring-green-500`}
              />
              <div id="name-help" className="text-xs text-gray-500">
                Ingresa tu nombre completo para personalizar tu experiencia
              </div>
              {nameError && (
                <div id="name-error" className="text-xs text-red-600 flex items-center mt-1" role="alert">
                  <span className="mr-1">⚠️</span>
                  {nameError}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              {/* ISO 9241-11 - Satisfacción: Etiquetas claras y descriptivas */}
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                {t('auth.email')} <span className="text-red-500" aria-label="obligatorio">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('register.placeholder.email')}
                value={email}
                onChange={handleEmailChange}
                required
                autoComplete="email"
                aria-describedby={emailError ? "email-error email-help" : "email-help"}
                aria-invalid={!!emailError}
                className={`h-12 ${emailError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'} focus:ring-green-500`}
              />
              <div id="email-help" className="text-xs text-gray-500">
                Usaremos tu email para notificaciones importantes y recuperación de cuenta
              </div>
              {emailError && (
                <div id="email-error" className="text-xs text-red-600 flex items-center mt-1" role="alert">
                  <span className="mr-1">⚠️</span>
                  {emailError}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              {/* ISO 9241-11 - Satisfacción: Etiquetas claras y descriptivas */}
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                {t('auth.password')} <span className="text-red-500" aria-label="obligatorio">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('register.placeholder.password')}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="new-password"
                  aria-describedby={passwordError ? "password-help password-error password-strength" : "password-help password-strength"}
                  aria-invalid={!!passwordError}
                  className={`h-12 pr-12 ${passwordError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-green-500'} focus:ring-green-500`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t('register.hide.password') : t('register.show.password')}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
              <div id="password-help" className="text-xs text-gray-500">
                Debe tener al menos 6 caracteres, incluir mayúsculas, minúsculas y números
              </div>
               
               {/* ISO 9241-11 - Eficiencia: Indicador visual de fortaleza de contraseña */}
               {password && (
                 <div className="mt-2">
                   <div className="w-full h-2 rounded bg-gray-200 overflow-hidden" aria-hidden="true">
                     <div
                       className={`h-2 transition-all duration-300 ${strengthColors[passwordStrength]}`}
                       style={{ width: `${(passwordStrength / 5) * 100}%` }}
                     />
                   </div>
                   <div id="password-strength" className="text-xs mt-1 font-medium" aria-live="polite">
                     Seguridad: <span className={passwordStrength < 2 ? 'text-red-600' : passwordStrength < 4 ? 'text-yellow-600' : 'text-green-600'}>
                       {strengthLabels[passwordStrength]}
                     </span>
                   </div>
                 </div>
               )}
              {/* ISO 9241-11 - Efectividad: Mensajes de error claros y específicos */}
              {passwordError && (
                <div id="password-error" className="text-xs text-red-600 mt-1" role="alert" aria-live="polite">
                  <span className="font-medium">Error:</span> {passwordError}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              aria-describedby={loading ? 'loading-message' : undefined}
            >
              {loading ? t('register.loading') : t('auth.register.button')}
            </Button>
            {loading && (
              <div id="loading-message" className="sr-only" aria-live="polite">
                {t('register.loading.message')}
              </div>
            )}
          </form>
          
          <nav className="mt-6 text-center" aria-label="Enlaces relacionados">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.have.account')}{' '}
              <Link 
                href="/login" 
                className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
              >
                {t('nav.login')}
              </Link>
            </p>
          </nav>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}
'use client';

import { useState } from 'react';
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Nuevos estados para validación en tiempo real
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  // Validación en tiempo real para email
  const validateEmail = (value: string) => {
    if (!value) return 'El email es obligatorio';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'El email no es válido';
    return '';
  };
  // Validación en tiempo real para contraseña
  const validatePassword = (value: string) => {
    if (!value) return 'La contraseña es obligatoria';
    return '';
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
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    setEmailError(emailErr);
    setPasswordError(passErr);
    if (emailErr || passErr) return;
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="sr-only">
        <h1>Iniciar sesión en Geotipicos</h1>
      </div>
      <div className="w-full max-w-md">
        <div className="flex justify-start mb-2">
          <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md">
            <Home className="h-4 w-4 mr-1" aria-hidden="true" />
            Regresar al inicio
          </Link>
        </div>
        <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <User className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-bold" id="login-title">{t('auth.login')}</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="login-title" noValidate>
            {error && (
              <Alert variant="destructive" role="alert" aria-live="polite">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={handleEmailChange}
                required
                autoComplete="email"
                aria-describedby="email-error"
                aria-invalid={!!emailError}
              />
              {emailError && (
                <div id="email-error" className="text-xs text-red-600 mt-1" role="alert">{emailError}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  autoComplete="current-password"
                  aria-describedby="password-error"
                  aria-invalid={!!passwordError}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
              {passwordError && (
                <div id="password-error" className="text-xs text-red-600 mt-1" role="alert">{passwordError}</div>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              aria-describedby={loading ? 'loading-message' : undefined}
            >
              {loading ? 'Iniciando sesión...' : t('auth.login.button')}
            </Button>
            {loading && (
              <div id="loading-message" className="sr-only" aria-live="polite">
                Procesando inicio de sesión, por favor espera
              </div>
            )}
          </form>
          
          <nav className="mt-6 text-center" aria-label="Enlaces relacionados">
            <div className="space-y-2">
              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-500 font-medium block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.no.account')}{' '}
              <Link 
                href="/register" 
                className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
              >
                {t('nav.register')}
              </Link>
            </p>
            </div>
          </nav>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}
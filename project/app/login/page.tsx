'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Home, Shield, AlertTriangle, Clock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Nuevos estados para validación en tiempo real
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // ISO 9241-11: Estados para prevención de intentos múltiples
  const [attemptCount, setAttemptCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const [warningShown, setWarningShown] = useState(false);
  
  const { login } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  // ISO 9241-11 - Eficacia: Constantes para control de intentos
  const MAX_ATTEMPTS = 5;
  const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutos
  const WARNING_THRESHOLD = 3;

  // Cargar datos de intentos del localStorage al montar el componente
  useEffect(() => {
    const savedAttempts = localStorage.getItem('loginAttempts');
    const savedBlockTime = localStorage.getItem('loginBlockTime');
    
    if (savedAttempts) {
      setAttemptCount(parseInt(savedAttempts, 10));
    }
    
    if (savedBlockTime) {
      const blockTime = parseInt(savedBlockTime, 10);
      const now = Date.now();
      
      if (now < blockTime) {
        setIsBlocked(true);
        setBlockTimeRemaining(Math.ceil((blockTime - now) / 1000));
      } else {
        // El bloqueo ha expirado, limpiar datos
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('loginBlockTime');
        setAttemptCount(0);
      }
    }
  }, []);

  // Contador regresivo para el bloqueo
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setAttemptCount(0);
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('loginBlockTime');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isBlocked, blockTimeRemaining]);

  // Validación en tiempo real para email
  const validateEmail = (value: string) => {
    if (!value) return 'El email es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Ingresa un email válido';
    return '';
  };
  
  // Validación en tiempo real para contraseña
  const validatePassword = (value: string) => {
    if (!value) return 'La contraseña es requerida';
    return '';
  };

  // Función para formatear tiempo restante
  const formatTimeRemaining = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Función para manejar intento fallido
  const handleFailedAttempt = () => {
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);
    localStorage.setItem('loginAttempts', newAttemptCount.toString());

    // ISO 9241-11 - Satisfacción: Mostrar advertencia antes del bloqueo
    if (newAttemptCount >= WARNING_THRESHOLD && newAttemptCount < MAX_ATTEMPTS) {
      setWarningShown(true);
    }

    // Si se alcanza el máximo de intentos, bloquear
    if (newAttemptCount >= MAX_ATTEMPTS) {
      const blockUntil = Date.now() + BLOCK_DURATION;
      localStorage.setItem('loginBlockTime', blockUntil.toString());
      setIsBlocked(true);
      setBlockTimeRemaining(Math.ceil(BLOCK_DURATION / 1000));
    }
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
    
    // Verificar si está bloqueado
    if (isBlocked) {
      return;
    }

    setError('');
    setWarningShown(false);
    
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
        // Login exitoso - limpiar intentos
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('loginBlockTime');
        setAttemptCount(0);
        router.push('/dashboard');
      } else {
        handleFailedAttempt();
        setError('Email o contraseña incorrectos');
      }
    } catch (err) {
      handleFailedAttempt();
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="sr-only">
        <h1>{t('auth.login.sr.title')}</h1>
      </div>
      <div className="w-full max-w-md">
        {/* Alerta de seguridad por bloqueo - ISO 9241-11 Satisfacción */}
        {isBlocked && (
          <Alert variant="destructive" className="mb-4" role="alert" aria-live="polite">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold">Cuenta temporalmente bloqueada</div>
              <div className="text-sm mt-1">
                Por seguridad, el acceso ha sido bloqueado debido a múltiples intentos fallidos.
              </div>
              <div className="flex items-center mt-2 text-sm">
                <Clock className="h-3 w-3 mr-1" />
                Tiempo restante: <span className="font-mono ml-1">{formatTimeRemaining(blockTimeRemaining)}</span>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Advertencia de intentos - ISO 9241-11 Eficiencia */}
        {warningShown && !isBlocked && (
          <Alert variant="default" className="mb-4 border-amber-200 bg-amber-50" role="alert" aria-live="polite">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="font-semibold">Advertencia de seguridad</div>
              <div className="text-sm mt-1">
                Has realizado {attemptCount} de {MAX_ATTEMPTS} intentos permitidos. 
                Después de {MAX_ATTEMPTS} intentos fallidos, tu cuenta será bloqueada temporalmente.
              </div>
            </AlertDescription>
          </Alert>
        )}

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
          <CardTitle className="text-2xl font-bold" id="login-title">{t('auth.login')}</CardTitle>
          <CardDescription>
            {t('auth.login.subtitle')}
          </CardDescription>
          
          {/* Indicador de intentos restantes - ISO 9241-11 Visibilidad */}
          {attemptCount > 0 && !isBlocked && (
            <div className="text-xs text-gray-500 mt-2 flex items-center justify-center" aria-live="polite">
              <Shield className="h-3 w-3 mr-1" />
              Intentos: {attemptCount}/{MAX_ATTEMPTS}
            </div>
          )}
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
                disabled={isBlocked}
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
                  placeholder={t('register.placeholder.password')}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  disabled={isBlocked}
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
                  disabled={isBlocked}
                  aria-label={showPassword ? t('auth.password.hide') : t('auth.password.show')}
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
              disabled={loading || isBlocked}
              aria-describedby={loading ? 'loading-message' : undefined}
            >
              {loading ? t('auth.login.loading') : t('auth.login.button')}
            </Button>
            {loading && (
              <div id="loading-message" className="sr-only" aria-live="polite">
                {t('auth.login.loading.message')}
              </div>
            )}
          </form>
          
          <nav className="mt-6 text-center" aria-label="Enlaces relacionados">
            <div className="space-y-2">
              <Link 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-500 font-medium block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
              >
                {t('auth.forgot.password')}
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
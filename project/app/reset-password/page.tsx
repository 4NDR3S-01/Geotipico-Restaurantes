'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/forgot-password');
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.error || 'Error al restablecer la contraseña');
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="sr-only">
          <h1>Contraseña restablecida exitosamente</h1>
        </div>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400" role="status" aria-live="polite">
              ¡Contraseña restablecida!
            </CardTitle>
            <CardDescription>
              Tu contraseña ha sido actualizada exitosamente. Serás redirigido al inicio de sesión en unos segundos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/login" className="focus:outline-none">Ir al inicio de sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="sr-only">
        <h1>Restablecer contraseña - Geotipicos</h1>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-bold" id="reset-password-title">Restablecer contraseña</CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="reset-password-title">
            {error && (
              <Alert variant="destructive" role="alert" aria-live="polite">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-describedby="password-help password-error"
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
              <div id="password-help" className="text-xs text-gray-500 dark:text-gray-400">
                La contraseña debe tener al menos 6 caracteres
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-describedby="confirm-password-help"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
                  tabIndex={0}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
              <div id="confirm-password-help" className="text-xs text-gray-500 dark:text-gray-400">
                Debe coincidir con la contraseña anterior
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              aria-describedby={loading ? 'loading-message' : undefined}
            >
              {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
            </Button>
            {loading && (
              <div id="loading-message" className="sr-only" aria-live="polite">
                Restableciendo contraseña, por favor espera
              </div>
            )}
          </form>
          
          <nav className="mt-6 text-center" aria-label="Enlaces de navegación">
            <Link 
              href="/login" 
              className="text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            >
              Volver al inicio de sesión
            </Link>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
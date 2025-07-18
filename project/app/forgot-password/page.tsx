'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, Home } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(''); // For demo purposes only
  
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // For demo purposes - remove in production
        if (data.resetToken) {
          setResetToken(data.resetToken);
        }
      } else {
        setError(data.error || 'Error al enviar el enlace de restablecimiento');
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="sr-only">
        <h1>Recuperar contraseña - Geotipicos</h1>
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
            <Mail className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-bold" id="forgot-password-title">¿Olvidaste tu contraseña?</CardTitle>
          <CardDescription>
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="forgot-password-title">
            {error && (
              <Alert variant="destructive" role="alert" aria-live="polite">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {message && (
              <Alert role="status" aria-live="polite">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Demo token display - remove in production */}
            {resetToken && (
              <Alert role="status" aria-live="polite">
                <AlertDescription>
                  <strong>Demo:</strong> Token de restablecimiento: {resetToken}
                  <br />
                  <Link 
                    href={`/reset-password?token=${resetToken}`}
                    className="text-blue-600 hover:text-blue-500 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
                  >
                    Hacer clic aquí para restablecer contraseña
                  </Link>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                aria-describedby="email-help"
              />
              <div id="email-help" className="text-xs text-gray-500 dark:text-gray-400">
                Ingresa el email asociado a tu cuenta
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              aria-describedby={loading ? 'loading-message' : undefined}
            >
              {loading ? 'Enviando...' : 'Enviar enlace de restablecimiento'}
            </Button>
            {loading && (
              <div id="loading-message" className="sr-only" aria-live="polite">
                Enviando enlace de restablecimiento, por favor espera
              </div>
            )}
          </form>
          
          <nav className="mt-6 text-center" aria-label="Enlaces de navegación">
            <Link 
              href="/login" 
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md"
            >
              <ArrowLeft className="h-4 w-4 mr-1" aria-hidden="true" />
              Volver al inicio de sesión
            </Link>
          </nav>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}
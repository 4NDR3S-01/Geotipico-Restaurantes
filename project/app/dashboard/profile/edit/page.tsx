"use client";
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function EditProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  // Accesibilidad
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<null | (() => void)>(null);
  const [originalEmail, setOriginalEmail] = useState(user?.email || "");
  const [noChanges, setNoChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setOriginalEmail(user.email || "");
    } else if (!loading) {
      router.replace('/login');
    }
  }, [user, loading]);

  const validateName = (value: string) => {
    if (!value) return "El nombre es obligatorio";
    return "";
  };
  const validateEmail = (value: string) => {
    if (!value) return "El email es obligatorio";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "El email no es válido";
    return "";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(validateName(e.target.value));
    setError("");
    setSuccess("");
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(validateEmail(e.target.value));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setNoChanges(false);
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    setNameError(nameErr);
    setEmailError(emailErr);
    if (nameErr || emailErr) return;
    // Si no hay cambios, mostrar mensaje y no guardar
    if (name === user?.name && email === user?.email) {
      setNoChanges(true);
      return;
    }
    // Si el email cambió, pedir confirmación
    if (email !== originalEmail) {
      setShowConfirm(true);
      setPendingSubmit(() => doSubmit);
      return;
    }
    doSubmit();
  };

  // Función real de guardado
  const doSubmit = async () => {
    setSaving(true);
    try {
      // Petición real al backend
      const token = Cookies.get('token');
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Perfil actualizado correctamente');
        setOriginalEmail(data.email);
        // Actualizar usuario en el contexto
        if (user) {
          user.name = data.name;
          user.email = data.email;
        }
      } else {
        setError(data.error || 'Error al actualizar el perfil');
      }
    } catch (err) {
      setError("Error al actualizar el perfil");
    } finally {
      setSaving(false);
      setShowConfirm(false);
      setPendingSubmit(null);
    }
  };

  // Nueva función para restaurar los datos originales
  const handleCancel = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setNameError("");
    setEmailError("");
    setError("");
    setSuccess("");
    router.push('/dashboard');
  };

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (!user && !loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <User className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-bold">Editar perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="profile-edit-title" noValidate>
            {noChanges && (
              <Alert variant="default" role="status" aria-live="polite">
                <AlertDescription>No se detectaron cambios para guardar.</AlertDescription>
              </Alert>
            )}
            {error && (
              <Alert variant="destructive" role="alert" aria-live="polite">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" role="status" aria-live="polite">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                required
                autoComplete="name"
                aria-describedby="name-error"
                aria-invalid={!!nameError}
              />
              {nameError && (
                <div id="name-error" className="text-xs text-red-600 mt-1" role="alert">{nameError}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
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
            <div className="flex gap-2">
              <Button type="submit" className="w-full" disabled={saving} aria-describedby={saving ? 'saving-message' : undefined}>
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
            {saving && (
              <div id="saving-message" className="sr-only" aria-live="polite">
                Guardando cambios, por favor espera
              </div>
            )}
          </form>
          {/* Modal de confirmación para cambio de correo */}
          <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
            <DialogContent role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
              <DialogHeader>
                <DialogTitle id="confirm-title">Confirmar cambio de correo electrónico</DialogTitle>
              </DialogHeader>
              <div className="py-2">¿Estás seguro de que deseas cambiar tu correo electrónico? Esto puede afectar tu acceso a la cuenta.</div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setShowConfirm(false); setPendingSubmit(null); }}>
                  Cancelar
                </Button>
                <Button onClick={() => { if (pendingSubmit) pendingSubmit(); }} autoFocus>
                  Sí, cambiar correo
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
} 
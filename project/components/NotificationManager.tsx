'use client';

import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef, useCallback } from 'react';

export const NotificationManager = () => {
  const { notifications, markAsRead } = useNotifications();
  const { toast } = useToast();
  const shownNotifications = useRef(new Set<string>());
  const processedNotifications = useRef(new Set<string>());

  const showNotification = useCallback((notification: any) => {
    // Evitar procesar la misma notificación múltiples veces
    if (processedNotifications.current.has(notification.id)) {
      return;
    }

    processedNotifications.current.add(notification.id);
    shownNotifications.current.add(notification.id);
    
    // Mapear el tipo de notificación a la variante del toast
    let variant: 'default' | 'destructive' | 'success' | 'warning';
    switch (notification.type) {
      case 'error':
        variant = 'destructive';
        break;
      case 'success':
        variant = 'success';
        break;
      case 'warning':
        variant = 'warning';
        break;
      default:
        variant = 'default';
        break;
    }
    
    // Mostrar el toast
    toast({
      title: notification.title,
      description: notification.message,
      variant,
      duration: notification.type === 'error' ? 8000 : 5000,
    });

    // Marcar como leída después de un breve delay
    setTimeout(() => {
      markAsRead(notification.id);
    }, 1500);
  }, [toast, markAsRead]);

  useEffect(() => {
    // Solo procesar notificaciones no leídas y no mostradas
    const unreadNotifications = notifications.filter(
      n => !n.read && !shownNotifications.current.has(n.id)
    );

    // Procesar cada notificación
    unreadNotifications.forEach(showNotification);
  }, [notifications, showNotification]);

  return null; // Este componente no renderiza nada visualmente
};

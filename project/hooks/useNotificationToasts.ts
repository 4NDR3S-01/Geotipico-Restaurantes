'use client';

import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export const useNotificationToasts = () => {
  const { notifications } = useNotifications();
  const { toast } = useToast();

  useEffect(() => {
    // Solo mostrar notificaciones no leídas
    const unreadNotifications = notifications.filter(n => !n.read);
    
    // Mostrar la notificación más reciente
    if (unreadNotifications.length > 0) {
      const latest = unreadNotifications[0];
      
      toast({
        title: latest.title,
        description: latest.message,
        variant: latest.type === 'error' ? 'destructive' : 'default',
        duration: 5000,
      });
    }
  }, [notifications, toast]);
};

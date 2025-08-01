'use client';

import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const NotificationDemo = () => {
  const { addNotification } = useNotifications();
  const [isDisabled, setIsDisabled] = useState(false);

  const { t } = useLanguage();
  const testNotifications = [
    {
      title: t('notification.success.title'),
      message: t('notification.success.message'),
      type: 'success' as const,
      icon: CheckCircle,
    },
    {
      title: t('notification.info.title'),
      message: t('notification.info.message'),
      type: 'info' as const,
      icon: Info,
    },
    {
      title: t('notification.warning.title'),
      message: t('notification.warning.message'),
      type: 'warning' as const,
      icon: AlertTriangle,
    },
    {
      title: t('notification.error.title'),
      message: t('notification.error.message'),
      type: 'error' as const,
      icon: AlertCircle,
    },
  ];

  const handleTestNotification = (notification: typeof testNotifications[0]) => {
    if (isDisabled) return;
    
    setIsDisabled(true);
    addNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      read: false,
    });

    // Rehabilitar botones después de 2 segundos para evitar spam
    setTimeout(() => {
      setIsDisabled(false);
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Probar Notificaciones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {testNotifications.map((notification) => {
          const IconComponent = notification.icon;
          return (
            <Button
              key={notification.type}
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleTestNotification(notification)}
              disabled={isDisabled}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {notification.title}
            </Button>
          );
        })}
        {isDisabled && (
          <p className="text-sm text-gray-500 text-center mt-2">
            Espera un momento antes del siguiente test...
          </p>
        )}
      </CardContent>
    </Card>
  );
};

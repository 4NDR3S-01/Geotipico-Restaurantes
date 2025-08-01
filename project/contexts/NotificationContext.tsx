'use client';

import { createContext, useContext, useState } from 'react';
import { Notification } from '@/types';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };
    
    setNotifications(prev => {
      // Evitar duplicar notificaciones con el mismo título y mensaje muy rápido
      const isDuplicate = prev.some(n => 
        n.title === newNotification.title && 
        n.message === newNotification.message && 
        (new Date().getTime() - n.createdAt.getTime()) < 2000
      );
      
      if (isDuplicate) {
        return prev;
      }
      
      return [newNotification, ...prev.slice(0, 9)]; // Limitar a 10 notificaciones máximo
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
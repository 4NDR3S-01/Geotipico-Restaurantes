export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  price_level?: number;
  types: string[];
  photos?: string[];
  opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  distance?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
}

export type Language = 'es' | 'en';
export type Theme = 'light' | 'dark';
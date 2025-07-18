import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Manta Restaurants - Encuentra los mejores restaurantes',
  description: 'Descubre los mejores restaurantes de Manta con nuestra tecnología de geolocalización',
  keywords: 'restaurantes, manta, ecuador, comida, geolocalización',
  authors: [{ name: 'Manta Restaurants' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Manta Restaurants',
    description: 'Encuentra los mejores restaurantes de Manta',
    type: 'website',
    locale: 'es_EC',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>
            <NotificationProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </NotificationProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import SessionProvider from '@/components/providers/SessionProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import '@/styles/globals.css';

export const metadata = {
  title: 'StockAlerte - Anti-gaspillage Algeria',
  description: 'Trouvez les meilleures offres et promotions près de chez vous en Algérie',
  keywords: 'offres, promotions, soldes, anti-gaspillage, Algérie, commerces',
  openGraph: {
    title:       'StockAlerte',
    description: 'La plateforme anti-gaspillage du marché algérien',
    type:        'website',
    locale:      'fr_DZ',
  },
};

const RTL_LOCALES = ['ar'];

export default async function RootLayout({ children, params: { locale } }) {
  const messages = await getMessages();
  const isRTL    = RTL_LOCALES.includes(locale);

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cairo:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={isRTL ? 'font-arabic' : 'font-sans'}>
        <SessionProvider>
          <ThemeProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 4000,
                  style: { borderRadius: '10px', padding: '12px 16px' },
                }}
              />
            </NextIntlClientProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

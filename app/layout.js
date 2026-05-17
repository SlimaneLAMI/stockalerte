import './globals.css';
import { startKeepAlive } from '@/lib/keepAlive';

startKeepAlive();

export const metadata = {
  title: {
    default: 'StockAlerte — Équipements Professionnels',
    template: '%s | StockAlerte',
  },
  description: 'Matériel de cuisine professionnel pour restaurants, hôtels et collectivités. Cuisson, réfrigération, préparation.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,500,400&f[]=satoshi@700,500,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

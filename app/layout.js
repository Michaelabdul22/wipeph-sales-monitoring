import './globals.css';
import AppEffects from '@/components/AppEffects';

export const metadata = {
  title: 'WIPE PH Sales Monitoring',
  description: 'Vercel-ready sales monitoring system'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppEffects />
        {children}
      </body>
    </html>
  );
}

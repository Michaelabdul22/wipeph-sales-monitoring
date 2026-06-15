import './globals.css';

export const metadata = {
  title: 'WIPE PH Sales Monitoring',
  description: 'Vercel-ready sales monitoring system'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

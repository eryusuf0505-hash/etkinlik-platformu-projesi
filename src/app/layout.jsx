import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Etkinlik & Topluluk Platformu',
  description: 'Modern etkinlik keşfetme ve topluluk yönetim platformu',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#0f172a] text-white">
          {children}
        </div>
      </body>
    </html>
  );
}

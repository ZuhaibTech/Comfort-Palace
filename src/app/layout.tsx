import type { Metadata } from 'next';
import { Inter, Raleway } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway', display: 'swap' });

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Comfort Palace | Premium Furniture',
  description: 'Premium furniture collection for you',
  icons: {
    icon: '/Logo/Logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${raleway.variable}`}>
      <body className="flex flex-col min-h-[100dvh] bg-surface-50 text-surface-800 font-sans antialiased">
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

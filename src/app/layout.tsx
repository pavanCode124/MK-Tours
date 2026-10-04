import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { FloatingContact } from '@/components/FloatingContact';
import { RevealFallbackScript, RevealObserver } from '@/components/Motion';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mktours.in'),
  title: {
    default: 'MK Tours | Private & Group Tours Across India & Nepal',
    template: '%s | MK Tours',
  },
  description:
    'MK Tours runs private and fixed-departure group tours across India and Nepal from Mumbai — pilgrimage circuits, Kashmir, Kerala, Rajasthan and more. One price covering train, stays, meals and sightseeing.',
  openGraph: {
    type: 'website',
    siteName: 'MK Tours',
    title: 'MK Tours | Private & Group Tours Across India & Nepal',
    description:
      'Fixed-departure group tours from Mumbai across India and Nepal. Train, hotels, meals, transport and sightseeing in one price.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cormorant.variable}`}>
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <FloatingContact />
        <RevealObserver />
        <RevealFallbackScript />
      </body>
    </html>
  );
}

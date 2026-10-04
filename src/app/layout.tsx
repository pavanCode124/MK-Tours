import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';
import { FloatingContact } from '@/components/FloatingContact';
import { RevealFallbackScript, RevealObserver } from '@/components/Motion';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

// Manrope carries body copy at light weights; Playfair Display stands in for
// the high-contrast editorial serif the brief's reference site sets its
// headings in. Both are loaded light-first — the design leans on thin strokes.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
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
    <html lang="en" className={`${manrope.variable} ${playfair.variable}`}>
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

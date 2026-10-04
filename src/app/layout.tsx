import type { Metadata } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';
import { FloatingContact } from '@/components/FloatingContact';
import { RevealFallbackScript, RevealObserver } from '@/components/Motion';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

// Manrope carries body copy; Fraunces carries every heading. Fraunces is a soft,
// high-optical-size serif with a wedge-serif warmth — it sets tight and in mixed
// case, which is what this design's headings want, and it reads nothing like the
// wide uppercase didone treatment it replaced.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

// Loaded as a variable font: `axes` may only be set when the weight axis is
// left variable, and the whole 100–900 range costs no more than a few static
// cuts would. SOFT rounds the terminals; WONK enables the alternate glyphs.
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal', 'italic'],
  axes: ['SOFT', 'WONK'],
  variable: '--font-fraunces',
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
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body className="min-h-screen overflow-x-hidden antialiased">
        <SiteHeader />
        <main id="top">{children}</main>
        <SiteFooter />
        <FloatingContact />
        <RevealObserver />
        <RevealFallbackScript />
      </body>
    </html>
  );
}

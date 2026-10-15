'use client';

import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Destination } from '@/lib/catalog';

/**
 * A brand-coloured banner that carries the destination collection as two
 * auto-scrolling rails instead of a static grid. The rails run in opposite
 * directions, pause under the cursor, and fall back to a plain scrollable row
 * when the visitor has asked for reduced motion.
 */
export function DestinationMarquee({
  destinations,
  lineOne = 'Monsoon Magic',
  lineTwo = 'Hill Escapes',
  tag = 'Season Sale',
  offer = 'Monsoon offers running now',
  viewAllHref,
  viewAllLabel = 'View all',
}: {
  destinations: Destination[];
  /** First line of the sale lockup. */
  lineOne?: string;
  /** Second line, joined to the first by an ampersand. */
  lineTwo?: string;
  /** The small red flag under the lockup. */
  tag?: string;
  offer?: string;
  /** When set, a pill link in the top-right corner of the panel. */
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  if (destinations.length === 0) return null;

  // One continuous rail carries the whole collection past the eye.
  const rows = [destinations];

  return (
    <div className="marquee-panel relative overflow-hidden rounded-[1.5rem] border-2 border-white/35 px-0 py-10 shadow-float sm:rounded-[1.75rem] sm:py-14">
      {/* Concentric ripples and a soft corner bloom, painted in CSS. */}
      <div className="marquee-panel__rings pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -left-24 -top-28 h-[320px] w-[320px] rounded-full bg-white/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-[340px] w-[340px] rounded-full bg-vermilion-500/20 blur-3xl" aria-hidden />

      <div className="relative">
        {viewAllHref && (
          <div className="flex justify-end px-6 pb-4 sm:absolute sm:right-6 sm:top-6 sm:px-0 sm:pb-0 lg:right-8 lg:top-8">
            <Link
              href={viewAllHref}
              className="group/link z-10 inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.12em] text-azure-900 shadow-lift transition-all duration-300 hover:bg-vermilion-500 hover:text-white sm:px-6 sm:py-3 sm:text-[12.5px]"
            >
              {viewAllLabel}
              <span className="transition-transform duration-300 group-hover/link:translate-x-0.5">→</span>
            </Link>
          </div>
        )}
        {/* Title lockup — a stacked sale banner, cream on the brand blue. */}
        <div className="px-6 text-center sm:px-10">
          <h3 className="marquee-title font-display uppercase">
            <span className="block">{lineOne}</span>
            <span className="block">
              <span className="marquee-title__amp">&amp;</span> {lineTwo}
            </span>
          </h3>
          <span className="marquee-tag mt-3 inline-block rounded-[0.45rem] bg-vermilion-500 px-4 py-1.5 font-sans text-[12px] font-extrabold uppercase tracking-[0.16em] text-white shadow-glow sm:mt-4 sm:px-5 sm:text-[14px]">
            {tag}
          </span>
        </div>

        {/* The rails */}
        <div className="mt-8 space-y-6 sm:mt-8 sm:space-y-7">
          {rows.map((row, i) => (
            <MarqueeRow key={i} items={row} reverse={i % 2 === 1} duration={38 + i * 9} />
          ))}
        </div>

        {/* Offer ribbon */}
        <div className="mt-9 flex justify-center px-6 sm:mt-11 sm:px-10">
          <span className="rounded-full bg-white px-6 py-2.5 text-center text-[11px] font-extrabold uppercase tracking-[0.12em] text-azure-900 shadow-lift sm:px-8 sm:py-3 sm:text-[13.5px] sm:tracking-[0.14em]">
            {offer}
          </span>
        </div>

      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse,
  duration,
}: {
  items: Destination[];
  reverse: boolean;
  duration: number;
}) {
  // Short rows are tripled so the loop still fills a wide screen seamlessly.
  const copies = items.length < 6 ? 3 : 2;

  return (
    <div
      className="marquee"
      style={
        {
          '--marquee-duration': `${duration}s`,
          '--marquee-copies': copies,
        } as CSSProperties
      }
    >
      <div className={`marquee__track${reverse ? ' marquee__track--reverse' : ''}`}>
        {Array.from({ length: copies }, (_, copy) => (
          <div key={copy} className="marquee__group" aria-hidden={copy > 0 || undefined}>
            {items.map((d) => (
              <Tile key={`${copy}-${d.slug}`} destination={d} interactive={copy === 0} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Tile({ destination: d, interactive }: { destination: Destination; interactive: boolean }) {
  return (
    <Link
      href={`/destinations/${d.slug}`}
      tabIndex={interactive ? undefined : -1}
      className="group block w-[124px] shrink-0 text-center sm:w-[150px] lg:w-[164px]"
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.35rem] bg-azure-900 ring-2 ring-white/60 shadow-lift transition-all duration-500 group-hover:-translate-y-2 group-hover:ring-4 group-hover:ring-white sm:rounded-[1.6rem]">
        <Image
          src={d.image}
          alt={d.label}
          fill
          sizes="(min-width: 1024px) 164px, (min-width: 640px) 150px, 124px"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-azure-900/55 via-transparent to-transparent opacity-80" />
        {d.count > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-azure-900/65 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-on-dark backdrop-blur-md">
            {d.count} {d.count === 1 ? 'tour' : 'tours'}
          </span>
        )}
      </div>
      <span className="mt-3 block truncate text-[11px] font-extrabold uppercase tracking-[0.13em] text-white transition-colors duration-300 group-hover:text-vermilion-100 sm:text-[12.5px]">
        {d.label}
      </span>
    </Link>
  );
}

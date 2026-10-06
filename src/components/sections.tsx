import Image from 'next/image';
import Link from 'next/link';
import type { Destination } from '@/lib/catalog';
import { CameraBadge, PineTree } from './Decor';
import { Icon, type IconName, Stars } from './ui';

/* -------------------------------------------------------------------------- */
/* Destination card — a curved portrait tile with the caption over the photo   */
/* -------------------------------------------------------------------------- */

export function DestinationCard({
  destination,
  className = '',
}: {
  destination: Destination;
  className?: string;
}) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={`group relative block overflow-hidden rounded-[1.75rem] bg-azure-900 shadow-soft transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-float ${className}`}
    >
      <div className="relative aspect-[4/5]">
        <Image
          src={destination.image}
          alt={destination.label}
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 45vw"
          className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.09]"
        />
        {/* The caption sits on the photo, so the tile is one object rather than
            a picture with a label parked underneath it. */}
        <div className="absolute inset-0 bg-gradient-to-t from-azure-900 via-azure-900/25 to-transparent" />
        {/* A single sheen crosses the photograph on hover. */}
        <span className="sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {destination.count !== undefined && destination.count > 0 && (
          <span className="absolute right-3 top-3 rounded-full border border-white/25 bg-azure-900/55 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.1em] text-on-dark backdrop-blur-md">
            {destination.count} {destination.count === 1 ? 'tour' : 'tours'}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.16em] text-vermilion-300">
            <Icon name="pin" className="h-3 w-3" />
            {destination.state}
          </span>
          <span className="mt-1 block font-display text-[19px] font-semibold leading-tight text-on-dark">
            {destination.label}
          </span>
          {/* A vermilion rule that draws itself under the name on hover. */}
          <span className="mt-2 block h-[2px] w-8 origin-left rounded-full bg-vermilion-500 transition-transform duration-500 ease-out group-hover:scale-x-[2.6]" />
        </div>
      </div>
    </Link>
  );
}

/** Horizontally scrolling rail of destination tiles. */
export function DestinationRail({ destinations }: { destinations: Destination[] }) {
  return (
    <div className="rail -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-5">
      {destinations.map((d) => (
        <DestinationCard key={d.slug} destination={d} className="w-[62vw] shrink-0 sm:w-[40vw] md:w-auto" />
      ))}
    </div>
  );
}

/**
 * Destination tiles on a true grid — two up on phones, three on tablets, five
 * across on desktop. No horizontal scrolling at any width.
 */
export function DestinationGrid({ destinations }: { destinations: Destination[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
      {destinations.map((d) => (
        <DestinationCard key={d.slug} destination={d} />
      ))}
    </div>
  );
}

/**
 * A staggered editorial grid: the first tile runs tall and wide, the rest fill in
 * around it. Used where a flat grid of equal tiles would read as a catalogue.
 */
export function DestinationMosaic({ destinations }: { destinations: Destination[] }) {
  const [lead, ...rest] = destinations;
  if (!lead) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Link
        href={`/destinations/${lead.slug}`}
        className="group relative col-span-1 overflow-hidden rounded-[2rem] bg-azure-900 shadow-lift transition-all duration-500 hover:-translate-y-1.5 hover:shadow-float sm:col-span-2 sm:row-span-2"
      >
        <div className="relative aspect-[4/5] sm:aspect-auto sm:h-full sm:min-h-[420px]">
          <Image
            src={lead.image}
            alt={lead.label}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-azure-900 via-azure-900/20 to-transparent" />
          <PineTree className="absolute -bottom-2 right-4 h-36 w-16 text-vermilion-300/25 tree-breathe" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-vermilion-300">
              <Icon name="pin" className="h-3.5 w-3.5" />
              {lead.state}
            </span>
            <span className="mt-1.5 block font-display text-[30px] font-semibold leading-none text-on-dark sm:text-[36px]">
              {lead.label}
            </span>
            {lead.blurb && (
              <span className="mt-2.5 block max-w-sm text-[13px] leading-relaxed text-on-dark/75">{lead.blurb}</span>
            )}
          </div>
        </div>
      </Link>
      {rest.map((d) => (
        <DestinationCard key={d.slug} destination={d} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Departure city card                                                        */
/* -------------------------------------------------------------------------- */

export function CityCard({
  label,
  state,
  note,
  image,
  count,
  href,
}: {
  label: string;
  state: string;
  note: string;
  image: string;
  count: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-[2rem] bg-azure-900 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-float"
    >
      <div className="relative aspect-[16/9]">
        <Image
          src={image}
          alt={label}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-azure-900/90 via-azure-900/25 to-transparent" />
        <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-azure-900/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-on-dark backdrop-blur-md">
          {count} {count === 1 ? 'trip' : 'trips'}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-vermilion-300">
            <Icon name="train" className="h-3.5 w-3.5" />
            Departing
          </span>
          <span className="mt-1 block font-display text-[30px] font-semibold leading-none text-on-dark sm:text-[36px]">
            {label}
          </span>
          <span className="mt-1.5 block text-[12px] text-on-dark/70">
            {state} · {note}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Why-us pillar                                                              */
/* -------------------------------------------------------------------------- */

/**
 * A pillar is now a glass card on the dark panel rather than a column divided by
 * hairlines, with the icon in a rounded roundel and a number in the corner.
 */
export function Pillar({
  icon,
  title,
  text,
  index,
}: {
  icon: IconName;
  title: string;
  text: string;
  index?: number;
}) {
  return (
    <div className="glass-dark group relative overflow-hidden p-6 transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/10">
      {index !== undefined && (
        <span className="absolute right-4 top-3 font-display text-[44px] font-semibold leading-none text-white/8">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      <span className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-vermilion-500/15 text-vermilion-300 ring-1 ring-vermilion-300/30 transition-colors duration-500 group-hover:bg-vermilion-500 group-hover:text-white">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h3 className="relative font-display text-[21px] font-semibold leading-tight text-on-dark">{title}</h3>
      <p className="relative mt-2.5 text-[13px] leading-relaxed text-on-dark/70">{text}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Review card                                                                */
/* -------------------------------------------------------------------------- */

export function ReviewCard({
  name,
  place,
  quote,
  stars,
}: {
  name: string;
  place: string;
  quote: string;
  stars: number;
}) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  return (
    <figure className="card group relative flex h-full flex-col overflow-hidden p-6 hover:card-hover">
      {/* An oversized quote mark, clipped by the card's curve. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -top-6 font-display text-[110px] font-semibold leading-none text-vermilion-100 transition-colors duration-500 group-hover:text-vermilion-300/60"
      >
        &rdquo;
      </span>
      <Stars count={stars} className="relative" />
      <blockquote className="relative mt-4 flex-1 text-[13.5px] leading-[1.75] text-muted">{quote}</blockquote>
      <figcaption className="relative mt-5 flex items-center gap-3 border-t border-border pt-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-azure-800 text-[11.5px] font-bold text-vermilion-300">
          {initials}
        </span>
        <span>
          <span className="block text-[13px] font-bold text-text">{name}</span>
          <span className="block text-[11.5px] text-subtle">{place}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Accordion built on <details>, so it opens without any client JavaScript. Each
 * question is now its own rounded card that tints as it opens, instead of a row
 * in a divided list.
 */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="group/faq overflow-hidden rounded-2xl border border-border bg-raised shadow-soft transition-all duration-300 open:border-vermilion-300/70 open:bg-vermilion-50/60 open:shadow-lift"
        >
          <summary className="flex cursor-pointer items-center justify-between gap-5 px-5 py-4 text-left">
            <span className="font-display text-[16px] font-semibold leading-snug text-text transition-colors group-hover/faq:text-vermilion-700 sm:text-[17px]">
              {item.q}
            </span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-strong bg-bg text-muted transition-all duration-300 group-open/faq:rotate-180 group-open/faq:border-vermilion-500 group-open/faq:bg-vermilion-500 group-open/faq:text-white">
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M8 3v10" className="origin-center transition-opacity duration-300 group-open/faq:opacity-0" />
                <path d="M3 8h10" />
              </svg>
            </span>
          </summary>
          <p className="px-5 pb-5 pr-12 text-[13.5px] leading-[1.75] text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Gallery strip                                                              */
/* -------------------------------------------------------------------------- */

export function GalleryStrip({ items }: { items: { src: string; label: string }[] }) {
  return (
    <div className="rail flex gap-3 overflow-x-auto px-5 py-2 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:py-0 lg:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.src}
          className="group relative h-[200px] w-60 flex-shrink-0 overflow-hidden rounded-2xl shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift md:h-[160px] md:w-auto"
        >
          <Image
            src={item.src}
            alt={item.label}
            fill
            sizes="(min-width: 1024px) 220px, (min-width: 768px) 25vw, 240px"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-azure-900/80 to-transparent p-3">
            <span className="text-[10.5px] font-bold text-on-dark">{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Guide card                                                                 */
/* -------------------------------------------------------------------------- */

export function GuideCard({
  slug,
  kicker,
  title,
  readMinutes,
  image,
}: {
  slug: string;
  kicker: string;
  title: string;
  readMinutes: number;
  image: string;
}) {
  return (
    <Link href={`/blog/${slug}`} className="card group flex flex-col overflow-hidden hover:card-hover">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
        />
        <span className="sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <CameraBadge className="absolute -bottom-4 -right-4 h-24 w-28 text-white/25" />
        <span className="absolute left-3.5 top-3.5 rounded-full border border-white/25 bg-azure-900/55 px-3 py-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-on-dark backdrop-blur-md">
          {kicker}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[18px] font-semibold leading-snug text-text transition-colors group-hover:text-vermilion-700">
          {title}
        </h3>
        <span className="mt-auto flex items-center gap-2 pt-4 text-[11.5px] text-subtle">
          <Icon name="clock" className="h-3.5 w-3.5" />
          {readMinutes} min read
          <span className="ml-auto text-vermilion-700 transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

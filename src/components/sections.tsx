import Image from 'next/image';
import Link from 'next/link';
import type { Destination } from '@/lib/catalog';
import { Icon, type IconName, Stars } from './ui';

/* -------------------------------------------------------------------------- */
/* Destination card — the arched tile from the reference site                 */
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
      className={`group relative block overflow-hidden rounded-t-[999px] rounded-b-md bg-surface ${className}`}
    >
      <div className="relative aspect-[3/4]">
        <Image
          src={destination.image}
          alt={destination.label}
          fill
          sizes="(min-width: 1024px) 220px, (min-width: 640px) 33vw, 60vw"
          className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-text/85 via-text/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <span className="block text-[9.5px] font-semibold uppercase tracking-[0.14em] text-on-dark/75">
            {destination.state}
          </span>
          <span className="mt-0.5 block font-display text-[21px] font-medium leading-tight text-on-dark">
            {destination.label}
          </span>
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
    <Link href={href} className="group relative block overflow-hidden rounded-md bg-surface">
      <div className="relative aspect-[16/9]">
        <Image
          src={image}
          alt={label}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-text/85 via-text/25 to-transparent" />
        <div className="absolute left-5 top-5">
          <span className="rounded-sm bg-text/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-on-dark backdrop-blur-sm">
            {count} {count === 1 ? 'trip' : 'trips'}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-on-dark/75">
            From {label}
          </span>
          <span className="mt-1 block font-display text-[30px] font-medium leading-none text-on-dark sm:text-[36px]">
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

export function Pillar({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <div className="px-5 py-2 text-center">
      <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-meadow-300/40 text-meadow-300">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h3 className="font-display text-[22px] font-medium leading-tight text-on-dark">{title}</h3>
      <p className="mx-auto mt-3 max-w-[16rem] text-[13px] leading-relaxed text-on-dark/65">{text}</p>
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
    <figure className="flex h-full flex-col rounded-md border border-border bg-raised p-6">
      <Stars count={stars} />
      <blockquote className="mt-4 flex-1 text-[13.5px] leading-relaxed text-muted">“{quote}”</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-[11px] font-semibold text-sherwood-800">
          {initials}
        </span>
        <span>
          <span className="block text-[13px] font-semibold text-text">{name}</span>
          <span className="block text-[11.5px] text-subtle">{place}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

/** Accordion built on <details>, so it opens without any client JavaScript. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <details key={item.q} className="group/faq">
          <summary className="flex cursor-pointer items-center justify-between gap-6 py-4 text-left">
            <span className="font-display text-[17px] font-medium leading-snug text-text transition-colors group-hover/faq:text-meadow-700 sm:text-[18px]">
              {item.q}
            </span>
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm border border-border-strong text-muted transition-colors group-open/faq:border-sherwood-800 group-open/faq:text-sherwood-800">
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M8 3v10" className="origin-center transition-transform duration-200 group-open/faq:rotate-90 group-open/faq:opacity-0" />
                <path d="M3 8h10" />
              </svg>
            </span>
          </summary>
          <p className="pb-5 pr-12 text-[13.5px] leading-relaxed text-muted">{item.a}</p>
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
    <div className="rail flex gap-2 overflow-x-auto px-5 py-2 md:grid md:grid-cols-4 md:gap-2 md:overflow-visible md:px-0 md:py-0 lg:grid-cols-6">
      {items.map((item) => (
        <div key={item.src} className="relative h-[200px] w-60 flex-shrink-0 overflow-hidden md:h-[150px] md:w-auto">
          <Image
            src={item.src}
            alt={item.label}
            fill
            sizes="(min-width: 1024px) 220px, (min-width: 768px) 25vw, 240px"
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-end bg-text/15 p-3">
            <span className="text-[10px] font-semibold text-on-dark/85">{item.label}</span>
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
    <Link href={`/blog/${slug}`} className="group flex flex-col overflow-hidden rounded-md border border-border bg-raised">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-text/90 to-transparent p-3 pt-10">
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-on-dark/85">{kicker}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[18px] font-medium leading-snug text-text transition-colors group-hover:text-meadow-700">
          {title}
        </h3>
        <span className="mt-auto pt-4 text-[11.5px] text-subtle">{readMinutes} min read</span>
      </div>
    </Link>
  );
}

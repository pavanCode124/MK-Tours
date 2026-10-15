import Image from 'next/image';
import Link from 'next/link';
import type { Destination } from '@/lib/catalog';
import { CardRail } from './CardRail';
import { PillarArt, PillarSquiggle, type ArtName } from './PillarArt';
import {
  CardChips,
  CardFact,
  CardFlag,
  CardMedia,
  CardShell,
  Icon,
  type IconName,
  PricePill,
  Stars,
} from './ui';

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
    <CardShell href={`/destinations/${destination.slug}`} className={`min-h-[320px] ${className}`}>
      <CardMedia
        src={destination.image}
        alt={destination.label}
        sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 45vw"
      />

      {destination.count !== undefined && destination.count > 0 && (
        <div className="p-3">
          <PricePill
            price={String(destination.count)}
            suffix={destination.count === 1 ? 'tour' : 'tours'}
          />
        </div>
      )}

      <div className="mt-auto space-y-2 p-4 pt-6">
        <CardFlag>{destination.region}</CardFlag>

        <h3 className="font-display text-[19px] font-semibold leading-tight text-on-dark">{destination.label}</h3>

        <CardChips items={[destination.state]} />

        {destination.blurb && (
          <p className="line-clamp-2 text-[11.5px] leading-[1.6] text-on-dark/70">{destination.blurb}</p>
        )}
      </div>
    </CardShell>
  );
}

/* -------------------------------------------------------------------------- */
/* Experience card — a theme, in the same photographic tile                    */
/* -------------------------------------------------------------------------- */

/**
 * One way to travel — pilgrimage, hill station, honeymoon — as the same tile
 * the packages and destinations use, so the three collections read as one set.
 */
export function ExperienceCard({
  theme,
  className = '',
}: {
  theme: { slug: string; label: string; blurb: string; count: number; image: string };
  className?: string;
}) {
  return (
    <CardShell href={`/themes/${theme.slug}`} className={`min-h-[340px] ${className}`}>
      <CardMedia
        src={theme.image}
        alt={theme.label}
        sizes="(min-width: 1024px) 300px, (min-width: 640px) 40vw, 70vw"
      />

      <div className="p-3">
        <PricePill price={String(theme.count)} suffix={theme.count === 1 ? 'tour' : 'tours'} />
      </div>

      <div className="mt-auto space-y-2 p-4 pt-6">
        <CardFlag>Experience</CardFlag>

        <h3 className="font-display text-[19px] font-semibold leading-tight text-on-dark">{theme.label}</h3>

        <p className="line-clamp-2 text-[11.5px] leading-[1.6] text-on-dark/70">{theme.blurb}</p>

        <CardFact icon="sparkle" text={`${theme.count} ${theme.count === 1 ? 'departure' : 'departures'}`} />
      </div>
    </CardShell>
  );
}

/** Uniform cell width for a destination tile, used by every destination rail. */
export const DESTINATION_ITEM = 'w-[205px] sm:w-[225px] lg:w-[240px]';

/**
 * Destination tiles on a scrolling rail. Every tile is the same width and the
 * row never wraps — an arrow on either flank pages through the collection
 * instead.
 */
export function DestinationRail({
  destinations,
  label = 'Destinations',
  className = '',
}: {
  destinations: Destination[];
  label?: string;
  className?: string;
}) {
  return (
    <CardRail className={className} itemClassName={DESTINATION_ITEM} label={label}>
      {destinations.map((d) => (
        <DestinationCard key={d.slug} destination={d} />
      ))}
    </CardRail>
  );
}

/**
 * Kept as the name older callers import. Destination collections are rails
 * everywhere now, so this is the same row.
 */
export const DestinationGrid = DestinationRail;

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
        <div className="absolute inset-0 bg-gradient-to-t from-azure-900/75 via-azure-900/10 to-transparent" />
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

/**
 * The light-panel card: the promise is read first, in type, and the drawing
 * sits underneath it on a pale dome — a card you look at rather than a row of
 * icons you skim past. `step` numbers it, for a sequence rather than a set.
 */
export function PillarCard({
  art,
  title,
  text,
  step,
}: {
  art: ArtName;
  title: string;
  text: string;
  /** e.g. `01` — shown as a small marker above the title. */
  step?: string;
}) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-azure-200 bg-raised transition-all duration-500 hover:-translate-y-1.5 hover:border-vermilion-300 hover:shadow-lift">
      <PillarSquiggle seed={SQUIGGLE_SEED[art] ?? 0} className="inset-x-0 top-6 h-[120px] w-full opacity-70" />

      <div className="relative px-6 pt-7">
        {step && (
          <span className="mb-2 flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-vermilion-600">
            {step}
            <span className="h-px w-6 bg-vermilion-300" />
          </span>
        )}
        <h3 className="font-display text-[20px] font-bold leading-tight text-azure-700 transition-colors duration-500 group-hover:text-vermilion-700">
          {title}
        </h3>
        <p className="mt-3 text-[13.5px] leading-[1.75] text-muted">{text}</p>
      </div>

      <PillarArt name={art} className="mt-6 h-[175px] w-full" />
    </article>
  );
}

const SQUIGGLE_SEED: Record<ArtName, number> = {
  group: 0,
  pin: 1,
  shield: 2,
  home: 3,
  enquiry: 4,
  quote: 2,
  booking: 1,
  manager: 0,
};

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



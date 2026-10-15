import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/* Type                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The small label above a section heading. It now sits in a soft vermilion
 * capsule with a leading dot rather than floating as bare tracked-out caps, so
 * it reads as a tag on the section instead of a line of small print.
 */
/**
 * Display heading: the soft serif set tight, in mixed case.
 *
 * Deliberately sets no colour of its own. A base `text-text` here would win
 * against a `text-on-dark` passed in `className` — Tailwind resolves same-property
 * utilities by stylesheet order, not by the order they appear in the attribute —
 * which silently painted dark headings onto the dark panels. Inheriting instead
 * means a heading is the colour of whatever section it sits in, and a caller can
 * still override it.
 */
export function Display({
  children,
  as: Tag = 'h2',
  className = '',
}: {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
}) {
  return (
    <Tag className={`font-display font-semibold leading-[1.1] tracking-[-0.02em] ${className}`}>{children}</Tag>
  );
}

/**
 * Section header: display heading, optional lede and a trailing link.
 * `align` switches between the left-aligned and centred variants.
 */
export function SectionHeading({
  title,
  lede,
  link,
  align = 'left',
  tone = 'light',
  className = '',
}: {
  title: ReactNode;
  lede?: ReactNode;
  link?: { href: string; label: string };
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const centered = align === 'center';
  const dark = tone === 'dark';
  return (
    <div
      className={`${centered ? 'text-center' : 'flex flex-wrap items-end justify-between gap-x-8 gap-y-4'} ${className}`}
    >
      <div className={centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        <Display
          className={`display-caps text-[30px] sm:text-[38px] lg:text-[45px] ${dark ? 'text-on-dark' : ''}`}
        >
          {title}
        </Display>
        {lede && (
          <p className={`mt-4 text-[15px] leading-[1.8] ${dark ? 'text-on-dark/75' : 'text-muted'}`}>{lede}</p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className={`group/link inline-flex shrink-0 items-center gap-2 rounded-full border px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
            dark
              ? 'border-transparent bg-white text-azure-900 shadow-lift hover:bg-vermilion-500 hover:text-white'
              : 'border-border-strong bg-raised text-text shadow-soft hover:border-azure-700 hover:bg-azure-800 hover:text-on-dark hover:shadow-lift'
          }`}
        >
          {link.label}
          <span className="">→</span>
        </Link>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

const BTN_BASE =
  'group/btn inline-flex items-center justify-center gap-2 rounded-full text-[11.5px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ease-out';

const BTN_VARIANTS = {
  solid: 'bg-azure-900 text-on-dark shadow-lift hover:bg-azure-700 hover:shadow-float',
  accent: 'bg-vermilion-500 text-white shadow-glow hover:bg-vermilion-400 hover:shadow-float',
  outline:
    'border border-border-strong bg-raised text-text shadow-soft hover:border-azure-700 hover:bg-azure-800 hover:text-on-dark hover:shadow-lift',
  onDark: 'border border-on-dark/35 text-on-dark backdrop-blur-sm hover:border-on-dark hover:bg-on-dark hover:text-azure-900',
  clay: 'bg-clay text-white shadow-lift hover:bg-clay-600 hover:shadow-float',
  ghost: 'text-vermilion-700 hover:text-azure-800',
} as const;

const BTN_SIZES = {
  sm: 'px-6 py-3',
  md: 'px-8 py-4',
} as const;

export function Button({
  href,
  children,
  variant = 'solid',
  size = 'md',
  external,
  arrow = true,
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof BTN_VARIANTS;
  size?: keyof typeof BTN_SIZES;
  external?: boolean;
  /** The trailing arrow. Turn it off for buttons whose label is a count. */
  arrow?: boolean;
  className?: string;
}) {
  const classes = `${BTN_BASE} ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && (
        <span aria-hidden="true" className="">
          →
        </span>
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Small parts                                                                */
/* -------------------------------------------------------------------------- */

export function Stars({ count = 5, className = '' }: { count?: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 text-vermilion-500 ${className}`} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-3.5 w-3.5"
          fill={i < count ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.3"
          aria-hidden="true"
        >
          <path d="M10 1.8l2.5 5.1 5.6.8-4 4 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

/** A thin ruled divider in the warm border colour, tapering at both ends. */
export function Rule({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-border-strong to-transparent ${className}`}
    />
  );
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-azure-900/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-on-dark shadow-soft backdrop-blur-md ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * A rounded tile with an icon in a tinted roundel — the small unit that carries
 * contact details, facts and notes throughout the site.
 */
export function IconTile({
  icon,
  children,
  className = '',
}: {
  icon: IconName;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card flex flex-col p-6 hover:card-hover ${className}`}>
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-vermilion-50 text-vermilion-700 ring-1 ring-vermilion-300/50">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      {children}
    </div>
  );
}

/** A number + label stat, used in the trust strips. */
export function Stat({
  top,
  label,
  note,
  highlight = false,
}: {
  top: string;
  label: string;
  note?: string;
  highlight?: boolean;
}) {
  return (
    <div className="group/stat rounded-2xl px-4 py-5 text-center transition-colors duration-300 hover:bg-vermilion-50/70">
      <div
        className={`font-display text-[20px] font-semibold leading-none ${
          highlight ? 'text-vermilion-500' : 'text-azure-700'
        }`}
      >
        {top}
      </div>
      <div className="mt-1.5 text-[12.5px] font-bold text-text">{label}</div>
      {note && <div className="mt-0.5 text-[11px] text-subtle">{note}</div>}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Icons — rounded line set                                                   */
/* -------------------------------------------------------------------------- */

const ICON_PATHS = {
  group: 'M7 11a3 3 0 100-6 3 3 0 000 6zm10 0a3 3 0 100-6 3 3 0 000 6zM2 20c0-2.8 2.2-5 5-5s5 2.2 5 5m1-9.2c2.5.4 4 2.5 4 5.2',
  pin: 'M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z M12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  shield: 'M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6l7-3z M9.2 12.2l2 2 3.6-4',
  home: 'M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9.5z',
  phone: 'M6.6 3h3l1.5 4-2 1.4a12 12 0 005.5 5.5l1.4-2 4 1.5v3A2 2 0 0118 18.4 16 16 0 015.6 6 2 2 0 016.6 3z',
  mail: 'M3 6.5h18v11H3z M3 7l9 6 9-6',
  calendar: 'M4 6h16v15H4z M4 10h16 M8 3v4 M16 3v4',
  sun: 'M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z M12 2v2 M12 20v2 M2 12h2 M20 12h2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M19.1 4.9l-1.4 1.4 M6.3 17.7l-1.4 1.4',
  cloud: 'M7 18h10a3.5 3.5 0 000-7 5 5 0 00-9.6-1.3A3.5 3.5 0 007 18z',
  snow: 'M12 3v18 M4.2 7.5l15.6 9 M19.8 7.5l-15.6 9',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.3 2.8 1-5.9L3.5 9.7l5.9-.9z',
  book: 'M4 5.5A2 2 0 016 3.5h13v15H6a2 2 0 00-2 2v-15z M19 18.5v2H6',
  train: 'M6 3.5h12v11H6z M6 14.5l-2 6 M18 14.5l2 6 M6 9h12 M9.5 12h.01 M14.5 12h.01',
  compass: 'M12 21a9 9 0 100-18 9 9 0 000 18z M15.5 8.5l-2 5-5 2 2-5z',
  check: 'M4.5 12.5l5 5 10-11',
  arrow: 'M4 12h15 M13 6l6 6-6 6',
  plane: 'M21 15.5v-2l-8-2.8V6a1.5 1.5 0 00-3 0v4.7L2 13.5v2l8-1.6v3.6l-2.5 1.6V21l4-1.2 4 1.2v-1.9L13 17.5v-3.6z',
  camera: 'M3.5 8.5h3l1.5-2.5h8L17.5 8.5h3v11h-17z M12 17.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z',
  tree: 'M12 21v-5 M12 3l5 7h-3.5l3.5 5H7l3.5-5H7z',
  leaf: 'M20 4C10 4 4 9 4 17c0 1 .2 2 .5 3 6-9 10-11 15.5-16z M7 17c3-6 7-8 11-10',
  heart: 'M12 20C7 16.5 3.5 13.5 3.5 10a4 4 0 017.1-2.5L12 9l1.4-1.5A4 4 0 0120.5 10c0 3.5-3.5 6.5-8.5 10z',
  sparkle: 'M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8z',
  wallet: 'M3.5 7.5h17v11h-17z M3.5 7.5l12-3 1 3 M16 13h2',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7.5V12l3.2 2',
} as const;

export type IconName = keyof typeof ICON_PATHS | 'whatsapp';

/**
 * The WhatsApp mark is a solid glyph, not a line drawing, so it is kept out of
 * ICON_PATHS and filled rather than stroked — a traced outline reads as a
 * generic speech bubble and loses the brand.
 */
const WHATSAPP_PATH =
  'M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.33 4.97L2 22l5.25-1.38a9.87 9.87 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2zm0 1.82c2.16 0 4.19.84 5.72 2.37a8.05 8.05 0 012.37 5.72c0 4.46-3.63 8.09-8.09 8.09a8.2 8.2 0 01-4.18-1.14l-.3-.18-3.11.82.83-3.04-.2-.31a8.05 8.05 0 01-1.24-4.3c0-4.46 3.63-8.09 8.2-8.03zm-3.3 3.6c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.6c.13.17 1.76 2.7 4.28 3.78.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.48-.6 1.69-1.19.21-.59.21-1.09.15-1.19-.06-.1-.23-.17-.48-.29-.25-.12-1.48-.73-1.71-.81-.23-.09-.4-.13-.56.12-.17.25-.65.81-.79.98-.15.17-.29.19-.54.06-.25-.12-1.06-.39-2.01-1.24-.74-.66-1.25-1.48-1.39-1.73-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.55-1.36-.78-1.86-.2-.47-.4-.41-.56-.42h-.48z';

export function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  if (name === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d={WHATSAPP_PATH} />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICON_PATHS[name].split(' M').map((d, i) => (
        <path key={i} d={i === 0 ? d : `M${d}`} />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Photographic card kit                                                      */
/* -------------------------------------------------------------------------- */

/*
 * Packages, destinations and experiences all share one tile now: a single
 * photograph darkened from the foot upwards, with the offer riding the top
 * corner and the facts stacked over the bottom of the picture. The parts live
 * here so the three cards cannot drift apart.
 */

/** The clickable tile itself. Children sit above the photograph. */
export function CardShell({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative isolate flex h-full min-h-[380px] flex-col overflow-hidden rounded-[1.15rem] bg-azure-900 shadow-lift ring-1 ring-white/10 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-float ${className}`}
    >
      {children}
    </Link>
  );
}

/**
 * The photograph behind a tile. One wash, weighted to the foot, so the top of
 * the picture stays bright and the type below always has something to sit on.
 */
export function CardMedia({
  src,
  alt,
  sizes = '(min-width: 1024px) 340px, (min-width: 640px) 45vw, 80vw',
  priority = false,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(6,16,38,0.98)_0%,rgba(8,20,46,0.95)_30%,rgba(10,26,60,0.70)_50%,rgba(10,26,60,0.16)_76%,rgba(10,26,60,0.04)_100%)]" />
      <span className="sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
    </div>
  );
}

/**
 * The offer that rides the top of the tile: the old price struck through on a
 * marigold highlight, then the price being asked.
 */
export function PricePill({
  price,
  was,
  suffix = 'onwards',
  className = '',
}: {
  price: string;
  was?: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[0.5rem] bg-raised px-2.5 py-1.5 leading-none shadow-lift ${className}`}
    >
      {was && (
        <s className="rounded-[0.25rem] bg-marigold px-1 py-[3px] text-[11px] font-semibold text-azure-900/70 decoration-vermilion-500 decoration-[1.5px]">
          {was}
        </s>
      )}
      <span className="font-display text-[14px] font-bold text-azure-900">{price}</span>
      <span className="text-[11px] font-semibold text-muted">{suffix}</span>
    </span>
  );
}

/** The marigold flag above a tile's title — trip type, region, or the like. */
export function CardFlag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-[0.45rem] bg-marigold px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.08em] text-azure-900 ${className}`}
    >
      {children}
    </span>
  );
}

/**
 * The route strip: what the trip covers, on one glass chip, with the overflow
 * counted off in marigold rather than wrapped onto another line.
 */
export function CardChips({ items, max = 3 }: { items: string[]; max?: number }) {
  if (items.length === 0) return null;
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  return (
    <div className="flex items-center gap-1.5">
      <span className="min-w-0 flex-1 truncate rounded-[0.45rem] bg-white/12 px-2 py-1.5 text-[11px] font-semibold text-on-dark/85 ring-1 ring-inset ring-white/15 backdrop-blur-sm">
        {shown.join(' • ')}
      </span>
      {rest > 0 && (
        <span className="shrink-0 rounded-[0.45rem] bg-marigold px-1.5 py-1.5 text-[11px] font-bold leading-none text-azure-900">
          +{rest} More
        </span>
      )}
    </div>
  );
}

/** One icon + label fact on the foot of a tile. */
export function CardFact({
  icon,
  text,
  trail,
  className = '',
}: {
  icon: IconName;
  text: string;
  /** A quieter note after the fact, e.g. "+3 batches". */
  trail?: string;
  className?: string;
}) {
  return (
    <span className={`flex min-w-0 items-center gap-1.5 text-[11.5px] font-medium text-on-dark/85 ${className}`}>
      <Icon name={icon} className="h-3.5 w-3.5 shrink-0 text-sky-300" />
      <span className="truncate">{text}</span>
      {trail && <span className="shrink-0 text-[11px] text-sky-300/80">{trail}</span>}
    </span>
  );
}

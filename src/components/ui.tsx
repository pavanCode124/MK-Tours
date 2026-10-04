import Link from 'next/link';
import type { ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/* Type                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The small label above a section heading. It now sits in a soft marigold
 * capsule with a leading dot rather than floating as bare tracked-out caps, so
 * it reads as a tag on the section instead of a line of small print.
 */
export function Eyebrow({
  children,
  tone = 'warm',
  className = '',
}: {
  children: ReactNode;
  tone?: 'warm' | 'dark' | 'bare';
  className?: string;
}) {
  if (tone === 'bare') {
    return (
      <span
        className={`block text-[10.5px] font-bold uppercase tracking-[0.2em] text-meadow-700 ${className}`}
      >
        {children}
      </span>
    );
  }
  const skin =
    tone === 'dark'
      ? 'border-meadow-300/35 bg-white/8 text-meadow-300'
      : 'border-meadow-300/70 bg-meadow-50 text-meadow-700';
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] ${skin} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

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
 * Section header: eyebrow, display heading, optional lede and a trailing link.
 * `align` switches between the left-aligned and centred variants.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  link,
  align = 'left',
  tone = 'light',
  className = '',
}: {
  eyebrow?: string;
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
        {eyebrow && <Eyebrow tone={dark ? 'dark' : 'warm'} className="mb-4">{eyebrow}</Eyebrow>}
        <Display
          className={`display-caps text-[30px] sm:text-[38px] lg:text-[45px] ${dark ? 'text-on-dark' : ''}`}
        >
          {title}
        </Display>
        {lede && (
          <p className={`mt-5 text-[15px] leading-[1.8] ${dark ? 'text-on-dark/75' : 'text-muted'}`}>{lede}</p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className={`group/link inline-flex shrink-0 items-center gap-2 rounded-full border px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
            dark
              ? 'border-white/25 text-on-dark hover:border-meadow-400 hover:bg-meadow-500 hover:text-sherwood-900'
              : 'border-border-strong bg-raised text-text shadow-soft hover:-translate-y-0.5 hover:border-sherwood-700 hover:bg-sherwood-800 hover:text-on-dark hover:shadow-lift'
          }`}
        >
          {link.label}
          <span className="transition-transform duration-300 group-hover/link:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

const BTN_BASE =
  'group/btn inline-flex items-center justify-center gap-2 rounded-full text-[11.5px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0';

const BTN_VARIANTS = {
  solid: 'bg-sherwood-900 text-on-dark shadow-lift hover:bg-sherwood-700 hover:shadow-float',
  meadow: 'bg-meadow-500 text-sherwood-900 shadow-glow hover:bg-meadow-400 hover:shadow-float',
  outline:
    'border border-border-strong bg-raised text-text shadow-soft hover:border-sherwood-700 hover:bg-sherwood-800 hover:text-on-dark hover:shadow-lift',
  onDark: 'border border-on-dark/35 text-on-dark backdrop-blur-sm hover:border-on-dark hover:bg-on-dark hover:text-sherwood-900',
  clay: 'bg-clay text-white shadow-lift hover:bg-clay-600 hover:shadow-float',
  ghost: 'text-meadow-700 hover:text-sherwood-800',
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
        <span aria-hidden="true" className="transition-transform duration-300 group-hover/btn:translate-x-1">
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
    <span className={`inline-flex gap-0.5 text-meadow-500 ${className}`} aria-label={`${count} out of 5 stars`}>
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
      className={`inline-flex items-center rounded-full bg-sherwood-900/75 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-on-dark shadow-soft backdrop-blur-md ${className}`}
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
      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-meadow-50 text-meadow-700 ring-1 ring-meadow-300/50">
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
    <div className="group/stat rounded-2xl px-4 py-5 text-center transition-colors duration-300 hover:bg-meadow-50/70">
      <div
        className={`font-display text-[20px] font-semibold leading-none ${
          highlight ? 'text-meadow-500' : 'text-sherwood-700'
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

export type IconName = keyof typeof ICON_PATHS;

export function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
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

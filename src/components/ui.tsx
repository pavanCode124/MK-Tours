import Link from 'next/link';
import type { ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/* Type                                                                       */
/* -------------------------------------------------------------------------- */

/** The small uppercase gold label that sits above every section heading. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`block text-[10.5px] font-medium uppercase tracking-[0.26em] text-meadow-700 ${className}`}>
      {children}
    </span>
  );
}

/** Display heading: the editorial serif at a regular weight, open leading. */
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
    <Tag className={`font-display font-normal leading-[1.18] tracking-[0.01em] text-text ${className}`}>{children}</Tag>
  );
}

/**
 * Section header: eyebrow, display heading, optional lede and a trailing link.
 * `align` switches between the left-aligned and centred variants the reference
 * site alternates between.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  link,
  align = 'left',
  className = '',
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  link?: { href: string; label: string };
  align?: 'left' | 'center';
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <div
      className={`${centered ? 'text-center' : 'flex flex-wrap items-end justify-between gap-x-6 gap-y-3'} ${className}`}
    >
      <div className={centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <Eyebrow className={centered ? 'mb-3' : 'mb-2.5'}>
            {centered ? (
              <span className="inline-flex items-center gap-3">
                <span className="h-px w-10 bg-meadow-600/50" />
                {eyebrow}
                <span className="h-px w-10 bg-meadow-600/50" />
              </span>
            ) : (
              eyebrow
            )}
          </Eyebrow>
        )}
        <Display className="display-caps text-[27px] sm:text-[34px] lg:text-[40px]">{title}</Display>
        {lede && <p className="mt-5 text-[15px] font-light leading-[1.85] text-muted">{lede}</p>}
      </div>
      {link && (
        <Link
          href={link.href}
          className="shrink-0 rounded-full border border-border-strong px-6 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-text transition-colors hover:border-sherwood-800 hover:bg-sherwood-800 hover:text-on-dark"
        >
          {link.label} →
        </Link>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Buttons                                                                    */
/* -------------------------------------------------------------------------- */

const BTN_BASE =
  'inline-flex items-center justify-center gap-2 rounded-full text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-200';

const BTN_VARIANTS = {
  solid: 'bg-sherwood-900 text-on-dark hover:bg-sherwood-700',
  meadow: 'bg-meadow-700 text-white hover:bg-sherwood-900',
  outline: 'border border-border-strong bg-transparent text-text hover:border-sherwood-900 hover:bg-sherwood-900 hover:text-on-dark',
  onDark: 'border border-on-dark/40 text-on-dark hover:border-on-dark hover:bg-on-dark hover:text-sherwood-900',
  clay: 'bg-clay text-white hover:bg-clay-600',
} as const;

const BTN_SIZES = {
  sm: 'px-6 py-3',
  md: 'px-9 py-4',
} as const;

export function Button({
  href,
  children,
  variant = 'solid',
  size = 'md',
  external,
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof BTN_VARIANTS;
  size?: keyof typeof BTN_SIZES;
  external?: boolean;
  className?: string;
}) {
  const classes = `${BTN_BASE} ${BTN_VARIANTS[variant]} ${BTN_SIZES[size]} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Small parts                                                                */
/* -------------------------------------------------------------------------- */

export function Stars({ count = 5, className = '' }: { count?: number; className?: string }) {
  return (
    <span className={`inline-flex text-amber ${className}`} aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill={i < count ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M10 1.8l2.5 5.1 5.6.8-4 4 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z" />
        </svg>
      ))}
    </span>
  );
}

/** A thin ruled divider in the warm border colour. */
export function Rule({ className = '' }: { className?: string }) {
  return <div className={`h-px w-full bg-border ${className}`} />;
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-text/75 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-on-dark backdrop-blur-sm ${className}`}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Icons — thin line set, matching the reference's stroke weight              */
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
} as const;

export type IconName = keyof typeof ICON_PATHS;

export function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
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

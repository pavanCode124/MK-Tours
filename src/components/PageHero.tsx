import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { BanyanTree, CameraBadge, FlightPath, PineTree, SmokePlume, TopoField, TreeLine } from './Decor';
import { PencilCamera } from './PencilCamera';
import { PencilPalm } from './PencilPalm';
import { Display } from './ui';

export interface Crumb {
  href?: string;
  label: string;
}

/** The breadcrumb trail, as a row of soft capsules rather than slash-separated text. */
function Breadcrumbs({ crumbs, tone }: { crumbs: Crumb[]; tone: 'dark' | 'light' }) {
  if (crumbs.length === 0) return null;
  const onDark = tone === 'dark';
  const base = onDark
    ? 'border-white/20 bg-white/10 text-on-dark/80 hover:border-white/50 hover:text-on-dark'
    : 'border-border bg-raised text-muted shadow-soft hover:border-vermilion-300 hover:text-vermilion-700';
  const current = onDark
    ? 'border-vermilion-300/40 bg-vermilion-500/15 text-vermilion-300'
    : 'border-vermilion-300/70 bg-vermilion-50 text-vermilion-700';

  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[11.5px]">
      <Link href="/" className={`rounded-full border px-3 py-1.5 transition-colors ${base}`}>
        Home
      </Link>
      {crumbs.map((c, i) => (
        <span key={c.label} className="flex items-center gap-2">
          <span aria-hidden="true" className={onDark ? 'text-on-dark/35' : 'text-subtle'}>
            ›
          </span>
          {c.href && i !== crumbs.length - 1 ? (
            <Link href={c.href} className={`rounded-full border px-3 py-1.5 transition-colors ${base}`}>
              {c.label}
            </Link>
          ) : (
            <span className={`max-w-[60vw] truncate rounded-full border px-3 py-1.5 font-semibold ${current}`}>
              {c.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/**
 * The banner every photographic inner page opens with.
 *
 * The photograph is inset from the page edges and clipped to a deep curve, so it
 * reads as a mounted print rather than a full-bleed band. Decorative trees, a
 * flight arc and a drifting plume sit inside the frame, and the copy is laid over
 * the lower-left corner.
 */
export function PageHero({
  image,
  eyebrow,
  title,
  lede,
  crumbs = [],
  children,
}: {
  image: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative bg-bg px-3 pt-3 sm:px-5 sm:pt-4 lg:px-7 lg:pt-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-azure-900 shadow-lift lg:rounded-[2.75rem]">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" aria-hidden="true" />
        {/* Grading. Neither layer reaches full opacity: the banner is short, so a
            solid stop at the foot would bury the photograph entirely rather than
            just darkening it under the copy. */}
        <div className="absolute inset-0 bg-gradient-to-t from-azure-900/88 via-azure-900/45 to-azure-900/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-azure-900/65 via-azure-900/15 to-transparent" />

        {/* Ornament inside the frame */}
        <FlightPath
          variant="arch"
          className="pointer-events-none absolute left-[10%] top-6 hidden h-[130px] w-[80%] text-vermilion-300/40 md:block"
        />
        <SmokePlume
          seed={1}
          className="pointer-events-none absolute -bottom-4 right-[8%] hidden h-[200px] w-[160px] text-white/25 lg:block"
        />
        <PineTree className="pointer-events-none absolute -bottom-1 right-[4%] hidden h-[150px] w-[64px] text-azure-900/70 tree-breathe sm:block" />
        <PineTree className="pointer-events-none absolute -bottom-2 right-[12%] hidden h-[110px] w-[48px] text-azure-900/55 tree-breathe tree-breathe-slow sm:block" />
        <TreeLine className="pointer-events-none absolute inset-x-0 bottom-0 h-[70px] text-azure-900/60" />

        <div className="relative mx-auto flex max-w-[1280px] flex-col justify-end px-6 pb-14 pt-16 md:px-10 lg:px-14 lg:pb-16 lg:pt-24">
          <Breadcrumbs crumbs={crumbs} tone="dark" />
          {eyebrow && (
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-vermilion-300/40 bg-azure-900/40 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-vermilion-300 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-vermilion-400" />
              {eyebrow}
            </span>
          )}
          <Display
            as="h1"
            className="display-caps max-w-3xl text-[32px] text-on-dark sm:text-[42px] lg:text-[52px]"
          >
            {title}
          </Display>
          {lede && <p className="mt-5 max-w-2xl text-[14.5px] leading-[1.8] text-on-dark/80">{lede}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

/**
 * Narrower banner for editorial pages that lead with text rather than a photo.
 * A tinted panel with the sketch set, a topographic field and a banyan rather
 * than a photograph.
 */
export function PlainPageHero({
  eyebrow,
  title,
  lede,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative bg-bg px-3 pt-3 sm:px-5 sm:pt-4 lg:px-7 lg:pt-5">
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface shadow-soft lg:rounded-[2.75rem]">
        {/* A warm bloom and a dotted field keep the panel from reading as flat. */}
        <div className="pointer-events-none absolute -right-20 -top-28 h-[320px] w-[320px] bloom-warm" />
        <div className="pointer-events-none absolute inset-0 dotfield opacity-40" />
        <TopoField className="pointer-events-none absolute -bottom-10 right-0 hidden h-[280px] w-[48%] text-azure-700/12 lg:block" />
        <PencilCamera className="pointer-events-none absolute -right-6 -top-6 hidden w-[180px] rotate-[8deg] opacity-[0.13] text-azure-800 sm:block lg:-right-8 lg:w-[240px]" />
        <CameraBadge className="pointer-events-none absolute right-[200px] top-8 hidden h-[110px] w-[130px] -rotate-6 text-azure-700/12 xl:block" />
        <PencilPalm className="pointer-events-none absolute bottom-0 right-[150px] hidden w-[84px] -rotate-[6deg] opacity-[0.12] text-azure-800 lg:block" />
        <BanyanTree className="pointer-events-none absolute -bottom-6 left-[3%] hidden h-[180px] w-[180px] text-azure-700/10 lg:block" />
        <PineTree className="pointer-events-none absolute bottom-0 left-[16%] hidden h-[140px] w-[60px] text-azure-700/12 tree-breathe xl:block" />

        <div className="relative mx-auto max-w-[1280px] px-6 py-14 md:px-10 lg:px-14 lg:py-18">
          <Breadcrumbs crumbs={crumbs} tone="light" />
          {eyebrow && (
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-vermilion-300/70 bg-vermilion-50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-vermilion-700">
              <span className="h-1.5 w-1.5 rounded-full bg-vermilion-500" />
              {eyebrow}
            </span>
          )}
          <Display as="h1" className="display-caps max-w-3xl text-[30px] sm:text-[38px] lg:text-[46px]">
            {title}
          </Display>
          {lede && <p className="mt-5 max-w-2xl text-[14.5px] leading-[1.8] text-muted">{lede}</p>}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

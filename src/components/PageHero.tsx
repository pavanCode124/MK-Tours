import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PencilCamera } from './PencilCamera';
import { PencilPalm } from './PencilPalm';
import { Display } from './ui';

export interface Crumb {
  href?: string;
  label: string;
}

/**
 * The banner every inner page opens with: a photograph, a breadcrumb, an
 * eyebrow and a display heading, in the same proportions as the home hero's
 * lower third.
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
    <section className="relative overflow-hidden bg-text">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-text/90 via-text/55 to-text/35" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col justify-end px-5 pb-12 pt-20 md:px-8 lg:px-12 lg:pb-16 lg:pt-28">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-[11.5px] text-on-dark/65">
            <Link href="/" className="transition-colors hover:text-on-dark">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-on-dark">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-on-dark/90">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <span className="mb-3 text-[10.5px] font-medium uppercase tracking-[0.26em] text-meadow-300">{eyebrow}</span>
        )}
        <Display as="h1" className="display-caps max-w-3xl text-[29px] text-on-dark sm:text-[38px] lg:text-[46px]">
          {title}
        </Display>
        {lede && <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-on-dark/80">{lede}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}

/** Narrower banner for editorial pages that lead with text rather than a photo. */
export function PlainPageHero({
  eyebrow,
  title,
  lede,
  crumbs = [],
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <PencilCamera className="absolute -right-8 -top-4 hidden w-[190px] rotate-[7deg] opacity-[0.11] sm:block lg:-right-10 lg:w-[250px]" />
      <PencilPalm className="absolute bottom-2 right-[240px] hidden w-[86px] -rotate-[6deg] opacity-[0.1] lg:block" />
      <div className="relative mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-[11.5px] text-muted">
            <Link href="/" className="transition-colors hover:text-sherwood-800">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-sherwood-800">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-text">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <span className="mb-3 block text-[10.5px] font-medium uppercase tracking-[0.26em] text-meadow-700">
            {eyebrow}
          </span>
        )}
        <Display as="h1" className="display-caps max-w-3xl text-[27px] sm:text-[34px] lg:text-[40px]">
          {title}
        </Display>
        {lede && <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-muted">{lede}</p>}
      </div>
    </section>
  );
}

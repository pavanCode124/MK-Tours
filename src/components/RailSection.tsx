import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CardRail } from './CardRail';

/**
 * A card collection presented the way the brand banners read: a photographic
 * panel carries the heading and a call to action, and the rail of cards rides
 * up over the foot of that photograph before running on below it.
 *
 * The cards themselves are a `CardRail` — one fixed width each, scrolled
 * sideways with an arrow on either flank — so no section on the site falls
 * back to a wrapping grid.
 */
export function RailSection({
  image,
  title,
  subtitle,
  cta,
  children,
  itemClassName,
  label,
  className = '',
  align = 'left',
  bannerHeight = 'h-[300px] sm:h-[330px] lg:h-[360px]',
}: {
  /** Path under /public, e.g. `/images/dest-srinagar.jpg`. */
  image: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** The pill under the heading — WanderOn's "Explore". */
  cta?: { href: string; label: string; external?: boolean };
  children: ReactNode;
  itemClassName?: string;
  label?: string;
  className?: string;
  align?: 'left' | 'center';
  /** Override when a section needs a taller or shorter photograph. */
  bannerHeight?: string;
}) {
  const centered = align === 'center';

  return (
    <section className={`relative py-8 lg:py-12 ${className}`}>
      <div className="mx-auto max-w-[1520px] px-5 md:px-8 lg:px-12">
        <div className="relative">
          {/* The photograph. It stops short of the section's foot, so the cards
              below it sit half on the picture and half on the page. */}
          <div
            className={`absolute inset-x-0 top-0 overflow-hidden rounded-[1.75rem] bg-azure-900 shadow-lift lg:rounded-[2.25rem] ${bannerHeight}`}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              aria-hidden="true"
              className="object-cover"
            />
            {/* Two passes of grading: one from the foot so the cards have
                something to sit on, one from the side so the copy stays legible
                over a bright sky. */}
            <div className="absolute inset-0 bg-gradient-to-t from-azure-900/85 via-azure-900/35 to-azure-900/20" />
            <div
              className={`absolute inset-0 ${
                centered
                  ? 'bg-azure-900/25'
                  : 'bg-gradient-to-r from-azure-900/70 via-azure-900/25 to-transparent'
              }`}
            />
          </div>

          {/* Heading, over the photograph */}
          <div
            className={`relative px-5 pt-10 sm:px-9 sm:pt-12 lg:px-12 ${
              centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'
            }`}
          >
            <h2 className="font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.02em] text-on-dark sm:text-[38px] lg:text-[44px]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.12em] text-on-dark/85 sm:text-[13px]">
                {subtitle}
              </p>
            )}
            {cta &&
              (cta.external ? (
                <a
                  href={cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CTA_CLASS}
                >
                  {cta.label}
                </a>
              ) : (
                <Link href={cta.href} className={CTA_CLASS}>
                  {cta.label}
                </Link>
              ))}
          </div>

          {/* The rail, overlapping the foot of the photograph */}
          <CardRail
            className="relative z-10 mt-8 sm:mt-9"
            itemClassName={itemClassName}
            label={label ?? (typeof title === 'string' ? title : 'Cards')}
          >
            {children}
          </CardRail>
        </div>
      </div>
    </section>
  );
}

const CTA_CLASS =
  'mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-vermilion-500 px-8 py-3.5 text-[12.5px] font-bold uppercase tracking-[0.12em] text-white shadow-float transition-all duration-300 hover:bg-vermilion-400 hover:shadow-glow';

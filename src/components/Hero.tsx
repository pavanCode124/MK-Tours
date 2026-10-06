'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HERO_SLIDES, HERO_WORDS } from '@/lib/content';
import { FlightPath, SmokePlume, TreeLine } from './Decor';

export interface HeroOption {
  value: string;
  label: string;
}

export interface HeroProps {
  states: HeroOption[];
  destinations: HeroOption[];
  cities: HeroOption[];
  headline: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const SLIDE_MS = 5600;
const ROTATE_MS = 2600;
const FADE_MS = 320;

/**
 * The home hero.
 *
 * Asymmetric rather than centred: the headline and buttons sit hard left over
 * the photography, a column of floating proof cards rides the right-hand edge,
 * and the search panel is a curved bar that overlaps the foot of the picture.
 * A dashed flight arc crosses the frame, smoke drifts up from the lower left,
 * and a tree line closes the bottom edge.
 */
export function Hero({ states, destinations, cities, headline }: HeroProps) {
  const [slide, setSlide] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced.current) return;

    const slides = setInterval(() => setSlide((i) => (i + 1) % HERO_SLIDES.length), SLIDE_MS);

    // Crossfade the word: fade out, swap the text mid-transition, fade back in.
    const words = setInterval(() => {
      setSwapping(true);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % HERO_WORDS.length);
        setSwapping(false);
      }, FADE_MS);
    }, ROTATE_MS);

    return () => {
      clearInterval(slides);
      clearInterval(words);
    };
  }, []);

  const current = HERO_WORDS[wordIndex];

  return (
    <section className="relative bg-azure-900">
      {/* Crossfading background photographs */}
      <div className="absolute inset-0 overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt=""
            aria-hidden="true"
            fetchPriority={i === 0 ? 'high' : 'low'}
            className="slow-pan absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out"
            style={{ opacity: i === slide ? 1 : 0 }}
          />
        ))}
      </div>

      {/* Grading: dark from the left so left-aligned copy always holds, plus a
          vignette at the foot that hands over to the page background. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-azure-900/88 via-azure-900/55 to-azure-900/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-azure-900/85 via-transparent to-azure-900/45" />

      {/* Ornament: the flight arc, a drifting plume, and the tree line */}
      <FlightPath
        variant="rise"
        className="pointer-events-none absolute left-[6%] top-[14%] hidden h-[180px] w-[70%] text-vermilion-300/55 md:block"
      />
      <SmokePlume className="pointer-events-none absolute -bottom-6 left-[2%] hidden h-[260px] w-[200px] text-white/30 lg:block" />
      <TreeLine className="pointer-events-none absolute inset-x-0 bottom-0 h-[110px] text-azure-900/70" />

      <div className="relative mx-auto grid min-h-[calc(100vh-120px)] max-w-[1320px] items-center gap-12 px-5 pb-48 pt-20 md:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-12">
        {/* Copy — left aligned, no card behind it */}
        <div className="hero-copy-in max-w-[640px]">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-vermilion-300/40 bg-azure-900/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-vermilion-300 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-vermilion-400" />
            Since 2012 · Departures from Mumbai
          </span>

          <h1 className="mt-6 font-display text-[38px] font-semibold leading-[1.02] tracking-[-0.03em] text-on-dark sm:text-[54px] lg:text-[66px]">
            Journeys made for{' '}
            <Link
              href={current.href}
              aria-label={`Explore tours for ${current.word}`}
              className="group/word relative inline-block align-baseline"
            >
              <span
                data-swapping={swapping}
                className="hero-word bg-gradient-to-r from-vermilion-300 via-vermilion-400 to-vermilion-500 bg-clip-text font-semibold italic text-transparent"
              >
                {current.word}
              </span>
              <span className="absolute inset-x-0 -bottom-1.5 h-[3px] origin-left rounded-full bg-vermilion-500/80 transition-transform duration-500 group-hover/word:scale-x-110" />
            </Link>
          </h1>

          <p className="mt-7 max-w-[520px] text-[15.5px] leading-[1.8] text-on-dark/80">{headline}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/packages"
              className="group/cta inline-flex items-center gap-2 rounded-full bg-vermilion-500 px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.14em] text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-vermilion-400"
            >
              Explore tours
              <span className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.14em] text-on-dark backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/20"
            >
              Plan a private trip
            </Link>
          </div>

          {/* Inline proof line, in place of the old centred trust row */}
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[12px] text-on-dark/70">
            {[
              '10,000+ travellers carried',
              'Train, stays, meals & sightseeing in one price',
              'Support 24×7',
            ].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-vermilion-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4.5 12.5l5 5 10-11" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Floating proof cards down the right-hand edge */}
        <div className="hero-side-in hidden lg:flex lg:flex-col lg:items-end lg:gap-4">
          <div className="float-soft glass w-[260px] p-5 text-on-dark">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[40px] font-bold leading-none text-vermilion-300">4.9</span>
              <span className="text-[11.5px] uppercase tracking-[0.14em] text-on-dark/70">/ 5</span>
            </div>
            <div className="mt-2 flex gap-0.5 text-vermilion-400">
              {Array.from({ length: 5 }, (_, i) => (
                <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M10 1.8l2.5 5.1 5.6.8-4 4 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-4 5.6-.8z" />
                </svg>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-on-dark/70">
              Rated by travellers on our Google profile, across pilgrimage, Kashmir and Kerala departures.
            </p>
          </div>

          <div className="float-soft float-soft-delay glass w-[230px] p-5 text-on-dark">
            <span className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-vermilion-300">Next up</span>
            <p className="mt-1.5 font-display text-[19px] font-semibold leading-tight">
              {HERO_SLIDES[slide]?.alt.split(',')[0] ?? 'Kashmir valleys'}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11.5px] text-on-dark/70">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-vermilion-400" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M6 3.5h12v11H6zM6 14.5l-2 6M18 14.5l2 6M6 9h12" />
              </svg>
              Group rail booking from Mumbai
            </div>
          </div>

          {/* Slide dots double as the only manual control in the hero */}
          <div className="mt-2 flex items-center gap-2.5">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => setSlide(i)}
                aria-label={`Show ${s.alt}`}
                aria-current={i === slide}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === slide ? 'w-9 bg-vermilion-400' : 'w-4 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search panel, overlapping the foot of the photograph */}
      <div className="relative z-10 mx-auto -mt-36 max-w-[1320px] px-5 pb-6 md:px-8 lg:px-12">
        <form
          action="/packages"
          method="get"
          className="hero-form-in rounded-[2rem] border border-border bg-raised/95 p-4 shadow-float backdrop-blur-md sm:p-5 lg:rounded-full lg:px-6 lg:py-4"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-2">
            <Field label="State" name="state" options={states} placeholder="All States" icon="pin" />
            <Field
              label="Destination"
              name="destination"
              options={destinations}
              placeholder="All Destinations"
              icon="compass"
            />
            <Field label="Departure City" name="city" options={cities} placeholder="All Cities" icon="train" />
            <Field
              label="Travel Month"
              name="month"
              placeholder="Any Month"
              icon="calendar"
              options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))}
            />
            <button
              type="submit"
              className="group/find mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-azure-900 px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.14em] text-on-dark shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-vermilion-500 hover:text-white lg:mt-0"
            >
              Find Tours
              <span className="transition-transform duration-300 group-hover/find:translate-x-1">→</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

const FIELD_ICONS = {
  pin: 'M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z',
  compass: 'M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z',
  train: 'M6 3.5h12v11H6zM6 14.5l-2 6M18 14.5l2 6M6 9h12',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
} as const;

function Field({
  label,
  name,
  options,
  placeholder,
  icon,
}: {
  label: string;
  name: string;
  options: HeroOption[];
  placeholder: string;
  icon: keyof typeof FIELD_ICONS;
}) {
  return (
    <label className="group/field relative flex items-center gap-3 rounded-full border border-border bg-bg px-4 py-2.5 transition-colors duration-300 focus-within:border-vermilion-500 hover:border-border-strong">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vermilion-50 text-vermilion-700">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={FIELD_ICONS[icon]} />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-subtle">{label}</span>
        <select
          name={name}
          defaultValue=""
          aria-label={label}
          className="-ml-0.5 w-full cursor-pointer appearance-none truncate bg-transparent pr-5 text-[13.5px] font-medium text-text outline-none"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </span>
      <svg
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-3.5 h-4 w-4 text-subtle transition-transform duration-300 group-focus-within/field:rotate-180"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden="true"
      >
        <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

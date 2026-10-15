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
 * Centred: the headline, copy and buttons sit in the middle of the frame over
 * bright, lightly graded photography, and the search panel is a curved bar
 * that overlaps the foot of the picture. A dashed flight arc crosses the
 * frame, smoke drifts up from the lower left, and a tree line closes the
 * bottom edge.
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

      {/* Grading: a light, even wash — just enough for the white copy to hold
          against bright photography, with no heavy darkening of the image. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-azure-900/45 via-azure-900/15 to-azure-900/55" />

      {/* Ornament: the flight arc, a drifting plume, and the tree line */}
      <FlightPath
        variant="rise"
        className="pointer-events-none absolute left-[6%] top-[14%] hidden h-[180px] w-[70%] text-vermilion-300/55 md:block"
      />
      <SmokePlume className="pointer-events-none absolute -bottom-6 left-[2%] hidden h-[260px] w-[200px] text-white/30 lg:block" />
      <TreeLine className="pointer-events-none absolute inset-x-0 bottom-0 h-[110px] text-azure-900/70" />

      <div className="relative mx-auto flex min-h-[calc(100vh-120px)] max-w-[900px] flex-col items-center justify-center gap-0 px-5 pb-48 pt-20 text-center md:px-8 lg:px-12">
        {/* Copy — centred, no card behind it */}
        <div className="hero-copy-in mx-auto max-w-[760px]">
          <h1 className="font-display text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] text-on-dark drop-shadow-[0_2px_18px_rgba(10,26,60,0.55)] sm:text-[54px] lg:text-[66px]">
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

          <p className="mx-auto mt-7 max-w-[560px] text-[15.5px] leading-[1.8] text-on-dark/90 drop-shadow-[0_1px_10px_rgba(10,26,60,0.5)]">
            {headline}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/packages"
              className="group/cta inline-flex items-center gap-2 rounded-full bg-vermilion-500 px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.14em] text-white shadow-glow transition-all duration-300 hover:bg-vermilion-400"
            >
              Explore tours
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.14em] text-on-dark backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/20"
            >
              Plan a private trip
            </Link>
          </div>

          {/* Inline proof line */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[12px] text-on-dark/85">
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

          {/* Slide dots double as the only manual control in the hero */}
          <div className="mt-8 flex items-center justify-center gap-2.5">
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
              className="group/find mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-azure-900 px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.14em] text-on-dark shadow-lift transition-all duration-300 hover:bg-vermilion-500 hover:text-white lg:mt-0"
            >
              Find Tours
              <span aria-hidden="true">→</span>
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

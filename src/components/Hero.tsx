'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HERO_SLIDES, HERO_WORDS } from '@/lib/content';

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

const SLIDE_MS = 5000;
const ROTATE_MS = 2600;
const FADE_MS = 320;

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
    <section className="relative overflow-hidden bg-text">
      {/* Crossfading background photographs */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.src}
            src={s.src}
            alt=""
            aria-hidden="true"
            fetchPriority={i === 0 ? 'high' : 'low'}
            className="absolute inset-0 h-full w-full object-cover brightness-[1.06] saturate-[1.1] transition-opacity duration-[900ms] ease-in-out"
            style={{ opacity: i === slide ? 1 : 0 }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-text/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[100px] bg-gradient-to-t from-bg to-transparent" />

      <div className="pointer-events-none relative mx-auto min-h-[calc(100vh-108px)] max-w-[1280px] lg:min-h-[calc(100vh-98px)]">
        {/* Headline block, vertically centred against the photograph */}
        <div className="pointer-events-none absolute inset-y-0 left-5 flex items-center md:left-8 lg:left-12">
          <div className="hero-copy-in pointer-events-auto flex w-fit flex-col items-start gap-2.5 text-left">
            <h1 className="sr-only">{headline}</h1>
            <span className="inline-flex w-fit items-center rounded-sm bg-text/65 px-3.5 py-1.5 font-display text-sm italic leading-none text-on-dark/90 backdrop-blur-sm sm:text-base">
              Discover
            </span>
            <Link
              href={current.href}
              aria-label={`Explore tours for ${current.word}`}
              className="inline-block w-fit rounded-md bg-text/65 px-5 py-2 backdrop-blur-sm transition-colors duration-200 hover:bg-text/80"
            >
              <span
                data-swapping={swapping}
                className="hero-word block font-display text-4xl font-medium leading-[0.95] tracking-tight text-on-dark sm:text-5xl lg:text-7xl"
              >
                {current.word}
              </span>
            </Link>
          </div>
        </div>

        {/* Search card, pinned to the bottom edge of the photograph */}
        <form
          action="/packages"
          method="get"
          className="hero-form-in pointer-events-auto absolute bottom-6 left-5 right-5 grid grid-cols-1 gap-3 rounded-md border border-border-strong bg-bg p-4 shadow-[0_8px_32px_rgba(48,44,37,.28)] md:left-8 md:right-8 md:grid-cols-2 lg:bottom-8 lg:left-12 lg:right-12 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end"
        >
          <Field label="State" name="state" options={states} placeholder="All States" />
          <Field label="Destination" name="destination" options={destinations} placeholder="All Destinations" />
          <Field label="Departure City" name="city" options={cities} placeholder="All Departure Cities" />
          <Field
            label="Travel Month"
            name="month"
            placeholder="Any Month"
            options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))}
          />
          <button
            type="submit"
            className="mt-1 inline-flex items-center justify-center rounded-sm bg-sherwood-800 px-7 py-[13px] text-[11px] font-semibold uppercase tracking-[0.1em] text-on-dark transition-colors duration-200 hover:bg-sherwood-900 lg:mt-0"
          >
            Find Tours →
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  options: HeroOption[];
  placeholder: string;
}) {
  return (
    <label className="flex flex-col items-start gap-1.5">
      <span className="pl-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-muted">{label}</span>
      <div className="relative w-full">
        <select
          name={name}
          defaultValue=""
          aria-label={label}
          className="w-full cursor-pointer appearance-none rounded-sm border border-border-strong bg-raised px-4 py-[11px] pr-9 text-sm text-text outline-none transition-colors duration-200 hover:bg-surface focus-visible:ring-2 focus-visible:ring-meadow-700"
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </label>
  );
}

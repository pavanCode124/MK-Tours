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
    <section className="relative bg-sherwood-900">
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
            className="slow-pan absolute inset-0 h-full w-full object-cover transition-opacity duration-[1100ms] ease-in-out"
            style={{ opacity: i === slide ? 1 : 0 }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sherwood-900/35 via-sherwood-900/15 to-sherwood-900/55" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[140px] bg-gradient-to-t from-bg to-transparent" />

      <div className="relative mx-auto flex min-h-[calc(100vh-110px)] max-w-[1280px] flex-col items-center justify-center px-5 pb-40 pt-16 md:px-8 lg:px-12">
        {/* Headline card, centred on the photograph — the reference's signature block */}
        <div className="hero-copy-in w-full max-w-[760px] rounded-[26px] border border-white/25 bg-white/[0.14] px-7 py-11 text-center shadow-[0_30px_80px_-30px_rgba(10,20,28,0.65)] backdrop-blur-md sm:px-12 sm:py-14">
          <span className="inline-flex items-center gap-3 text-[10.5px] font-semibold uppercase tracking-[0.3em] text-on-dark/85">
            <span className="h-px w-8 bg-meadow-300/70" />
            Since 2012 · Mumbai
            <span className="h-px w-8 bg-meadow-300/70" />
          </span>

          <h1 className="mt-5 font-display text-[36px] font-light leading-[1.08] tracking-[-0.025em] text-on-dark sm:text-[52px] lg:text-[62px]">
            Journeys made for
            <br className="hidden sm:block" />{' '}
            <Link
              href={current.href}
              aria-label={`Explore tours for ${current.word}`}
              className="group/word relative inline-block align-baseline transition-colors hover:text-meadow-300"
            >
              <span data-swapping={swapping} className="hero-word font-normal italic text-meadow-300">
                {current.word}
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-meadow-300 transition-transform duration-300 group-hover/word:scale-x-100" />
            </Link>
          </h1>

          <p className="mx-auto mt-6 max-w-[520px] text-[15px] leading-[1.75] text-on-dark/85">
            {headline}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 rounded-full bg-meadow-600 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_14px_34px_-14px_rgba(169,119,31,1)] transition-colors hover:bg-meadow-700"
            >
              Explore tours
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/45 px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-on-dark transition-colors hover:border-white hover:bg-white/15"
            >
              Plan a private trip
            </Link>
          </div>
        </div>
      </div>

      {/* Search card, straddling the foot of the photograph */}
      <div className="relative mx-auto -mt-24 max-w-[1280px] px-5 pb-4 md:px-8 lg:px-12">
        <form
          action="/packages"
          method="get"
          className="hero-form-in grid grid-cols-1 gap-3 rounded-2xl border border-border bg-raised p-5 shadow-[0_24px_60px_-24px_rgba(28,46,61,0.45)] md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end lg:gap-4 lg:p-6"
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
            className="mt-1 inline-flex items-center justify-center rounded-full bg-sherwood-800 px-8 py-[14px] text-[11.5px] font-semibold uppercase tracking-[0.1em] text-on-dark transition-colors duration-200 hover:bg-sherwood-900 lg:mt-0"
          >
            Find Tours
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
      <span className="pl-0.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-subtle">{label}</span>
      <div className="relative w-full">
        <select
          name={name}
          defaultValue=""
          aria-label={label}
          className="w-full cursor-pointer appearance-none rounded-xl border border-border-strong bg-bg px-4 py-[12px] pr-9 text-sm text-text outline-none transition-colors duration-200 hover:bg-surface focus-visible:ring-2 focus-visible:ring-meadow-700"
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

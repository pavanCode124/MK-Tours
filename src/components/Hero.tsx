'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { HERO_SLIDES, HERO_WORDS, TRUST_ITEMS } from '@/lib/content';
import { FlightPath, SmokePlume, TreeLine } from './Decor';

const SLIDE_MS = 5600;
const ROTATE_MS = 2600;
const FADE_MS = 320;

/**
 * The home hero.
 *
 * Centred: the rotating headline sits in the middle of the frame over bright,
 * lightly graded photography, and the trust row plus the search panel close the
 * foot of the same viewport. A dashed flight arc crosses the frame, smoke drifts up from the
 * lower left, and a tree line closes the bottom edge.
 */
export function Hero({ children }: { children?: React.ReactNode }) {
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

      <div className="relative mx-auto flex min-h-[calc(100vh-66px)] max-w-[1320px] flex-col px-5 pb-8 pt-10 md:px-8 lg:min-h-[calc(100vh-142px)] lg:px-12 lg:pb-7 lg:pt-8">
        {/* Copy — centred in whatever height the trust row leaves */}
        <div className="hero-copy-in flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="mx-auto max-w-[900px] font-display text-[38px] font-semibold leading-[1.05] tracking-[-0.03em] text-on-dark drop-shadow-[0_2px_18px_rgba(10,26,60,0.55)] sm:text-[54px] lg:text-[66px]">
            <span className="block">Journeys made for</span>
            <span className="mt-3 block sm:mt-4">
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
            </span>
          </h1>

          {/* Slide dots double as the only manual control in the hero */}
          <div className="mt-7 flex items-center justify-center gap-2.5">
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

        {/* Trust row — the proof that used to sit in a card below the hero,
            now closing the foot of the same viewport. */}
        <div className="relative mt-7 rounded-[1.75rem] border border-white/20 bg-white/10 p-2 backdrop-blur-md sm:p-3">
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-5">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl px-3 py-3 text-center transition-colors duration-300 hover:bg-white/10"
              >
                <div
                  className={`font-display text-[17px] font-bold leading-none ${
                    item.top.startsWith('★') ? 'text-vermilion-300' : 'text-on-dark'
                  }`}
                >
                  {item.top}
                </div>
                <div className="mt-1.5 text-[12.5px] font-bold text-on-dark">{item.label}</div>
                <div className="mt-0.5 text-[11px] text-on-dark/70">{item.note}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Search panel — closing the same viewport as the headline */}
        {/* z-30 keeps the search fields' open dropdowns above the section below. */}
        {children ? <div className="relative z-30 mt-4">{children}</div> : null}
      </div>
    </section>
  );
}

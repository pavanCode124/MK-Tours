'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from './ui';

export interface FrameItem {
  src: string;
  label: string;
}

/** One frame plus the gap that follows it — the distance the arrows page by. */
const STEP = 278;

/**
 * A full-bleed filmstrip of travel photographs, each pinned with a location
 * badge.
 *
 * The band appears to bow away from the viewer. Nothing is actually warped:
 * two wide ellipses painted in the section's own colour sit over the top and
 * bottom of the strip, so the photographs are eaten into an arc at the middle
 * and stand full height at the flanks. Because the ellipses are fixed to the
 * rail rather than to the tiles, the curve holds while the strip scrolls.
 *
 * `surfaceClass` must be the background the strip is laid on, or the arcs show
 * as a band of the wrong colour.
 */
export function JourneyInFrames({
  items,
  surfaceClass = 'bg-surface',
}: {
  items: FrameItem[];
  surfaceClass?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= 1);
    setAtEnd(rail.scrollLeft >= max - 1);
  }, []);

  // Scroll fires far faster than the arrows need to be repainted, so the
  // end-of-rail test is folded into the next frame.
  const schedule = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      measure();
    });
  }, [measure]);

  useEffect(() => {
    measure();
    const rail = railRef.current;
    if (!rail) return;
    const ro = new ResizeObserver(schedule);
    ro.observe(rail);
    window.addEventListener('resize', schedule);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', schedule);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [measure, schedule]);

  /** Page the rail by whole frames, rounded to the viewport it has to fill. */
  const scrollBy = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const page = Math.max(STEP, Math.floor(rail.clientWidth / STEP) * STEP - STEP);
    rail.scrollBy({ left: dir * page, behavior: 'smooth' });
  };

  return (
    // The strip is laid out edge to edge, so it is given the full width of
    // whatever it is dropped into rather than a padded column.
    <div className="relative w-full">
      <div
        ref={railRef}
        onScroll={schedule}
        className="rail flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth scroll-px-4 px-4 md:scroll-px-[60px] md:px-[60px]"
        role="region"
        aria-label="Journey in frames"
        tabIndex={0}
      >
        {items.map((item) => (
          <div
            key={item.src}
            className="group relative aspect-[270/400] w-[calc(100vw-2rem)] shrink-0 snap-start overflow-hidden bg-border md:aspect-auto md:h-[400px] md:w-[270px]"
          >
            <Image
              src={item.src}
              alt={item.label}
              fill
              sizes="(min-width: 768px) 270px, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
            />
            <span className="absolute bottom-8 left-2 inline-flex items-center gap-1 rounded-full border-[0.5px] border-white/70 bg-black/40 px-1.5 py-[2px] text-[12px] font-normal leading-4 text-on-dark backdrop-blur-[2px] md:bottom-12">
              <Icon name="pin" className="h-3 w-3" />
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* The two arcs. They overhang the strip by half their height so the
          curve bites into the photographs rather than merely capping them. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-5 left-0 right-0 z-10 h-10 rounded-[50%] md:-top-10 md:h-20 ${surfaceClass}`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-5 left-0 right-0 z-10 h-10 rounded-[50%] md:-bottom-10 md:h-20 ${surfaceClass}`}
      />

      <RailArrow side="left" onClick={() => scrollBy(-1)} disabled={atStart} />
      <RailArrow side="right" onClick={() => scrollBy(1)} disabled={atEnd} />
    </div>
  );
}

function RailArrow({
  side,
  onClick,
  disabled,
}: {
  side: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === 'left' ? 'Previous photographs' : 'Next photographs'}
      className={`absolute top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-sky-500 text-white shadow-float transition-opacity duration-150 ease-in disabled:cursor-not-allowed disabled:opacity-40 md:inline-flex ${
        side === 'left' ? 'left-2' : 'right-2'
      }`}
    >
      <svg
        viewBox="0 0 16 16"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={side === 'left' ? 'M10 12L6 8l4-4' : 'M6 4l4 4-4 4'} />
      </svg>
    </button>
  );
}

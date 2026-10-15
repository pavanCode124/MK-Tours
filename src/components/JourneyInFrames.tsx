'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef } from 'react';
import { Icon } from './ui';

export interface FrameItem {
  src: string;
  label: string;
}

/** How much taller a frame grows at the far edge of the strip. */
const CURVE = 0.17;

/**
 * A horizontally scrolling strip of travel photographs, each pinned with a
 * location badge.
 *
 * The strip is bowed: a frame is drawn at its natural height in the middle of
 * the rail and stretches as it travels towards either flank, so the row reads
 * as a band curving away from the viewer rather than a flat line of tiles. The
 * bow is measured against the rail, not the list, so it holds its shape while
 * the strip scrolls.
 */
export function JourneyInFrames({ items }: { items: FrameItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  const curve = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const box = rail.getBoundingClientRect();
    // Nothing to measure against until the rail has been laid out — a
    // background or freshly mounted tab reports a collapsed box.
    if (box.width < 64) return;
    const mid = box.left + box.width / 2;
    const reach = box.width / 2;
    for (const tile of Array.from(rail.children) as HTMLElement[]) {
      const t = tile.getBoundingClientRect();
      const d = Math.min(Math.abs(t.left + t.width / 2 - mid) / reach, 1.25);
      tile.style.transform = `scaleY(${(1 + CURVE * d * d).toFixed(4)})`;
    }
  }, []);

  const schedule = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      curve();
    });
  }, [curve]);

  useEffect(() => {
    curve();
    const rail = railRef.current;
    if (!rail) return;
    const ro = new ResizeObserver(schedule);
    ro.observe(rail);
    // Photographs settle late and the band is measured in viewport terms, so
    // the bow is recomputed on load and on any reflow that moves the rail.
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    document.addEventListener('visibilitychange', schedule);
    const io = new IntersectionObserver(schedule);
    io.observe(rail);
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('load', schedule);
      document.removeEventListener('visibilitychange', schedule);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [curve, schedule]);

  const scrollBy = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      {/* The bowed frames overflow their row, so the rail is given room to
          breathe above and below rather than clipping them. */}
      <div
        ref={railRef}
        onScroll={schedule}
        className="rail flex gap-2 overflow-x-auto scroll-smooth px-1 py-10"
        role="region"
        aria-label="Journey in frames"
        tabIndex={0}
      >
        {items.map((item) => (
          <div
            key={item.src}
            className="group relative h-[300px] w-[180px] flex-shrink-0 origin-center overflow-hidden rounded-xl shadow-soft transition-shadow duration-500 hover:shadow-lift sm:h-[360px] sm:w-[215px] lg:h-[400px] lg:w-[240px]"
          >
            <Image
              src={item.src}
              alt={item.label}
              fill
              sizes="(min-width: 1024px) 240px, (min-width: 640px) 215px, 180px"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-azure-900/55 to-transparent" />
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11.5px] font-semibold text-azure-900 shadow-soft backdrop-blur-sm">
              <Icon name="pin" className="h-3.5 w-3.5 text-azure-700" />
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <RailArrow side="left" onClick={() => scrollBy(-1)} />
      <RailArrow side="right" onClick={() => scrollBy(1)} />
    </div>
  );
}

function RailArrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous photographs' : 'Next photographs'}
      className={`absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-sky-500 text-white shadow-float transition-colors duration-200 hover:bg-sky-400 sm:flex ${
        side === 'left' ? 'left-3 lg:left-6' : 'right-3 lg:right-6'
      }`}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={side === 'left' ? 'M12.5 15l-5-5 5-5' : 'M7.5 5l5 5-5 5'} />
      </svg>
    </button>
  );
}

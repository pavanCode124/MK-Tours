'use client';

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * A horizontal rail for card collections — packages, destinations, anything
 * that used to sit in a grid. Cards keep a fixed width and the rail scrolls
 * sideways, with an arrow on either flank rather than wrapping onto further
 * rows.
 *
 * Each child is wrapped in its own fixed-width, snap-aligned cell, so callers
 * carry on rendering plain `<PackageCard />`s on the server.
 */
export function CardRail({
  children,
  itemClassName = 'w-[290px] sm:w-[330px] lg:w-[360px]',
  className = '',
  railClassName = '',
  label = 'Cards',
  tone = 'light',
}: {
  children: ReactNode;
  /** Width of one cell. Override for wider or narrower cards. */
  itemClassName?: string;
  className?: string;
  /** Extra classes on the scrolling track itself, e.g. vertical padding. */
  railClassName?: string;
  label?: string;
  /** `dark` flips the arrows to glass-on-photo, for rails over a dark panel. */
  tone?: 'light' | 'dark';
}) {
  const rail = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  // Only worth showing arrows when there is something off-screen to reach.
  const [overflows, setOverflows] = useState(false);

  const sync = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 8);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = rail.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    // Cells are the things that change width at a breakpoint, so watch one too.
    const first = el.firstElementChild;
    if (first) ro.observe(first);
    return () => ro.disconnect();
  }, [sync]);

  const page = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    // Advance by whole cards, never by a fraction of one.
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    const jumps = Math.max(1, Math.floor((el.clientWidth + 24) / step) - 1);
    el.scrollBy({ left: dir * step * jumps, behavior: 'smooth' });
  };

  const items = Children.toArray(children);
  if (items.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={rail}
        onScroll={sync}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`rail -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-6 overflow-x-auto scroll-smooth px-5 py-2 md:mx-0 md:scroll-pl-1 md:px-1 ${railClassName}`}
      >
        {items.map((child, i) => (
          <div key={i} className={`flex shrink-0 snap-start ${itemClassName}`}>
            <div className="flex w-full flex-col [&>*]:h-full">{child}</div>
          </div>
        ))}
      </div>

      {overflows && (
        <>
          <RailArrow side="left" tone={tone} onClick={() => page(-1)} disabled={atStart} />
          <RailArrow side="right" tone={tone} onClick={() => page(1)} disabled={atEnd} />
        </>
      )}
    </div>
  );
}

function RailArrow({
  side,
  onClick,
  disabled,
  tone,
}: {
  side: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
  tone: 'light' | 'dark';
}) {
  const skin =
    tone === 'dark'
      ? 'border-white/30 bg-white/15 text-on-dark backdrop-blur-md hover:bg-white hover:text-azure-900'
      : 'border-border bg-raised text-azure-900 hover:bg-vermilion-500 hover:border-vermilion-500 hover:text-white';

  return (
    <button
      type="button"
      onClick={onClick}
      // Clicking must not focus the button: the browser then scrolls every
      // clipped ancestor to bring it into view, which drags the whole section
      // sideways. Keyboard focus still works.
      onMouseDown={(e) => e.preventDefault()}
      disabled={disabled}
      aria-label={side === 'left' ? 'Previous' : 'Next'}
      // Dimmed rather than removed at the ends, so the control stays where the
      // eye last found it instead of popping in and out of the layout.
      className={`absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border shadow-float transition-all duration-200 disabled:pointer-events-none disabled:opacity-25 sm:h-11 sm:w-11 ${skin} ${
        side === 'left' ? '-left-1 lg:-left-5' : '-right-1 lg:-right-5'
      }`}
    >
      <svg
        viewBox="0 0 20 20"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={side === 'left' ? 'M12.5 15l-5-5 5-5' : 'M7.5 5l5 5-5 5'} />
      </svg>
    </button>
  );
}

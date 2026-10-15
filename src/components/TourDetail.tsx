'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './ui';
import type { TourDay } from '@/lib/mktours';

/* -------------------------------------------------------------------------- */
/* Sticky section nav                                                         */
/* -------------------------------------------------------------------------- */

/**
 * The band of section links that rides under the header on a tour page —
 * "Overview · Itinerary · Inclusions · Exclusions · Other Info".
 *
 * The active pill is driven by scroll position rather than by the clicked link,
 * so the band keeps up when the reader scrolls past a section by hand. The
 * observer fires on a narrow horizontal slice a third of the way down the
 * viewport: that is the line the eye is reading at, and testing against it
 * avoids the usual problem of a tall section outranking the short one that has
 * just come on screen.
 */
export function TourTabs({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const ids = items.map((i) => i.id);
    let frame = 0;

    const apply = () => {
      frame = 0;
      // Sorted by where the sections actually sit in the page, not by the
      // order of the band, so the two cannot drift apart.
      const sections = ids
        .map((id) => ({ id, el: document.getElementById(id) }))
        .filter((s): s is { id: string; el: HTMLElement } => s.el !== null)
        .sort((a, b) =>
          a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        );
      if (sections.length === 0) return;

      // The last section whose heading has passed the reading line is the one
      // the reader is in. Measuring every section against one line each frame
      // is deterministic, where an IntersectionObserver only reports the
      // sections whose state happened to change.
      const line = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const s of sections) {
        if (s.el.getBoundingClientRect().top <= line) current = s.id;
      }

      // At the very foot of the page the last section may never reach the
      // line, so pin the band to it rather than leaving it a section behind.
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      setActive(atBottom ? sections[sections.length - 1].id : current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  // Keep the active pill in view on phones, where the band scrolls sideways.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const pill = rail.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    pill?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [active]);

  if (items.length === 0) return null;

  return (
    <div className="sticky top-[56px] z-30 mt-7 border-y border-border bg-bg/85 backdrop-blur-md lg:top-[112px]">
      <div ref={railRef} className="rail mx-auto flex max-w-[1320px] gap-1.5 overflow-x-auto px-5 py-3 md:px-8 lg:px-12">
        {items.map((i) => (
          <a
            key={i.id}
            href={`#${i.id}`}
            data-tab={i.id}
            aria-current={active === i.id ? 'true' : undefined}
            className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] font-bold transition-all duration-300 ${
              active === i.id
                ? 'bg-azure-900 text-on-dark shadow-lift'
                : 'text-muted hover:bg-vermilion-50 hover:text-vermilion-700'
            }`}
          >
            {i.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Read more                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A block of CRM-authored prose that opens to its full height.
 *
 * The copy is always in the DOM — it is only masked — so it stays available to
 * search engines and to find-in-page. The toggle hides itself when the content
 * is short enough that there is nothing to reveal.
 */
export function ReadMore({ html, collapsedHeight = 260 }: { html: string; collapsedHeight?: number }) {
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflows(el.scrollHeight > collapsedHeight + 24);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [collapsedHeight, html]);

  return (
    <div>
      <div className="relative">
        <div
          ref={ref}
          className="rich-text overflow-hidden text-[14.5px] text-muted transition-[max-height] duration-500 ease-out"
          style={{ maxHeight: open || !overflows ? 'none' : collapsedHeight }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {overflows && !open && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-raised to-transparent" />
        )}
      </div>
      {overflows && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-vermilion-700 transition-colors hover:text-vermilion-800"
        >
          {open ? 'Read less' : 'Read more'}
          <span
            aria-hidden="true"
            className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          >
            ▾
          </span>
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Itinerary accordion                                                        */
/* -------------------------------------------------------------------------- */

/**
 * The day-by-day itinerary, as rows that open one at a time.
 *
 * A long tour printed in full runs to several screens of prose before the
 * reader reaches the price, so each day is collapsed to its heading and the
 * first is opened on arrival. The numbered badges stay on a single connector
 * line whether a row is open or shut.
 */
export function ItineraryAccordion({ days }: { days: TourDay[] }) {
  const [open, setOpen] = useState<number[]>(days.length > 0 ? [days[0].day_num] : []);
  const allOpen = open.length === days.length;

  const toggle = (num: number) =>
    setOpen((cur) => (cur.includes(num) ? cur.filter((n) => n !== num) : [...cur, num]));

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(allOpen ? [] : days.map((d) => d.day_num))}
          className="text-[12px] font-bold text-vermilion-700 transition-colors hover:text-vermilion-800"
        >
          {allOpen ? 'Collapse all days' : 'Expand all days'}
        </button>
      </div>

      <ol className="mt-4">
        {days.map((d, i) => (
          <DayRow
            key={d.id}
            day={d}
            last={i === days.length - 1}
            open={open.includes(d.day_num)}
            onToggle={() => toggle(d.day_num)}
          />
        ))}
      </ol>
    </div>
  );
}

function DayRow({
  day,
  last,
  open,
  onToggle,
}: {
  day: TourDay;
  last: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const points = day.sightseeing?.description_points ?? '';
  const place = [day.sightseeing?.city, day.sightseeing?.country].filter(Boolean).join(', ');
  const title = day.title || day.sightseeing?.activity || `Day ${day.day_num}`;
  const panelId = `day-${day.day_num}-panel`;

  return (
    <li className={`relative pl-12 ${last ? 'pb-0' : 'pb-3'}`}>
      {/* The connector runs behind the badges and stops at the last day. */}
      {!last && <span className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-border" />}
      <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-2xl bg-azure-800 font-display text-[15px] font-bold text-vermilion-300 shadow-soft">
        {day.day_num}
      </span>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="group/day flex w-full items-start gap-3 rounded-xl px-2 py-1 text-left transition-colors hover:bg-vermilion-50/60"
      >
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-vermilion-700">
              Day {day.day_num}
            </span>
            {place && (
              <span className="inline-flex items-center gap-1 text-[11px] text-subtle">
                <Icon name="pin" className="h-3 w-3" />
                {place}
              </span>
            )}
          </span>
          <span className="mt-1 block font-display text-[18px] font-semibold leading-snug text-text transition-colors group-hover/day:text-vermilion-800">
            {title}
          </span>
        </span>
        {points && (
          <span
            aria-hidden="true"
            className={`mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-[11px] text-muted transition-all duration-300 group-hover/day:border-vermilion-300 group-hover/day:text-vermilion-700 ${
              open ? 'rotate-180' : ''
            }`}
          >
            ▾
          </span>
        )}
      </button>

      {points && (
        <div
          id={panelId}
          hidden={!open}
          className="rich-text ml-2 mt-2 border-l-2 border-vermilion-100 pl-4 text-[13.5px] text-muted"
          dangerouslySetInnerHTML={{ __html: points }}
        />
      )}
    </li>
  );
}

'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';

export interface HeroOption {
  value: string;
  label: string;
}

export interface SearchBarProps {
  states: HeroOption[];
  destinations: HeroOption[];
  cities: HeroOption[];
  /** Rendered inside the hero's own container — drops the section shell. */
  embedded?: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * The catalogue search bar.
 *
 * A curved rectangle panel: four pill fields and the submit button, all inside
 * the same card. Embedded, it closes the foot of the hero viewport; standalone,
 * it sits in its own band under whatever precedes it.
 */
export function SearchBar({ states, destinations, cities, embedded = false }: SearchBarProps) {
  const form = (
    <form
      action="/packages"
      method="get"
      className="hero-form-in rounded-[1.75rem] border border-border bg-raised p-4 shadow-float sm:p-5"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-2.5">
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
          className="group/find mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-azure-900 px-8 py-4 text-[11.5px] font-bold uppercase tracking-[0.14em] text-on-dark shadow-lift transition-all duration-300 hover:bg-vermilion-500 hover:text-white lg:mt-0"
        >
          Find Tours
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );

  if (embedded) return form;

  return (
    <section className="relative z-10 bg-bg">
      <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">{form}</div>
    </section>
  );
}

const FIELD_ICONS = {
  pin: 'M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z',
  compass: 'M12 21a9 9 0 100-18 9 9 0 000 18zM15.5 8.5l-2 5-5 2 2-5z',
  train: 'M6 3.5h12v11H6zM6 14.5l-2 6M18 14.5l2 6M6 9h12',
  calendar: 'M4 6h16v15H4zM4 10h16M8 3v4M16 3v4',
} as const;

/**
 * One search field: a listbox, not a native `<select>`.
 *
 * The native control hands its popup to the OS, which sizes the list to the
 * field and clips longer names — "Himachal Pradesh" and "All Destinations" came
 * out truncated and crowded against the field's own border. This panel is ours:
 * it starts at the field's width, grows to the longest label (`min-w-max`),
 * caps at the viewport, and scrolls past ten or so entries. A hidden input
 * carries the value so the form stays a plain GET to /packages.
 */
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
  const items: HeroOption[] = [{ value: '', label: placeholder }, ...options];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const current = items.find((o) => o.value === selected) ?? items[0];

  // Escape closes, and so does a click or a focus landing outside the field.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('touchstart', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('touchstart', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);

  const choose = (i: number) => {
    setSelected(items[i].value);
    setActive(i);
    setOpen(false);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => (i + step + items.length) % items.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open) choose(active);
      else setOpen(true);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name={name} value={selected} />
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-label={label}
        onClick={() => {
          setActive(items.findIndex((o) => o.value === selected));
          setOpen((v) => !v);
        }}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center gap-3 rounded-2xl border bg-bg px-4 py-2.5 text-left transition-colors duration-300 hover:border-border-strong ${
          open ? 'border-vermilion-500' : 'border-border'
        }`}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-vermilion-50 text-vermilion-700">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={FIELD_ICONS[icon]} />
          </svg>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[9px] font-bold uppercase tracking-[0.16em] text-subtle">{label}</span>
          <span className="block truncate text-[13.5px] font-medium leading-6 text-text">{current.label}</span>
        </span>
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 shrink-0 text-subtle transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.4rem)] z-50 max-h-[min(19rem,50vh)] w-full min-w-max max-w-[min(22rem,80vw)] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-raised py-1.5 shadow-float"
        >
          {items.map((o, i) => (
            <li
              key={o.value || '__any'}
              role="option"
              aria-selected={o.value === selected}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={`cursor-pointer whitespace-nowrap px-4 py-2 text-[13.5px] leading-6 transition-colors duration-150 ${
                o.value === selected ? 'font-semibold text-vermilion-700' : 'text-text'
              } ${i === active ? 'bg-vermilion-50' : ''}`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

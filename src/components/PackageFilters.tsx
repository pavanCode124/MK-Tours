'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

/* -------------------------------------------------------------------------- */
/* Shapes passed down from the server page                                    */
/* -------------------------------------------------------------------------- */

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface DestinationState {
  state: string;
  count: number;
  items: FilterOption[];
}

export interface DestinationGroup {
  key: string;
  label: string;
  count: number;
  states: DestinationState[];
}

export interface FilterBounds {
  nights: [number, number];
  price: [number, number];
}

export interface FilterSelection {
  destination: string[];
  state: string[];
  theme: string[];
  season: string[];
  month: string[];
  nights: [number, number];
  price: [number, number];
}

interface Props {
  groups: DestinationGroup[];
  themes: FilterOption[];
  seasons: FilterOption[];
  months: FilterOption[];
  bounds: FilterBounds;
  selected: FilterSelection;
  /** Tours matching the committed selection, for the header count. */
  resultCount: number;
  total: number;
}

/* -------------------------------------------------------------------------- */

/**
 * The catalogue's filter rail — a sticky sidebar in the shape travellers know
 * from the big OTAs: a destination tree, two range sliders and checkbox lists,
 * all held locally until "Apply" writes them to the URL. The page itself still
 * filters on the server from those query parameters, so every view stays
 * shareable and crawlable.
 */
export function PackageFilters({
  groups,
  themes,
  seasons,
  months,
  bounds,
  selected,
  resultCount,
  total,
}: Props) {
  const router = useRouter();
  const [draft, setDraft] = useState<FilterSelection>(selected);
  const [open, setOpen] = useState(false); // mobile sheet
  const [pending, setPending] = useState(false);

  // The URL is the source of truth: a back button, a chip cleared elsewhere or
  // a link from the mega menu all land here and must reset the draft.
  useEffect(() => {
    setDraft(selected);
    setPending(false);
  }, [selected]);

  const dirty = useMemo(() => !sameSelection(draft, selected), [draft, selected]);
  const active = countActive(selected, bounds);

  const toggle = (facet: 'destination' | 'state' | 'theme' | 'season' | 'month', value: string) =>
    setDraft((d) => {
      const list = d[facet];
      return { ...d, [facet]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] };
    });

  const apply = () => {
    setPending(true);
    router.push(buildHref(draft, bounds), { scroll: false });
    setOpen(false);
  };

  const clear = () => {
    setPending(true);
    setDraft(emptySelection(bounds));
    router.push('/packages', { scroll: false });
    setOpen(false);
  };

  const panel = (
    <div className="flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-border bg-raised shadow-soft">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-display text-[19px] font-semibold text-text">Filters</h2>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold text-muted">
            {resultCount}/{total}
          </span>
          {/* The sheet needs a way out that is not the backdrop. */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close filters"
            className="-mr-1 rounded-full p-1.5 text-muted transition-colors hover:bg-surface hover:text-text lg:hidden"
          >
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="thin-scroll flex-1 overflow-y-auto px-5 py-4">
        {/* Destination — two levels, India and International, like the tree a
            traveller expects to drill into. */}
        <Section title="Destination" defaultOpen>
          <div className="-mx-1">
            {groups.map((group) => (
              <DestinationBranch
                key={group.key}
                group={group}
                selectedStates={draft.state}
                selectedDestinations={draft.destination}
                onToggleState={(v) => toggle('state', v)}
                onToggleDestination={(v) => toggle('destination', v)}
              />
            ))}
          </div>
        </Section>

        <Section title="Duration (in nights)" defaultOpen>
          <RangeSlider
            min={bounds.nights[0]}
            max={bounds.nights[1]}
            value={draft.nights}
            onChange={(nights) => setDraft((d) => ({ ...d, nights }))}
            format={(n) => `${n}N`}
          />
        </Section>

        <Section title="Budget (per person)" defaultOpen>
          <RangeSlider
            min={bounds.price[0]}
            max={bounds.price[1]}
            step={500}
            value={draft.price}
            onChange={(price) => setDraft((d) => ({ ...d, price }))}
            format={(n) => n.toLocaleString('en-IN')}
          />
        </Section>

        <Section title="Month" defaultOpen>
          <div className="grid grid-cols-2 gap-x-3">
            {months.map((m) => (
              <CheckRow
                key={m.value}
                label={m.label}
                count={m.count}
                checked={draft.month.includes(m.value)}
                onChange={() => toggle('month', m.value)}
              />
            ))}
          </div>
        </Section>

        <Section title="Trip theme">
          {themes.map((t) => (
            <CheckRow
              key={t.value}
              label={t.label}
              count={t.count}
              checked={draft.theme.includes(t.value)}
              onChange={() => toggle('theme', t.value)}
            />
          ))}
        </Section>

        <Section title="Season" last>
          {seasons.map((s) => (
            <CheckRow
              key={s.value}
              label={s.label}
              count={s.count}
              checked={draft.season.includes(s.value)}
              onChange={() => toggle('season', s.value)}
            />
          ))}
        </Section>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-4">
        <button
          type="button"
          onClick={clear}
          disabled={active === 0 && !dirty}
          className="text-[13px] font-semibold text-azure-600 transition-colors hover:text-vermilion-600 disabled:cursor-not-allowed disabled:text-subtle"
        >
          Clear Filters
        </button>
        <button
          type="button"
          onClick={apply}
          disabled={!dirty || pending}
          className="rounded-lg bg-sky-500 px-7 py-2.5 text-[13.5px] font-bold text-white shadow-soft transition-all hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-45"
        >
          Apply
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: a bar that opens the same panel as a sheet. */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-2xl border border-border bg-raised px-5 py-3.5 shadow-soft"
        >
          <span className="flex items-center gap-2.5 text-[14px] font-bold text-text">
            <SlidersIcon className="h-4 w-4 text-azure-600" />
            Filters
            {active > 0 && (
              <span className="rounded-full bg-vermilion-500 px-2 py-0.5 text-[11px] font-bold text-white">
                {active}
              </span>
            )}
          </span>
          <span className="text-[12px] font-semibold text-muted">{resultCount} tours</span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <div
            className="absolute inset-0 bg-azure-900/50 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-3 bottom-3 top-14">{panel}</div>
        </div>
      )}

      <aside className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7.5rem)]">{panel}</div>
      </aside>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Pieces                                                                     */
/* -------------------------------------------------------------------------- */

function Section({
  title,
  children,
  defaultOpen = false,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  last?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={last ? 'py-1' : 'border-b border-border py-1'}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <span className="text-[14px] font-bold text-text">{title}</span>
        <Chevron open={open} />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

function DestinationBranch({
  group,
  selectedStates,
  selectedDestinations,
  onToggleState,
  onToggleDestination,
}: {
  group: DestinationGroup;
  selectedStates: string[];
  selectedDestinations: string[];
  onToggleState: (value: string) => void;
  onToggleDestination: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  if (group.states.length === 0) return null;

  return (
    <div className="px-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-lg py-2.5 text-left transition-colors hover:bg-surface"
      >
        <span className="text-[13.5px] font-semibold text-muted">{group.label}</span>
        <span className="flex items-center gap-2">
          <span className="text-[11.5px] font-semibold text-subtle">{group.count}</span>
          <Chevron open={open} direction="right" />
        </span>
      </button>

      {open && (
        <div className="mb-1 ml-1 space-y-0.5 border-l border-border pl-3">
          {group.states.map((s) => (
            <StateBranch
              key={s.state}
              state={s}
              checked={selectedStates.includes(s.state)}
              selectedDestinations={selectedDestinations}
              onToggleState={onToggleState}
              onToggleDestination={onToggleDestination}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StateBranch({
  state,
  checked,
  selectedDestinations,
  onToggleState,
  onToggleDestination,
}: {
  state: DestinationState;
  checked: boolean;
  selectedDestinations: string[];
  onToggleState: (value: string) => void;
  onToggleDestination: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-1">
        <label className="flex flex-1 cursor-pointer items-center gap-2.5 py-1.5">
          <Box checked={checked} onChange={() => onToggleState(state.state)} />
          <span className={`text-[13px] ${checked ? 'font-semibold text-text' : 'text-muted'}`}>{state.state}</span>
          <span className="text-[11px] text-subtle">({state.count})</span>
        </label>
        {state.items.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={`Places in ${state.state}`}
            className="rounded p-1 text-subtle transition-colors hover:text-azure-600"
          >
            <Chevron open={open} />
          </button>
        )}
      </div>

      {open && (
        <div className="ml-3 border-l border-border pl-3">
          {state.items.map((d) => (
            <CheckRow
              key={d.value}
              label={d.label}
              count={d.count}
              checked={selectedDestinations.includes(d.value)}
              onChange={() => onToggleDestination(d.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  const empty = count === 0 && !checked;
  return (
    <label
      className={`flex items-center gap-2.5 py-1.5 ${empty ? 'cursor-not-allowed opacity-45' : 'cursor-pointer'}`}
    >
      <Box checked={checked} onChange={onChange} disabled={empty} />
      <span className={`text-[13px] ${checked ? 'font-semibold text-text' : 'text-muted'}`}>{label}</span>
      {typeof count === 'number' && <span className="text-[11px] text-subtle">({count})</span>}
    </label>
  );
}

function Box({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <span className="relative flex h-[17px] w-[17px] shrink-0 items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer h-[17px] w-[17px] cursor-pointer appearance-none rounded-[5px] border border-border-strong bg-raised transition-colors checked:border-sky-500 checked:bg-sky-500 disabled:cursor-not-allowed"
      />
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3.5 8.5l3 3 6-6.5" />
      </svg>
    </span>
  );
}

/** Two thumbs over one track — the budget and duration ranges. */
function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  format,
}: {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  format: (n: number) => string;
}) {
  const span = Math.max(max - min, 1);
  const [lo, hi] = value;
  const leftPct = ((lo - min) / span) * 100;
  const rightPct = ((hi - min) / span) * 100;

  if (max <= min) {
    return <p className="text-[12.5px] text-muted">{format(min)}</p>;
  }

  return (
    <div className="px-1 pt-1">
      <div className="range-dual">
        <div className="range-track" />
        <div className="range-fill" style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }} />
        <input
          type="range"
          className="range-input"
          min={min}
          max={max}
          step={step}
          value={lo}
          aria-label="Minimum"
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi), hi])}
        />
        <input
          type="range"
          className="range-input"
          min={min}
          max={max}
          step={step}
          value={hi}
          aria-label="Maximum"
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo)])}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[12px] font-semibold text-muted">
        <span>{format(lo)}</span>
        <span>{format(hi)}</span>
      </div>
    </div>
  );
}

function Chevron({ open, direction = 'down' }: { open: boolean; direction?: 'down' | 'right' }) {
  const rotation = direction === 'right' ? (open ? 'rotate-90' : '') : open ? 'rotate-180' : '';
  const path = direction === 'right' ? 'M7.5 4l5 6-5 6' : 'M4 7.5l6 5 6-5';
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`h-3.5 w-3.5 shrink-0 text-subtle transition-transform duration-200 ${rotation}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

function SlidersIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M3 6h14M3 14h14" />
      <circle cx="8" cy="6" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="13" cy="14" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Selection helpers — shared shape with the server page                      */
/* -------------------------------------------------------------------------- */

export function emptySelection(bounds: FilterBounds): FilterSelection {
  return {
    destination: [],
    state: [],
    theme: [],
    season: [],
    month: [],
    nights: [...bounds.nights] as [number, number],
    price: [...bounds.price] as [number, number],
  };
}

/** Query string for a selection; a range at its bounds is left out entirely. */
export function buildHref(selection: FilterSelection, bounds: FilterBounds): string {
  const query = new URLSearchParams();
  for (const facet of ['destination', 'state', 'theme', 'season', 'month'] as const) {
    for (const value of selection[facet]) query.append(facet, value);
  }
  if (selection.nights[0] !== bounds.nights[0] || selection.nights[1] !== bounds.nights[1]) {
    query.set('nights', `${selection.nights[0]}-${selection.nights[1]}`);
  }
  if (selection.price[0] !== bounds.price[0] || selection.price[1] !== bounds.price[1]) {
    query.set('price', `${selection.price[0]}-${selection.price[1]}`);
  }
  const qs = query.toString();
  return qs ? `/packages?${qs}` : '/packages';
}

function countActive(selection: FilterSelection, bounds: FilterBounds): number {
  let n = 0;
  for (const facet of ['destination', 'state', 'theme', 'season', 'month'] as const) {
    n += selection[facet].length;
  }
  if (selection.nights[0] !== bounds.nights[0] || selection.nights[1] !== bounds.nights[1]) n += 1;
  if (selection.price[0] !== bounds.price[0] || selection.price[1] !== bounds.price[1]) n += 1;
  return n;
}

function sameSelection(a: FilterSelection, b: FilterSelection): boolean {
  const sameList = (x: string[], y: string[]) =>
    x.length === y.length && [...x].sort().every((v, i) => v === [...y].sort()[i]);
  return (
    (['destination', 'state', 'theme', 'season', 'month'] as const).every((f) => sameList(a[f], b[f])) &&
    a.nights[0] === b.nights[0] &&
    a.nights[1] === b.nights[1] &&
    a.price[0] === b.price[0] &&
    a.price[1] === b.price[1]
  );
}

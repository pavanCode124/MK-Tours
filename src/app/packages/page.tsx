import type { Metadata } from 'next';
import Link from 'next/link';
import { PackageCard } from '@/components/PackageCard';
import {
  PackageFilters,
  type DestinationGroup,
  type FilterBounds,
  type FilterOption,
  type FilterSelection,
} from '@/components/PackageFilters';
import { PageHero } from '@/components/PageHero';
import { PencilCamera } from '@/components/PencilCamera';
import { PencilBackpack, PencilPines } from '@/components/PencilDoodles';
import {
  BanyanTree,
  FlightPath,
  PineTree,
  SmokeShadow,
  TopoField,
} from '@/components/Decor';
import { Button, Display, Icon } from '@/components/ui';
import {
  allDestinations,
  DEPARTURE_CITIES,
  destinationFor,
  destinationsByState,
  isInternationalState,
  packageDestinations,
  SEASONS,
  seasonsForPackage,
  THEMES,
} from '@/lib/catalog';
import { AGENCY } from '@/lib/content';
import { durationNights, getPackages, startingPrice, whatsappLink, type Package } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Tour Packages',
  description:
    'Every MK Tours fixed-departure group package — pilgrimage circuits, Kashmir, Kerala, Rajasthan and Nepal — with durations, sharing options and prices.',
};

/** A filter value may arrive once, repeated, or comma-joined. */
type Param = string | string[] | undefined;

interface Props {
  searchParams: Promise<{
    state?: Param;
    destination?: Param;
    city?: Param;
    month?: Param;
    duration?: Param;
    season?: Param;
    theme?: Param;
    nights?: Param;
    price?: Param;
  }>;
}

export default async function PackagesPage({ searchParams }: Props) {
  const params = await searchParams;
  const packages = await getPackages();

  const bounds = boundsFor(packages);
  const selected = readSelections(params, bounds);
  const filtered = packages.filter((pkg) => matches(pkg, selected));

  const destinations = allDestinations(packages);
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'm looking for a tour and would like some help choosing.`);

  const activeLabel = describe(selected, destinations);
  const hasFilters = isFiltered(selected, bounds);
  const departureCity = DEPARTURE_CITIES.find((c) => selected.city.includes(c.slug))?.label ?? 'Mumbai';

  // Faceted counts: how many tours an option would leave once added to the rest
  // of the selection. Counting against the other facets only keeps every list
  // self-consistent, so the numbers never contradict the result list.
  const countFor = (facet: Facet, value: string) =>
    packages.filter((pkg) => matches(pkg, selected, facet) && MATCHERS[facet](pkg, value)).length;

  const states = destinationsByState(packages).map((s) => ({
    state: s.state,
    count: countFor('state', s.state),
    items: s.items.map((d) => ({ value: d.slug, label: d.label, count: countFor('destination', d.slug) })),
  }));

  const groups: DestinationGroup[] = [
    { key: 'india', label: 'India', states: states.filter((s) => !isInternationalState(s.state)) },
    { key: 'international', label: 'International', states: states.filter((s) => isInternationalState(s.state)) },
  ].map((g) => ({ ...g, count: new Set(g.states.flatMap((s) => s.items.map((i) => i.value))).size }));

  const themeOptions: FilterOption[] = THEMES.map((t) => ({
    value: t.slug,
    label: t.label,
    count: countFor('theme', t.slug),
  }));

  const seasonOptions: FilterOption[] = SEASONS.map((s) => ({
    value: s.slug,
    label: `${s.label} · ${s.window}`,
    count: countFor('season', s.slug),
  }));

  const monthOptions: FilterOption[] = upcomingMonths().map((m) => ({
    value: m.value,
    label: m.label,
    count: countFor('month', m.value),
  }));

  // The sidebar is a client island, so everything it reads has to be plain data.
  const selection: FilterSelection = {
    destination: selected.destination,
    state: selected.state,
    theme: selected.theme,
    season: selected.season,
    month: selected.month,
    nights: selected.nights,
    price: selected.price,
  };

  return (
    <>
      <PageHero
        image="/images/hero-varanasi.jpg"
        title={activeLabel ?? 'Tour Packages'}
        lede={`${filtered.length} fixed-departure ${filtered.length === 1 ? 'tour' : 'tours'} from ${departureCity}, with the train, stays, meals and sightseeing in one price.`}
        crumbs={[{ label: 'Tour Packages' }]}
      >
      </PageHero>

      <div className="relative overflow-hidden">
        <PencilCamera className="pointer-events-none absolute -left-16 top-56 hidden w-[230px] -rotate-[9deg] opacity-[0.07] xl:block" />
        <PencilBackpack className="pointer-events-none absolute -right-10 top-32 hidden w-[140px] rotate-[7deg] opacity-[0.07] lg:block" />
        <PencilPines className="pointer-events-none absolute -left-12 bottom-24 hidden w-[200px] rotate-[3deg] opacity-[0.06] xl:block" />
        <FlightPath
          variant="arch"
          className="pointer-events-none absolute left-[8%] top-10 hidden h-[150px] w-[80%] text-vermilion-500/18 lg:block"
        />
        <TopoField className="pointer-events-none absolute -right-14 top-[45%] hidden h-[340px] w-[42%] text-azure-700/8 lg:block" />
        <BanyanTree className="pointer-events-none absolute bottom-[12%] -left-14 hidden h-[240px] w-[240px] text-azure-700/8 xl:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-10 md:px-8 lg:px-12 lg:py-14">
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[300px_minmax(0,1fr)]">
            <PackageFilters
              groups={groups}
              themes={themeOptions}
              seasons={seasonOptions}
              months={monthOptions}
              bounds={bounds}
              selected={selection}
              resultCount={filtered.length}
              total={packages.length}
            />

            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-vermilion-700">
                    Fixed departures
                  </div>
                  <h2 className="font-display text-[22px] font-semibold leading-tight text-text">
                    {filtered.length} {filtered.length === 1 ? 'tour' : 'tours'} to choose from
                  </h2>
                </div>
                {hasFilters && (
                  <Link
                    href="/packages"
                    className="rounded-full border border-border-strong px-3.5 py-1.5 text-[11.5px] font-bold text-vermilion-700 transition-colors hover:border-vermilion-500 hover:bg-vermilion-50"
                  >
                    Clear all ×
                  </Link>
                )}
              </div>

              {filtered.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((pkg, i) => (
                    <PackageCard key={pkg.id} pkg={pkg} priority={i < 3} />
                  ))}
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-12 text-center shadow-soft">
                  <SmokeShadow className="pointer-events-none absolute inset-0 h-full w-full text-azure-600/15" />
                  <PineTree className="pointer-events-none absolute -bottom-2 right-10 hidden h-[150px] w-[64px] text-azure-700/12 tree-breathe sm:block" />
                  <div className="relative">
                    <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-vermilion-50 text-vermilion-700 ring-1 ring-vermilion-300/60">
                      <Icon name="compass" className="h-6 w-6" />
                    </span>
                    <Display className="text-[23px]">No tours match these filters yet.</Display>
                    <p className="mx-auto mt-3.5 max-w-md text-[13.5px] leading-[1.75] text-muted">
                      Our catalogue grows every season, and we build itineraries to order. Tell us where you want to go
                      and when, and we will quote it.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                      <Button href="/packages" variant="outline">
                        Clear filters
                      </Button>
                      {wa && (
                        <Button href={wa} external variant="accent">
                          Ask us on WhatsApp
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Departure cities footnote */}
          <div className="card mt-16 overflow-hidden p-7 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <Display className="text-[23px]">Every group tour leaves by train from Mumbai</Display>
                <p className="mt-3 text-[13.5px] leading-[1.75] text-muted">
                  Boarding is available at Pune on the same rake. Private groups can start from any city — ask us and we
                  will price it.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {DEPARTURE_CITIES.map((c) => (
                    <Link
                      key={c.slug}
                      href={hrefToggling(selected, bounds, 'city', c.slug)}
                      aria-pressed={selected.city.includes(c.slug)}
                      className={`shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-all duration-300 ${
                        selected.city.includes(c.slug)
                          ? 'border-azure-900 bg-azure-900 text-on-dark shadow-lift'
                          : 'border-border bg-bg text-text hover:border-vermilion-300 hover:bg-vermilion-50 hover:text-vermilion-700'
                      }`}
                    >
                      {c.label}
                      {selected.city.includes(c.slug) && <span className="text-on-dark/70"> ×</span>}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Faceted filtering                                                          */
/* -------------------------------------------------------------------------- */

const LIST_FACETS = ['destination', 'state', 'duration', 'theme', 'season', 'month', 'city'] as const;
type Facet = (typeof LIST_FACETS)[number];
type Selections = Record<Facet, string[]> & {
  nights: [number, number];
  price: [number, number];
};

/** Does one package satisfy one value of one facet? */
const MATCHERS: Record<Facet, (pkg: Package, value: string) => boolean> = {
  destination: (pkg, value) => packageDestinations(pkg).includes(value.toLowerCase()),
  state: (pkg, value) => packageDestinations(pkg).some((s) => destinationFor(s).state === value),
  duration: (pkg, value) => pkg.days === Number(value),
  season: (pkg, value) => seasonsForPackage(pkg).includes(value),
  // Themes are an editorial grouping, so defer to the catalogue's own list.
  theme: (pkg, value) => (THEMES.find((t) => t.slug === value)?.packages ?? []).includes(pkg.slug ?? ''),
  // "2026-10" — the CRM has no batch dates, so a month matches when one of the
  // package's travel windows covers it. The all-weather window is set aside
  // first: counting it would make every tour match every month.
  month: (pkg, value) => {
    const month = Number(value.split('-')[1]);
    const windows = seasonsForPackage(pkg)
      .filter((slug) => slug !== 'year-round')
      .map((slug) => SEASONS.find((s) => s.slug === slug));
    // A route with no season of its own runs whenever the traveller asks.
    if (windows.length === 0) return true;
    return windows.some((s) => s?.months.includes(month) ?? false);
  },
  // `city` is informational for now: every departure originates in Mumbai.
  city: () => true,
};

function nightsOf(pkg: Package): number {
  return durationNights(pkg);
}

/** The widest range the catalogue covers, which is where both sliders start. */
function boundsFor(packages: Package[]): FilterBounds {
  const nights = packages.map(nightsOf).filter((n) => n > 0);
  const prices = packages.map((p) => startingPrice(p)).filter((n): n is number => n !== null && n > 0);
  const round = (n: number, to: number, dir: 'down' | 'up') =>
    dir === 'down' ? Math.floor(n / to) * to : Math.ceil(n / to) * to;
  return {
    nights: [nights.length ? Math.min(...nights) : 1, nights.length ? Math.max(...nights) : 15],
    price: [
      prices.length ? round(Math.min(...prices), 500, 'down') : 0,
      prices.length ? round(Math.max(...prices), 500, 'up') : 100000,
    ],
  };
}

function readSelections(params: Awaited<Props['searchParams']>, bounds: FilterBounds): Selections {
  const out = {} as Selections;
  for (const facet of LIST_FACETS) {
    out[facet] = toValues((params as Record<string, Param>)[facet]);
  }
  out.nights = toRange(params.nights, bounds.nights);
  out.price = toRange(params.price, bounds.price);
  return out;
}

function toValues(param: Param): string[] {
  const raw = param === undefined ? [] : Array.isArray(param) ? param : [param];
  return [...new Set(raw.flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean))];
}

/** "2-9" into a pair, clamped to the catalogue's own range. */
function toRange(param: Param, fallback: [number, number]): [number, number] {
  const raw = Array.isArray(param) ? param[0] : param;
  const [a, b] = (raw ?? '').split('-').map((v) => Number(v.trim()));
  if (!Number.isFinite(a) || !Number.isFinite(b)) return [...fallback] as [number, number];
  const lo = Math.max(fallback[0], Math.min(a, b));
  const hi = Math.min(fallback[1], Math.max(a, b));
  return lo <= hi ? [lo, hi] : ([...fallback] as [number, number]);
}

/**
 * Values inside one facet widen the search (OR); facets narrow each other
 * (AND). `ignore` drops one facet, which is how a list counts its own options.
 * The two sliders always narrow, since they carry no options of their own.
 */
function matches(pkg: Package, selected: Selections, ignore?: Facet): boolean {
  const nights = nightsOf(pkg);
  if (nights < selected.nights[0] || nights > selected.nights[1]) return false;

  const price = startingPrice(pkg);
  // A tour with no published price is only hidden once the slider has moved.
  if (price !== null && (price < selected.price[0] || price > selected.price[1])) return false;

  return LIST_FACETS.every((facet) => {
    if (facet === ignore) return true;
    const values = selected[facet];
    return values.length === 0 || values.some((value) => MATCHERS[facet](pkg, value));
  });
}

function isFiltered(selected: Selections, bounds: FilterBounds): boolean {
  return (
    LIST_FACETS.some((f) => selected[f].length > 0) ||
    selected.nights[0] !== bounds.nights[0] ||
    selected.nights[1] !== bounds.nights[1] ||
    selected.price[0] !== bounds.price[0] ||
    selected.price[1] !== bounds.price[1]
  );
}

function hrefFor(selected: Selections, bounds: FilterBounds, overrides: Partial<Selections>): string {
  const next = { ...selected, ...overrides };
  const query = new URLSearchParams();
  for (const facet of LIST_FACETS) {
    for (const value of next[facet]) query.append(facet, value);
  }
  if (next.nights[0] !== bounds.nights[0] || next.nights[1] !== bounds.nights[1]) {
    query.set('nights', `${next.nights[0]}-${next.nights[1]}`);
  }
  if (next.price[0] !== bounds.price[0] || next.price[1] !== bounds.price[1]) {
    query.set('price', `${next.price[0]}-${next.price[1]}`);
  }
  const qs = query.toString();
  return qs ? `/packages?${qs}` : '/packages';
}

/** Add the value if it is not selected, drop it if it is. */
function hrefToggling(selected: Selections, bounds: FilterBounds, facet: Facet, value: string): string {
  const current = selected[facet];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  return hrefFor(selected, bounds, { [facet]: next } as Partial<Selections>);
}

/** The next twelve months, as the filter's own "Oct-26" labels. */
function upcomingMonths(): { value: string; label: string }[] {
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const month = d.getMonth() + 1;
    return {
      value: `${d.getFullYear()}-${String(month).padStart(2, '0')}`,
      label: `${names[d.getMonth()]}-${String(d.getFullYear()).slice(2)}`,
    };
  });
}

function describe(selected: Selections, destinations: ReturnType<typeof allDestinations>): string | undefined {
  const active = LIST_FACETS.filter((f) => selected[f].length > 0);
  // Two facets at once have no natural headline; fall back to the page title.
  if (active.length !== 1) return undefined;
  const facet = active[0];
  const values = selected[facet];

  const join = (labels: string[]) =>
    labels.length <= 2 ? labels.join(' & ') : `${labels.slice(0, -1).join(', ')} & ${labels[labels.length - 1]}`;
  const labelled = (lookup: (value: string) => string | undefined) =>
    values.map(lookup).filter((l): l is string => Boolean(l));

  switch (facet) {
    case 'destination': {
      const labels = labelled((v) => destinations.find((d) => d.slug === v)?.label);
      return labels.length ? `Tours to ${join(labels)}` : undefined;
    }
    case 'state':
      return `Tours in ${join(values)}`;
    case 'duration':
      return values.length === 1 ? `${values[0]}-Day Tours` : `${join(values)} Day Tours`;
    case 'season': {
      const labels = labelled((v) => SEASONS.find((s) => s.slug === v)?.label);
      return labels.length ? `${join(labels)} Departures` : undefined;
    }
    case 'theme': {
      const labels = labelled((v) => THEMES.find((t) => t.slug === v)?.label);
      return labels.length ? `${join(labels)} Tours` : undefined;
    }
    case 'city': {
      const labels = labelled((v) => DEPARTURE_CITIES.find((c) => c.slug === v)?.label);
      return labels.length ? `Tours from ${join(labels)}` : undefined;
    }
    default:
      return undefined;
  }
}

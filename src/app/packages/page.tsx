import type { Metadata } from 'next';
import Link from 'next/link';
import { CardRail } from '@/components/CardRail';
import { PACKAGE_ITEM, PackageCard } from '@/components/PackageCard';
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
  durationBuckets,
  packageDestinations,
  SEASONS,
  seasonsForPackage,
  THEMES,
} from '@/lib/catalog';
import { AGENCY } from '@/lib/content';
import { getPackages, whatsappLink, type Package } from '@/lib/mktours';

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
  }>;
}

export default async function PackagesPage({ searchParams }: Props) {
  const params = await searchParams;
  const packages = await getPackages();

  const selected = readSelections(params);
  const filtered = packages.filter((pkg) => matches(pkg, selected));

  const destinations = allDestinations(packages);
  const states = destinationsByState(packages);
  const durations = durationBuckets(packages);
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'm looking for a tour and would like some help choosing.`);

  const activeLabel = describe(selected, destinations);
  const hasFilters = FACETS.some((f) => selected[f].length > 0);
  const departureCity = DEPARTURE_CITIES.find((c) => selected.city.includes(c.slug))?.label ?? 'Mumbai';

  // Faceted counts: how many tours a chip would leave once added to the rest of
  // the selection. Counting against the other facets only keeps every row
  // self-consistent, so the numbers never contradict the result list.
  const countFor = (facet: Facet, value: string) =>
    packages.filter((pkg) => matches(pkg, selected, facet) && MATCHERS[facet](pkg, value)).length;

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
          {/* Filter board — one raised card holding every rail */}
          <div className="card p-6 sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-vermilion-50 text-vermilion-700 ring-1 ring-vermilion-300/50">
                  <Icon name="compass" className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-vermilion-700">Narrow it down</div>
                  <div className="font-display text-[20px] font-semibold leading-tight text-text">
                    Filter the catalogue
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-surface px-3.5 py-1.5 text-[11.5px] font-bold text-muted">
                  {filtered.length} of {packages.length} shown
                </span>
                {hasFilters && (
                  <Link
                    href="/packages"
                    className="rounded-full border border-border-strong px-3.5 py-1.5 text-[11.5px] font-bold text-vermilion-700 transition-colors hover:border-vermilion-500 hover:bg-vermilion-50"
                  >
                    Clear all ×
                  </Link>
                )}
              </div>
            </div>

            <p className="mb-5 text-[12px] leading-relaxed text-muted">
              Pick as many as you like — chips in the same row widen the search, and each row narrows the next. Tap a
              selected chip again to drop it.
            </p>

            <div className="space-y-4">
              <FilterRow label="Destination">
                <Chip
                  href={hrefWithout(selected, 'destination')}
                  active={selected.destination.length === 0}
                  label="All tours"
                  toggle={false}
                />
                {destinations.slice(0, 12).map((d) => (
                  <Chip
                    key={d.slug}
                    href={hrefToggling(selected, 'destination', d.slug)}
                    active={selected.destination.includes(d.slug)}
                    label={d.label}
                    count={countFor('destination', d.slug)}
                  />
                ))}
              </FilterRow>

              <FilterRow label="State">
                {states.map((s) => (
                  <Chip
                    key={s.state}
                    href={hrefToggling(selected, 'state', s.state)}
                    active={selected.state.includes(s.state)}
                    label={s.state}
                    count={countFor('state', s.state)}
                  />
                ))}
              </FilterRow>

              <FilterRow label="Duration">
                {durations.map((d) => (
                  <Chip
                    key={d.days}
                    href={hrefToggling(selected, 'duration', String(d.days))}
                    active={selected.duration.includes(String(d.days))}
                    label={d.label}
                    count={countFor('duration', String(d.days))}
                  />
                ))}
              </FilterRow>

              <FilterRow label="Theme">
                {THEMES.map((t) => (
                  <Chip
                    key={t.slug}
                    href={hrefToggling(selected, 'theme', t.slug)}
                    active={selected.theme.includes(t.slug)}
                    label={t.label}
                    count={countFor('theme', t.slug)}
                  />
                ))}
              </FilterRow>

              <FilterRow label="Season">
                {SEASONS.map((s) => (
                  <Chip
                    key={s.slug}
                    href={hrefToggling(selected, 'season', s.slug)}
                    active={selected.season.includes(s.slug)}
                    label={`${s.label} · ${s.window}`}
                    count={countFor('season', s.slug)}
                  />
                ))}
              </FilterRow>
            </div>
          </div>

          {/* Results */}
          {filtered.length > 0 ? (
            <CardRail className="mt-9" itemClassName={PACKAGE_ITEM} label="Tour packages">
              {filtered.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} priority={i < 3} />
              ))}
            </CardRail>
          ) : (
            <div className="relative mt-9 overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-12 text-center shadow-soft">
              <SmokeShadow className="pointer-events-none absolute inset-0 h-full w-full text-azure-600/15" />
              <PineTree className="pointer-events-none absolute -bottom-2 right-10 hidden h-[150px] w-[64px] text-azure-700/12 tree-breathe sm:block" />
              <div className="relative">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-vermilion-50 text-vermilion-700 ring-1 ring-vermilion-300/60">
                  <Icon name="compass" className="h-6 w-6" />
                </span>
                <Display className="text-[23px]">No tours match these filters yet.</Display>
                <p className="mx-auto mt-3.5 max-w-md text-[13.5px] leading-[1.75] text-muted">
                  Our catalogue grows every season, and we build itineraries to order. Tell us where you want to go and
                  when, and we will quote it.
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
                    <Chip
                      key={c.slug}
                      href={hrefToggling(selected, 'city', c.slug)}
                      active={selected.city.includes(c.slug)}
                      label={c.label}
                    />
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

const FACETS = ['destination', 'state', 'duration', 'theme', 'season', 'month', 'city'] as const;
type Facet = (typeof FACETS)[number];
type Selections = Record<Facet, string[]>;

/** Does one package satisfy one value of one facet? */
const MATCHERS: Record<Facet, (pkg: Package, value: string) => boolean> = {
  destination: (pkg, value) => packageDestinations(pkg).includes(value.toLowerCase()),
  state: (pkg, value) => packageDestinations(pkg).some((s) => destinationFor(s).state === value),
  duration: (pkg, value) => pkg.days === Number(value),
  season: (pkg, value) => seasonsForPackage(pkg).includes(value),
  // Themes are an editorial grouping, so defer to the catalogue's own list.
  theme: (pkg, value) => (THEMES.find((t) => t.slug === value)?.packages ?? []).includes(pkg.slug ?? ''),
  month: (pkg, value) =>
    seasonsForPackage(pkg)
      .map((slug) => SEASONS.find((s) => s.slug === slug))
      .some((s) => s?.months.includes(Number(value)) ?? false),
  // `city` is informational for now: every departure originates in Mumbai.
  city: () => true,
};

function readSelections(params: Awaited<Props['searchParams']>): Selections {
  const out = {} as Selections;
  for (const facet of FACETS) {
    out[facet] = toValues((params as Record<string, Param>)[facet]);
  }
  return out;
}

function toValues(param: Param): string[] {
  const raw = param === undefined ? [] : Array.isArray(param) ? param : [param];
  return [...new Set(raw.flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean))];
}

/**
 * Values inside one facet widen the search (OR); facets narrow each other
 * (AND). `ignore` drops one facet, which is how a row counts its own chips.
 */
function matches(pkg: Package, selected: Selections, ignore?: Facet): boolean {
  return FACETS.every((facet) => {
    if (facet === ignore) return true;
    const values = selected[facet];
    return values.length === 0 || values.some((value) => MATCHERS[facet](pkg, value));
  });
}

function hrefFor(selected: Selections, overrides: Partial<Selections>): string {
  const next = { ...selected, ...overrides };
  const query = new URLSearchParams();
  for (const facet of FACETS) {
    for (const value of next[facet]) query.append(facet, value);
  }
  const qs = query.toString();
  return qs ? `/packages?${qs}` : '/packages';
}

/** Add the value if it is not selected, drop it if it is. */
function hrefToggling(selected: Selections, facet: Facet, value: string): string {
  const current = selected[facet];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  return hrefFor(selected, { [facet]: next });
}

/** Clear a whole facet, leaving the rest of the selection in place. */
function hrefWithout(selected: Selections, facet: Facet): string {
  return hrefFor(selected, { [facet]: [] });
}

function describe(selected: Selections, destinations: ReturnType<typeof allDestinations>): string | undefined {
  const active = FACETS.filter((f) => selected[f].length > 0);
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

/* -------------------------------------------------------------------------- */

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start">
      <span className="w-24 shrink-0 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">{label}</span>
      <div className="rail -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">{children}</div>
    </div>
  );
}

function Chip({
  href,
  active,
  label,
  count,
  toggle = true,
}: {
  href: string;
  active: boolean;
  label: string;
  count?: number;
  /** False for a chip that resets a row rather than toggling one value. */
  toggle?: boolean;
}) {
  const base = 'shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-all duration-300';

  // A chip that would empty the results stays in place but goes quiet, so the
  // rows never reshuffle under the cursor.
  if (count === 0 && !active) {
    return (
      <span aria-disabled="true" className={`${base} cursor-not-allowed border-border bg-bg text-subtle opacity-50`}>
        {label}
        <span className="text-subtle"> (0)</span>
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-pressed={active}
      className={`${base} ${
        active
          ? 'border-azure-900 bg-azure-900 text-on-dark shadow-lift'
          : 'border-border bg-bg text-text hover:border-vermilion-300 hover:bg-vermilion-50 hover:text-vermilion-700 hover:shadow-soft'
      }`}
    >
      {label}
      {typeof count === 'number' && (
        <span className={active ? 'text-on-dark/60' : 'text-subtle'}> ({count})</span>
      )}
      {active && toggle && <span className="text-on-dark/70"> ×</span>}
    </Link>
  );
}

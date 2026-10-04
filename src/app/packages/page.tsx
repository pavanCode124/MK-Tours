import type { Metadata } from 'next';
import Link from 'next/link';
import { PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { PencilCamera } from '@/components/PencilCamera';
import {
  BanyanTree,
  FlightPath,
  FlightTag,
  PineTree,
  SmokeShadow,
  TopoField,
} from '@/components/Decor';
import { Button, Display, Eyebrow, Icon } from '@/components/ui';
import {
  allDestinations,
  DEPARTURE_CITIES,
  destinationFor,
  destinationsByState,
  durationBuckets,
  packageDestinations,
  packagesForSeason,
  SEASONS,
  seasonsForPackage,
  THEMES,
  themesWithCounts,
} from '@/lib/catalog';
import { AGENCY } from '@/lib/content';
import { getPackages, whatsappLink, type Package } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Tour Packages',
  description:
    'Every MK Tours fixed-departure group package — pilgrimage circuits, Kashmir, Kerala, Rajasthan and Nepal — with durations, sharing options and prices.',
};

interface Props {
  searchParams: Promise<{
    state?: string;
    destination?: string;
    city?: string;
    month?: string;
    duration?: string;
    season?: string;
    theme?: string;
  }>;
}

export default async function PackagesPage({ searchParams }: Props) {
  const params = await searchParams;
  const packages = await getPackages();

  const filtered = applyFilters(packages, params);
  const destinations = allDestinations(packages);
  const states = destinationsByState(packages);
  const durations = durationBuckets(packages);
  const themes = themesWithCounts(packages);
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'm looking for a tour and would like some help choosing.`);

  const activeLabel = describe(params, destinations);
  const hasFilters = Object.values(params).some(Boolean);

  return (
    <>
      <PageHero
        image="/images/hero-varanasi.jpg"
        eyebrow="Packages"
        title={activeLabel ?? 'Tour Packages'}
        lede={`${filtered.length} fixed-departure ${filtered.length === 1 ? 'tour' : 'tours'} from Mumbai, with the train, stays, meals and sightseeing in one price.`}
        crumbs={[{ label: 'Tour Packages' }]}
      >
        <FlightTag from="Mumbai" to="Pick a route" note={`${packages.length} departures`} />
      </PageHero>

      <div className="relative overflow-hidden">
        <PencilCamera className="pointer-events-none absolute -left-16 top-56 hidden w-[230px] -rotate-[9deg] opacity-[0.07] xl:block" />
        <FlightPath
          variant="arch"
          className="pointer-events-none absolute left-[8%] top-10 hidden h-[150px] w-[80%] text-meadow-500/18 lg:block"
        />
        <TopoField className="pointer-events-none absolute -right-14 top-[45%] hidden h-[340px] w-[42%] text-sherwood-700/8 lg:block" />
        <BanyanTree className="pointer-events-none absolute bottom-[12%] -left-14 hidden h-[240px] w-[240px] text-sherwood-700/8 xl:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          {/* Filter board — one raised card holding every rail */}
          <div className="card p-6 sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-meadow-50 text-meadow-700 ring-1 ring-meadow-300/50">
                  <Icon name="compass" className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-meadow-700">Narrow it down</div>
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
                    className="rounded-full border border-border-strong px-3.5 py-1.5 text-[11.5px] font-bold text-meadow-700 transition-colors hover:border-meadow-500 hover:bg-meadow-50"
                  >
                    Clear all ×
                  </Link>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <FilterRow label="Destination">
                <Chip href="/packages" active={!hasFilters} label="All tours" />
                {destinations.slice(0, 12).map((d) => (
                  <Chip
                    key={d.slug}
                    href={`/packages?destination=${encodeURIComponent(d.slug)}`}
                    active={params.destination === d.slug}
                    label={d.label}
                    count={d.count}
                  />
                ))}
              </FilterRow>

              <FilterRow label="State">
                {states.map((s) => (
                  <Chip
                    key={s.state}
                    href={`/packages?state=${encodeURIComponent(s.state)}`}
                    active={params.state === s.state}
                    label={s.state}
                  />
                ))}
              </FilterRow>

              <FilterRow label="Duration">
                {durations.map((d) => (
                  <Chip
                    key={d.days}
                    href={`/packages?duration=${d.days}`}
                    active={params.duration === String(d.days)}
                    label={d.label}
                    count={d.count}
                  />
                ))}
              </FilterRow>

              <FilterRow label="Theme">
                {themes.map((t) => (
                  <Chip
                    key={t.slug}
                    href={`/packages?theme=${t.slug}`}
                    active={params.theme === t.slug}
                    label={t.label}
                    count={t.count}
                  />
                ))}
              </FilterRow>

              <FilterRow label="Season">
                {SEASONS.map((s) => (
                  <Chip
                    key={s.slug}
                    href={`/packages?season=${s.slug}`}
                    active={params.season === s.slug}
                    label={`${s.label} · ${s.window}`}
                    count={packagesForSeason(packages, s.slug).length}
                  />
                ))}
              </FilterRow>
            </div>
          </div>

          {/* Results */}
          {filtered.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((pkg, i) => (
                <PackageCard key={pkg.id} pkg={pkg} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="relative mt-12 overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-16 text-center shadow-soft">
              <SmokeShadow className="pointer-events-none absolute inset-0 h-full w-full text-sherwood-600/15" />
              <PineTree className="pointer-events-none absolute -bottom-2 right-10 hidden h-[150px] w-[64px] text-sherwood-700/12 tree-breathe sm:block" />
              <div className="relative">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-meadow-50 text-meadow-700 ring-1 ring-meadow-300/60">
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
                    <Button href={wa} external variant="meadow">
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
                <Eyebrow className="mb-4">Departing from</Eyebrow>
                <Display className="text-[23px]">Every group tour leaves by train from Mumbai</Display>
                <p className="mt-3 text-[13.5px] leading-[1.75] text-muted">
                  Boarding is available at Pune on the same rake. Private groups can start from any city — ask us and we
                  will price it.
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {DEPARTURE_CITIES.map((c) => (
                    <Chip
                      key={c.slug}
                      href={`/packages?city=${c.slug}`}
                      active={params.city === c.slug}
                      label={c.label}
                    />
                  ))}
                </div>
              </div>
              <FlightTag from="Mumbai CSMT" to="Pune" note="Same rake" className="shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function applyFilters(packages: Package[], params: Awaited<Props['searchParams']>): Package[] {
  const { state, destination, duration, season, theme, month } = params;
  return packages.filter((pkg) => {
    const slugs = packageDestinations(pkg);

    if (destination && !slugs.includes(destination.toLowerCase())) return false;
    if (state && !slugs.some((s) => destinationFor(s).state === state)) return false;
    if (duration && pkg.days !== Number(duration)) return false;
    if (season && !seasonsForPackage(pkg).includes(season)) return false;

    if (theme) {
      // Themes are an editorial grouping, so defer to the catalogue's own list.
      const themed = THEMES.find((t) => t.slug === theme);
      if (!themed || !themed.packages.includes(pkg.slug ?? '')) return false;
    }

    if (month) {
      const m = Number(month);
      const windows = seasonsForPackage(pkg)
        .map((slug) => SEASONS.find((s) => s.slug === slug))
        .filter(Boolean);
      if (!windows.some((s) => s!.months.includes(m))) return false;
    }

    // `city` is informational for now: every departure originates in Mumbai.
    return true;
  });
}

function describe(
  params: Awaited<Props['searchParams']>,
  destinations: ReturnType<typeof allDestinations>,
): string | undefined {
  if (params.destination) {
    const d = destinations.find((x) => x.slug === params.destination);
    return d ? `Tours to ${d.label}` : undefined;
  }
  if (params.state) return `Tours in ${params.state}`;
  if (params.duration) return `${params.duration}-Day Tours`;
  if (params.season) {
    const s = SEASONS.find((x) => x.slug === params.season);
    return s ? `${s.label} Departures` : undefined;
  }
  if (params.theme) {
    const t = THEMES.find((x) => x.slug === params.theme);
    return t ? `${t.label} Tours` : undefined;
  }
  if (params.city) {
    const c = DEPARTURE_CITIES.find((x) => x.slug === params.city);
    return c ? `Tours from ${c.label}` : undefined;
  }
  return undefined;
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start">
      <span className="w-24 shrink-0 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">{label}</span>
      <div className="rail -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">{children}</div>
    </div>
  );
}

function Chip({ href, active, label, count }: { href: string; active: boolean; label: string; count?: number }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full border px-3.5 py-2 text-[12px] font-semibold transition-all duration-300 ${
        active
          ? 'border-sherwood-900 bg-sherwood-900 text-on-dark shadow-lift'
          : 'border-border bg-bg text-text hover:-translate-y-0.5 hover:border-meadow-300 hover:bg-meadow-50 hover:text-meadow-700 hover:shadow-soft'
      }`}
    >
      {label}
      {typeof count === 'number' && (
        <span className={active ? 'text-on-dark/60' : 'text-subtle'}> ({count})</span>
      )}
    </Link>
  );
}

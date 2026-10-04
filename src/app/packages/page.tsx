import type { Metadata } from 'next';
import Link from 'next/link';
import { PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { Button } from '@/components/ui';
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
      />

      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        {/* Filter rails */}
        <div className="space-y-5">
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

        {hasFilters && (
          <div className="mt-6">
            <Link
              href="/packages"
              className="text-[12.5px] font-medium text-meadow-700 underline-offset-4 hover:underline"
            >
              Clear all filters
            </Link>
          </div>
        )}

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="mt-14 rounded-2xl border border-border bg-surface px-6 py-14 text-center">
            <p className="font-display text-[22px] text-text">No tours match these filters yet.</p>
            <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-muted">
              Our catalogue grows every season, and we build itineraries to order. Tell us where you want to go and when,
              and we will quote it.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button href="/packages" variant="outline">
                Clear filters
              </Button>
              {wa && (
                <Button href={wa} external variant="solid">
                  Ask us on WhatsApp
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Departure cities footnote */}
        <div className="mt-14 rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-[20px] font-normal text-text">Departing from</h2>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
            Every fixed departure leaves by train from Mumbai, with boarding available at Pune on the same rake. Private
            groups can start from any city — ask us and we will price it.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {DEPARTURE_CITIES.map((c) => (
              <Chip key={c.slug} href={`/packages?city=${c.slug}`} active={params.city === c.slug} label={c.label} />
            ))}
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
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
      <span className="w-24 shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">{label}</span>
      <div className="rail -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">{children}</div>
    </div>
  );
}

function Chip({ href, active, label, count }: { href: string; active: boolean; label: string; count?: number }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-xl border px-3.5 py-2 text-[12px] font-medium transition-colors duration-200 ${
        active
          ? 'border-sherwood-800 bg-sherwood-800 text-on-dark'
          : 'border-border-strong bg-raised text-text hover:border-sherwood-800 hover:text-sherwood-800'
      }`}
    >
      {label}
      {typeof count === 'number' && <span className={active ? 'text-on-dark/60' : 'text-subtle'}> ({count})</span>}
    </Link>
  );
}

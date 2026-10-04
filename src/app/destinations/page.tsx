import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { DestinationCard } from '@/components/sections';
import { Display } from '@/components/ui';
import { allDestinations, destinationsByRegion, destinationsByState } from '@/lib/catalog';
import { getPackages } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Destinations',
  description:
    'Every place MK Tours travels to across India and Nepal — from the Kashmir valleys and the Ganga temple towns to the Kerala backwaters and the Thar desert.',
};

interface Props {
  searchParams: Promise<{ region?: string; state?: string }>;
}

export default async function DestinationsPage({ searchParams }: Props) {
  const { region, state } = await searchParams;
  const packages = await getPackages();

  const all = allDestinations(packages);
  const byRegion = destinationsByRegion(packages);
  const byState = destinationsByState(packages);

  const filtered = all.filter((d) => {
    if (region && d.region !== region) return false;
    if (state && d.state !== state) return false;
    return true;
  });

  const title = state ? `Destinations in ${state}` : region ? `${region} Destinations` : 'Destinations';

  return (
    <>
      <PageHero
        image="/images/dest-srinagar.jpg"
        eyebrow="Explore"
        title={title}
        lede={`${filtered.length} places across ${new Set(filtered.map((d) => d.state)).size} states and countries, every one of them on a fixed departure out of Mumbai.`}
        crumbs={[{ label: 'Destinations' }]}
      />

      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        {/* Region / state filters */}
        <div className="space-y-4">
          <Row label="Region">
            <Chip href="/destinations" active={!region && !state} label="All" />
            {byRegion.map((r) => (
              <Chip
                key={r.region}
                href={`/destinations?region=${encodeURIComponent(r.region)}`}
                active={region === r.region}
                label={r.region}
                count={r.items.length}
              />
            ))}
          </Row>
          <Row label="State">
            {byState.map((s) => (
              <Chip
                key={s.state}
                href={`/destinations?state=${encodeURIComponent(s.state)}`}
                active={state === s.state}
                label={s.state}
                count={s.items.length}
              />
            ))}
          </Row>
        </div>

        {/* Grouped grid */}
        {region || state ? (
          <div className="mt-11 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {filtered.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        ) : (
          <div className="mt-11 space-y-14">
            {byRegion.map((r) => (
              <section key={r.region}>
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-meadow-700">
                      {r.items.length} {r.items.length === 1 ? 'place' : 'places'}
                    </span>
                    <Display className="mt-1 text-[26px] sm:text-[30px]">{r.region}</Display>
                  </div>
                  <Link
                    href={`/destinations?region=${encodeURIComponent(r.region)}`}
                    className="shrink-0 text-[13px] font-medium text-meadow-700 underline-offset-4 hover:underline"
                  >
                    View {r.region} →
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                  {r.items.map((d) => (
                    <DestinationCard key={d.slug} destination={d} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="mt-14 text-center text-[14px] text-muted">
            Nothing here yet.{' '}
            <Link href="/destinations" className="font-medium text-meadow-700 underline-offset-4 hover:underline">
              See every destination
            </Link>
            .
          </p>
        )}
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
      <span className="w-20 shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">{label}</span>
      <div className="rail -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">{children}</div>
    </div>
  );
}

function Chip({ href, active, label, count }: { href: string; active: boolean; label: string; count?: number }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-sm border px-3.5 py-2 text-[12px] font-medium transition-colors duration-200 ${
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

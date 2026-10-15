import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { PencilPalm } from '@/components/PencilPalm';
import { PencilBalloon, PencilPines } from '@/components/PencilDoodles';
import { BanyanTree, CompassRose, FlightPath, PineTree, TopoField } from '@/components/Decor';
import { RailSection } from '@/components/RailSection';
import { DestinationCard, DestinationRail, DESTINATION_ITEM } from '@/components/sections';
import { Display, Icon } from '@/components/ui';
import { allDestinations, destinationsByRegion, destinationsByState, REGION_BANNERS } from '@/lib/catalog';
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
        title={title}
        lede={`${filtered.length} places across ${new Set(filtered.map((d) => d.state)).size} states and countries, every one of them on a fixed departure out of Mumbai.`}
        crumbs={[{ label: 'Destinations' }]}
      />

      <div className="relative overflow-x-clip">
        <PencilPalm className="pointer-events-none absolute -right-12 top-28 hidden w-[170px] rotate-[8deg] opacity-[0.07] xl:block" />
        <PencilBalloon className="pointer-events-none absolute -left-10 top-40 hidden w-[150px] -rotate-[5deg] opacity-[0.07] lg:block" />
        <PencilPines className="pointer-events-none absolute -right-8 bottom-16 hidden w-[200px] rotate-[3deg] opacity-[0.06] xl:block" />
        <CompassRose className="pointer-events-none absolute -left-20 top-[22%] hidden h-[250px] w-[250px] text-azure-700/8 xl:block" />
        <FlightPath
          variant="rise"
          className="pointer-events-none absolute left-[5%] top-8 hidden h-[150px] w-[80%] text-vermilion-500/18 lg:block"
        />
        <TopoField className="pointer-events-none absolute -right-10 bottom-[18%] hidden h-[320px] w-[40%] text-azure-700/8 lg:block" />
        <BanyanTree className="pointer-events-none absolute -bottom-10 left-[2%] hidden h-[230px] w-[230px] text-azure-700/8 lg:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-10 md:px-8 lg:px-12 lg:py-14">
          {/* Region / state filters on one raised card */}
          <div className="card p-6 sm:p-7">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-vermilion-50 text-vermilion-700 ring-1 ring-vermilion-300/50">
                  <Icon name="pin" className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-vermilion-700">Browse</div>
                  <div className="font-display text-[20px] font-semibold leading-tight text-text">
                    By region &amp; state
                  </div>
                </div>
              </div>
              <span className="rounded-full bg-surface px-3.5 py-1.5 text-[11.5px] font-bold text-muted">
                {filtered.length} {filtered.length === 1 ? 'place' : 'places'}
              </span>
            </div>
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
          </div>

          {/* Every collection runs as a rail under its own photographic banner,
              so the page reads as a set of places rather than one long grid. */}
          {region || state ? (
            <div className="mt-9">
              <DestinationRail destinations={filtered} label={title} />
            </div>
          ) : null}
        </div>

        {!region && !state && (
          <div className="-mt-4">
            {byRegion.map((r) => (
              <RailSection
                key={r.region}
                image={REGION_BANNERS[r.region].image}
                title={r.region}
                subtitle={REGION_BANNERS[r.region].tagline}
                cta={{ href: `/destinations?region=${encodeURIComponent(r.region)}`, label: 'Explore' }}
                itemClassName={DESTINATION_ITEM}
                label={`${r.region} destinations`}
              >
                {r.items.map((d) => (
                  <DestinationCard key={d.slug} destination={d} />
                ))}
              </RailSection>
            ))}
          </div>
        )}

        <div className="relative mx-auto max-w-[1320px] px-5 pb-14 md:px-8 lg:px-12 lg:pb-20">
          {filtered.length === 0 && (
            <div className="relative mt-9 overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-14 text-center shadow-soft">
              <PineTree className="pointer-events-none absolute -bottom-2 right-10 hidden h-[140px] w-[60px] text-azure-700/12 tree-breathe sm:block" />
              <p className="relative text-[14px] text-muted">
                Nothing here yet.{' '}
                <Link href="/destinations" className="font-bold text-vermilion-700 underline-offset-4 hover:underline">
                  See every destination →
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start">
      <span className="w-20 shrink-0 pt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">{label}</span>
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
          ? 'border-azure-900 bg-azure-900 text-on-dark shadow-lift'
          : 'border-border bg-bg text-text hover:border-vermilion-300 hover:bg-vermilion-50 hover:text-vermilion-700 hover:shadow-soft'
      }`}
    >
      {label}
      {typeof count === 'number' && (
        <span className={active ? 'text-on-dark/60' : 'text-subtle'}> ({count})</span>
      )}
    </Link>
  );
}

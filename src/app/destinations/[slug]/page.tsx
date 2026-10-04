import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { DestinationCard } from '@/components/sections';
import { Button, Display, Eyebrow, Icon } from '@/components/ui';
import { BanyanTree, FlightTag, PineTree, SmokeShadow, TopoField } from '@/components/Decor';
import {
  allDestinations,
  DESTINATIONS,
  destinationFor,
  packagesForDestination,
  packagesForState,
} from '@/lib/catalog';
import { AGENCY } from '@/lib/content';
import { getPackages, whatsappLink } from '@/lib/mktours';

export const dynamicParams = true;

export function generateStaticParams() {
  return Object.keys(DESTINATIONS).map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!DESTINATIONS[slug]) return { title: 'Destination not found' };
  const d = destinationFor(slug);
  return {
    title: `${d.label} Tours`,
    description: d.blurb ?? `Group and private tours to ${d.label}, ${d.state}, with MK Tours.`,
  };
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  if (!DESTINATIONS[slug]) notFound();

  const packages = await getPackages();
  const destination = destinationFor(slug, packagesForDestination(packages, slug).length);
  const tours = packagesForDestination(packages, slug);
  const sameState = allDestinations(packages).filter((d) => d.state === destination.state && d.slug !== slug);
  const stateTours = packagesForState(packages, destination.state).filter((p) => !tours.some((t) => t.id === p.id));
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip to ${destination.label}.`);

  return (
    <>
      <PageHero
        image={destination.image}
        eyebrow={destination.state}
        title={`${destination.label} Tours`}
        lede={destination.blurb}
        crumbs={[
          { href: '/destinations', label: 'Destinations' },
          { href: `/destinations?state=${encodeURIComponent(destination.state)}`, label: destination.state },
          { label: destination.label },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="#tours" variant="meadow" arrow={false}>
            {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'} Available
          </Button>
          {wa && (
            <Button href={wa} external variant="onDark">
              Customize a {destination.label} trip
            </Button>
          )}
          <FlightTag from="Mumbai" to={destination.label} note={destination.region} className="hidden sm:inline-flex" />
        </div>
      </PageHero>

      <div className="relative overflow-hidden">
        <TopoField className="pointer-events-none absolute -right-12 top-[14%] hidden h-[320px] w-[38%] text-sherwood-700/8 lg:block" />
        <BanyanTree className="pointer-events-none absolute -left-14 bottom-[20%] hidden h-[240px] w-[240px] text-sherwood-700/8 xl:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          <section id="tours" className="scroll-mt-28">
            <Eyebrow className="mb-4">Departures</Eyebrow>
            <Display className="display-caps text-[28px] sm:text-[34px]">
              Tours that visit <span className="flourish">{destination.label}</span>
            </Display>
            {tours.length > 0 ? (
              <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((p, i) => (
                  <PackageCard key={p.id} pkg={p} priority={i < 3} />
                ))}
              </div>
            ) : (
              <div className="relative mt-9 overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-14 text-center shadow-soft">
                <SmokeShadow className="pointer-events-none absolute inset-0 h-full w-full text-sherwood-600/12" />
                <PineTree className="pointer-events-none absolute -bottom-2 right-10 hidden h-[140px] w-[60px] text-sherwood-700/12 tree-breathe sm:block" />
                <div className="relative">
                  <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-meadow-50 text-meadow-700 ring-1 ring-meadow-300/60">
                    <Icon name="compass" className="h-6 w-6" />
                  </span>
                  <p className="text-[14.5px] leading-[1.75] text-muted">
                    No fixed departure covers {destination.label} right now — but we build private itineraries to order.
                  </p>
                  {wa && (
                    <Button href={wa} external variant="meadow" className="mt-7">
                      Ask about {destination.label}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </section>

          {stateTours.length > 0 && (
            <section className="mt-20">
              <Eyebrow className="mb-4">Nearby departures</Eyebrow>
              <Display className="display-caps text-[27px] sm:text-[33px]">
                More tours in {destination.state}
              </Display>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {stateTours.slice(0, 3).map((p) => (
                  <PackageCard key={p.id} pkg={p} />
                ))}
              </div>
            </section>
          )}

          {sameState.length > 0 && (
            <section className="mt-20">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Eyebrow className="mb-4">On the map</Eyebrow>
                  <Display className="display-caps text-[27px] sm:text-[33px]">Nearby in {destination.state}</Display>
                </div>
                <Link
                  href={`/destinations?state=${encodeURIComponent(destination.state)}`}
                  className="group/l inline-flex shrink-0 items-center gap-2 rounded-full border border-border-strong bg-raised px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.12em] text-text shadow-soft transition-all hover:-translate-y-0.5 hover:border-sherwood-700 hover:bg-sherwood-800 hover:text-on-dark"
                >
                  All of {destination.state}
                  <span className="transition-transform group-hover/l:translate-x-1">→</span>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {sameState.slice(0, 5).map((d) => (
                  <DestinationCard key={d.slug} destination={d} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CardRail } from '@/components/CardRail';
import { PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { DestinationRail } from '@/components/sections';
import { Button, Display, Icon } from '@/components/ui';
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
        title={`${destination.label} Tours`}
        lede={destination.blurb}
        crumbs={[
          { href: '/destinations', label: 'Destinations' },
          { href: `/destinations?state=${encodeURIComponent(destination.state)}`, label: destination.state },
          { label: destination.label },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="#tours" variant="accent" arrow={false}>
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
        <TopoField className="pointer-events-none absolute -right-12 top-[14%] hidden h-[320px] w-[38%] text-azure-700/8 lg:block" />
        <BanyanTree className="pointer-events-none absolute -left-14 bottom-[20%] hidden h-[240px] w-[240px] text-azure-700/8 xl:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-10 md:px-8 lg:px-12 lg:py-14">
          <section id="tours" className="scroll-mt-28">
            <Display className="display-caps text-[28px] sm:text-[34px]">
              Tours that visit <span className="flourish">{destination.label}</span>
            </Display>
            {tours.length > 0 ? (
              <CardRail className="mt-9" label="Tours that visit this destination">
                {tours.map((p, i) => (
                  <PackageCard key={p.id} pkg={p} priority={i < 3} />
                ))}
              </CardRail>
            ) : (
              <div className="relative mt-9 overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-14 text-center shadow-soft">
                <SmokeShadow className="pointer-events-none absolute inset-0 h-full w-full text-azure-600/12" />
                <PineTree className="pointer-events-none absolute -bottom-2 right-10 hidden h-[140px] w-[60px] text-azure-700/12 tree-breathe sm:block" />
                <div className="relative">
                  <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-vermilion-50 text-vermilion-700 ring-1 ring-vermilion-300/60">
                    <Icon name="compass" className="h-6 w-6" />
                  </span>
                  <p className="text-[14.5px] leading-[1.75] text-muted">
                    No fixed departure covers {destination.label} right now — but we build private itineraries to order.
                  </p>
                  {wa && (
                    <Button href={wa} external variant="accent" className="mt-7">
                      Ask about {destination.label}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </section>

          {stateTours.length > 0 && (
            <section className="mt-20">
              <Display className="display-caps text-[27px] sm:text-[33px]">
                More tours in {destination.state}
              </Display>
              <CardRail className="mt-8" label="Nearby departures">
                {stateTours.slice(0, 6).map((p) => (
                  <PackageCard key={p.id} pkg={p} />
                ))}
              </CardRail>
            </section>
          )}

          {sameState.length > 0 && (
            <section className="mt-20">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Display className="display-caps text-[27px] sm:text-[33px]">Nearby in {destination.state}</Display>
                </div>
                <Link
                  href={`/destinations?state=${encodeURIComponent(destination.state)}`}
                  className="group/l inline-flex shrink-0 items-center gap-2 rounded-full border border-border-strong bg-raised px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.12em] text-text shadow-soft transition-all hover:border-azure-700 hover:bg-azure-800 hover:text-on-dark"
                >
                  All of {destination.state}
                  <span className="">→</span>
                </Link>
              </div>
              <DestinationRail
                destinations={sameState}
                label={`Nearby in ${destination.state}`}
              />
            </section>
          )}
        </div>
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { DestinationCard } from '@/components/sections';
import { Button, Display } from '@/components/ui';
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
  const stateTours = packagesForState(packages, destination.state).filter(
    (p) => !tours.some((t) => t.id === p.id),
  );
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
        <div className="flex flex-wrap gap-3">
          <Button href="#tours" variant="meadow">
            {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'} Available
          </Button>
          {wa && (
            <Button href={wa} external variant="onDark">
              Customize a {destination.label} trip
            </Button>
          )}
        </div>
      </PageHero>

      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        <section id="tours" className="scroll-mt-28">
          <Display className="text-[28px] sm:text-[32px]">Tours that visit {destination.label}</Display>
          {tours.length > 0 ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((p, i) => (
                <PackageCard key={p.id} pkg={p} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="mt-8 border border-border bg-surface px-6 py-12 text-center">
              <p className="text-[14px] text-muted">
                No fixed departure covers {destination.label} right now — but we build private itineraries to order.
              </p>
              {wa && (
                <Button href={wa} external variant="solid" className="mt-6">
                  Ask about {destination.label}
                </Button>
              )}
            </div>
          )}
        </section>

        {stateTours.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <Display className="text-[26px]">More tours in {destination.state}</Display>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {stateTours.slice(0, 3).map((p) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </section>
        )}

        {sameState.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <Display className="text-[26px]">Nearby in {destination.state}</Display>
              <Link
                href={`/destinations?state=${encodeURIComponent(destination.state)}`}
                className="shrink-0 text-[13px] font-medium text-meadow-700 underline-offset-4 hover:underline"
              >
                All of {destination.state} →
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
    </>
  );
}

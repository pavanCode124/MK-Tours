import Link from 'next/link';
import { PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { DestinationCard } from '@/components/sections';
import { Button, Display } from '@/components/ui';
import type { Destination } from '@/lib/catalog';
import { AGENCY } from '@/lib/content';
import { whatsappLink, type Package } from '@/lib/mktours';

/**
 * Shared layout for the nav's collection pages — Weekend Getaways, South India
 * and North India all show the same thing: a banner, a tour grid, the places
 * they cover, and a fallback when the catalogue has nothing yet.
 */
export function CollectionPage({
  image,
  eyebrow,
  title,
  lede,
  crumbLabel,
  tours,
  destinations,
  emptyTitle,
  emptyBody,
  notes,
}: {
  image: string;
  eyebrow: string;
  title: string;
  lede: string;
  crumbLabel: string;
  tours: Package[];
  destinations: Destination[];
  emptyTitle: string;
  emptyBody: string;
  notes?: { title: string; body: string }[];
}) {
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'm interested in your ${title.toLowerCase()}.`);

  return (
    <>
      <PageHero image={image} eyebrow={eyebrow} title={title} lede={lede} crumbs={[{ label: crumbLabel }]}>
        <div className="flex flex-wrap gap-3">
          <Button href="#tours" variant="meadow">
            {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'}
          </Button>
          {wa && (
            <Button href={wa} external variant="onDark">
              Customize your trip
            </Button>
          )}
        </div>
      </PageHero>

      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        <section id="tours" className="scroll-mt-28">
          {tours.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((p, i) => (
                <PackageCard key={p.id} pkg={p} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-border bg-surface px-6 py-14 text-center">
              <Display className="text-[24px]">{emptyTitle}</Display>
              <p className="mx-auto mt-3 max-w-lg text-[13.5px] leading-relaxed text-muted">{emptyBody}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button href="/packages" variant="outline">
                  Browse all packages
                </Button>
                {wa && (
                  <Button href={wa} external variant="solid">
                    Ask us on WhatsApp
                  </Button>
                )}
              </div>
            </div>
          )}
        </section>

        {destinations.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <div className="mb-6 flex items-end justify-between gap-4">
              <Display className="text-[26px]">Places on these routes</Display>
              <Link
                href="/destinations"
                className="shrink-0 text-[13px] font-medium text-meadow-700 underline-offset-4 hover:underline"
              >
                All destinations →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {destinations.slice(0, 10).map((d) => (
                <DestinationCard key={d.slug} destination={d} />
              ))}
            </div>
          </section>
        )}

        {notes && notes.length > 0 && (
          <section className="mt-16 grid gap-6 border-t border-border pt-12 md:grid-cols-3">
            {notes.map((n) => (
              <div key={n.title} className="rounded-md border border-border bg-raised p-6">
                <h3 className="font-display text-[19px] font-medium leading-snug text-text">{n.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{n.body}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </>
  );
}

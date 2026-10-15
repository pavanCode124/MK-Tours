import Link from 'next/link';
import { CardRail } from '@/components/CardRail';
import { PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { RailSection } from '@/components/RailSection';
import { DestinationCard, DESTINATION_ITEM } from '@/components/sections';
import { Button, Display, Icon } from '@/components/ui';
import { BanyanTree, FlightPath, PineTree, SmokeShadow, TopoField } from '@/components/Decor';
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
      <PageHero image={image} title={title} lede={lede} crumbs={[{ label: crumbLabel }]}>
        <div className="flex flex-wrap gap-3">
          <Button href="#tours" variant="accent" arrow={false}>
            {tours.length} {tours.length === 1 ? 'Tour' : 'Tours'}
          </Button>
          {wa && (
            <Button href={wa} external variant="onDark">
              Customize your trip
            </Button>
          )}
        </div>
      </PageHero>

      <div className="relative overflow-x-clip">
        <FlightPath
          variant="rise"
          className="pointer-events-none absolute -left-10 top-10 hidden h-[160px] w-[70%] text-vermilion-500/20 xl:block"
        />
        <TopoField className="pointer-events-none absolute right-0 top-[30%] hidden h-[320px] w-[40%] text-azure-700/8 lg:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-10 md:px-8 lg:px-12 lg:py-14">
          <section id="tours" className="scroll-mt-28">
            {tours.length > 0 ? (
              <>
                <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
                  <div>
                    <Display className="display-caps text-[27px] sm:text-[33px]">
                      {tours.length} {tours.length === 1 ? 'tour' : 'tours'} on this collection
                    </Display>
                  </div>
                  <Link
                    href="/packages"
                    className="group/l inline-flex items-center gap-2 rounded-full border border-border-strong bg-raised px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.12em] text-text shadow-soft transition-all hover:border-azure-700 hover:bg-azure-800 hover:text-on-dark"
                  >
                    All packages
                    <span className="">→</span>
                  </Link>
                </div>
                <CardRail label="Departures">
                  {tours.map((p, i) => (
                    <PackageCard key={p.id} pkg={p} priority={i < 3} />
                  ))}
                </CardRail>
              </>
            ) : (
              <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-12 text-center shadow-soft">
                <SmokeShadow className="pointer-events-none absolute inset-0 h-full w-full text-azure-600/15" />
                <BanyanTree className="pointer-events-none absolute -bottom-6 left-6 hidden h-[170px] w-[170px] text-azure-700/10 sm:block" />
                <PineTree className="pointer-events-none absolute -bottom-2 right-10 hidden h-[150px] w-[64px] text-azure-700/12 tree-breathe sm:block" />
                <div className="relative">
                  <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-vermilion-50 text-vermilion-700 ring-1 ring-vermilion-300/60">
                    <Icon name="compass" className="h-6 w-6" />
                  </span>
                  <Display className="text-[25px]">{emptyTitle}</Display>
                  <p className="mx-auto mt-3.5 max-w-lg text-[13.5px] leading-[1.75] text-muted">{emptyBody}</p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Button href="/packages" variant="outline">
                      Browse all packages
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
          </section>

        </div>

        {destinations.length > 0 && (
          <RailSection
            image={destinations[0].image}
            title="Places on these routes"
            subtitle={`${destinations.length} stops across this collection`}
            cta={{ href: '/destinations', label: 'Explore' }}
            itemClassName={DESTINATION_ITEM}
            label="Places on these routes"
          >
            {destinations.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </RailSection>
        )}

        <div className="relative mx-auto max-w-[1320px] px-5 pb-14 md:px-8 lg:px-12 lg:pb-20">
          {notes && notes.length > 0 && (
            <section className="mt-20">
              <Display className="display-caps text-[27px] sm:text-[33px]">Before you pick a date</Display>
              <CardRail className="mt-7" itemClassName="w-[280px] sm:w-[330px] lg:w-[380px]" label="Good to know">
                {notes.map((n, i) => (
                  <div key={n.title} className="card group relative overflow-hidden p-6 hover:card-hover">
                    <span className="absolute right-4 top-3 font-display text-[46px] font-bold leading-none text-vermilion-100 transition-colors duration-500 group-hover:text-vermilion-300/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="relative font-display text-[19px] font-semibold leading-snug text-text">
                      {n.title}
                    </h3>
                    <p className="relative mt-3 text-[13px] leading-[1.75] text-muted">{n.body}</p>
                  </div>
                ))}
              </CardRail>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

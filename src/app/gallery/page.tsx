import type { Metadata } from 'next';
import Image from 'next/image';
import { PlainPageHero } from '@/components/PageHero';
import { Button, Display, Eyebrow, Icon } from '@/components/ui';
import { CameraBadge, FlightPath, PineTree, SmokeShadow } from '@/components/Decor';
import { DESTINATIONS, destinationFor } from '@/lib/catalog';
import { AGENCY } from '@/lib/content';
import { whatsappLink } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'The places MK Tours travels to, across India and Nepal.',
};

export default function GalleryPage() {
  const items = Object.keys(DESTINATIONS)
    .map((slug) => destinationFor(slug))
    // One photograph per place: several slugs intentionally share an image.
    .filter((d, i, all) => all.findIndex((x) => x.image === d.image) === i);

  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);

  return (
    <>
      <PlainPageHero
        eyebrow="Resources"
        title={
          <>
            A <span className="flourish">gallery</span> of places we actually go
          </>
        }
        lede={`${items.length} places across India and Nepal, every one of them on a route we run.`}
        crumbs={[{ label: 'Gallery' }]}
      />

      <div className="relative overflow-hidden">
        <CameraBadge className="pointer-events-none absolute -right-10 top-[18%] hidden h-[230px] w-[270px] text-azure-700/8 xl:block" />
        <FlightPath
          variant="arch"
          className="pointer-events-none absolute left-[8%] bottom-[28%] hidden h-[150px] w-[80%] text-vermilion-500/15 lg:block"
        />
        <PineTree className="pointer-events-none absolute -left-4 bottom-[14%] hidden h-[200px] w-[86px] text-azure-700/10 tree-breathe lg:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          {/* A masonry-style column flow, so no two tiles share an edge rhythm */}
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
            {items.map((d, i) => (
              <figure
                key={d.slug}
                className={`group relative block break-inside-avoid overflow-hidden rounded-[1.5rem] bg-azure-900 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-float ${
                  i % 5 === 0 ? 'aspect-[3/4]' : i % 7 === 3 ? 'aspect-square' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={d.image}
                  alt={`${d.label}, ${d.state}`}
                  fill
                  sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-azure-900 via-azure-900/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                <span className="sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                {/* A shutter mark appears top-right on hover. */}
                <span className="absolute right-3 top-3 flex h-8 w-8 translate-y-2 items-center justify-center rounded-full border border-white/25 bg-azure-900/50 text-on-dark opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <Icon name="camera" className="h-4 w-4" />
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 p-4">
                  <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-vermilion-300">
                    <Icon name="pin" className="h-3 w-3" />
                    {d.state}
                  </span>
                  <span className="mt-1 block font-display text-[17px] font-semibold leading-tight text-on-dark">
                    {d.label}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="relative mt-16 overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-12 text-center shadow-soft">
            <SmokeShadow className="pointer-events-none absolute inset-0 h-full w-full text-azure-600/12" />
            <div className="relative">
              <Eyebrow className="mb-5">Pick a frame</Eyebrow>
              <Display className="text-[24px]">Every photograph here is a place we stop</Display>
              <p className="mx-auto mt-3.5 max-w-lg text-[14px] leading-[1.75] text-muted">
                Every photograph here is a place one of our departures actually visits. Pick the one you want to stand in.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="/packages" variant="solid">
                  Browse tour packages
                </Button>
                {wa && (
                  <Button href={wa} external variant="outline">
                    Customize your trip
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

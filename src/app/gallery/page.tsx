import type { Metadata } from 'next';
import Image from 'next/image';
import { PlainPageHero } from '@/components/PageHero';
import { Button } from '@/components/ui';
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
        title="Gallery"
        lede={`${items.length} places across India and Nepal, every one of them on a route we run.`}
        crumbs={[{ label: 'Gallery' }]}
      />

      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((d, i) => (
            <figure
              key={d.slug}
              className={`group relative overflow-hidden rounded-md bg-surface ${
                i % 7 === 0 ? 'row-span-2 aspect-[3/4] sm:aspect-[3/5]' : 'aspect-[4/3]'
              }`}
            >
              <Image
                src={d.image}
                alt={`${d.label}, ${d.state}`}
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-text/80 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-3">
                <span className="block text-[9.5px] font-semibold uppercase tracking-[0.14em] text-on-dark/70">
                  {d.state}
                </span>
                <span className="block font-display text-[16px] font-medium leading-tight text-on-dark">{d.label}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14 rounded-md border border-border bg-surface px-6 py-10 text-center">
          <p className="mx-auto max-w-lg text-[14px] leading-relaxed text-muted">
            Every photograph here is a place one of our departures actually visits. Pick the one you want to stand in.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
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
    </>
  );
}

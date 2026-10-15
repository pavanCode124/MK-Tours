import type { Metadata } from 'next';
import { PlainPageHero } from '@/components/PageHero';
import { Button, Display, Eyebrow } from '@/components/ui';
import { CameraBadge, FlightPath, PineTree, SmokeShadow } from '@/components/Decor';
import { JourneyInFrames } from '@/components/JourneyInFrames';
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
          <div className="text-center">
            <Eyebrow className="mb-4">Journey In Frames</Eyebrow>
            <Display className="display-caps text-[28px] sm:text-[34px] lg:text-[40px]">
              Pictures <span className="flourish">perfect</span> moments
            </Display>
          </div>

          <div className="mt-10">
            <JourneyInFrames items={items.map((d) => ({ src: d.image, label: d.state }))} />
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

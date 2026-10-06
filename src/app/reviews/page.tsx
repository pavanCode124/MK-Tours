import type { Metadata } from 'next';
import { PlainPageHero } from '@/components/PageHero';
import { ReviewCard } from '@/components/sections';
import { Button, Display, Eyebrow, Icon, Stars } from '@/components/ui';
import { FlightPath, PineTree, SmokeShadow, TopoField } from '@/components/Decor';
import { AGENCY, REVIEWS } from '@/lib/content';
import { whatsappLink } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Reviews',
  description: 'What travellers say after a fixed-departure group tour with MK Tours.',
};

export default function ReviewsPage() {
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);
  const fiveStar = REVIEWS.filter((r) => r.stars === 5).length;

  return (
    <>
      <PlainPageHero
        eyebrow="Reviews"
        title={
          <>
            What our <span className="flourish">travellers</span> say
          </>
        }
        lede={`More than ${AGENCY.travellers} travellers have gone out with us since ${AGENCY.since}. These are a few of them.`}
        crumbs={[{ label: 'Reviews' }]}
      />

      <div className="relative overflow-hidden">
        <TopoField className="pointer-events-none absolute -right-12 top-[35%] hidden h-[320px] w-[40%] text-azure-700/8 lg:block" />
        <FlightPath
          variant="rise"
          className="pointer-events-none absolute -left-8 bottom-[26%] hidden h-[150px] w-[70%] text-vermilion-500/15 lg:block"
        />

        <div className="relative mx-auto max-w-[1320px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          {/* Rating summary — a raised card with the score pulled out */}
          <div className="card flex flex-wrap items-center gap-7 p-7 sm:p-9">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-[1.25rem] bg-vermilion-500 text-white shadow-glow">
                <span className="font-display text-[30px] font-bold leading-none">4.9</span>
                <span className="text-[9px] font-bold uppercase tracking-[0.12em]">out of 5</span>
              </div>
              <div>
                <Stars />
                <p className="mt-1.5 text-[13px] font-semibold text-text">Average rating on our Google profile</p>
                <p className="mt-0.5 text-[12px] text-subtle">
                  {fiveStar} of the {REVIEWS.length} reviews below are five stars
                </p>
              </div>
            </div>
            <a
              href={AGENCY.googleProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="group/l ml-auto inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-text shadow-soft transition-all hover:-translate-y-0.5 hover:border-azure-700 hover:bg-azure-800 hover:text-on-dark"
            >
              Read them on Google
              <span className="transition-transform group-hover/l:translate-x-1">→</span>
            </a>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <ReviewCard key={r.name} {...r} />
            ))}
          </div>

          <div className="relative mt-16 overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-12 text-center shadow-soft">
            <SmokeShadow className="pointer-events-none absolute inset-0 h-full w-full text-azure-600/12" />
            <PineTree className="pointer-events-none absolute -bottom-2 right-8 hidden h-[150px] w-[64px] text-azure-700/12 tree-breathe sm:block" />
            <div className="relative">
              <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-vermilion-50 text-vermilion-700 ring-1 ring-vermilion-300/60">
                <Icon name="heart" className="h-6 w-6" />
              </span>
              <Eyebrow className="mb-4">Your turn</Eyebrow>
              <Display className="text-[24px]">Travelled with us?</Display>
              <p className="mx-auto mt-3.5 max-w-lg text-[13.5px] leading-[1.75] text-muted">
                Leave a review on our Google profile, or send it to us directly. We read the critical ones too — it is how
                the itineraries get better.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href={AGENCY.googleProfile} external variant="solid">
                  Write a review
                </Button>
                {wa && (
                  <Button href={wa} external variant="outline">
                    Send us feedback
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

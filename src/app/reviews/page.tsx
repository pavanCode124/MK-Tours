import type { Metadata } from 'next';
import { PlainPageHero } from '@/components/PageHero';
import { ReviewCard } from '@/components/sections';
import { Button, Display, Stars } from '@/components/ui';
import { AGENCY, REVIEWS } from '@/lib/content';
import { whatsappLink } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Reviews',
  description: 'What travellers say after a fixed-departure group tour with MK Tours.',
};

export default function ReviewsPage() {
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);

  return (
    <>
      <PlainPageHero
        eyebrow="Reviews"
        title="What Our Travellers Say"
        lede={`More than ${AGENCY.travellers} travellers have gone out with us since ${AGENCY.since}. These are a few of them.`}
        crumbs={[{ label: 'Reviews' }]}
      />

      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        <div className="flex flex-wrap items-center gap-6 border border-border bg-amber-50 px-7 py-6">
          <div>
            <span className="font-display text-[40px] font-normal leading-none text-sherwood-800">4.9</span>
          </div>
          <div>
            <Stars />
            <p className="mt-1 text-[12.5px] text-muted">Average rating on our Google profile</p>
          </div>
          <a
            href={AGENCY.googleProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-[13px] font-medium text-meadow-700 underline-offset-4 hover:underline"
          >
            Read them on Google →
          </a>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} {...r} />
          ))}
        </div>

        <div className="mt-14 border border-border bg-surface px-6 py-10 text-center">
          <Display className="text-[24px]">Travelled with us?</Display>
          <p className="mx-auto mt-3 max-w-lg text-[13.5px] leading-relaxed text-muted">
            Leave a review on our Google profile, or send it to us directly. We read the critical ones too — it is how
            the itineraries get better.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
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
    </>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { Pillar } from '@/components/sections';
import { Button, Display, Eyebrow, Icon } from '@/components/ui';
import { allDestinations } from '@/lib/catalog';
import { AGENCY, PILLARS } from '@/lib/content';
import { getPackages, whatsappLink } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'MK Tours has run private and fixed-departure group journeys across India since 2017, for more than 10,000 travellers. How we work, and what one price actually covers.',
};

const STEPS = [
  {
    n: '01',
    title: 'You tell us the trip',
    body: 'Pick a fixed departure from the calendar, or tell us where you want to go and when. Either way we start with your dates, your group size and the sharing you want.',
  },
  {
    n: '02',
    title: 'We quote it in writing',
    body: 'You get the itinerary, the train class, the hotel sharing and the full price — with the exclusions listed, not implied. Nothing is held until you have read it.',
  },
  {
    n: '03',
    title: 'We book the group',
    body: 'An advance confirms your seat. We make the group rail booking, hold the hotels, and send you the packing note and the documents you will need to carry.',
  },
  {
    n: '04',
    title: 'A tour manager travels with you',
    body: 'From the platform at Mumbai to the platform you come home to. If something changes on the road, somebody who works for us is standing there to change it.',
  },
];

export default async function AboutPage() {
  const packages = await getPackages().catch(() => []);
  const destinations = allDestinations(packages);
  const states = new Set(destinations.map((d) => d.state));
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);

  return (
    <>
      <PageHero
        image="/images/about-group.jpg"
        eyebrow={`Since ${AGENCY.since}`}
        title="A Trusted Travel Partner for Private & Group Journeys"
        lede={`${AGENCY.travellers} travellers, ${destinations.length} destinations, ${states.size} states and countries — all on fixed departures out of Mumbai.`}
        crumbs={[{ label: 'Our Story' }]}
      />

      {/* Numbers */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-y divide-border/80 px-5 md:grid-cols-4 md:divide-y-0 md:px-8 lg:px-12">
          {[
            { v: `${new Date().getFullYear() - AGENCY.since}+`, l: 'Years running tours' },
            { v: AGENCY.travellers, l: 'Travellers carried' },
            { v: String(destinations.length), l: 'Destinations covered' },
            { v: String(states.size), l: 'States & countries' },
          ].map((s) => (
            <div key={s.l} className="px-4 py-7 text-center">
              <div className="font-display text-[30px] font-normal leading-none text-sherwood-800">{s.v}</div>
              <div className="mt-2 text-[11.5px] text-muted">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto grid max-w-[1280px] items-start gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <div>
            <Eyebrow className="mb-3">Who we are</Eyebrow>
            <Display className="text-[30px] sm:text-[36px]">We started with one coach and one route</Display>
            <div className="mt-6 space-y-4 text-[14.5px] leading-[1.75] text-muted">
              <p>
                MK Tours began in {AGENCY.since} with a single pilgrimage circuit out of Mumbai and a belief that has not
                changed since: a group trip is only as good as the arrangements made before anyone boards.
              </p>
              <p>
                We book the train as a group rather than chasing seats traveller by traveller. We hold the hotels in
                advance rather than taking whatever is left. And we send a tour manager with every departure, because a
                phone number is not the same as a person standing on the platform.
              </p>
              <p>
                Today that calendar covers the temple towns of the Ganga plain, the three valleys of Kashmir, the forts
                and desert of Rajasthan, the Kerala backwaters and the Annapurna foothills of Nepal. More than{' '}
                {AGENCY.travellers} travellers have come with us.
              </p>
              <p>
                We quote one price, and we write down what it does not cover. Entry fees, special darshan, personal
                expenses — they are on every package page, in plain language. We would rather lose a booking to honesty
                than win one and argue about it on the road.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/packages" variant="solid">
                See our departures
              </Button>
              {wa && (
                <Button href={wa} external variant="outline">
                  Talk to us
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {['/images/dest-varanasi.jpg', '/images/dest-gulmarg.jpg', '/images/dest-jaisalmer.jpg', '/images/dest-alleppey.jpg'].map(
              (src, i) => (
                <div
                  key={src}
                  className={`relative overflow-hidden rounded-2xl ${i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}
                >
                  <Image src={src} alt="" fill sizes="(min-width: 1024px) 260px, 50vw" className="object-cover" />
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12">
          <Eyebrow className="mb-3">How we work</Eyebrow>
          <Display className="text-[30px] sm:text-[36px]">From enquiry to platform</Display>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-raised p-6">
                <span className="font-display text-[28px] font-normal leading-none text-meadow-600">{s.n}</span>
                <h3 className="mt-3 font-display text-[19px] font-normal leading-snug text-text">{s.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12">
          <div className="rounded-2xl bg-sherwood-800 px-6 py-12 lg:px-10 lg:py-14">
            <div className="text-center">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-meadow-300">
                What you can count on
              </span>
              <Display className="mt-3 text-[28px] text-on-dark sm:text-[34px]">
                Travel the Way It Was Meant to Be
              </Display>
            </div>
            <div className="mt-11 grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
              {PILLARS.map((p) => (
                <Pillar key={p.title} {...p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="pb-16 lg:pb-20">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: 'phone' as const, title: 'Call us', body: `+91 ${AGENCY.phonePrimary}`, note: AGENCY.hours },
              { icon: 'mail' as const, title: 'Email us', body: AGENCY.email, note: 'We reply the same day' },
              { icon: 'pin' as const, title: 'Find us', body: AGENCY.address, note: 'Departures from Mumbai' },
            ].map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-raised p-6">
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-meadow-50 text-meadow-700">
                  <Icon name={c.icon} className="h-[18px] w-[18px]" />
                </span>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">{c.title}</h3>
                <p className="mt-2 text-[14px] leading-snug text-text">{c.body}</p>
                <p className="mt-1 text-[12px] text-subtle">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

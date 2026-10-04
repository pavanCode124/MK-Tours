import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { PencilCamera } from '@/components/PencilCamera';
import { PencilPalm } from '@/components/PencilPalm';
import {
  BanyanTree,
  CameraBadge,
  FlightPath,
  FlightTag,
  PineTree,
  SmokePlume,
  SmokeShadow,
  TopoField,
  TreeLine,
} from '@/components/Decor';
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
    icon: 'compass' as const,
    title: 'You tell us the trip',
    body: 'Pick a fixed departure from the calendar, or tell us where you want to go and when. Either way we start with your dates, your group size and the sharing you want.',
  },
  {
    n: '02',
    icon: 'wallet' as const,
    title: 'We quote it in writing',
    body: 'You get the itinerary, the train class, the hotel sharing and the full price — with the exclusions listed, not implied. Nothing is held until you have read it.',
  },
  {
    n: '03',
    icon: 'train' as const,
    title: 'We book the group',
    body: 'An advance confirms your seat. We make the group rail booking, hold the hotels, and send you the packing note and the documents you will need to carry.',
  },
  {
    n: '04',
    icon: 'shield' as const,
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
        title="A trusted travel partner for private & group journeys"
        lede={`${AGENCY.travellers} travellers, ${destinations.length} destinations, ${states.size} states and countries — all on fixed departures out of Mumbai.`}
        crumbs={[{ label: 'Our Story' }]}
      >
        <FlightTag from="Mumbai" to="India & Nepal" note="Since 2017" />
      </PageHero>

      {/* Numbers — a raised card lifted over the banner */}
      <section className="relative z-10 -mt-10 bg-transparent">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 gap-1 rounded-[1.75rem] border border-border bg-raised p-3 shadow-float md:grid-cols-4">
            {[
              { v: `${new Date().getFullYear() - AGENCY.since}+`, l: 'Years running tours', i: 'calendar' as const },
              { v: AGENCY.travellers, l: 'Travellers carried', i: 'group' as const },
              { v: String(destinations.length), l: 'Destinations covered', i: 'pin' as const },
              { v: String(states.size), l: 'States & countries', i: 'compass' as const },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl px-4 py-6 text-center transition-colors duration-300 hover:bg-meadow-50">
                <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-meadow-50 text-meadow-700 ring-1 ring-meadow-300/50">
                  <Icon name={s.i} className="h-[18px] w-[18px]" />
                </span>
                <div className="font-display text-[28px] font-bold leading-none text-sherwood-700">{s.v}</div>
                <div className="mt-2 text-[11.5px] text-muted">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden py-18 lg:py-24">
        <PencilPalm className="pointer-events-none absolute -bottom-8 -left-10 hidden w-[150px] -rotate-[7deg] opacity-[0.08] lg:block" />
        <BanyanTree className="pointer-events-none absolute -top-10 right-[2%] hidden h-[220px] w-[220px] text-sherwood-700/8 xl:block" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-[320px] w-[320px] bloom-cool" />
        <div className="relative mx-auto grid max-w-[1320px] items-start gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <div>
            <Eyebrow className="mb-5">Who we are</Eyebrow>
            <Display className="display-caps text-[30px] sm:text-[38px]">
              We started with one coach and <span className="flourish">one route</span>
            </Display>
            <div className="mt-7 space-y-4 text-[14.5px] leading-[1.8] text-muted">
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
            <div className="mt-9 flex flex-wrap gap-3">
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

          {/* A staggered print wall rather than a flat 2×2 grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { src: '/images/dest-varanasi.jpg', alt: 'Ghats along the Ganga at Varanasi', cls: 'aspect-[4/5] mt-0' },
              { src: '/images/dest-gulmarg.jpg', alt: 'The meadow at Gulmarg, Kashmir', cls: 'aspect-[4/3] mt-8' },
              { src: '/images/dest-jaisalmer.jpg', alt: 'The golden fort at Jaisalmer', cls: 'aspect-[4/3] -mt-4' },
              { src: '/images/dest-alleppey.jpg', alt: 'A houseboat on the Alleppey backwaters', cls: 'aspect-[4/5] mt-4' },
            ].map((p) => (
              <div
                key={p.src}
                className={`group relative overflow-hidden rounded-[1.75rem] shadow-lift transition-all duration-500 hover:-translate-y-1.5 hover:shadow-float ${p.cls}`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 260px, 50vw"
                  className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
                />
                <span className="sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — a flight leg with four stops */}
      <section className="relative overflow-hidden bg-surface py-18 lg:py-24">
        <div className="pointer-events-none absolute inset-0 dotfield opacity-50" />
        <PencilCamera className="pointer-events-none absolute -right-12 -top-8 hidden w-[220px] rotate-[10deg] opacity-[0.1] md:block lg:w-[290px]" />
        <FlightPath
          variant="rise"
          className="pointer-events-none absolute left-[6%] top-[40%] hidden h-[180px] w-[88%] text-meadow-500/30 lg:block"
        />
        <TopoField className="pointer-events-none absolute -bottom-10 left-0 hidden h-[280px] w-[40%] text-sherwood-700/8 lg:block" />
        <div className="relative mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <Eyebrow className="mb-5">How we work</Eyebrow>
          <Display className="display-caps text-[30px] sm:text-[38px]">
            From enquiry to <span className="flourish">platform</span>
          </Display>
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="card group relative overflow-hidden p-6 hover:card-hover">
                <span className="absolute right-4 top-3 font-display text-[48px] font-bold leading-none text-meadow-100 transition-colors duration-500 group-hover:text-meadow-300/70">
                  {s.n}
                </span>
                <span className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-sherwood-800 text-meadow-300 shadow-soft transition-colors duration-500 group-hover:bg-meadow-500 group-hover:text-sherwood-900">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
                <h3 className="relative font-display text-[19px] font-semibold leading-snug text-text">{s.title}</h3>
                <p className="relative mt-2.5 text-[13px] leading-[1.7] text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-18 lg:py-24">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-[2.25rem] bg-sherwood-900 px-6 py-14 shadow-float lg:px-12 lg:py-16">
            <SmokePlume
              seed={2}
              className="pointer-events-none absolute -bottom-6 left-[4%] hidden h-[230px] w-[180px] text-white/15 lg:block"
            />
            <CameraBadge className="pointer-events-none absolute -right-6 top-6 hidden h-[180px] w-[210px] text-meadow-300/12 lg:block" />
            <PineTree className="pointer-events-none absolute -bottom-1 right-[8%] hidden h-[150px] w-[64px] text-black/25 tree-breathe lg:block" />
            <div className="relative text-center">
              <Eyebrow tone="dark" className="mb-5">
                What you can count on
              </Eyebrow>
              <Display className="display-caps text-[29px] text-on-dark sm:text-[36px]">
                Travel the way it was meant to be
              </Display>
            </div>
            <div className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {PILLARS.map((p, i) => (
                <Pillar key={p.title} {...p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="relative overflow-hidden pb-18 lg:pb-24">
        <SmokeShadow className="pointer-events-none absolute -bottom-16 right-0 h-[300px] w-[55%] text-sherwood-600/12" />
        <div className="relative mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: 'phone' as const, title: 'Call us', body: `+91 ${AGENCY.phonePrimary}`, note: AGENCY.hours },
              { icon: 'mail' as const, title: 'Email us', body: AGENCY.email, note: 'We reply the same day' },
              { icon: 'pin' as const, title: 'Find us', body: AGENCY.address, note: 'Departures from Mumbai' },
            ].map((c) => (
              <div key={c.title} className="card p-6 hover:card-hover">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-meadow-50 text-meadow-700 ring-1 ring-meadow-300/50">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.14em] text-meadow-700">{c.title}</h3>
                <p className="mt-2 text-[14px] font-semibold leading-snug text-text">{c.body}</p>
                <p className="mt-1 text-[12px] text-subtle">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
        <TreeLine className="pointer-events-none absolute inset-x-0 -bottom-1 h-[64px] text-surface" />
      </section>
    </>
  );
}

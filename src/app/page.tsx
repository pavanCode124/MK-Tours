import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { PackageCard } from '@/components/PackageCard';
import { PackageTabs } from '@/components/PackageTabs';
import {
  DestinationGrid,
  FaqList,
  GuideCard,
  Pillar,
  ReviewCard,
} from '@/components/sections';
import { PencilCamera } from '@/components/PencilCamera';
import { PencilPalm } from '@/components/PencilPalm';
import { Button, Display, Eyebrow, Icon, SectionHeading, Stars } from '@/components/ui';
import {
  allDestinations,
  DEPARTURE_CITIES,
  destinationsByState,
  durationBuckets,
  packagesForSeason,
  packagesForState,
  SEASONS,
  themesWithCounts,
} from '@/lib/catalog';
import { AGENCY, ALL_FAQS, GUIDES, PILLARS, REVIEWS, TRUST_ITEMS } from '@/lib/content';
import { getHost, getPackages, telHref, whatsappLink } from '@/lib/mktours';

export default async function HomePage() {
  const [host, packages] = await Promise.all([getHost().catch(() => null), getPackages()]);

  const destinations = allDestinations(packages);
  const byState = destinationsByState(packages);
  const themes = themesWithCounts(packages);
  const durations = durationBuckets(packages);
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);
  const tel = telHref(AGENCY.phonePrimary);

  // The package grid is grouped by state, so the tabs mirror the catalogue.
  const tabStates = byState.filter((g) => packagesForState(packages, g.state).length > 1).slice(0, 4);
  const tabs = [
    { label: 'All Tours', content: <Grid packages={packages} priority /> },
    ...tabStates.map((g) => ({
      label: g.state,
      content: <Grid packages={packagesForState(packages, g.state)} />,
    })),
  ];

  return (
    <>
      <Hero
        headline="Fixed-departure group tours and private trips across India and Nepal — train, hotels, meals, transport and sightseeing in one honest price."
        states={byState.map((g) => ({ value: g.state, label: g.state }))}
        destinations={destinations.map((d) => ({ value: d.slug, label: d.label }))}
        cities={DEPARTURE_CITIES.map((c) => ({ value: c.slug, label: c.label }))}
      />

      {/* Trust strip */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-y divide-border/80 px-5 sm:grid-cols-3 md:px-8 lg:grid-cols-5 lg:divide-y-0 lg:px-12">
          {TRUST_ITEMS.map((item) => (
            <div key={item.label} className="px-4 py-5 text-center">
              <div className={`text-[15px] font-semibold ${item.top.startsWith('★') ? 'text-amber' : 'text-sherwood-800'}`}>
                {item.top}
              </div>
              <div className="mt-0.5 text-[12.5px] font-semibold text-text">{item.label}</div>
              <div className="mt-0.5 text-[11px] text-subtle">{item.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Top destinations */}
      <Section className="relative overflow-hidden">
        <PencilCamera className="absolute -right-10 -top-6 hidden w-[200px] rotate-[9deg] opacity-[0.12] sm:block md:w-[260px] lg:-right-14 lg:-top-8 lg:w-[340px]" />
        <div className="relative">
          <div className="reveal">
            <SectionHeading
              eyebrow="Explore"
              title="Top Destinations"
              link={{ href: '/destinations', label: 'View all destinations' }}
            />
          </div>
          <div className="reveal mt-9">
            <DestinationGrid destinations={destinations.slice(0, 5)} />
          </div>
          <div className="reveal mt-9 text-center">
            <Button href="/destinations" variant="solid">
              View All Destinations
            </Button>
          </div>
        </div>
      </Section>

      {/* Who we are */}
      <Section tone="warm">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="reveal relative">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src="/images/about-group.jpg"
                alt="Travellers above Phewa Lake with the Annapurna range behind"
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 right-5 bg-sherwood-900 px-6 py-4 text-center shadow-xl sm:right-10">
              <div className="font-display text-[26px] font-normal leading-none text-on-dark">Since {AGENCY.since}</div>
              <div className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-meadow-300">
                Group departures
              </div>
            </div>
          </div>

          <div className="reveal">
            <Eyebrow className="mb-3 !text-meadow-300">Who we are</Eyebrow>
            <Display className="text-[32px] text-on-dark sm:text-[38px] lg:text-[46px]">
              A Trusted Travel Partner for Private &amp; Group Journeys
            </Display>
            <div className="mt-7 space-y-4 text-[14.5px] leading-[1.8] text-on-dark/85">
              <p>
                MK Tours has been running group journeys across India since {AGENCY.since}. More than {AGENCY.travellers}{' '}
                travellers have gone out with us since — on pilgrimage circuits through the Ganga plain, up into the
                Kashmir valleys, down the Kerala backwaters, and across the Thar to Jaisalmer.
              </p>
              <p>
                Every departure is a fixed departure. The train is booked as a group, the hotels are held in advance, and
                a tour manager travels with you from the platform at Mumbai to the platform you come home to. Nothing is
                arranged at the last minute, because nothing on a group trip survives being arranged at the last minute.
              </p>
              <p>
                One price covers the journey, the stays, the meals during the stay, the local transport and the
                sightseeing in the itinerary. What it does not cover is written out on every package page — entry fees,
                special darshan, personal expenses. We would rather you read the exclusions before you book than discover
                them on the road.
              </p>
              <p>
                Go private and the whole itinerary is yours to shape. Join a group departure and you travel with people
                who chose the same trip for the same reasons. Either way, you travel with someone who answers the phone.
              </p>
            </div>
            <Button href="/about" variant="onDark" className="mt-9">
              Learn More About How We Work
            </Button>
          </div>
        </div>
      </Section>

      {/* Packages */}
      <section className="bg-surface py-20 lg:py-28">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12">
          <div className="reveal">
            <SectionHeading
              eyebrow="Packages"
              title="Popular Tour Packages"
              link={{ href: '/packages', label: 'View all packages' }}
            />
          </div>
          <div className="reveal mt-9">
            <PackageTabs groups={tabs} />
          </div>
          <div className="reveal mt-12 text-center">
            <Button href="/packages" variant="solid">
              View All Packages
            </Button>
          </div>
        </div>
      </section>

      {/* Browse by duration & season */}
      <Section>
        <div className="reveal">
          <SectionHeading
            align="center"
            eyebrow="Travel your way"
            title="Browse by Duration & Season"
            lede="Six days or ten, winter in Rajasthan or summer in the Kashmir meadows — find the trip length and travel window that fits your calendar."
          />
        </div>

        <div className="reveal mt-10 grid gap-5 lg:grid-cols-2">
          <div className="border border-border bg-raised p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center bg-meadow-50 text-meadow-700">
                <Icon name="calendar" className="h-[18px] w-[18px]" />
              </span>
              <div className="flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-meadow-700">By duration</div>
                <div className="font-display text-[20px] font-normal leading-tight text-text">Trip Length</div>
              </div>
              <span className="text-[11px] text-subtle">{durations.length} lengths</span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {durations.map((d) => (
                <Link
                  key={d.days}
                  href={`/packages?duration=${d.days}`}
                  className="border border-border p-4 transition-colors hover:border-sherwood-800 hover:bg-surface"
                >
                  <div className="font-display text-[22px] font-normal leading-none text-text">{d.days}D</div>
                  <div className="mt-1.5 text-[12px] text-muted">{d.nights} Nights</div>
                  <div className="mt-0.5 text-[11px] text-subtle">
                    {d.count} {d.count === 1 ? 'tour' : 'tours'}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="border border-border bg-raised p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center bg-meadow-50 text-meadow-700">
                <Icon name="compass" className="h-[18px] w-[18px]" />
              </span>
              <div className="flex-1">
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-meadow-700">By season</div>
                <div className="font-display text-[20px] font-normal leading-tight text-text">Travel Window</div>
              </div>
              <span className="text-[11px] text-subtle">{SEASONS.length} seasons</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SEASONS.map((s) => {
                const count = packagesForSeason(packages, s.slug).length;
                return (
                  <Link
                    key={s.slug}
                    href={`/packages?season=${s.slug}`}
                    className={`border p-4 transition-shadow hover:shadow-sm ${s.tone}`}
                  >
                    <div className="font-display text-[19px] font-normal leading-tight text-text">{s.label}</div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-meadow-700">
                      {s.window}
                    </div>
                    <div className="mt-2 text-[11px] text-muted">
                      {s.note} · {count} {count === 1 ? 'tour' : 'tours'}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Themes */}
        <div className="reveal mt-5 border border-border bg-raised p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-meadow-50 text-meadow-700">
              <Icon name="star" className="h-[18px] w-[18px]" />
            </span>
            <div className="flex-1">
              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-meadow-700">By theme</div>
              <div className="font-display text-[20px] font-normal leading-tight text-text">What the trip is for</div>
            </div>
            <span className="text-[11px] text-subtle">{themes.length} themes</span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {themes.map((t) => (
              <Link
                key={t.slug}
                href={`/themes/${t.slug}`}
                className="border border-border px-4 py-2.5 text-[12.5px] text-text transition-colors hover:border-sherwood-800 hover:text-sherwood-800"
              >
                {t.label} <span className="text-subtle">({t.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* Why us */}
      <Section tone="dark">
        <div className="reveal text-center">
          <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-meadow-300">
            <span className="h-px w-10 bg-meadow-300/50" />
            Why MK Tours
            <span className="h-px w-10 bg-meadow-300/50" />
          </span>
          <Display className="mx-auto mt-4 max-w-3xl text-[32px] text-on-dark sm:text-[40px] lg:text-[46px]">
            Travel the Way It Was Meant to Be
          </Display>
        </div>
        <div className="reveal mt-14 grid divide-y divide-white/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {PILLARS.map((p) => (
            <Pillar key={p.title} icon={p.icon} title={p.title} text={p.text} />
          ))}
        </div>
      </Section>

      {/* Reviews */}
      <Section className="relative overflow-hidden">
        <PencilPalm className="absolute -bottom-12 -left-14 hidden w-[180px] -rotate-[7deg] opacity-[0.07] lg:block" />
        <div className="reveal relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="mb-2.5">Reviews</Eyebrow>
            <Display className="display-caps text-[26px] sm:text-[31px] lg:text-[35px]">What Our Travellers Say</Display>
          </div>
          <div className="flex items-center gap-3 border border-border bg-amber-50 px-5 py-3">
            <span className="font-display text-[26px] font-normal leading-none text-sherwood-800">4.9</span>
            <span>
              <Stars />
              <span className="mt-0.5 block text-[11px] text-muted">Google rating</span>
            </span>
          </div>
        </div>
        <div className="reveal mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} {...r} />
          ))}
        </div>
      </Section>

      {/* Guides */}
      <Section>
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-surface text-sherwood-800">
              <Icon name="book" className="h-[18px] w-[18px]" />
            </span>
            <Display className="display-caps text-[24px] sm:text-[29px]">Read Before You Go</Display>
          </div>
          <Link
            href="/blog"
            className="text-[13px] font-medium text-meadow-700 underline-offset-4 transition-colors hover:text-sherwood-800 hover:underline"
          >
            All guides →
          </Link>
        </div>
        <div className="reveal mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.slice(0, 3).map((g) => (
            <GuideCard key={g.slug} {...g} />
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="relative overflow-hidden">
        <PencilCamera className="absolute -right-14 top-6 hidden w-[230px] rotate-[12deg] opacity-[0.07] lg:block" />
        <div className="reveal relative">
          <Eyebrow className="mb-2.5">FAQ</Eyebrow>
          <Display className="display-caps text-[26px] sm:text-[31px] lg:text-[35px]">Common Questions</Display>
        </div>
        <div className="reveal mt-8">
          <FaqList items={ALL_FAQS.slice(0, 14)} />
        </div>
        <div className="reveal mt-6">
          <Link
            href="/contact#faq"
            className="text-[13px] font-medium text-meadow-700 underline-offset-4 transition-colors hover:text-sherwood-800 hover:underline"
          >
            See all {ALL_FAQS.length} questions →
          </Link>
        </div>
      </Section>

      {/* Talk to us */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12">
          <div className="reveal flex flex-col gap-7 bg-sherwood-800 px-7 py-11 text-on-dark sm:px-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <Display className="text-[26px] text-on-dark sm:text-[30px]">Have questions? Let&apos;s talk.</Display>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-on-dark/85">
                Our team is on WhatsApp and on the phone, {AGENCY.hours.toLowerCase()}. We will help you pick the right
                departure, check dates, or answer anything you need before you book.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              {wa && (
                <Button href={wa} external variant="meadow">
                  Chat on WhatsApp
                </Button>
              )}
              {tel && (
                <Button href={tel} external variant="onDark">
                  Call +91 {AGENCY.phonePrimary}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------------------------------- */

const SECTION_TONES = {
  light: 'bg-bg',
  surface: 'bg-surface',
  dark: 'bg-sherwood-900 text-on-dark',
  warm: 'bg-clay text-on-dark',
} as const;

function Section({
  children,
  tone = 'light',
  className = '',
}: {
  children: React.ReactNode;
  tone?: keyof typeof SECTION_TONES;
  className?: string;
}) {
  return (
    <section className={`${SECTION_TONES[tone]} py-20 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12">{children}</div>
    </section>
  );
}

function Grid({ packages, priority = false }: { packages: Awaited<ReturnType<typeof getPackages>>; priority?: boolean }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg, i) => (
        <PackageCard key={pkg.id} pkg={pkg} priority={priority && i < 3} />
      ))}
    </div>
  );
}

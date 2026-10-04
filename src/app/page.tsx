import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { PackageCard } from '@/components/PackageCard';
import { PackageTabs } from '@/components/PackageTabs';
import {
  DestinationMosaic,
  FaqList,
  GuideCard,
  Pillar,
  ReviewCard,
} from '@/components/sections';
import {
  BanyanTree,
  CameraBadge,
  CompassRose,
  FlightPath,
  FlightTag,
  PineTree,
  SmokePlume,
  SmokeShadow,
  TopoField,
  TreeLine,
  WaveDivider,
} from '@/components/Decor';
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
  const [, packages] = await Promise.all([getHost().catch(() => null), getPackages()]);

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

      {/* Trust strip — a raised card rather than a divided band */}
      <section className="relative z-10 bg-bg">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 gap-1 rounded-[1.75rem] border border-border bg-raised p-3 shadow-lift sm:grid-cols-3 lg:grid-cols-5">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.label}
                className="group/t rounded-2xl px-3 py-4 text-center transition-colors duration-300 hover:bg-meadow-50"
              >
                <div
                  className={`font-display text-[17px] font-bold leading-none ${
                    item.top.startsWith('★') ? 'text-meadow-500' : 'text-sherwood-700'
                  }`}
                >
                  {item.top}
                </div>
                <div className="mt-1.5 text-[12.5px] font-bold text-text">{item.label}</div>
                <div className="mt-0.5 text-[11px] text-subtle">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top destinations — a mosaic, not a row of medallions */}
      <Section className="relative overflow-hidden">
        <PencilCamera className="pointer-events-none absolute -right-10 -top-4 hidden w-[200px] rotate-[9deg] opacity-[0.1] sm:block md:w-[250px] lg:-right-14 lg:w-[310px]" />
        <BanyanTree className="pointer-events-none absolute -bottom-10 -left-12 hidden h-[260px] w-[260px] text-sherwood-700/8 lg:block" />
        <div className="pointer-events-none absolute -left-24 top-20 h-[300px] w-[300px] bloom-cool" />
        <div className="relative">
          <div className="reveal">
            <SectionHeading
              eyebrow="Explore"
              title={
                <>
                  Places our travellers <span className="flourish">come back for</span>
                </>
              }
              link={{ href: '/destinations', label: 'View all' }}
            />
          </div>
          <div className="reveal mt-10">
            <DestinationMosaic destinations={destinations.slice(0, 7)} />
          </div>
          <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/destinations" variant="solid">
              View all {destinations.length} destinations
            </Button>
            <FlightTag from="Mumbai" to="Anywhere" note="By train or air" className="hidden sm:inline-flex" />
          </div>
        </div>
      </Section>

      {/* Who we are — a curved terracotta panel with a photo collage */}
      <section className="relative overflow-hidden bg-clay py-20 text-on-dark lg:py-28">
        <WaveDivider flip className="pointer-events-none absolute inset-x-0 top-0 h-[64px] text-bg" />
        <SmokeShadow className="pointer-events-none absolute -bottom-16 right-0 h-[340px] w-[60%] text-white/15" />
        <PineTree className="pointer-events-none absolute bottom-0 left-[4%] hidden h-[190px] w-[80px] text-sherwood-900/25 tree-breathe lg:block" />
        <FlightPath
          variant="fall"
          className="pointer-events-none absolute right-0 top-10 hidden h-[150px] w-[55%] text-white/25 lg:block"
        />

        <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 px-5 md:px-8 lg:grid-cols-2 lg:gap-16 lg:px-12">
          <div className="reveal relative">
            {/* Two overlapping prints instead of one flat rectangle */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] shadow-float sm:aspect-[4/3] lg:aspect-[4/5]">
              <Image
                src="/images/about-group.jpg"
                alt="Travellers above Phewa Lake with the Annapurna range behind"
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 hidden h-[190px] w-[150px] overflow-hidden rounded-[1.75rem] border-4 border-clay shadow-float sm:block">
              <Image
                src="/images/dest-pokhara.jpg"
                alt="Boats on Phewa Lake at Pokhara"
                fill
                sizes="150px"
                className="object-cover"
              />
            </div>
            <div className="float-soft absolute -left-3 top-6 rounded-2xl bg-bg px-5 py-3.5 text-center shadow-float">
              <div className="font-display text-[24px] font-bold leading-none text-clay">Since {AGENCY.since}</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">Group departures</div>
            </div>
          </div>

          <div className="reveal">
            <Eyebrow tone="dark" className="mb-5">
              Who we are
            </Eyebrow>
            <Display className="display-caps text-[32px] text-on-dark sm:text-[40px] lg:text-[46px]">
              A trusted travel partner for private &amp; group journeys
            </Display>
            <div className="mt-7 space-y-4 text-[14.5px] leading-[1.85] text-on-dark/85">
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

            {/* Three quick facts, as capsules on the warm panel */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {[
                { icon: 'train' as const, label: 'Group rail booking' },
                { icon: 'shield' as const, label: 'Tour manager on board' },
                { icon: 'wallet' as const, label: 'One clear price' },
              ].map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-semibold text-on-dark backdrop-blur-sm"
                >
                  <Icon name={f.icon} className="h-4 w-4 text-meadow-300" />
                  {f.label}
                </span>
              ))}
            </div>

            <Button href="/about" variant="onDark" className="mt-9">
              Learn more about how we work
            </Button>
          </div>
        </div>

        <TreeLine className="pointer-events-none absolute inset-x-0 bottom-0 h-[70px] text-surface" />
      </section>

      {/* Packages */}
      <section className="relative overflow-hidden bg-surface py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 dotfield opacity-50" />
        <TopoField className="pointer-events-none absolute -right-16 top-24 hidden h-[360px] w-[45%] text-sherwood-700/8 lg:block" />
        <PencilPalm className="pointer-events-none absolute -bottom-10 left-0 hidden w-[160px] -rotate-[8deg] opacity-[0.09] lg:block" />
        <div className="relative mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <div className="reveal">
            <SectionHeading
              eyebrow="Packages"
              title={
                <>
                  Popular <span className="flourish">tour packages</span>
                </>
              }
              lede="Every departure below is dated, priced and ready to book. Filter by state to find the one that fits your calendar."
              link={{ href: '/packages', label: 'View all' }}
            />
          </div>
          <div className="reveal mt-10">
            <PackageTabs groups={tabs} />
          </div>
          <div className="reveal mt-12 text-center">
            <Button href="/packages" variant="solid">
              View all {packages.length} packages
            </Button>
          </div>
        </div>
      </section>

      {/* Browse by duration, season & theme — one planning board */}
      <Section className="relative overflow-hidden">
        <CompassRose className="pointer-events-none absolute -left-20 top-28 hidden h-[260px] w-[260px] text-sherwood-700/8 xl:block" />
        <SmokePlume
          seed={3}
          className="pointer-events-none absolute -right-6 top-10 hidden h-[260px] w-[200px] text-sherwood-600/12 lg:block"
        />
        <div className="reveal relative">
          <SectionHeading
            align="center"
            eyebrow="Travel your way"
            title={
              <>
                Pick a length, a <span className="flourish">season</span>, or a reason
              </>
            }
            lede="Six days or ten, winter in Rajasthan or summer in the Kashmir meadows — find the trip length and travel window that fits your calendar."
          />
        </div>

        <div className="relative mt-12 grid gap-5 lg:grid-cols-2">
          <div className="reveal card p-7">
            <BoardHead
              icon="calendar"
              kicker="By duration"
              title="Trip length"
              note={`${durations.length} lengths`}
            />
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {durations.map((d) => (
                <Link
                  key={d.days}
                  href={`/packages?duration=${d.days}`}
                  className="group/d rounded-2xl border border-border bg-bg p-4 transition-all duration-300 hover:-translate-y-1 hover:border-meadow-300 hover:bg-meadow-50 hover:shadow-lift"
                >
                  <div className="font-display text-[23px] font-bold leading-none text-sherwood-700 transition-colors group-hover/d:text-meadow-700">
                    {d.days}D
                  </div>
                  <div className="mt-1.5 text-[12px] text-muted">{d.nights} nights</div>
                  <div className="mt-0.5 text-[11px] text-subtle">
                    {d.count} {d.count === 1 ? 'tour' : 'tours'}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="reveal card p-7">
            <BoardHead icon="sun" kicker="By season" title="Travel window" note={`${SEASONS.length} seasons`} />
            <div className="mt-6 grid grid-cols-2 gap-3">
              {SEASONS.map((s) => {
                const count = packagesForSeason(packages, s.slug).length;
                return (
                  <Link
                    key={s.slug}
                    href={`/packages?season=${s.slug}`}
                    className="group/s rounded-2xl border border-border bg-bg p-4 transition-all duration-300 hover:-translate-y-1 hover:border-meadow-300 hover:shadow-lift"
                  >
                    <div className="font-display text-[19px] font-semibold leading-tight text-text transition-colors group-hover/s:text-meadow-700">
                      {s.label}
                    </div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-meadow-700">
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
        <div className="reveal card mt-5 p-7">
          <BoardHead icon="sparkle" kicker="By theme" title="What the trip is for" note={`${themes.length} themes`} />
          <div className="mt-6 flex flex-wrap gap-2.5">
            {themes.map((t) => (
              <Link
                key={t.slug}
                href={`/themes/${t.slug}`}
                className="group/t inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2.5 text-[12.5px] font-semibold text-text transition-all duration-300 hover:-translate-y-0.5 hover:border-meadow-300 hover:bg-meadow-50 hover:text-meadow-700 hover:shadow-soft"
              >
                {t.label}
                <span className="rounded-full bg-surface px-1.5 py-0.5 text-[10px] font-bold text-subtle transition-colors group-hover/t:bg-meadow-100 group-hover/t:text-meadow-700">
                  {t.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* Why us — dark pine panel with glass pillars */}
      <section className="relative overflow-hidden bg-sherwood-900 py-20 text-on-dark lg:py-28">
        <WaveDivider flip className="pointer-events-none absolute inset-x-0 top-0 h-[64px] text-bg" />
        <FlightPath
          variant="arch"
          className="pointer-events-none absolute left-[8%] top-16 hidden h-[170px] w-[84%] text-meadow-300/30 md:block"
        />
        <SmokePlume
          seed={5}
          className="pointer-events-none absolute bottom-10 left-[6%] hidden h-[240px] w-[180px] text-white/15 lg:block"
        />
        <CameraBadge className="pointer-events-none absolute -right-8 bottom-16 hidden h-[200px] w-[230px] text-meadow-300/12 lg:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <div className="reveal text-center">
            <Eyebrow tone="dark" className="mb-5">
              Why MK Tours
            </Eyebrow>
            <Display className="display-caps mx-auto max-w-3xl text-[32px] text-on-dark sm:text-[40px] lg:text-[47px]">
              Travel the way it was meant to be
            </Display>
            <p className="mx-auto mt-5 max-w-xl text-[14.5px] leading-[1.8] text-on-dark/70">
              Four things we settle before you board, so nothing has to be settled on the road.
            </p>
          </div>
          <div className="reveal mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Pillar key={p.title} icon={p.icon} title={p.title} text={p.text} index={i} />
            ))}
          </div>
        </div>

        <TreeLine className="pointer-events-none absolute inset-x-0 bottom-0 h-[70px] text-bg" />
      </section>

      {/* Reviews */}
      <Section className="relative overflow-hidden">
        <PencilPalm className="pointer-events-none absolute -bottom-12 -left-14 hidden w-[180px] -rotate-[7deg] opacity-[0.07] lg:block" />
        <div className="reveal relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow className="mb-4">Reviews</Eyebrow>
            <Display className="display-caps text-[28px] sm:text-[34px] lg:text-[40px]">
              What our <span className="flourish">travellers</span> say
            </Display>
          </div>
          <div className="flex items-center gap-4 rounded-[1.5rem] border border-meadow-300/70 bg-meadow-50 px-6 py-4 shadow-soft">
            <span className="font-display text-[34px] font-bold leading-none text-sherwood-700">4.9</span>
            <span>
              <Stars />
              <span className="mt-1 block text-[11px] font-semibold text-muted">Google rating</span>
            </span>
          </div>
        </div>
        <div className="reveal mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} {...r} />
          ))}
        </div>
        <div className="reveal mt-9 text-center">
          <Button href="/reviews" variant="outline">
            Read all reviews
          </Button>
        </div>
      </Section>

      {/* Guides */}
      <section className="relative overflow-hidden bg-surface py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 dotfield opacity-50" />
        <PineTree className="pointer-events-none absolute -bottom-2 right-[5%] hidden h-[200px] w-[86px] text-sherwood-700/10 tree-breathe lg:block" />
        <PineTree className="pointer-events-none absolute -bottom-3 right-[13%] hidden h-[150px] w-[64px] text-sherwood-700/8 tree-breathe tree-breathe-slow lg:block" />
        <div className="relative mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <div className="reveal">
            <SectionHeading
              eyebrow="Travel journal"
              title={
                <>
                  Read before <span className="flourish">you go</span>
                </>
              }
              lede="Short, practical notes on the places we travel to — written by the people who run the routes."
              link={{ href: '/blog', label: 'All guides' }}
            />
          </div>
          <div className="reveal mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.slice(0, 3).map((g) => (
              <GuideCard key={g.slug} {...g} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — heading on the left, accordion cards on the right */}
      <Section className="relative overflow-hidden">
        <PencilCamera className="pointer-events-none absolute -left-16 top-24 hidden w-[240px] -rotate-[10deg] opacity-[0.08] xl:block" />
        <div className="pointer-events-none absolute -right-20 top-10 h-[300px] w-[300px] bloom-warm" />
        <div className="relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
            <Eyebrow className="mb-4">FAQ</Eyebrow>
            <Display className="display-caps text-[28px] sm:text-[34px] lg:text-[40px]">
              Common <span className="flourish">questions</span>
            </Display>
            <p className="mt-5 text-[14.5px] leading-[1.8] text-muted">
              The things travellers ask us most often, answered plainly. Anything missing, our team is on the phone and
              on WhatsApp {AGENCY.hours.toLowerCase()}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact#faq"
                className="group/l inline-flex items-center gap-2 rounded-full border border-border-strong bg-raised px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-text shadow-soft transition-all hover:-translate-y-0.5 hover:border-sherwood-700 hover:bg-sherwood-800 hover:text-on-dark"
              >
                All {ALL_FAQS.length} questions
                <span className="transition-transform group-hover/l:translate-x-1">→</span>
              </Link>
            </div>
            <CameraBadge className="pointer-events-none mt-10 hidden h-[150px] w-[180px] text-sherwood-700/12 lg:block" />
          </div>
          <div className="reveal">
            <FaqList items={ALL_FAQS.slice(0, 14)} />
          </div>
        </div>
      </Section>

      {/* Talk to us */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <div className="reveal relative flex flex-col gap-8 overflow-hidden rounded-[2.25rem] bg-sherwood-800 px-7 py-12 text-on-dark shadow-float sm:px-12 lg:flex-row lg:items-center lg:justify-between">
            <SmokeShadow className="pointer-events-none absolute -bottom-10 -left-10 h-[260px] w-[60%] text-sherwood-500/25" />
            <FlightPath
              variant="rise"
              className="pointer-events-none absolute right-0 top-0 hidden h-[140px] w-[55%] text-meadow-300/30 md:block"
            />
            <PineTree className="pointer-events-none absolute -bottom-1 right-[6%] hidden h-[130px] w-[56px] text-sherwood-900/50 tree-breathe lg:block" />

            <div className="relative max-w-xl">
              <Eyebrow tone="dark" className="mb-4">
                Talk to us
              </Eyebrow>
              <Display className="text-[27px] text-on-dark sm:text-[33px]">Have questions? Let&apos;s talk.</Display>
              <p className="mt-3 text-[13.5px] leading-[1.75] text-on-dark/80">
                Our team is on WhatsApp and on the phone, {AGENCY.hours.toLowerCase()}. We will help you pick the right
                departure, check dates, or answer anything you need before you book.
              </p>
            </div>
            <div className="relative flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
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
      <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">{children}</div>
    </section>
  );
}

/** The header row on each planning-board card. */
function BoardHead({
  icon,
  kicker,
  title,
  note,
}: {
  icon: 'calendar' | 'sun' | 'sparkle';
  kicker: string;
  title: string;
  note: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-meadow-50 text-meadow-700 ring-1 ring-meadow-300/50">
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-meadow-700">{kicker}</div>
        <div className="font-display text-[20px] font-semibold leading-tight text-text">{title}</div>
      </div>
      <span className="shrink-0 rounded-full bg-surface px-3 py-1.5 text-[11px] font-semibold text-subtle">{note}</span>
    </div>
  );
}

function Grid({ packages, priority = false }: { packages: Awaited<ReturnType<typeof getPackages>>; priority?: boolean }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((pkg, i) => (
        <PackageCard key={pkg.id} pkg={pkg} priority={priority && i < 3} />
      ))}
    </div>
  );
}

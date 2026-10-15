import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { SearchBar } from '@/components/SearchBar';
import { JourneyInFrames } from '@/components/JourneyInFrames';
import { CardRail } from '@/components/CardRail';
import { PackageCard } from '@/components/PackageCard';
import { DestinationMarquee } from '@/components/DestinationMarquee';
import {
  ExperienceCard,
  FaqList,
  PillarCard,
  ReviewCard,
} from '@/components/sections';
import {
  BanyanTree,
  CameraBadge,
  CompassRose,
  FlightPath,
  PineTree,
  SmokePlume,
  SmokeShadow,
  TopoField,
  TreeLine,
  WaveDivider,
} from '@/components/Decor';
import { PencilCamera } from '@/components/PencilCamera';
import { PencilPalm } from '@/components/PencilPalm';
import { PencilBalloon, PencilCouple, PencilPines } from '@/components/PencilDoodles';
import { Button, Display, Icon, SectionHeading, Stars } from '@/components/ui';
import {
  allDestinations,
  DEPARTURE_CITIES,
  destinationsByState,
  durationBuckets,
  packagesForSeason,
  SEASONS,
  themesWithCounts,
} from '@/lib/catalog';
import { AGENCY, ALL_FAQS, PILLARS, REVIEWS } from '@/lib/content';
import { getHost, getPackages, telHref, whatsappLink } from '@/lib/mktours';

export default async function HomePage() {
  const [, packages] = await Promise.all([getHost().catch(() => null), getPackages()]);

  const destinations = allDestinations(packages);
  const byState = destinationsByState(packages);
  const themes = themesWithCounts(packages);
  const durations = durationBuckets(packages);
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);
  const tel = telHref(AGENCY.phonePrimary);

  return (
    <>
      {/* Hero — headline, trust row and the search panel share one viewport */}
      <Hero>
        <SearchBar
          embedded
          states={byState.map((g) => ({ value: g.state, label: g.state }))}
          destinations={destinations.map((d) => ({ value: d.slug, label: d.label }))}
          cities={DEPARTURE_CITIES.map((c) => ({ value: c.slug, label: c.label }))}
        />
      </Hero>

      {/* Top destinations — a mosaic, not a row of medallions */}
      <Section className="relative overflow-hidden" contentClassName="max-w-[1800px] lg:!px-6 xl:!px-8">
        <PencilCamera className="pointer-events-none absolute -right-10 -top-4 hidden w-[200px] rotate-[9deg] opacity-[0.1] sm:block md:w-[250px] lg:-right-14 lg:w-[310px]" />
        <BanyanTree className="pointer-events-none absolute -bottom-10 -left-12 hidden h-[260px] w-[260px] text-azure-700/8 lg:block" />
        <div className="pointer-events-none absolute -left-24 top-20 h-[300px] w-[300px] bloom-cool" />
        <div className="relative">
          <div className="reveal">
            <DestinationMarquee
              destinations={destinations.slice(0, 18)}
              viewAllHref="/destinations"
              viewAllLabel="View all"
            />
          </div>
        </div>
      </Section>

      {/* Who we are — a curved terracotta panel with a photo collage */}
      <section className="relative overflow-hidden bg-clay py-10 text-on-dark lg:py-12">
        <WaveDivider flip className="pointer-events-none absolute inset-x-0 top-0 h-[64px] text-bg" />
        <SmokeShadow className="pointer-events-none absolute -bottom-16 right-0 h-[340px] w-[60%] text-white/15" />
        <PineTree className="pointer-events-none absolute bottom-0 left-[4%] hidden h-[190px] w-[80px] text-azure-900/25 tree-breathe lg:block" />
        <FlightPath
          variant="fall"
          className="pointer-events-none absolute right-0 top-10 hidden h-[150px] w-[55%] text-white/25 lg:block"
        />

        <div className="relative mx-auto grid max-w-[1320px] items-center gap-10 px-5 md:px-8 lg:grid-cols-2 lg:gap-14 lg:px-12">
          <div className="reveal relative">
            {/* Two overlapping prints instead of one flat rectangle */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] shadow-float sm:aspect-[4/3] lg:aspect-[5/5]">
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
            <Display className="display-caps text-[32px] text-on-dark sm:text-[40px] lg:text-[46px]">
              A trusted travel partner for private &amp; group journeys
            </Display>
            <div className="mt-5 space-y-3 text-[14.5px] leading-[1.8] text-on-dark/85">
              <p>
                Since {AGENCY.since} we have taken more than {AGENCY.travellers} travellers out on fixed group
                departures — pilgrimage circuits on the Ganga plain, the Kashmir valleys, the Kerala backwaters and the
                Thar to Jaisalmer.
              </p>
              <p>
                The train is booked as a group, the hotels are held in advance and a tour manager travels with you both
                ways. One price covers the journey, the stays, the meals, local transport and sightseeing; what it does
                not cover is written out on every package page.
              </p>
            </div>

            {/* Three quick facts, as capsules on the warm panel */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                { icon: 'train' as const, label: 'Group rail booking' },
                { icon: 'shield' as const, label: 'Tour manager on board' },
                { icon: 'wallet' as const, label: 'One clear price' },
              ].map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-semibold text-on-dark backdrop-blur-sm"
                >
                  <Icon name={f.icon} className="h-4 w-4 text-vermilion-300" />
                  {f.label}
                </span>
              ))}
            </div>

            <Button href="/about" variant="onDark" className="mt-7">
              Learn more about how we work
            </Button>
          </div>
        </div>

        <TreeLine className="pointer-events-none absolute inset-x-0 bottom-0 h-[70px] text-surface" />
      </section>

      {/* Packages */}
      <section className="relative overflow-hidden bg-surface py-9 lg:py-10">
        <div className="pointer-events-none absolute inset-0 dotfield opacity-50" />
        <TopoField className="pointer-events-none absolute -right-16 top-24 hidden h-[360px] w-[45%] text-azure-700/8 lg:block" />
        <PencilPalm className="pointer-events-none absolute -bottom-10 left-0 hidden w-[160px] -rotate-[8deg] opacity-[0.09] lg:block" />
        <div className="relative mx-auto max-w-[1600px] px-5 md:px-8 lg:px-10">
          {/* The heading rides on a photograph and the cards ride up over its
              foot, so the collection reads as one piece rather than a banner
              with a separate grid beneath it. */}
          <div className="reveal relative">
            <div className="absolute inset-x-0 top-0 h-[250px] overflow-hidden rounded-[1.75rem] bg-azure-900 shadow-lift sm:h-[265px] lg:h-[280px] lg:rounded-[2.25rem]">
              <Image
                src="/images/hero-varanasi.jpg"
                alt=""
                fill
                aria-hidden="true"
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-azure-900/90 via-azure-900/45 to-azure-900/25" />
              <div className="absolute inset-0 bg-gradient-to-r from-azure-900/80 via-azure-900/35 to-transparent" />
            </div>

            <div className="relative px-5 pt-7 sm:px-9 lg:px-12">
              <SectionHeading
                tone="dark"
                title={
                  <>
                    Popular <span className="flourish">tour packages</span>
                  </>
                }
                lede="Every departure below is dated, priced and ready to book."
                link={{ href: '/packages', label: 'View all packages' }}
              />
            </div>

            {/* Cards ride up over the foot of the photograph. */}
            <div className="relative z-10 mt-5 px-5 sm:px-6 lg:px-8">
              <Grid packages={packages} priority />
            </div>
          </div>
        </div>
      </section>

      {/* Browse by duration, season & theme — one planning board */}
      <Section className="relative overflow-hidden">
        <CompassRose className="pointer-events-none absolute -left-20 top-28 hidden h-[260px] w-[260px] text-azure-700/8 xl:block" />
        <SmokePlume
          seed={3}
          className="pointer-events-none absolute -right-6 top-10 hidden h-[260px] w-[200px] text-azure-600/12 lg:block"
        />
        <PencilBalloon className="pointer-events-none absolute -right-8 bottom-10 hidden w-[150px] rotate-[6deg] opacity-[0.08] lg:block" />
        <div className="reveal relative">
          <SectionHeading
            align="center"
            title={
              <>
                Pick a length, a <span className="flourish">season</span>, or a reason
              </>
            }
            lede="Find the trip length and travel window that fits your calendar."
          />
        </div>

        <div className="relative mt-7 grid gap-4 lg:grid-cols-2">
          <div className="reveal card p-5 lg:p-6">
            <BoardHead
              kicker="By duration"
              title="Trip length"
              note={`${durations.length} lengths`}
            />
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {durations.map((d) => (
                <Link
                  key={d.days}
                  href={`/packages?duration=${d.days}`}
                  className="group/d rounded-2xl border border-border bg-bg p-3.5 transition-all duration-300 hover:border-vermilion-300 hover:bg-vermilion-50 hover:shadow-lift"
                >
                  <div className="font-display text-[23px] font-bold leading-none text-azure-700 transition-colors group-hover/d:text-vermilion-700">
                    {d.days}D
                  </div>
                  <div className="mt-1 text-[11.5px] text-muted">{d.nights} nights</div>
                  <div className="text-[11px] text-subtle">
                    {d.count} {d.count === 1 ? 'tour' : 'tours'}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="reveal card p-5 lg:p-6">
            <BoardHead kicker="By season" title="Travel window" note={`${SEASONS.length} seasons`} />
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              {SEASONS.map((s) => {
                const count = packagesForSeason(packages, s.slug).length;
                return (
                  <Link
                    key={s.slug}
                    href={`/packages?season=${s.slug}`}
                    className="group/s rounded-2xl border border-border bg-bg p-3.5 transition-all duration-300 hover:border-vermilion-300 hover:shadow-lift"
                  >
                    <div className="font-display text-[19px] font-semibold leading-tight text-text transition-colors group-hover/s:text-vermilion-700">
                      {s.label}
                    </div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-vermilion-700">
                      {s.window}
                    </div>
                    <div className="mt-1.5 text-[11px] text-muted">
                      {s.note} · {count} {count === 1 ? 'tour' : 'tours'}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Themes */}
        <div className="reveal card mt-4 p-5 lg:p-6">
          <BoardHead kicker="By theme" title="What the trip is for" note={`${themes.length} themes`} />
          <CardRail className="mt-5" itemClassName="w-[230px] sm:w-[250px] lg:w-[265px]" label="Experiences">
            {themes.map((t) => (
              <ExperienceCard key={t.slug} theme={t} />
            ))}
          </CardRail>
        </div>
      </Section>

      {/* Why us — a light panel: the promise in type, the drawing underneath */}
      <section className="relative overflow-hidden bg-surface py-14 lg:py-20">
        <div className="pointer-events-none absolute -left-24 top-10 h-[320px] w-[320px] bloom-cool" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-[300px] w-[300px] bloom-warm" />
        <PencilCouple className="pointer-events-none absolute -left-6 bottom-2 hidden w-[180px] -rotate-[4deg] opacity-[0.09] lg:block" />
        <PencilPines className="pointer-events-none absolute -right-6 top-6 hidden w-[200px] rotate-[3deg] opacity-[0.07] lg:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <div className="reveal text-center">
            <Display className="display-caps mx-auto max-w-3xl text-[30px] sm:text-[38px] lg:text-[44px]">
              Travel the way it was meant to be
            </Display>
            {/* the short rule under the heading, as on the rest of the page */}
            <span className="mx-auto mt-4 block h-[5px] w-[120px] rounded-full bg-vermilion-500" />
            <p className="mx-auto mt-5 max-w-xl text-[14.5px] leading-[1.8] text-muted">
              Four things we settle before you board, so nothing has to be settled on the road.
            </p>
          </div>
          <CardRail
            className="reveal mt-11"
            itemClassName="w-[270px] sm:w-[300px] lg:w-[320px]"
            label="Why MK Tours"
          >
            {PILLARS.map((p) => (
              <PillarCard key={p.title} art={p.icon} title={p.title} text={p.text} />
            ))}
          </CardRail>
        </div>
      </section>

      {/* Reviews */}
      <Section className="relative overflow-hidden">
        <PencilPalm className="pointer-events-none absolute -bottom-12 -left-14 hidden w-[180px] -rotate-[7deg] opacity-[0.07] lg:block" />
        <div className="reveal relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <Display className="display-caps text-[28px] sm:text-[34px] lg:text-[40px]">
              What our <span className="flourish">travellers</span> say
            </Display>
          </div>
          <div className="flex items-center gap-4 rounded-[1.5rem] border border-vermilion-300/70 bg-vermilion-50 px-6 py-4 shadow-soft">
            <span className="font-display text-[34px] font-bold leading-none text-azure-700">4.9</span>
            <span>
              <Stars />
              <span className="mt-1 block text-[11px] font-semibold text-muted">Google rating</span>
            </span>
          </div>
        </div>
        <CardRail className="reveal mt-8" itemClassName="w-[280px] sm:w-[320px] lg:w-[340px]" label="Reviews">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.name} {...r} />
          ))}
        </CardRail>
        <div className="reveal mt-9 text-center">
          <Button href="/reviews" variant="outline">
            Read all reviews
          </Button>
        </div>
      </Section>

      {/* Journey in frames — a horizontal filmstrip of destination photography */}
      <Section tone="surface" className="relative overflow-hidden" contentClassName="max-w-none !px-0">
        <div className="reveal mx-auto max-w-[1320px] px-5 text-center md:px-8 lg:px-12">
          <Display className="display-caps text-[30px] uppercase tracking-[0.02em] sm:text-[38px] lg:text-[44px]">
            Journey in frames
          </Display>
          <span className="mx-auto mt-4 block h-[5px] w-[120px] rounded-full bg-vermilion-500" />
          <p className="mt-5 text-[15px] text-muted">Pictures perfect moments</p>
        </div>
        {/* The strip runs the full width of the section, not the text column. */}
        <div className="reveal mt-10">
          <JourneyInFrames items={destinations.slice(0, 12).map((d) => ({ src: d.image, label: d.state }))} />
        </div>
      </Section>

      {/* FAQ — heading on the left, accordion cards on the right */}
      <Section className="relative overflow-hidden">
        <PencilCamera className="pointer-events-none absolute -left-16 top-24 hidden w-[240px] -rotate-[10deg] opacity-[0.08] xl:block" />
        <div className="pointer-events-none absolute -right-20 top-10 h-[300px] w-[300px] bloom-warm" />
        <div className="relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div className="reveal lg:sticky lg:top-28 lg:self-start">
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
                className="group/l inline-flex items-center gap-2 rounded-full border border-border-strong bg-raised px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.12em] text-text shadow-soft transition-all hover:border-azure-700 hover:bg-azure-800 hover:text-on-dark"
              >
                All {ALL_FAQS.length} questions
                <span className="">→</span>
              </Link>
            </div>
            <CameraBadge className="pointer-events-none mt-8 hidden h-[150px] w-[180px] text-azure-700/12 lg:block" />
          </div>
          <div className="reveal">
            <FaqList items={ALL_FAQS.slice(0, 5)} />
          </div>
        </div>
      </Section>

      {/* Talk to us */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <div className="reveal relative flex flex-col gap-8 overflow-hidden rounded-[2.25rem] bg-azure-800 px-7 py-12 text-on-dark shadow-float sm:px-12 lg:flex-row lg:items-center lg:justify-between">
            <SmokeShadow className="pointer-events-none absolute -bottom-10 -left-10 h-[260px] w-[60%] text-azure-500/25" />
            <FlightPath
              variant="rise"
              className="pointer-events-none absolute right-0 top-0 hidden h-[140px] w-[55%] text-vermilion-300/30 md:block"
            />
            <PineTree className="pointer-events-none absolute -bottom-1 right-[6%] hidden h-[130px] w-[56px] text-azure-900/50 tree-breathe lg:block" />

            <div className="relative max-w-xl">
              <Display className="text-[27px] text-on-dark sm:text-[33px]">Have questions? Let&apos;s talk.</Display>
              <p className="mt-3 text-[13.5px] leading-[1.75] text-on-dark/80">
                Our team is on WhatsApp and on the phone, {AGENCY.hours.toLowerCase()}. We will help you pick the right
                departure, check dates, or answer anything you need before you book.
              </p>
            </div>
            <div className="relative flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              {wa && (
                <Button href={wa} external variant="accent">
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
  dark: 'bg-azure-900 text-on-dark',
  warm: 'bg-clay text-on-dark',
} as const;

function Section({
  children,
  tone = 'light',
  className = '',
  contentClassName = 'max-w-[1320px]',
}: {
  children: React.ReactNode;
  tone?: keyof typeof SECTION_TONES;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section className={`${SECTION_TONES[tone]} py-12 lg:py-16 ${className}`}>
      <div className={`mx-auto px-5 md:px-8 lg:px-12 ${contentClassName}`}>{children}</div>
    </section>
  );
}

/** The header row on each planning-board card. */
function BoardHead({
  kicker,
  title,
  note,
}: {
  kicker: string;
  title: string;
  note: string;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <div className="flex-1">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-vermilion-700">{kicker}</div>
        <div className="font-display text-[19px] font-semibold leading-tight text-text">{title}</div>
      </div>
      <span className="shrink-0 rounded-full bg-surface px-3 py-1.5 text-[11px] font-semibold text-subtle">{note}</span>
    </div>
  );
}

function Grid({ packages, priority = false }: { packages: Awaited<ReturnType<typeof getPackages>>; priority?: boolean }) {
  return (
    <CardRail label="Tour packages" itemClassName="w-[240px] sm:w-[260px] lg:w-[280px]">
      {packages.map((pkg, i) => (
        <PackageCard key={pkg.id} pkg={pkg} priority={priority && i < 3} />
      ))}
    </CardRail>
  );
}

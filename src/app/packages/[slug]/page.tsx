import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CardRail } from '@/components/CardRail';
import { JourneyInFrames } from '@/components/JourneyInFrames';
import { PACKAGE_ITEM, PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { FaqList, ReviewCard } from '@/components/sections';
import { ItineraryAccordion, ReadMore, TourTabs } from '@/components/TourDetail';
import { Button, Display, Icon, Stars } from '@/components/ui';
import { PineTree, SmokeShadow, TopoField } from '@/components/Decor';
import {
  DESTINATIONS,
  destinationFor,
  longDuration,
  packageDestinations,
  seasonsForPackage,
  SEASONS,
} from '@/lib/catalog';
import { AGENCY, FAQS, REVIEWS } from '@/lib/content';
import {
  durationPhrase,
  formatINR,
  getPackages,
  getTour,
  mediaUrl,
  phoneNumbers,
  plainText,
  startingPrice,
  telHref,
  whatsappLink,
  type Package,
} from '@/lib/mktours';

export const dynamicParams = true;

export async function generateStaticParams() {
  const packages = await getPackages().catch(() => []);
  return packages.map((p) => ({ slug: p.slug ?? p.id }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug).catch(() => null);
  if (!tour) return { title: 'Tour not found' };
  const from = startingPrice(tour.pkg);
  return {
    title: tour.pkg.package_name,
    description:
      plainText(tour.pkg.highlights, 150) ||
      `${durationPhrase(tour.pkg)} fixed-departure group tour from Mumbai${from ? `, from ${formatINR(from)} per person` : ''}.`,
  };
}

export default async function TourPage({ params }: Props) {
  const { slug } = await params;
  const [tour, allPackages] = await Promise.all([getTour(slug).catch(() => null), getPackages().catch(() => [])]);
  if (!tour) notFound();

  const { pkg, days } = tour;
  const places = packageDestinations(pkg).map((s) => destinationFor(s));
  const hero = places.find((p) => DESTINATIONS[p.slug])?.image ?? '/images/hero-varanasi.jpg';
  const from = startingPrice(pkg);
  const brochure = mediaUrl(pkg.package_pdf);
  const poster = mediaUrl(pkg.whatsapp_banner_image) ?? mediaUrl(pkg.banner_image);
  const phones = phoneNumbers(pkg.contact_phone).length
    ? phoneNumbers(pkg.contact_phone)
    : [AGENCY.phonePrimary, AGENCY.phoneSecondary];
  const wa = whatsappLink(
    AGENCY.whatsapp,
    `Hi ${AGENCY.name}, I'd like to book ${pkg.package_name}${pkg.package_code ? ` (${pkg.package_code})` : ''}.`,
  );
  const seasons = seasonsForPackage(pkg)
    .filter((s) => s !== 'year-round')
    .map((s) => SEASONS.find((x) => x.slug === s))
    .filter(Boolean);

  const has = (html: string | null | undefined) =>
    Boolean(html && html.trim() && html.trim() !== '<h3><br></h3>');

  // "Other info" collects the policy prose that a traveller reads once, at the
  // end — keeping it out of the main flow is what stops the page running long.
  const otherInfo = (
    [
      { id: 'payment', title: 'Payment Policy', icon: 'wallet', html: pkg.payment_policy },
      { id: 'cancellation', title: 'Cancellation Policy', icon: 'shield', html: pkg.cancellation_policy },
      { id: 'terms', title: 'Terms & Conditions', icon: 'book', html: pkg.terms_and_conditions },
    ] as const
  ).filter((s) => has(s.html));

  const hasOverview = has(pkg.description) || has(pkg.highlights);

  // The sticky band only lists sections this particular tour actually has.
  const tabs = [
    ...(hasOverview ? [{ id: 'overview', label: 'Overview & Highlights' }] : []),
    ...(days.length > 0 ? [{ id: 'itinerary', label: 'Itinerary' }] : []),
    ...(has(pkg.inclusions) ? [{ id: 'inclusions', label: 'Inclusions' }] : []),
    ...(has(pkg.exclusions) ? [{ id: 'exclusions', label: 'Exclusions' }] : []),
    ...(otherInfo.length > 0 ? [{ id: 'other-info', label: 'Other Info' }] : []),
    { id: 'faq', label: 'FAQs' },
    { id: 'reviews', label: 'Reviews' },
  ];

  // Quick facts, the row of bordered tiles under the banner.
  const facts = [
    { icon: 'train' as const, label: 'Pickup & Drop', value: 'Mumbai — Mumbai' },
    { icon: 'calendar' as const, label: 'Duration', value: longDuration(pkg) },
    ...(places.length > 0
      ? [
          {
            icon: 'pin' as const,
            label: 'Destinations',
            value: places.map((p) => p.label).join(' · '),
          },
        ]
      : []),
    ...(pkg.package_code ? [{ icon: 'check' as const, label: 'Tour Code', value: pkg.package_code }] : []),
  ];

  // Prefer departures that share a destination, then fill the row with others.
  const others = allPackages.filter((p) => p.id !== pkg.id);
  const sharesPlace = (p: Package) => packageDestinations(p).some((s) => places.some((pl) => pl.slug === s));
  const related = [...others.filter(sharesPlace), ...others.filter((p) => !sharesPlace(p))].slice(0, 3);

  const frames = places
    .filter((p) => DESTINATIONS[p.slug])
    .map((p) => ({ src: p.image, label: p.state }));

  return (
    <>
      <PageHero
        image={hero}
        title={pkg.package_name}
        crumbs={[{ href: '/packages', label: 'Tour Packages' }, { label: pkg.package_name }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          {wa && (
            <Button href={wa} external variant="accent">
              Request a callback
            </Button>
          )}
          {brochure && (
            <a
              href={brochure}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 text-[11.5px] font-bold uppercase tracking-[0.14em] text-on-dark backdrop-blur-md transition-colors duration-300 hover:border-white/70 hover:bg-white/20"
            >
              <Icon name="book" className="h-4 w-4" />
              Download itinerary
            </a>
          )}
        </div>
      </PageHero>

      {/* No `overflow-hidden` on this wrapper: it would become the containing
          block for the sticky section band below and stop it from sticking.
          The decoration is clipped by its own layer instead. */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <TopoField className="absolute -left-12 top-[28%] hidden h-[320px] w-[34%] text-azure-700/8 xl:block" />
        </div>

        <div className="relative mx-auto max-w-[1320px] px-5 pt-8 md:px-8 lg:px-12">
          {/* Quick facts */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div
                key={f.label}
                className="flex items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-raised text-vermilion-700 ring-1 ring-border">
                  <Icon name={f.icon} className="h-[17px] w-[17px]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-subtle">
                    {f.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[13.5px] font-bold text-text">{f.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* The sticky section band is a direct child of the full-height page
            wrapper on purpose: a sticky element can only travel inside its own
            parent, so boxing it in a short container would let it scroll away
            with the quick facts instead of pinning under the header. */}
        <TourTabs items={tabs} />

        <div className="relative mx-auto max-w-[1320px] px-5 pb-10 pt-8 md:px-8 lg:px-12 lg:pb-14">
          <div className="grid gap-12 lg:grid-cols-[1fr_390px] lg:gap-12">
            {/* Main column */}
            <div className="min-w-0 space-y-6">
              {/* Overview & highlights */}
              {hasOverview && (
                <section id="overview" className="card scroll-mt-[170px] p-7 sm:p-9">
                  <SectionTitle icon="book">Overview &amp; Highlights</SectionTitle>
                  {places.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {places.map((p) => (
                        <Link
                          key={p.slug}
                          href={`/destinations/${p.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3.5 py-1.5 text-[12px] font-semibold text-text transition-all duration-300 hover:border-vermilion-300 hover:bg-vermilion-50 hover:text-vermilion-700"
                        >
                          <Icon name="pin" className="h-3 w-3 text-vermilion-600" />
                          {p.label}
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="mt-5">
                    <ReadMore html={[pkg.description, pkg.highlights].filter((h) => has(h)).join('')} />
                  </div>
                </section>
              )}

              {/* Itinerary */}
              {days.length > 0 && (
                <section
                  id="itinerary"
                  className="card relative overflow-hidden scroll-mt-[170px] p-7 sm:p-9"
                >
                  <PineTree className="pointer-events-none absolute -bottom-3 right-4 hidden h-[160px] w-[70px] text-azure-700/8 tree-breathe sm:block" />
                  <div className="relative">
                    <SectionTitle icon="compass">Day-by-Day Itinerary</SectionTitle>
                    <div className="mt-6">
                      <ItineraryAccordion days={days} />
                    </div>
                    {brochure && (
                      <a
                        href={brochure}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-7 inline-flex items-center gap-2 rounded-full border border-vermilion-300 bg-vermilion-50 px-5 py-2.5 text-[12px] font-bold text-vermilion-800 transition-colors hover:bg-vermilion-100"
                      >
                        <Icon name="book" className="h-4 w-4" />
                        Download the full itinerary (PDF)
                      </a>
                    )}
                  </div>
                </section>
              )}

              {/* Inclusions / exclusions, side by side like a checklist */}
              {(has(pkg.inclusions) || has(pkg.exclusions)) && (
                <div className="grid gap-6 xl:grid-cols-2">
                  {has(pkg.inclusions) && (
                    <section id="inclusions" className="card scroll-mt-[170px] p-7 sm:p-8">
                      <SectionTitle icon="check">Inclusions</SectionTitle>
                      <div
                        className="rich-text tick-list mt-4 text-[14px] text-muted"
                        data-tone="in"
                        dangerouslySetInnerHTML={{ __html: pkg.inclusions ?? '' }}
                      />
                    </section>
                  )}
                  {has(pkg.exclusions) && (
                    <section id="exclusions" className="card scroll-mt-[170px] p-7 sm:p-8">
                      <SectionTitle icon="arrow">Exclusions</SectionTitle>
                      <div
                        className="rich-text tick-list mt-4 text-[14px] text-muted"
                        data-tone="out"
                        dangerouslySetInnerHTML={{ __html: pkg.exclusions ?? '' }}
                      />
                    </section>
                  )}
                </div>
              )}

              {/* Other info — the policies, folded away */}
              {otherInfo.length > 0 && (
                <section id="other-info" className="card scroll-mt-[170px] p-7 sm:p-9">
                  <SectionTitle icon="shield">Other Info</SectionTitle>
                  <div className="mt-5 grid gap-3">
                    {otherInfo.map((s) => (
                      <details
                        key={s.id}
                        id={s.id}
                        className="group/info scroll-mt-[170px] overflow-hidden rounded-2xl border border-border bg-surface transition-colors open:bg-raised"
                      >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
                          <span className="flex items-center gap-3">
                            <Icon name={s.icon} className="h-[17px] w-[17px] text-vermilion-700" />
                            <span className="font-display text-[16px] font-semibold text-text">{s.title}</span>
                          </span>
                          <span
                            aria-hidden="true"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-[11px] text-muted transition-transform duration-300 group-open/info:rotate-180"
                          >
                            ▾
                          </span>
                        </summary>
                        <div
                          className="rich-text border-t border-border px-5 pb-5 pt-4 text-[13.5px] text-muted"
                          dangerouslySetInnerHTML={{ __html: s.html ?? '' }}
                        />
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {/* Tour poster from the CRM, if the agency uploaded one */}
              {poster && (
                <section className="card p-7 sm:p-9">
                  <SectionTitle icon="camera">Tour Flyer</SectionTitle>
                  <div className="mt-5 flex justify-center overflow-hidden rounded-[1.25rem] border border-border bg-surface shadow-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={poster}
                      alt={`${pkg.package_name} flyer`}
                      loading="lazy"
                      className="max-h-[32rem] w-auto max-w-full object-contain"
                    />
                  </div>
                </section>
              )}

              {/* FAQ */}
              <section id="faq" className="scroll-mt-[170px]">
                <div className="card p-7 sm:p-9">
                  <SectionTitle icon="sparkle">Before You Book</SectionTitle>
                  <div className="mt-6">
                    <FaqList items={[...FAQS[0].items.slice(0, 3), ...FAQS[1].items.slice(0, 3)]} />
                  </div>
                </div>
              </section>
            </div>

            {/* Booking rail */}
            <aside className="lg:sticky lg:top-[176px] lg:self-start">
              <div
                id="book"
                className="relative overflow-hidden rounded-[1.75rem] border border-border bg-raised p-6 shadow-float scroll-mt-28"
              >
                {/* A vermilion cap across the top of the rail. */}
                <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-vermilion-400 via-vermilion-500 to-clay" />

                {from !== null && (
                  <div className="pt-2">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-vermilion-700">
                      Starting from
                    </span>
                    <div className="mt-1.5 flex items-baseline gap-1.5">
                      <span className="font-display text-[36px] font-bold leading-none text-azure-700">
                        {formatINR(from)}
                      </span>
                      <span className="text-[12px] text-muted">/ person</span>
                    </div>
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <Stars />
                  <span className="text-[11.5px] text-muted">Fixed departure · tour manager included</span>
                </div>

                <div className="mt-5 flex flex-col gap-2.5">
                  {wa && (
                    <Button href={wa} external variant="accent" className="w-full">
                      Book now
                    </Button>
                  )}
                  {phones[0] && (
                    <Button href={telHref(phones[0]) ?? '#'} external variant="outline" className="w-full">
                      Call +91 {phones[0]}
                    </Button>
                  )}
                  {brochure && (
                    <a
                      href={brochure}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center justify-center gap-2 text-center text-[12.5px] font-bold text-vermilion-700 underline-offset-4 hover:underline"
                    >
                      <Icon name="book" className="h-4 w-4" />
                      Download the brochure (PDF)
                    </a>
                  )}
                </div>

                {(pkg.pricing ?? []).length > 0 && (
                  <div className="mt-6">
                    <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">
                      Price options
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-border">
                      {(pkg.pricing ?? []).map((o, i) => (
                        <div
                          key={o.label}
                          className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-vermilion-50 ${
                            i % 2 === 1 ? 'bg-surface/60' : ''
                          }`}
                        >
                          <span className="text-[12.5px] leading-snug text-muted">{o.label}</span>
                          <span className="shrink-0 font-display text-[18px] font-bold text-azure-700">
                            {formatINR(o.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2.5 text-[11px] leading-relaxed text-subtle">
                      SL is sleeper class, 3AC is three-tier air-conditioned. Sharing is per room.
                    </p>
                  </div>
                )}

                <div className="mt-6 space-y-2.5 rounded-2xl bg-surface p-4 text-[12px] text-muted">
                  <Fact icon="train" text="Group rail booking from Mumbai, Pune boarding available" />
                  <Fact icon="home" text="Hotels on twin or triple sharing, held in advance" />
                  <Fact icon="shield" text="Tour manager with the group throughout" />
                  <Fact icon="phone" text={`Support ${AGENCY.hours.toLowerCase()}`} />
                </div>

                {seasons.length > 0 && (
                  <div className="mt-6">
                    <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">
                      Best season
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {seasons.map((s) => (
                        <span
                          key={s!.slug}
                          className="inline-flex items-center gap-1.5 rounded-full border border-vermilion-300/70 bg-vermilion-50 px-3 py-1.5 text-[11.5px] font-semibold text-vermilion-800"
                        >
                          <Icon name="sun" className="h-3.5 w-3.5" />
                          {s!.label} · {s!.window}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>

        {/* Travellers */}
        <section id="reviews" className="relative scroll-mt-[170px] bg-surface py-16 lg:py-20">
          <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
            <Display className="display-caps text-[27px] sm:text-[33px]">
              Hear from travellers like you
            </Display>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {REVIEWS.slice(0, 3).map((r) => (
                <ReviewCard key={r.name} {...r} />
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        {frames.length > 1 && (
          <section className="py-16 lg:py-20">
            <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-vermilion-700">
                Journey in frames
              </span>
              <Display className="display-caps mt-2 text-[27px] sm:text-[33px]">
                Picture-perfect moments
              </Display>
            </div>
            <div className="mt-8">
              <JourneyInFrames items={frames} surfaceClass="bg-bg" />
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div className="relative mx-auto max-w-[1320px] px-5 pb-16 md:px-8 lg:px-12 lg:pb-20">
            <section className="relative overflow-hidden">
              <SmokeShadow className="pointer-events-none absolute -right-10 -top-10 h-[280px] w-[50%] text-azure-600/10" />
              <div className="relative">
                <Display className="display-caps text-[27px] sm:text-[33px]">
                  Other departures you might like
                </Display>
                <CardRail className="mt-8" itemClassName={PACKAGE_ITEM} label="Other departures">
                  {related.map((p: Package) => (
                    <PackageCard key={p.id} pkg={p} />
                  ))}
                </CardRail>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

/** A section title with its icon roundel, used down the main column. */
function SectionTitle({
  icon,
  children,
}: {
  icon: 'book' | 'compass' | 'sparkle' | 'check' | 'arrow' | 'wallet' | 'shield' | 'camera';
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-vermilion-50 text-vermilion-700 ring-1 ring-vermilion-300/50">
        <Icon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <Display className="text-[24px]">{children}</Display>
    </div>
  );
}

function Fact({ icon, text }: { icon: 'train' | 'home' | 'shield' | 'phone'; text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon name={icon} className="mt-0.5 h-4 w-4 shrink-0 text-vermilion-700" />
      <span className="leading-snug">{text}</span>
    </div>
  );
}

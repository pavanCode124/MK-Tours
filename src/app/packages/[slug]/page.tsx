import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { FaqList } from '@/components/sections';
import { Button, Display, Eyebrow, Icon, Stars } from '@/components/ui';
import { FlightTag, PineTree, SmokeShadow, TopoField } from '@/components/Decor';
import { DESTINATIONS, destinationFor, longDuration, packageDestinations, seasonsForPackage, SEASONS } from '@/lib/catalog';
import { AGENCY, FAQS } from '@/lib/content';
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
  type TourDay,
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

  const sections = (
    [
      { id: 'highlights', title: 'Tour Highlights', icon: 'sparkle', html: pkg.highlights },
      { id: 'inclusions', title: "What's Included", icon: 'check', html: pkg.inclusions },
      { id: 'exclusions', title: "What's Not Included", icon: 'arrow', html: pkg.exclusions },
      { id: 'payment', title: 'Payment Policy', icon: 'wallet', html: pkg.payment_policy },
      { id: 'cancellation', title: 'Cancellation Policy', icon: 'shield', html: pkg.cancellation_policy },
      { id: 'terms', title: 'Terms & Conditions', icon: 'book', html: pkg.terms_and_conditions },
    ] as const
  ).filter((s) => s.html && s.html.trim() && s.html.trim() !== '<h3><br></h3>');

  // Prefer departures that share a destination, then fill the row with others.
  const others = allPackages.filter((p) => p.id !== pkg.id);
  const sharesPlace = (p: Package) => packageDestinations(p).some((s) => places.some((pl) => pl.slug === s));
  const related = [...others.filter(sharesPlace), ...others.filter((p) => !sharesPlace(p))].slice(0, 3);

  return (
    <>
      <PageHero
        image={hero}
        eyebrow={places[0]?.state ?? 'India'}
        title={pkg.package_name}
        crumbs={[{ href: '/packages', label: 'Tour Packages' }, { label: pkg.package_name }]}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          {[
            { icon: 'calendar' as const, text: longDuration(pkg) },
            ...(places.length > 0
              ? [
                  {
                    icon: 'pin' as const,
                    text: `${places.length} ${places.length === 1 ? 'destination' : 'destinations'}`,
                  },
                ]
              : []),
            { icon: 'train' as const, text: 'Departs Mumbai' },
            ...(pkg.package_code ? [{ icon: 'check' as const, text: `Code ${pkg.package_code}` }] : []),
          ].map((f) => (
            <span
              key={f.text}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-azure-900/40 px-3.5 py-2 text-[12px] font-semibold text-on-dark backdrop-blur-md"
            >
              <Icon name={f.icon} className="h-4 w-4 text-vermilion-300" />
              {f.text}
            </span>
          ))}
        </div>
      </PageHero>

      <div className="relative overflow-hidden">
        <TopoField className="pointer-events-none absolute -left-12 top-[28%] hidden h-[320px] w-[34%] text-azure-700/8 xl:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_390px] lg:gap-12">
            {/* Main column */}
            <div className="min-w-0 space-y-6">
              {/* Places visited */}
              {places.length > 0 && (
                <section className="card p-7">
                  <Eyebrow className="mb-4">Places on this route</Eyebrow>
                  <div className="flex flex-wrap gap-2.5">
                    {places.map((p) => (
                      <Link
                        key={p.slug}
                        href={`/destinations/${p.slug}`}
                        className="group/p inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2.5 text-[12.5px] font-semibold text-text transition-all duration-300 hover:-translate-y-0.5 hover:border-vermilion-300 hover:bg-vermilion-50 hover:text-vermilion-700 hover:shadow-soft"
                      >
                        <Icon name="pin" className="h-3.5 w-3.5 text-vermilion-600" />
                        {p.label}
                        <span className="text-subtle">· {p.state}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Overview */}
              {pkg.description && plainText(pkg.description).length > 0 && (
                <section className="card p-7 sm:p-9">
                  <SectionTitle icon="book">Overview</SectionTitle>
                  <div
                    className="rich-text mt-4 text-[14.5px] text-muted"
                    dangerouslySetInnerHTML={{ __html: pkg.description }}
                  />
                </section>
              )}

              {/* Itinerary */}
              {days.length > 0 && (
                <section id="itinerary" className="card relative overflow-hidden scroll-mt-28 p-7 sm:p-9">
                  <PineTree className="pointer-events-none absolute -bottom-3 right-4 hidden h-[160px] w-[70px] text-azure-700/8 tree-breathe sm:block" />
                  <div className="relative">
                    <SectionTitle icon="compass">Day-by-Day Itinerary</SectionTitle>
                    <ol className="mt-7 space-y-0">
                      {days.map((d, i) => (
                        <DayRow key={d.id} day={d} last={i === days.length - 1} />
                      ))}
                    </ol>
                  </div>
                </section>
              )}

              {/* CRM-authored sections */}
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="card scroll-mt-28 p-7 sm:p-9">
                  <SectionTitle icon={s.icon}>{s.title}</SectionTitle>
                  <div
                    className="rich-text mt-4 text-[14.5px] text-muted"
                    dangerouslySetInnerHTML={{ __html: s.html ?? '' }}
                  />
                </section>
              ))}

              {/* Tour poster from the CRM, if the agency uploaded one */}
              {poster && (
                <section className="card p-7 sm:p-9">
                  <SectionTitle icon="camera">Tour Flyer</SectionTitle>
                  <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-border bg-surface shadow-soft">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={poster} alt={`${pkg.package_name} flyer`} loading="lazy" className="w-full" />
                  </div>
                </section>
              )}

              {/* FAQ */}
              <section id="faq" className="scroll-mt-28">
                <div className="card p-7 sm:p-9">
                  <SectionTitle icon="sparkle">Before You Book</SectionTitle>
                  <div className="mt-6">
                    <FaqList items={[...FAQS[0].items.slice(0, 3), ...FAQS[1].items.slice(0, 3)]} />
                  </div>
                </div>
              </section>
            </div>

            {/* Booking rail */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
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

                <FlightTag
                  from="Mumbai"
                  to={places[0]?.label ?? 'India'}
                  note={durationPhrase(pkg) || undefined}
                  className="mt-5 w-full justify-between"
                />

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

                <div className="mt-6 flex flex-col gap-2.5">
                  {wa && (
                    <Button href={wa} external variant="accent" className="w-full">
                      Book on WhatsApp
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

                {/* Jump links */}
                <nav className="mt-6 border-t border-border pt-5">
                  <div className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">On this page</div>
                  <div className="space-y-1 text-[12.5px]">
                    {days.length > 0 && <JumpLink href="#itinerary">Day-by-day itinerary</JumpLink>}
                    {sections.map((s) => (
                      <JumpLink key={s.id} href={`#${s.id}`}>
                        {s.title}
                      </JumpLink>
                    ))}
                    <JumpLink href="#faq">Before you book</JumpLink>
                  </div>
                </nav>
              </div>
            </aside>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="relative mt-20 overflow-hidden">
              <SmokeShadow className="pointer-events-none absolute -right-10 -top-10 h-[280px] w-[50%] text-azure-600/10" />
              <div className="relative">
                <Eyebrow className="mb-4">Keep looking</Eyebrow>
                <Display className="display-caps text-[27px] sm:text-[33px]">
                  Other departures you might like
                </Display>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((p: Package) => (
                    <PackageCard key={p.id} pkg={p} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
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

function JumpLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group/j flex items-center gap-2 rounded-lg px-2 py-1.5 text-muted transition-colors hover:bg-vermilion-50 hover:text-vermilion-700"
    >
      <span className="h-px w-2 bg-border-strong transition-all duration-300 group-hover/j:w-4 group-hover/j:bg-vermilion-500" />
      {children}
    </a>
  );
}

function DayRow({ day, last }: { day: TourDay; last: boolean }) {
  const points = day.sightseeing?.description_points ?? '';
  const place = [day.sightseeing?.city, day.sightseeing?.country].filter(Boolean).join(', ');
  return (
    <li className={`relative pl-12 ${last ? 'pb-0' : 'pb-9'}`}>
      {/* The connector line runs behind the day badge, stopping at the last day. */}
      {!last && <span className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px bg-border" />}
      <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-2xl bg-azure-800 font-display text-[15px] font-bold text-vermilion-300 shadow-soft">
        {day.day_num}
      </span>
      <div className="flex flex-wrap items-baseline gap-x-3 pt-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-vermilion-700">Day {day.day_num}</span>
        {place && (
          <span className="inline-flex items-center gap-1 text-[11px] text-subtle">
            <Icon name="pin" className="h-3 w-3" />
            {place}
          </span>
        )}
      </div>
      <h3 className="mt-1 font-display text-[19px] font-semibold leading-snug text-text">
        {day.title || day.sightseeing?.activity || `Day ${day.day_num}`}
      </h3>
      {points && (
        <div className="rich-text mt-2 text-[13.5px] text-muted" dangerouslySetInnerHTML={{ __html: points }} />
      )}
    </li>
  );
}

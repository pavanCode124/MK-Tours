import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { FaqList } from '@/components/sections';
import { Button, Display, Eyebrow, Icon, Stars } from '@/components/ui';
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
      { id: 'highlights', title: 'Tour Highlights', html: pkg.highlights },
      { id: 'inclusions', title: "What's Included", html: pkg.inclusions },
      { id: 'exclusions', title: "What's Not Included", html: pkg.exclusions },
      { id: 'payment', title: 'Payment Policy', html: pkg.payment_policy },
      { id: 'cancellation', title: 'Cancellation Policy', html: pkg.cancellation_policy },
      { id: 'terms', title: 'Terms & Conditions', html: pkg.terms_and_conditions },
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
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[12.5px] text-on-dark/85">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="calendar" className="h-4 w-4" />
            {longDuration(pkg)}
          </span>
          {places.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="pin" className="h-4 w-4" />
              {places.length} {places.length === 1 ? 'destination' : 'destinations'}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Icon name="train" className="h-4 w-4" />
            Departs Mumbai
          </span>
          {pkg.package_code && (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="check" className="h-4 w-4" />
              Code {pkg.package_code}
            </span>
          )}
        </div>
      </PageHero>

      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-14">
          {/* Main column */}
          <div className="min-w-0">
            {/* Places visited */}
            {places.length > 0 && (
              <section>
                <Eyebrow className="mb-3">Places on this route</Eyebrow>
                <div className="flex flex-wrap gap-2">
                  {places.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/destinations/${p.slug}`}
                      className="rounded-xl border border-border-strong bg-raised px-3.5 py-2 text-[12.5px] text-text transition-colors hover:border-sherwood-800 hover:text-sherwood-800"
                    >
                      {p.label}
                      <span className="text-subtle"> · {p.state}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Overview */}
            {pkg.description && plainText(pkg.description).length > 0 && (
              <section className="mt-10">
                <Display className="text-[26px]">Overview</Display>
                <div
                  className="rich-text mt-4 text-[14.5px] text-muted"
                  dangerouslySetInnerHTML={{ __html: pkg.description }}
                />
              </section>
            )}

            {/* Itinerary */}
            {days.length > 0 && (
              <section id="itinerary" className="mt-12 scroll-mt-28">
                <Display className="text-[26px]">Day-by-Day Itinerary</Display>
                <ol className="mt-6 space-y-0 border-l border-border pl-0">
                  {days.map((d, i) => (
                    <DayRow key={d.id} day={d} last={i === days.length - 1} />
                  ))}
                </ol>
              </section>
            )}

            {/* CRM-authored sections */}
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="mt-12 scroll-mt-28 border-t border-border pt-10">
                <Display className="text-[26px]">{s.title}</Display>
                <div
                  className="rich-text mt-4 text-[14.5px] text-muted"
                  dangerouslySetInnerHTML={{ __html: s.html ?? '' }}
                />
              </section>
            ))}

            {/* Tour poster from the CRM, if the agency uploaded one */}
            {poster && (
              <section className="mt-12 border-t border-border pt-10">
                <Display className="text-[26px]">Tour Flyer</Display>
                <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-surface">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={poster} alt={`${pkg.package_name} flyer`} loading="lazy" className="w-full" />
                </div>
              </section>
            )}

            {/* FAQ */}
            <section id="faq" className="mt-12 scroll-mt-28 border-t border-border pt-10">
              <Display className="text-[26px]">Before You Book</Display>
              <div className="mt-5">
                <FaqList items={[...FAQS[0].items.slice(0, 3), ...FAQS[1].items.slice(0, 3)]} />
              </div>
            </section>
          </div>

          {/* Booking rail */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div id="book" className="scroll-mt-28 rounded-2xl border border-border bg-raised p-6 shadow-[0_8px_28px_rgba(48,44,37,.1)]">
              {from !== null && (
                <>
                  <span className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-subtle">
                    Starting from
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-display text-[36px] font-semibold leading-none text-sherwood-800">
                      {formatINR(from)}
                    </span>
                    <span className="text-[12px] text-muted">/ person</span>
                  </div>
                </>
              )}
              <div className="mt-3 flex items-center gap-2">
                <Stars />
                <span className="text-[11.5px] text-muted">Fixed departure · tour manager included</span>
              </div>

              {(pkg.pricing ?? []).length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">
                    Price options
                  </div>
                  <div className="divide-y divide-border rounded-xl border border-border">
                    {(pkg.pricing ?? []).map((o) => (
                      <div key={o.label} className="flex items-center justify-between gap-4 px-4 py-3">
                        <span className="text-[12.5px] leading-snug text-muted">{o.label}</span>
                        <span className="shrink-0 font-display text-[18px] font-semibold text-sherwood-800">
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
                  <Button href={wa} external variant="meadow" className="w-full">
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
                    className="mt-1 text-center text-[12.5px] font-medium text-meadow-700 underline-offset-4 hover:underline"
                  >
                    Download the brochure (PDF)
                  </a>
                )}
              </div>

              <div className="mt-6 space-y-2 border-t border-border pt-5 text-[12px] text-muted">
                <Fact icon="train" text="Group rail booking from Mumbai, Pune boarding available" />
                <Fact icon="home" text="Hotels on twin or triple sharing, held in advance" />
                <Fact icon="shield" text="Tour manager with the group throughout" />
                <Fact icon="phone" text={`Support ${AGENCY.hours.toLowerCase()}`} />
              </div>

              {seasons.length > 0 && (
                <div className="mt-6 border-t border-border pt-5">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">Best season</div>
                  <div className="flex flex-wrap gap-2">
                    {seasons.map((s) => (
                      <span key={s!.slug} className={`rounded-xl border px-3 py-1.5 text-[11.5px] ${s!.tone}`}>
                        {s!.label} · {s!.window}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Jump links */}
              <nav className="mt-6 space-y-1.5 border-t border-border pt-5 text-[12.5px]">
                {days.length > 0 && <JumpLink href="#itinerary">Day-by-day itinerary</JumpLink>}
                {sections.map((s) => (
                  <JumpLink key={s.id} href={`#${s.id}`}>
                    {s.title}
                  </JumpLink>
                ))}
                <JumpLink href="#faq">Before you book</JumpLink>
              </nav>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <Display className="text-[26px]">Other Departures You Might Like</Display>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p: Package) => (
                <PackageCard key={p.id} pkg={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Fact({ icon, text }: { icon: 'train' | 'home' | 'shield' | 'phone'; text: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon name={icon} className="mt-0.5 h-4 w-4 shrink-0 text-meadow-700" />
      <span className="leading-snug">{text}</span>
    </div>
  );
}

function JumpLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="block text-muted transition-colors hover:text-sherwood-800">
      {children}
    </a>
  );
}

function DayRow({ day, last }: { day: TourDay; last: boolean }) {
  const points = day.sightseeing?.description_points ?? '';
  const place = [day.sightseeing?.city, day.sightseeing?.country].filter(Boolean).join(', ');
  return (
    <li className={`relative pl-8 ${last ? 'pb-0' : 'pb-8'}`}>
      <span className="absolute -left-[9px] top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-bg bg-sherwood-800" />
      <div className="flex flex-wrap items-baseline gap-x-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-meadow-700">Day {day.day_num}</span>
        {place && <span className="text-[11px] text-subtle">{place}</span>}
      </div>
      <h3 className="mt-1 font-display text-[20px] font-normal leading-snug text-text">
        {day.title || day.sightseeing?.activity || `Day ${day.day_num}`}
      </h3>
      {points && (
        <div className="rich-text mt-1.5 text-[13.5px] text-muted" dangerouslySetInnerHTML={{ __html: points }} />
      )}
    </li>
  );
}

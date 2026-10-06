import Link from 'next/link';
import {
  DEPARTURE_CITIES,
  destinationsByRegion,
  destinationsByState,
  durationBuckets,
  SEASONS,
  themesWithCounts,
} from '@/lib/catalog';
import { AGENCY } from '@/lib/content';
import { NavBar, NavMenu } from '@/components/NavMenu';
import { durationPhrase, getHost, getPackages, mediaUrl, telHref, whatsappLink, type Package } from '@/lib/mktours';

const NAV_LINK =
  'whitespace-nowrap rounded-full px-3.5 py-2 text-[13.5px] font-semibold text-text transition-colors hover:bg-vermilion-50 hover:text-vermilion-700';

/** The regional collections that used to sit as their own tabs in the bar. */
const COLLECTIONS = [
  { href: '/south-india-tours', label: 'South India Tours', note: 'Kerala, Tamil Nadu & the coast' },
  { href: '/north-india-tours', label: 'North India Tours', note: 'Himalaya, Rajasthan & the plains' },
  { href: '/weekend-getaways', label: 'Weekend Getaways', note: 'Short trips, two to three days' },
  { href: '/destinations', label: 'All Destinations', note: 'Browse every place we travel to' },
];

export async function SiteHeader() {
  const [host, packages] = await Promise.all([getHost().catch(() => null), getPackages().catch(() => [])]);
  const logo = mediaUrl(host?.image_url);
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);
  const tel = telHref(AGENCY.phonePrimary);

  const byState = destinationsByState(packages);
  const byRegion = destinationsByRegion(packages);
  const themes = themesWithCounts(packages);
  const durations = durationBuckets(packages);

  return (
    <header className="sticky top-0 z-40">
      {/* Utility strip — a thin indigo band carrying hours and the direct lines. */}
      <div className="hidden bg-azure-900 text-on-dark/80 lg:block">
        <div className="mx-auto flex h-9 max-w-[1320px] items-center gap-6 px-5 text-[11.5px] md:px-8 lg:px-12">
          <span className="flex items-center gap-2 text-vermilion-300">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M12 21a9 9 0 100-18 9 9 0 000 18zM12 7.5V12l3.2 2" />
            </svg>
            {AGENCY.hours}
          </span>
          <span className="hidden h-3 w-px bg-white/15 xl:block" />
          <span className="hidden text-on-dark/60 xl:inline">{AGENCY.tagline}</span>
          <div className="ml-auto flex items-center gap-5">
            <a href={`mailto:${AGENCY.email}`} className="transition-colors hover:text-vermilion-300">
              {AGENCY.email}
            </a>
            <span className="h-3 w-px bg-white/15" />
            <a href={AGENCY.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-vermilion-300">
              Instagram
            </a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-vermilion-300">
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border bg-bg/88 shadow-soft backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1320px] items-center gap-5 px-5 md:px-8 lg:h-[80px] lg:gap-8 lg:px-12">
          <Link href="/" className="group flex flex-shrink-0 items-center gap-3" aria-label={`${AGENCY.name} home`}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt=""
                aria-hidden="true"
                className="h-12 w-auto rounded-xl transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-azure-800 font-display text-lg font-bold text-vermilion-300 shadow-lift transition-transform duration-500 group-hover:scale-105">
                MK
              </span>
            )}
            <span className="font-display text-[22px] font-bold leading-none tracking-[-0.03em] text-azure-900">
              MK Tours
            </span>
          </Link>

          <NavBar className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {/* Destinations — states, regions and the regional collections */}
            <NavMenu label="Destinations" width="w-[940px]" align="left">
              <div className="grid grid-cols-[1.4fr_1fr] gap-7 p-7">
                <div>
                  <PanelTitle>Browse by state</PanelTitle>
                  <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                    {byState.slice(0, 9).map((g) => (
                      <div key={g.state}>
                        <div className="mb-2 flex items-baseline gap-2">
                          <span className="text-[12.5px] font-bold text-text">{g.state}</span>
                          <span className="rounded-full bg-surface px-1.5 py-0.5 text-[9.5px] font-bold text-subtle">
                            {g.items.length}
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {g.items.slice(0, 5).map((d) => (
                            <li key={d.slug}>
                              <Link
                                href={`/destinations/${d.slug}`}
                                className="-mx-2 block rounded-lg px-2 py-1 text-[12.5px] text-muted transition-colors hover:bg-vermilion-50 hover:text-vermilion-700"
                              >
                                {d.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-surface p-5">
                  <PanelTitle>Collections</PanelTitle>
                  <ul className="space-y-2">
                    {COLLECTIONS.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className="group/i block rounded-xl px-3 py-2 transition-colors hover:bg-raised hover:shadow-soft"
                        >
                          <span className="block text-[13px] font-bold text-text transition-colors group-hover/i:text-vermilion-700">
                            {c.label}
                          </span>
                          <span className="mt-0.5 block text-[11.5px] leading-snug text-subtle">{c.note}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <PanelTitle className="mt-6">By region</PanelTitle>
                  <ul className="space-y-1">
                    {byRegion.map((r) => (
                      <li key={r.region}>
                        <Link
                          href={`/destinations?region=${encodeURIComponent(r.region)}`}
                          className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-1.5 text-[12.5px] text-muted transition-colors hover:bg-raised hover:text-vermilion-700"
                        >
                          {r.region}
                          <span className="text-[10px] text-subtle">{r.items.length} spots</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </NavMenu>

            <Link href="/packages" className={NAV_LINK}>
              Tour Packages
            </Link>

            {/* Experiences — theme, duration, season and departure city */}
            <NavMenu label="Experiences" width="w-[900px]" align="center">
              <div className="grid grid-cols-3 gap-7 p-7">
                <div>
                  <PanelTitle>By theme</PanelTitle>
                  <ul className="space-y-1">
                    {themes.map((t) => (
                      <li key={t.slug}>
                        <Link
                          href={`/themes/${t.slug}`}
                          className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-1.5 text-[12.5px] text-muted transition-colors hover:bg-vermilion-50 hover:text-vermilion-700"
                        >
                          {t.label}
                          <span className="text-[10px] text-subtle">
                            {t.count} {t.count === 1 ? 'tour' : 'tours'}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <PanelTitle>By duration</PanelTitle>
                  <ul className="space-y-1">
                    {durations.map((d) => (
                      <li key={d.days}>
                        <Link
                          href={`/packages?duration=${d.days}`}
                          className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-1.5 text-[12.5px] text-muted transition-colors hover:bg-vermilion-50 hover:text-vermilion-700"
                        >
                          {d.label}
                          <span className="text-[10px] text-subtle">
                            {d.count} {d.count === 1 ? 'tour' : 'tours'}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <PanelTitle className="mt-6">By season</PanelTitle>
                  <ul className="space-y-1">
                    {SEASONS.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/packages?season=${s.slug}`}
                          className="flex items-baseline justify-between gap-3 rounded-lg px-3 py-1.5 text-[12.5px] text-muted transition-colors hover:bg-vermilion-50 hover:text-vermilion-700"
                        >
                          {s.label}
                          <span className="text-[10px] uppercase text-subtle">{s.window}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-surface p-5">
                  <PanelTitle>Departing from</PanelTitle>
                  <ul className="space-y-1.5">
                    {DEPARTURE_CITIES.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/packages?city=${c.slug}`}
                          className="group/i block rounded-xl px-3 py-2 transition-colors hover:bg-raised hover:shadow-soft"
                        >
                          <span className="block text-[12.5px] font-bold text-text transition-colors group-hover/i:text-vermilion-700">
                            From {c.label}
                          </span>
                          <span className="block text-[11px] text-subtle">{c.note}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <PanelTitle className="mt-6">Popular right now</PanelTitle>
                  <ul className="space-y-1">
                    {packages.slice(0, 4).map((p: Package) => (
                      <li key={p.id}>
                        <Link
                          href={`/packages/${p.slug ?? p.id}`}
                          className="group/i block rounded-lg px-3 py-1.5 transition-colors hover:bg-raised"
                        >
                          <span className="block text-[12.5px] text-muted transition-colors group-hover/i:text-vermilion-700">
                            {p.package_name.replace(/ Group Tour$/, '')}
                          </span>
                          <span className="block text-[10.5px] text-subtle">{durationPhrase(p)}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </NavMenu>

            <NavMenu label="About" width="w-64" align="center">
              <ul className="p-3">
                {[
                  { href: '/about', label: 'About MK Tours' },
                  { href: '/reviews', label: 'Guest Reviews' },
                  { href: '/gallery', label: 'Gallery' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="block rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-vermilion-50 hover:text-vermilion-700"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </NavMenu>

            <Link href="/contact" className={NAV_LINK}>
              Contact
            </Link>
          </NavBar>

          {/* Right-hand controls */}
          <div className="ml-auto flex flex-shrink-0 items-center gap-3">
            {tel && (
              <a
                href={tel}
                className="hidden items-center gap-2.5 rounded-full border border-border bg-raised px-4 py-2 text-[13px] font-bold text-text shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-vermilion-300 hover:text-vermilion-700 lg:inline-flex"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-vermilion-50 text-vermilion-700">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                    <path d="M6.6 3h3l1.5 4-2 1.4a12 12 0 005.5 5.5l1.4-2 4 1.5v3A2 2 0 0118 18.4 16 16 0 015.6 6 2 2 0 016.6 3z" />
                  </svg>
                </span>
                +91 {AGENCY.phonePrimary}
              </a>
            )}
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp us"
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-vermilion-500 text-white shadow-glow transition-transform duration-300 hover:scale-105 xl:hidden"
              >
                <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 004.74 1.21c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0012.04 2zm4.52 12.07c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.13.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.2-.57.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29z" />
                </svg>
              </a>
            )}
            <Link
              href="/packages"
              className="group/book hidden items-center gap-2 rounded-full bg-azure-900 px-6 py-3.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-on-dark shadow-lift transition-all duration-300 hover:-translate-y-0.5 hover:bg-vermilion-500 hover:text-white xl:inline-flex"
            >
              Book a Tour
              <span className="transition-transform duration-300 group-hover/book:translate-x-1">→</span>
            </Link>

            {/* Mobile drawer — CSS only, no client JS */}
            <details className="group/menu relative xl:hidden">
              <summary
                className="flex h-11 w-11 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-2xl border border-border bg-raised shadow-soft"
                aria-label="Open menu"
              >
                <span className="block h-[2px] w-[20px] rounded-full bg-text transition-all" />
                <span className="block h-[2px] w-[20px] rounded-full bg-text transition-all" />
                <span className="block h-[2px] w-[12px] rounded-full bg-vermilion-600 transition-all group-open/menu:w-[20px]" />
              </summary>
              <div className="fixed inset-x-3 top-[84px] z-50 max-h-[calc(100vh-100px)] overflow-y-auto rounded-[1.75rem] border border-border bg-bg px-5 pb-8 pt-5 shadow-float">
                <MobileLinks
                  states={byState.map((s) => s.state)}
                  themes={themes.map((t) => ({ slug: t.slug, label: t.label }))}
                />
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */

function PanelTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-3.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-vermilion-700 ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-vermilion-500" />
      {children}
    </div>
  );
}

function MobileLinks({ states, themes }: { states: string[]; themes: { slug: string; label: string }[] }) {
  const primary = [
    { href: '/packages', label: 'Tour Packages' },
    { href: '/destinations', label: 'Destinations' },
    ...COLLECTIONS.slice(0, 3),
    { href: '/about', label: 'About' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];
  return (
    <>
      <ul className="grid gap-1.5">
        {primary.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 text-[15px] font-bold text-text transition-colors hover:bg-vermilion-50 hover:text-vermilion-700"
            >
              {l.label}
              <span className="text-vermilion-600">→</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-vermilion-700">
        <span className="h-1.5 w-1.5 rounded-full bg-vermilion-500" />
        By theme
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {themes.map((t) => (
          <Link
            key={t.slug}
            href={`/themes/${t.slug}`}
            className="rounded-full border border-border-strong bg-raised px-3.5 py-1.5 text-[12.5px] text-muted shadow-soft"
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-vermilion-700">
        <span className="h-1.5 w-1.5 rounded-full bg-vermilion-500" />
        By state
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {states.map((s) => (
          <Link
            key={s}
            href={`/destinations?state=${encodeURIComponent(s)}`}
            className="rounded-full border border-border-strong bg-raised px-3.5 py-1.5 text-[12.5px] text-muted shadow-soft"
          >
            {s}
          </Link>
        ))}
      </div>
    </>
  );
}

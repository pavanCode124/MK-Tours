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
  'whitespace-nowrap py-2 text-[13.5px] font-medium tracking-[0.01em] text-text transition-colors hover:text-meadow-700';

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
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur-sm">
      {/* Main bar — logo, then a generous gap, the links, another gap, the CTA. */}
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center gap-6 px-5 md:px-8 lg:h-[78px] lg:gap-12 lg:px-10">
        <Link href="/" className="flex flex-shrink-0 items-center gap-3" aria-label={`${AGENCY.name} home`}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" aria-hidden="true" className="h-11 w-auto" />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sherwood-800 font-display text-lg font-medium text-on-dark">
              MK
            </span>
          )}
          <span className="flex flex-col leading-none">
            <span className="font-display text-[21px] font-medium tracking-tight text-sherwood-900">MK Tours</span>
            <span className="mt-1 text-[9.5px] font-semibold uppercase tracking-[0.26em] text-meadow-700">
              India & Nepal
            </span>
          </span>
        </Link>

        <NavBar className="hidden flex-1 items-center justify-center gap-7 xl:flex 2xl:gap-9">
          {/* Destinations — states, regions and the regional collections */}
          <NavMenu label="Destinations" width="w-[940px]" align="left">
            <div className="grid grid-cols-[1.4fr_1fr] gap-8 p-7">
              <div>
                <PanelTitle>Browse by state</PanelTitle>
                <div className="grid grid-cols-3 gap-x-7 gap-y-5">
                  {byState.slice(0, 9).map((g) => (
                    <div key={g.state}>
                      <div className="mb-2 flex items-baseline gap-1.5">
                        <span className="text-[12.5px] font-semibold text-text">{g.state}</span>
                        <span className="text-[10px] text-subtle">{g.items.length}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {g.items.slice(0, 5).map((d) => (
                          <li key={d.slug}>
                            <Link
                              href={`/destinations/${d.slug}`}
                              className="text-[12.5px] text-muted transition-colors hover:text-meadow-700"
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

              <div className="bg-surface p-6">
                <PanelTitle>Collections</PanelTitle>
                <ul className="space-y-3">
                  {COLLECTIONS.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="group/i block">
                        <span className="block text-[13px] font-semibold text-text transition-colors group-hover/i:text-meadow-700">
                          {c.label}
                        </span>
                        <span className="mt-0.5 block text-[11.5px] leading-snug text-subtle">{c.note}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <PanelTitle className="mt-6">By region</PanelTitle>
                <ul className="space-y-1.5">
                  {byRegion.map((r) => (
                    <li key={r.region} className="flex items-baseline justify-between gap-3">
                      <Link
                        href={`/destinations?region=${encodeURIComponent(r.region)}`}
                        className="text-[12.5px] text-muted transition-colors hover:text-meadow-700"
                      >
                        {r.region}
                      </Link>
                      <span className="text-[10px] text-subtle">{r.items.length} spots</span>
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
            <div className="grid grid-cols-3 gap-8 p-7">
              <div>
                <PanelTitle>By theme</PanelTitle>
                <ul className="space-y-1.5">
                  {themes.map((t) => (
                    <li key={t.slug} className="flex items-baseline justify-between gap-3">
                      <Link href={`/themes/${t.slug}`} className="text-[12.5px] text-muted transition-colors hover:text-meadow-700">
                        {t.label}
                      </Link>
                      <span className="text-[10px] text-subtle">
                        {t.count} {t.count === 1 ? 'tour' : 'tours'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <PanelTitle>By duration</PanelTitle>
                <ul className="space-y-1.5">
                  {durations.map((d) => (
                    <li key={d.days} className="flex items-baseline justify-between gap-3">
                      <Link href={`/packages?duration=${d.days}`} className="text-[12.5px] text-muted transition-colors hover:text-meadow-700">
                        {d.label}
                      </Link>
                      <span className="text-[10px] text-subtle">
                        {d.count} {d.count === 1 ? 'tour' : 'tours'}
                      </span>
                    </li>
                  ))}
                </ul>

                <PanelTitle className="mt-6">By season</PanelTitle>
                <ul className="space-y-1.5">
                  {SEASONS.map((s) => (
                    <li key={s.slug} className="flex items-baseline justify-between gap-3">
                      <Link href={`/packages?season=${s.slug}`} className="text-[12.5px] text-muted transition-colors hover:text-meadow-700">
                        {s.label}
                      </Link>
                      <span className="text-[10px] uppercase text-subtle">{s.window}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-surface p-6">
                <PanelTitle>Departing from</PanelTitle>
                <ul className="space-y-2.5">
                  {DEPARTURE_CITIES.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/packages?city=${c.slug}`} className="group/i block">
                        <span className="block text-[12.5px] font-semibold text-text transition-colors group-hover/i:text-meadow-700">
                          From {c.label}
                        </span>
                        <span className="block text-[11px] text-subtle">{c.note}</span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <PanelTitle className="mt-6">Popular right now</PanelTitle>
                <ul className="space-y-2">
                  {packages.slice(0, 4).map((p: Package) => (
                    <li key={p.id}>
                      <Link href={`/packages/${p.slug ?? p.id}`} className="group/i block">
                        <span className="block text-[12.5px] text-muted transition-colors group-hover/i:text-meadow-700">
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

          <NavMenu label="About" width="w-60" align="center">
            <ul className="p-3">
              {[
                { href: '/about', label: 'About MK Tours' },
                { href: '/reviews', label: 'Guest Reviews' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/blog', label: 'Travel Journal' },
                { href: '/careers', label: 'Careers' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block px-3.5 py-2.5 text-[13px] text-muted transition-colors hover:bg-surface hover:text-meadow-700"
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
        {/* The utility strip used to carry these; they now live inline in the bar. */}
        <div className="ml-auto flex flex-shrink-0 items-center gap-4 lg:gap-5">
          {tel && (
            <a
              href={tel}
              className="hidden items-center gap-2 text-[13px] font-medium tracking-[0.01em] text-text transition-colors hover:text-meadow-700 lg:inline-flex"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6.6 3h3l1.5 4-2 1.4a12 12 0 005.5 5.5l1.4-2 4 1.5v3A2 2 0 0118 18.4 16 16 0 015.6 6 2 2 0 016.6 3z" />
              </svg>
              +91 {AGENCY.phonePrimary}
            </a>
          )}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-[13px] font-medium tracking-[0.01em] text-text transition-colors hover:text-meadow-700 lg:inline"
            >
              WhatsApp
            </a>
          )}
          <span className="hidden h-4 w-px bg-border-strong lg:block" />
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp us"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-meadow-700 text-white transition-colors hover:bg-sherwood-900 xl:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 004.74 1.21c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0012.04 2zm4.52 12.07c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.13.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.2-.57.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29z" />
              </svg>
            </a>
          )}
          <Link
            href="/packages"
            className="hidden items-center rounded-full bg-sherwood-900 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-on-dark transition-colors hover:bg-meadow-700 xl:inline-flex"
          >
            Book a Tour
          </Link>

          {/* Mobile drawer — CSS only, no client JS */}
          <details className="group/menu relative xl:hidden">
            <summary className="flex cursor-pointer flex-col items-end gap-1.5 p-1.5" aria-label="Open menu">
              <span className="block h-0.5 w-[22px] rounded-full bg-text transition-all" />
              <span className="block h-0.5 w-[22px] rounded-full bg-text transition-all" />
              <span className="block h-0.5 w-3.5 rounded-full bg-text transition-all group-open/menu:w-[22px]" />
            </summary>
            <div className="fixed inset-x-0 top-[72px] z-50 max-h-[calc(100vh-72px)] overflow-y-auto border-t border-border bg-bg px-5 pb-10 pt-4 shadow-xl">
              <MobileLinks
                states={byState.map((s) => s.state)}
                themes={themes.map((t) => ({ slug: t.slug, label: t.label }))}
              />
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */

function PanelTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-3.5 text-[10px] font-medium uppercase tracking-[0.22em] text-meadow-700 ${className}`}>
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
    { href: '/blog', label: 'Travel Journal' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
  ];
  return (
    <>
      <ul className="divide-y divide-border">
        {primary.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="block py-3.5 text-[15px] font-medium text-text">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-7 text-[10px] font-medium uppercase tracking-[0.22em] text-meadow-700">By theme</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {themes.map((t) => (
          <Link
            key={t.slug}
            href={`/themes/${t.slug}`}
            className="rounded-full border border-border-strong px-3.5 py-1.5 text-[12.5px] font-light text-muted"
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 text-[10px] font-medium uppercase tracking-[0.22em] text-meadow-700">By state</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {states.map((s) => (
          <Link
            key={s}
            href={`/destinations?state=${encodeURIComponent(s)}`}
            className="rounded-full border border-border-strong px-3.5 py-1.5 text-[12.5px] font-light text-muted"
          >
            {s}
          </Link>
        ))}
      </div>
    </>
  );
}

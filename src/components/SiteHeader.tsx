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
import { durationPhrase, getHost, getPackages, mediaUrl, telHref, whatsappLink, type Package } from '@/lib/mktours';

const NAV_LINK =
  'whitespace-nowrap border-b-2 border-transparent py-[11px] text-[13.5px] font-medium capitalize tracking-[0.05em] text-text transition-colors hover:border-meadow-700 hover:text-meadow-700';

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
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      {/* Utility bar */}
      <div className="hidden border-b border-border/60 bg-sherwood-900 lg:block">
        <div className="mx-auto flex h-9 max-w-[1280px] items-center justify-between gap-4 px-5 text-xs text-on-dark/70 lg:px-12">
          <div className="flex items-center gap-4">
            {tel && (
              <a href={tel} className="flex items-center gap-1.5 font-semibold text-sherwood-200 transition-colors hover:text-on-dark">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <path d="M6.6 3h3l1.5 4-2 1.4a12 12 0 005.5 5.5l1.4-2 4 1.5v3A2 2 0 0118 18.4 16 16 0 015.6 6 2 2 0 016.6 3z" />
                </svg>
                +91 {AGENCY.phonePrimary}
              </a>
            )}
            <div className="h-4 w-px bg-white/[.15]" />
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-semibold text-sherwood-200 transition-colors hover:text-on-dark">
                WhatsApp us
              </a>
            )}
            <div className="h-4 w-px bg-white/[.15]" />
            <span className="text-sherwood-200">{AGENCY.hours}</span>
          </div>
          <div className="flex items-stretch">
            <Link
              href="/packages"
              className="flex items-center border-l border-white/[.15] px-[18px] text-xs font-semibold uppercase tracking-wide text-on-dark transition-colors hover:text-meadow-300"
            >
              Book a Tour
            </Link>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center border-l border-white/[.15] px-[18px] text-xs font-semibold uppercase tracking-wide text-meadow-300 transition-colors hover:text-on-dark"
              >
                Customize Your Trip
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-4 px-5 md:px-8 lg:h-[62px] lg:px-12">
        <Link href="/" className="flex flex-shrink-0 items-center gap-2.5" aria-label={`${AGENCY.name} home`}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" aria-hidden="true" className="h-[36px] w-auto" />
          ) : (
            <span className="font-display text-2xl font-semibold tracking-tight text-sherwood-800">MK</span>
          )}
          <span className="font-display text-[22px] font-semibold leading-none tracking-tight text-sherwood-800">
            MK Tours
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-[14px] xl:flex" aria-label="Primary">
          {/* Destinations */}
          <MegaGroup label="Destinations" width="w-[920px]" align="left">
            <div className="grid grid-cols-[1.45fr_1fr] gap-7 p-6">
              <div>
                <PanelTitle>States</PanelTitle>
                <div className="grid grid-cols-3 gap-x-6 gap-y-5">
                  {byState.slice(0, 9).map((g) => (
                    <div key={g.state}>
                      <div className="mb-1.5 flex items-baseline gap-1.5">
                        <span className="text-[12px] font-semibold text-text">{g.state}</span>
                        <span className="text-[10px] text-subtle">{g.items.length}</span>
                      </div>
                      <ul className="space-y-1">
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
              <div className="border-l border-border pl-7">
                <PanelTitle>Region</PanelTitle>
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
                <Link
                  href="/destinations"
                  className="mt-5 inline-flex text-[12px] font-semibold uppercase tracking-[0.1em] text-meadow-700 hover:text-sherwood-800"
                >
                  View all destinations →
                </Link>
              </div>
            </div>
          </MegaGroup>

          {/* Explore trips */}
          <MegaGroup label="Explore Trips" width="w-[860px]" align="center">
            <div className="grid grid-cols-3 gap-7 p-6">
              <div>
                <PanelTitle>By departure city</PanelTitle>
                <ul className="space-y-2">
                  {DEPARTURE_CITIES.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/packages?city=${c.slug}`} className="group/i block">
                        <span className="block text-[12.5px] font-medium text-text transition-colors group-hover/i:text-meadow-700">
                          From {c.label}
                        </span>
                        <span className="block text-[11px] text-subtle">{c.note}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <PanelTitle className="mt-6">Popular trips</PanelTitle>
                <ul className="space-y-1.5">
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

              <div className="border-l border-border pl-7">
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

              <div className="border-l border-border pl-7">
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
            </div>
          </MegaGroup>

          <Link href="/packages" className={NAV_LINK}>
            Tour Packages
          </Link>
          <Link href="/weekend-getaways" className={NAV_LINK}>
            Weekend Getaways
          </Link>
          <Link href="/south-india-tours" className={NAV_LINK}>
            South India Tour
          </Link>
          <Link href="/north-india-tours" className={NAV_LINK}>
            North India Tour
          </Link>

          <MegaGroup label="Resources" width="w-52" align="left">
            <ul className="p-3">
              {[
                { href: '/about', label: 'About' },
                { href: '/blog', label: 'Blog' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/reviews', label: 'Reviews' },
                { href: '/careers', label: 'Careers' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block rounded-sm px-3 py-2 text-[12.5px] text-muted transition-colors hover:bg-surface hover:text-meadow-700"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </MegaGroup>

          <Link href="/contact" className={NAV_LINK}>
            Contact
          </Link>
        </nav>

        {/* Right-hand controls */}
        <div className="flex flex-shrink-0 items-center gap-3">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp us"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm bg-meadow-700 text-white xl:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 004.74 1.21c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0012.04 2zm4.52 12.07c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.13.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.2-.57.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29z" />
              </svg>
            </a>
          )}
          <Link
            href="/packages"
            className="hidden rounded-sm bg-sherwood-800 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-on-dark transition-colors hover:bg-sherwood-900 xl:inline-flex"
          >
            Book a Tour
          </Link>

          {/* Mobile drawer — CSS only, no client JS */}
          <details className="group/menu relative xl:hidden">
            <summary
              className="flex cursor-pointer flex-col items-end gap-1.5 p-1.5"
              aria-label="Open menu"
            >
              <span className="block h-0.5 w-[22px] rounded-full bg-text transition-all" />
              <span className="block h-0.5 w-[22px] rounded-full bg-text transition-all" />
              <span className="block h-0.5 w-3.5 rounded-full bg-text transition-all group-open/menu:w-[22px]" />
            </summary>
            <div className="fixed inset-x-0 top-[68px] z-50 max-h-[calc(100vh-68px)] overflow-y-auto border-t border-border bg-bg px-5 pb-10 pt-4 shadow-xl">
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
    <div className={`mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-meadow-700 ${className}`}>
      {children}
    </div>
  );
}

/**
 * A hover/focus mega-menu. CSS-only: the panel shows on `group-hover` and
 * `group-focus-within`, so it is reachable by keyboard without any JavaScript.
 */
function MegaGroup({
  label,
  children,
  width,
  align,
}: {
  label: string;
  children: React.ReactNode;
  width: string;
  align: 'left' | 'center';
}) {
  return (
    <div className="group relative">
      <button type="button" className={`${NAV_LINK} flex items-center gap-1`} aria-haspopup="true">
        {label}
        <svg viewBox="0 0 20 20" className="h-3 w-3 text-subtle transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        className={`invisible absolute top-full z-30 ${width} ${
          align === 'center' ? 'left-1/2 -translate-x-1/2' : 'left-0'
        } translate-y-1 rounded-md border border-border bg-raised opacity-0 shadow-xl transition-[opacity,transform] duration-150 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100`}
      >
        {children}
      </div>
    </div>
  );
}

function MobileLinks({ states, themes }: { states: string[]; themes: { slug: string; label: string }[] }) {
  const primary = [
    { href: '/packages', label: 'Tour Packages' },
    { href: '/destinations', label: 'Destinations' },
    { href: '/weekend-getaways', label: 'Weekend Getaways' },
    { href: '/south-india-tours', label: 'South India Tour' },
    { href: '/north-india-tours', label: 'North India Tour' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/careers', label: 'Careers' },
    { href: '/contact', label: 'Contact' },
  ];
  return (
    <>
      <ul className="divide-y divide-border">
        {primary.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="block py-3 text-[15px] font-medium text-text">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-meadow-700">By theme</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {themes.map((t) => (
          <Link
            key={t.slug}
            href={`/themes/${t.slug}`}
            className="rounded-sm border border-border-strong px-3 py-1.5 text-[12.5px] text-muted"
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-meadow-700">By state</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {states.map((s) => (
          <Link
            key={s}
            href={`/destinations?state=${encodeURIComponent(s)}`}
            className="rounded-sm border border-border-strong px-3 py-1.5 text-[12.5px] text-muted"
          >
            {s}
          </Link>
        ))}
      </div>
    </>
  );
}

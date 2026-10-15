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
  'whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-white/15';

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
      {/* Top strip — a white band, tall enough to carry the wordmark and the
          About Us link alongside the direct lines. */}
      <div className="border-b border-border bg-raised text-text">
        <div className="flex h-[66px] w-full items-center gap-4 px-5 md:px-8 lg:h-[84px] lg:gap-7 lg:px-10">
          <Link href="/" className="flex flex-shrink-0 items-center gap-2.5" aria-label={`${AGENCY.name} home`}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" aria-hidden="true" className="h-10 w-auto lg:h-12" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-azure-900 font-display text-base font-bold text-white lg:h-12 lg:w-12">
                MK
              </span>
            )}
            <span className="font-display text-[21px] font-bold leading-none tracking-[-0.03em] text-azure-900 lg:text-[25px]">
              MK Tours
            </span>
          </Link>

          <div className="ml-auto hidden items-center gap-5 text-[12px] text-muted lg:flex">
            <a href={`mailto:${AGENCY.email}`} className="transition-colors hover:text-sky-600">
              {AGENCY.email}
            </a>
            <span className="h-3.5 w-px bg-border-strong" />
            <div className="flex items-center gap-2">
              <SocialMark href={AGENCY.instagram} label="Instagram">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5.2" />
                  <circle cx="12" cy="12" r="4.1" />
                  <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
                </svg>
              </SocialMark>
              <SocialMark href={wa} label="WhatsApp">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                  <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.57-.49-.5-.67-.5-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
                  <path d="M12.04 2C6.58 2 2.14 6.44 2.14 11.9c0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 004.74 1.21h.01c5.45 0 9.89-4.44 9.89-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0012.04 2zm0 18.08h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.37c0-4.53 3.7-8.22 8.23-8.22a8.18 8.18 0 015.81 2.41 8.17 8.17 0 012.41 5.82c0 4.53-3.69 8.22-8.22 8.22z" />
                </svg>
              </SocialMark>
            </div>
            <span className="h-3.5 w-px bg-border-strong" />
            {tel && (
              <a
                href={tel}
                className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-[12.5px] font-bold text-azure-900 ring-1 ring-sky-100 transition-colors duration-200 hover:bg-sky-100"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                  <path d="M6.6 3h3l1.5 4-2 1.4a12 12 0 005.5 5.5l1.4-2 4 1.5v3A2 2 0 0118 18.4 16 16 0 015.6 6 2 2 0 016.6 3z" />
                </svg>
                +91 {AGENCY.phonePrimary}
              </a>
            )}
            <Link
              href="/packages"
              className="hidden items-center justify-center gap-2 rounded-full bg-azure-900 px-6 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-on-dark shadow-lift transition-all duration-300 hover:bg-vermilion-500 hover:text-white xl:inline-flex"
            >
              Book a Tour
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Compact controls — WhatsApp and the drawer, below the wide bar */}
          <div className="ml-auto flex flex-shrink-0 items-center gap-3 xl:hidden">
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp us"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-sky-500 text-white transition-colors duration-200 hover:bg-sky-400"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
                  <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 004.74 1.21c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0012.04 2zm4.52 12.07c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.13.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.2-.57.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29z" />
                </svg>
              </a>
            )}

            {/* Mobile drawer — CSS only, no client JS */}
            <details className="group/menu relative">
              <summary
                className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-2xl border border-border bg-surface"
                aria-label="Open menu"
              >
                <span className="block h-[2px] w-[20px] rounded-full bg-text transition-all" />
                <span className="block h-[2px] w-[20px] rounded-full bg-text transition-all" />
                <span className="block h-[2px] w-[12px] rounded-full bg-sky-500 transition-all group-open/menu:w-[20px]" />
              </summary>
              <div className="fixed inset-x-3 top-[76px] z-50 max-h-[calc(100vh-92px)] overflow-y-auto rounded-[1.75rem] border border-border bg-bg px-5 pb-8 pt-5 shadow-float">
                <MobileLinks
                  states={byState.map((s) => s.state)}
                  themes={themes.map((t) => ({ slug: t.slug, label: t.label }))}
                />
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Primary bar — a solid skyblue band whose links share the width evenly.
          Nothing in here shifts on hover; only the fill behind a link changes. */}
      <div className="hidden border-b border-sky-700/40 bg-sky-500 xl:block">
        <div className="mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
          <NavBar className="flex h-[58px] items-center justify-center gap-8">
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

            <Link href="/about" className={NAV_LINK}>
              About Us
            </Link>

            <Link href="/contact" className={NAV_LINK}>
              Contact
            </Link>
          </NavBar>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */

/** A social mark on the white strip: the service's own glyph, in a quiet
 *  outlined square that fills sky on hover. */
function SocialMark({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted transition-colors duration-200 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
    >
      {children}
    </a>
  );
}

function PanelTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-3.5 flex items-center text-[10px] font-bold uppercase tracking-[0.18em] text-vermilion-700 ${className}`}>
      {children}
    </div>
  );
}

function MobileLinks({ states, themes }: { states: string[]; themes: { slug: string; label: string }[] }) {
  const primary = [
    { href: '/packages', label: 'Tour Packages' },
    { href: '/destinations', label: 'Destinations' },
    ...COLLECTIONS.slice(0, 3),
    { href: '/about', label: 'About Us' },
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

      <div className="mt-6 flex items-center text-[10px] font-bold uppercase tracking-[0.18em] text-vermilion-700">
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

      <div className="mt-6 flex items-center text-[10px] font-bold uppercase tracking-[0.18em] text-vermilion-700">
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

import Link from 'next/link';
import { AGENCY } from '@/lib/content';
import { formatPhone, getHost, mediaUrl, telHref, whatsappLink } from '@/lib/mktours';
import { CompassRose, FlightPath, SmokeShadow, WaveDivider } from './Decor';
import { Icon } from './ui';

const EXPLORE = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/packages', label: 'Tour Packages' },
  { href: '/weekend-getaways', label: 'Weekend Getaways' },
  { href: '/south-india-tours', label: 'South India Tours' },
  { href: '/north-india-tours', label: 'North India Tours' },
  { href: '/themes/pilgrimage', label: 'Pilgrimage Tours' },
];

const COMPANY = [
  { href: '/about', label: 'Our Story' },
  { href: '/blog', label: 'Travel Guides' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/careers', label: 'Careers' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
];

export async function SiteFooter() {
  const host = await getHost().catch(() => null);
  const logo = mediaUrl(host?.image_url);
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);
  const tel = telHref(AGENCY.phonePrimary);
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative scroll-mt-24 overflow-hidden bg-sherwood-900 text-on-dark/75">
      {/* The footer opens on a tree line and carries a flight arc and a soft
          smoke mass behind the columns, so it is never a flat slab of colour. */}
      <WaveDivider flip className="pointer-events-none absolute inset-x-0 top-0 h-[72px] text-bg" />
      <FlightPath
        variant="fall"
        className="pointer-events-none absolute right-0 top-[120px] hidden h-[160px] w-[60%] text-meadow-300/25 lg:block"
      />
      <SmokeShadow className="pointer-events-none absolute -bottom-10 left-[10%] h-[280px] w-[55%] text-sherwood-500/25" />
      <CompassRose className="pointer-events-none absolute -right-14 bottom-24 hidden h-[260px] w-[260px] text-meadow-300/10 lg:block" />

      <div className="relative mx-auto max-w-[1320px] px-5 pt-24 md:px-8 lg:px-12">
        {/* Newsletter — a raised card floating on the pine rather than a slab */}
        <div className="glass-dark overflow-hidden p-8 shadow-float sm:p-11">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-meadow-300/35 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-meadow-300">
                <Icon name="mail" className="h-3.5 w-3.5" />
                Newsletter
              </span>
              <h2 className="mt-4 font-display text-[27px] font-semibold leading-tight tracking-[-0.025em] text-on-dark sm:text-[34px]">
                Travel Dispatches from MK Tours
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-on-dark/70">
                One letter a month: upcoming fixed departures, seats still open, and notes from the road. No offers you
                did not ask for.
              </p>
            </div>
            <form
              action={wa}
              target="_blank"
              className="flex w-full max-w-md shrink-0 overflow-hidden rounded-full border border-white/20 bg-raised p-1.5 shadow-lift"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-text outline-none placeholder:text-subtle"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-meadow-500 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-sherwood-900 transition-colors hover:bg-meadow-400"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-3">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" aria-hidden="true" className="h-11 w-auto rounded-xl bg-bg/95 p-1" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-meadow-500 font-display text-base font-bold text-sherwood-900">
                  MK
                </span>
              )}
              <span className="font-display text-[25px] font-bold tracking-[-0.03em] text-on-dark">MK Tours</span>
            </div>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-on-dark/65">
              Private and group journeys across India and Nepal, run on fixed departures out of Mumbai. One price that
              covers the train, the stays, the meals and the sightseeing.
            </p>
            <div className="mt-6 flex gap-2.5">
              <Social href={AGENCY.instagram} label="Instagram">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.23 1 .5 1.4.94.44.43.71.83.94 1.4.17.42.36 1.02.42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.23.6-.5 1-.94 1.4-.43.44-.83.71-1.4.94-.42.17-1.02.36-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.23-1-.5-1.4-.94-.44-.43-.71-.83-.94-1.4-.17-.42-.36-1.02-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.23-.6.5-1 .94-1.4.43-.44.83-.71 1.4-.94.42-.17 1.02-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.4a6.4 6.4 0 100 12.8 6.4 6.4 0 000-12.8zm0 10.56a4.16 4.16 0 110-8.32 4.16 4.16 0 010 8.32zm8.14-10.81a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
              </Social>
              <Social href={AGENCY.googleProfile} label="Google profile">
                <span className="text-[11px] font-bold">G</span>
              </Social>
              {wa && (
                <Social href={wa} label="WhatsApp">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 004.74 1.21c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0012.04 2zm4.52 12.07c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.13.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.2-.57.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29z" />
                  </svg>
                </Social>
              )}
            </div>
          </div>

          <FooterColumn title="Explore" links={EXPLORE} />
          <FooterColumn title="Company" links={COMPANY} />

          <div>
            <ColumnTitle>Get in touch</ColumnTitle>
            <ul className="space-y-2 text-[13px]">
              <li>
                {tel ? (
                  <a
                    href={tel}
                    className="inline-flex items-center gap-2 font-bold text-on-dark transition-colors hover:text-meadow-300"
                  >
                    <Icon name="phone" className="h-4 w-4 text-meadow-400" />
                    {formatPhone(AGENCY.phonePrimary)}
                  </a>
                ) : (
                  formatPhone(AGENCY.phonePrimary)
                )}
              </li>
              <li>
                <a
                  href={telHref(AGENCY.phoneSecondary)}
                  className="inline-flex items-center gap-2 text-on-dark/70 transition-colors hover:text-meadow-300"
                >
                  <Icon name="phone" className="h-4 w-4 text-meadow-400/60" />
                  {formatPhone(AGENCY.phoneSecondary)}
                </a>
              </li>
              <li className="flex items-center gap-2 pb-1 text-[12px] text-on-dark/50">
                <Icon name="clock" className="h-4 w-4 text-meadow-400/60" />
                {AGENCY.hours}
              </li>
              <li>
                <a
                  href={`mailto:${AGENCY.email}`}
                  className="inline-flex items-center gap-2 text-on-dark/70 transition-colors hover:text-meadow-300"
                >
                  <Icon name="mail" className="h-4 w-4 text-meadow-400/60" />
                  {AGENCY.email}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-2 text-[12.5px] leading-relaxed text-on-dark/55">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-meadow-400/60" />
                {AGENCY.address}
              </li>
              <li className="flex items-center gap-2 pt-2 text-[12px] text-on-dark/50">
                <Icon name="train" className="h-4 w-4 text-meadow-400/60" />
                Fixed departures from Mumbai &amp; Pune
              </li>
            </ul>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="group/wa mt-6 inline-flex items-center gap-2 rounded-full bg-meadow-500 px-6 py-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-sherwood-900 shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-meadow-400"
              >
                Customize Your Trip
                <span className="transition-transform duration-300 group-hover/wa:translate-x-1">→</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-2 px-5 py-6 text-[12px] text-on-dark/50 sm:flex-row sm:items-center sm:justify-between md:px-8 lg:px-12">
          <span>
            © {year} {host?.name ?? AGENCY.name}. All rights reserved.
          </span>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link href="/privacy" className="transition-colors hover:text-meadow-300">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-meadow-300">
              Terms
            </Link>
            <Link href="/terms#cancellation" className="transition-colors hover:text-meadow-300">
              Refunds
            </Link>
            <Link href="/destinations" className="transition-colors hover:text-meadow-300">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-meadow-400">
      <span className="h-1.5 w-1.5 rounded-full bg-meadow-500" />
      {children}
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <ColumnTitle>{title}</ColumnTitle>
      <ul className="space-y-1.5 text-[13px]">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group/l inline-flex items-center gap-1.5 text-on-dark/70 transition-colors hover:text-meadow-300"
            >
              <span className="h-px w-0 bg-meadow-400 transition-all duration-300 group-hover/l:w-3" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Social({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 text-on-dark/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-meadow-400 hover:bg-meadow-500 hover:text-sherwood-900"
    >
      {children}
    </a>
  );
}

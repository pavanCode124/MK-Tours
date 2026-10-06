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
    <footer id="contact" className="relative scroll-mt-24 overflow-hidden bg-azure-900 text-on-dark/75">
      {/* The footer opens on a tree line and carries a flight arc and a soft
          smoke mass behind the columns, so it is never a flat slab of colour. */}
      <WaveDivider flip className="pointer-events-none absolute inset-x-0 top-0 h-[72px] text-bg" />
      <FlightPath
        variant="fall"
        className="pointer-events-none absolute right-0 top-[120px] hidden h-[160px] w-[60%] text-vermilion-300/25 lg:block"
      />
      <SmokeShadow className="pointer-events-none absolute -bottom-10 left-[10%] h-[280px] w-[55%] text-azure-500/25" />
      <CompassRose className="pointer-events-none absolute -right-14 bottom-24 hidden h-[260px] w-[260px] text-vermilion-300/10 lg:block" />

      <div className="relative mx-auto max-w-[1320px] px-5 pt-24 md:px-8 lg:px-12">
        {/* Newsletter — a raised card floating on the indigo rather than a slab */}
        <div className="glass-dark overflow-hidden p-8 shadow-float sm:p-11">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-vermilion-300/35 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-vermilion-300">
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
                className="shrink-0 rounded-full bg-vermilion-500 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-vermilion-400"
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
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-vermilion-500 font-display text-base font-bold text-white">
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
                <InstagramIcon />
              </Social>
              <Social href={AGENCY.googleProfile} label="Google profile">
                <GoogleIcon />
              </Social>
              {wa && (
                <Social href={wa} label="WhatsApp">
                  <WhatsAppIcon />
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
                    className="inline-flex items-center gap-2 font-bold text-on-dark transition-colors hover:text-vermilion-300"
                  >
                    <Icon name="phone" className="h-4 w-4 text-vermilion-400" />
                    {formatPhone(AGENCY.phonePrimary)}
                  </a>
                ) : (
                  formatPhone(AGENCY.phonePrimary)
                )}
              </li>
              <li>
                <a
                  href={telHref(AGENCY.phoneSecondary)}
                  className="inline-flex items-center gap-2 text-on-dark/70 transition-colors hover:text-vermilion-300"
                >
                  <Icon name="phone" className="h-4 w-4 text-vermilion-400/60" />
                  {formatPhone(AGENCY.phoneSecondary)}
                </a>
              </li>
              <li className="flex items-center gap-2 pb-1 text-[12px] text-on-dark/50">
                <Icon name="clock" className="h-4 w-4 text-vermilion-400/60" />
                {AGENCY.hours}
              </li>
              <li>
                <a
                  href={`mailto:${AGENCY.email}`}
                  className="inline-flex items-center gap-2 text-on-dark/70 transition-colors hover:text-vermilion-300"
                >
                  <Icon name="mail" className="h-4 w-4 text-vermilion-400/60" />
                  {AGENCY.email}
                </a>
              </li>
              <li className="flex items-start gap-2 pt-2 text-[12.5px] leading-relaxed text-on-dark/55">
                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-vermilion-400/60" />
                {AGENCY.address}
              </li>
              <li className="flex items-center gap-2 pt-2 text-[12px] text-on-dark/50">
                <Icon name="train" className="h-4 w-4 text-vermilion-400/60" />
                Fixed departures from Mumbai &amp; Pune
              </li>
            </ul>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="group/wa mt-6 inline-flex items-center gap-2 rounded-full bg-vermilion-500 px-6 py-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-white shadow-glow transition-all duration-300 hover:-translate-y-0.5 hover:bg-vermilion-400"
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
            <Link href="/privacy" className="transition-colors hover:text-vermilion-300">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-vermilion-300">
              Terms
            </Link>
            <Link href="/terms#cancellation" className="transition-colors hover:text-vermilion-300">
              Refunds
            </Link>
            <Link href="/destinations" className="transition-colors hover:text-vermilion-300">
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
    <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-vermilion-400">
      <span className="h-1.5 w-1.5 rounded-full bg-vermilion-500" />
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
              className="group/l inline-flex items-center gap-1.5 text-on-dark/70 transition-colors hover:text-vermilion-300"
            >
              <span className="h-px w-0 bg-vermilion-400 transition-all duration-300 group-hover/l:w-3" />
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
      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/20 text-on-dark/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-vermilion-400 hover:bg-vermilion-500 hover:text-white"
    >
      {children}
    </a>
  );
}

/* --------------------------------------------------------------------------
   Brand marks.

   These are drawn rather than pulled from the line-icon set: a social row wants
   each service's own mark, and the Instagram glyph in particular has to be a
   stroked outline — filled as one path, its lens and flash holes close up and
   it reads as a plain rounded square.
   -------------------------------------------------------------------------- */

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** The Google "G", monochrome so the row reads as one set and picks up the
    hover colour like its neighbours. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="currentColor" aria-hidden="true">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.57-.49-.5-.67-.5-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.14 6.44 2.14 11.9c0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 004.74 1.21h.01c5.45 0 9.89-4.44 9.89-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0012.04 2zm0 18.08h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.37c0-4.53 3.7-8.22 8.23-8.22a8.18 8.18 0 015.81 2.41 8.17 8.17 0 012.41 5.82c0 4.53-3.69 8.22-8.22 8.22z" />
    </svg>
  );
}

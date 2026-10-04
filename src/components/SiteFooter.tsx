import Link from 'next/link';
import { AGENCY } from '@/lib/content';
import { formatPhone, getHost, mediaUrl, telHref, whatsappLink } from '@/lib/mktours';

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
  { href: '/privacy', label: 'Privacy Policy', italic: true },
  { href: '/terms', label: 'Terms & Conditions', italic: true },
];

export async function SiteFooter() {
  const host = await getHost().catch(() => null);
  const logo = mediaUrl(host?.image_url);
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);
  const tel = telHref(AGENCY.phonePrimary);
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="scroll-mt-24 bg-sherwood-900 text-on-dark/75">
      <div className="mx-auto max-w-[1280px] px-5 pt-14 md:px-8 lg:px-12">
        {/* Newsletter */}
        <div className="rounded-[28px] bg-sherwood-800 p-8 sm:p-11">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-[26px] font-normal leading-tight tracking-tight text-on-dark sm:text-[32px]">
                Travel Dispatches from MK Tours
              </h2>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-on-dark/70">
                One letter a month: upcoming fixed departures, seats still open, and notes from the road. No offers you
                did not ask for.
              </p>
            </div>
            <form
              action={wa}
              target="_blank"
              className="flex w-full max-w-md shrink-0 overflow-hidden rounded-full bg-raised p-1.5"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-text outline-none placeholder:text-subtle"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-meadow-600 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-meadow-700"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              {logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" aria-hidden="true" className="h-10 w-auto rounded-xl bg-bg/95 p-1" />
              )}
              <span className="font-display text-[26px] font-semibold uppercase tracking-tight text-on-dark">
                MK Tours
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-on-dark/65">
              Private and group journeys across India and Nepal, run on fixed departures out of Mumbai. One price that
              covers the train, the stays, the meals and the sightseeing.
            </p>
            <div className="mt-5 flex gap-2.5">
              <Social href={AGENCY.instagram} label="Instagram">IG</Social>
              <Social href={AGENCY.googleProfile} label="Google profile">G</Social>
              {wa && <Social href={wa} label="WhatsApp">WA</Social>}
            </div>
          </div>

          <FooterColumn title="Explore" links={EXPLORE} />
          <FooterColumn title="Company" links={COMPANY} />

          <div>
            <ColumnTitle>Get in touch</ColumnTitle>
            <ul className="space-y-1.5 text-[13px]">
              <li>
                {tel ? (
                  <a href={tel} className="font-semibold text-on-dark transition-colors hover:text-meadow-300">
                    {formatPhone(AGENCY.phonePrimary)}
                  </a>
                ) : (
                  formatPhone(AGENCY.phonePrimary)
                )}
              </li>
              <li>
                <a
                  href={telHref(AGENCY.phoneSecondary)}
                  className="text-on-dark/70 transition-colors hover:text-meadow-300"
                >
                  {formatPhone(AGENCY.phoneSecondary)}
                </a>
              </li>
              <li className="pb-1 text-[12px] text-on-dark/50">{AGENCY.hours}</li>
              <li>
                <a
                  href={`mailto:${AGENCY.email}`}
                  className="text-on-dark/70 transition-colors hover:text-meadow-300"
                >
                  {AGENCY.email}
                </a>
              </li>
              <li className="pt-2 text-[12.5px] leading-relaxed text-on-dark/55">{AGENCY.address}</li>
            </ul>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex rounded-full border border-amber/70 px-5 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-amber transition-colors hover:bg-amber hover:text-sherwood-900"
              >
                Customize Your Trip
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-5 py-5 text-[12px] text-on-dark/50 sm:flex-row sm:items-center sm:justify-between md:px-8 lg:px-12">
          <span>© {year} {host?.name ?? AGENCY.name}. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-on-dark">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-on-dark">Terms</Link>
            <Link href="/terms#cancellation" className="transition-colors hover:text-on-dark">Refunds</Link>
            <Link href="/destinations" className="transition-colors hover:text-on-dark">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-meadow-500">{children}</div>;
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; italic?: boolean }[];
}) {
  return (
    <div>
      <ColumnTitle>{title}</ColumnTitle>
      <ul className="space-y-2 text-[13px]">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className={`text-on-dark/70 transition-colors hover:text-meadow-300 ${l.italic ? 'italic' : ''}`}
            >
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
      className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 text-[10px] font-bold tracking-wide text-on-dark/80 transition-colors hover:border-meadow-300 hover:text-meadow-300"
    >
      {children}
    </a>
  );
}

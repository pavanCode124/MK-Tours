import Image from 'next/image';
import Link from 'next/link';
import { DESTINATIONS, packageDestinations } from '@/lib/catalog';
import {
  destinationLabel,
  durationPhrase,
  formatINR,
  packageTagline,
  startingPrice,
  topPrice,
  type Package,
} from '@/lib/mktours';
import { Icon, Stars } from './ui';

/** The state + nights line above a card title, e.g. "Rajasthan · 7 Nights". */
function contextLine(pkg: Package): string {
  const slugs = packageDestinations(pkg);
  const states = [...new Set(slugs.map((s) => DESTINATIONS[s]?.state).filter(Boolean))] as string[];
  const place = states[0] ?? (slugs[0] ? destinationLabel(slugs[0]) : 'India');
  const nights = Math.max((pkg.days ?? 1) - 1, 0);
  return `${place} · ${nights === 0 ? 'Day Trip' : `${nights} Nights`}`;
}

/** Card image: the destination photo for the first place, since the CRM's own
 *  banners are portrait posters that crop badly at card proportions. */
function cardImage(pkg: Package): { src: string; alt: string } {
  const slug = packageDestinations(pkg).find((s) => DESTINATIONS[s]);
  const meta = slug ? DESTINATIONS[slug] : undefined;
  return {
    src: `/images/${meta?.image ?? 'dest-varanasi.jpg'}`,
    alt: pkg.package_name,
  };
}

export function PackageCard({ pkg, priority = false }: { pkg: Package; priority?: boolean }) {
  const href = `/packages/${pkg.slug ?? pkg.id}`;
  const image = cardImage(pkg);
  const duration = durationPhrase(pkg);
  const from = startingPrice(pkg);
  const top = topPrice(pkg);
  const tagline = packageTagline(pkg);
  const places = packageDestinations(pkg).length;

  return (
    <article className="card group relative flex flex-col overflow-hidden hover:card-hover">
      {/* Photograph, curved on all four corners and inset from the card edge so
          the card reads as a mount holding a print rather than a bordered box. */}
      <div className="p-2.5 pb-0">
        <Link href={href} className="relative block aspect-[16/11] overflow-hidden rounded-[1.15rem] bg-surface">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-azure-900/55 via-transparent to-transparent" />
          <span className="sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-azure-900/55 px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.12em] text-on-dark backdrop-blur-md">
            <Icon name="train" className="h-3 w-3" />
            Fixed departure
          </span>
          {duration && (
            <span className="absolute right-3 top-3 rounded-full bg-vermilion-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-glow">
              {duration}
            </span>
          )}
          {places > 0 && (
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-on-dark drop-shadow">
              <Icon name="pin" className="h-3.5 w-3.5" />
              {places} {places === 1 ? 'destination' : 'destinations'}
            </span>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-vermilion-700">
          {contextLine(pkg)}
        </span>
        <Link href={href} className="mt-1.5">
          <h3 className="font-display text-[20px] font-semibold leading-tight text-text transition-colors group-hover:text-vermilion-700">
            {pkg.package_name.replace(/ Group Tour$/, '')}
          </h3>
        </Link>
        {tagline && <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted">{tagline}</p>}

        <div className="mt-3 flex items-center gap-2">
          <Stars />
          <span className="text-[12px] text-muted">Tour manager included</span>
        </div>

        {/* Price and actions sit in a tinted well at the foot of the card. */}
        <div className="mt-auto pt-4">
          <div className="-mx-1.5 -mb-1.5 flex items-end justify-between gap-3 rounded-[1.1rem] bg-surface/80 p-4">
            <div>
              {from !== null ? (
                <>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-subtle">
                    Starting from
                  </span>
                  <span className="font-display text-[25px] font-bold leading-none text-azure-700">
                    {formatINR(from)}
                  </span>
                  {top !== null && top > from && (
                    <span className="ml-1 text-[11px] text-subtle">up to {formatINR(top)}</span>
                  )}
                </>
              ) : (
                <span className="block text-[12px] font-semibold text-muted">Price on request</span>
              )}
            </div>
            <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row">
              <Link
                href={href}
                className="rounded-full border border-border-strong bg-raised px-3.5 py-2 text-center text-[10.5px] font-bold uppercase tracking-[0.08em] text-text transition-colors hover:border-azure-700 hover:bg-azure-800 hover:text-on-dark"
              >
                Details
              </Link>
              <Link
                href={`${href}#book`}
                className="rounded-full bg-vermilion-500 px-3.5 py-2 text-center text-[10.5px] font-bold uppercase tracking-[0.08em] text-white shadow-glow transition-colors hover:bg-vermilion-400"
              >
                Book
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

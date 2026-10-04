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
import { Stars } from './ui';

/** The state + nights line above a card title, e.g. "RAJASTHAN · 7 NIGHTS". */
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

  return (
    <article className="group flex flex-col overflow-hidden rounded-md border border-border bg-raised transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(48,44,37,.12)]">
      <Link href={href} className="relative block aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
        />
        {duration && (
          <span className="absolute right-3 top-3 rounded-sm bg-text/75 px-2.5 py-1 text-[10px] font-semibold text-on-dark backdrop-blur-sm">
            {duration}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-subtle">{contextLine(pkg)}</span>
        <Link href={href} className="mt-1.5">
          <h3 className="font-display text-[21px] font-medium leading-tight text-text transition-colors group-hover:text-meadow-700">
            {pkg.package_name.replace(/ Group Tour$/, '')}
          </h3>
        </Link>
        {tagline && <p className="mt-2.5 line-clamp-2 text-[13px] leading-relaxed text-muted">{tagline}</p>}

        <div className="mt-3 flex items-center gap-2">
          <Stars />
          <span className="text-[12px] text-muted">Fixed departure</span>
        </div>

        <div className="mt-auto pt-4">
          <div className="h-px w-full bg-border" />
          <div className="flex items-end justify-between gap-3 pt-4">
            <div>
              {from !== null && (
                <>
                  <span className="block text-[10.5px] uppercase tracking-wide text-subtle">Starting from</span>
                  <span className="font-display text-[26px] font-semibold leading-none text-sherwood-800">
                    {formatINR(from)}
                  </span>
                  {top !== null && top > from && (
                    <span className="ml-1 text-[11px] text-subtle">up to {formatINR(top)}</span>
                  )}
                </>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={href}
                className="rounded-sm border border-border-strong px-3.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-text transition-colors hover:border-sherwood-800 hover:text-sherwood-800"
              >
                Details
              </Link>
              <Link
                href={`${href}#book`}
                className="rounded-sm bg-sherwood-800 px-3.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-on-dark transition-colors hover:bg-sherwood-900"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

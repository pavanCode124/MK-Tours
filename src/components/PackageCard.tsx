import { DESTINATIONS, packageDestinations, SEASONS, seasonsForPackage } from '@/lib/catalog';
import {
  destinationLabel,
  durationNights,
  formatINR,
  startingPrice,
  type Package,
} from '@/lib/mktours';
import { CardChips, CardFact, CardFlag, CardMedia, CardShell, PricePill } from './ui';

/** "9N/10D" — nights first, the way the fixed-departure listings are read. */
function durationChip(pkg: Package): string {
  if (!pkg.days) return '';
  const nights = durationNights(pkg);
  return nights === 0 ? 'Day Trip' : `${nights}N/${pkg.days}D`;
}

/** The places an itinerary covers, each one as its own chip entry. */
function places(pkg: Package): string[] {
  return packageDestinations(pkg).map((s) => DESTINATIONS[s]?.label ?? destinationLabel(s));
}

/** The travel windows this trip suits — the nearest thing we have to batches. */
function windows(pkg: Package): string[] {
  return seasonsForPackage(pkg)
    .filter((slug) => slug !== 'year-round')
    .map((slug) => SEASONS.find((s) => s.slug === slug)?.window)
    .filter((w): w is string => Boolean(w));
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

/**
 * One package, as a single photographic tile: the picture runs the whole card,
 * the offer rides the top corner, and the trip type, title, route and facts
 * stack over the darkened foot of the photograph.
 */
/** Uniform cell width for a package tile, used by every package rail. */
export const PACKAGE_ITEM = 'w-[240px] sm:w-[260px] lg:w-[280px]';

export function PackageCard({ pkg, priority = false }: { pkg: Package; priority?: boolean }) {
  const href = `/packages/${pkg.slug ?? pkg.id}`;
  const image = cardImage(pkg);
  const duration = durationChip(pkg);
  const from = startingPrice(pkg);
  const was = pkg.original_price && from !== null && pkg.original_price > from ? pkg.original_price : null;
  const route = places(pkg);
  const travelWindows = windows(pkg);
  const flag = (pkg.package_type ?? 'Group Tour').trim();

  return (
    <CardShell href={href} className="min-h-[420px]">
      <CardMedia src={image.src} alt={image.alt} priority={priority} />

      {from !== null && (
        <div className="p-3">
          <PricePill
            price={`${formatINR(from)}/-`}
            was={was ? `${formatINR(was)}/-` : undefined}
          />
        </div>
      )}

      <div className="mt-auto space-y-2.5 p-4 pt-6">
        {flag && <CardFlag>{flag}</CardFlag>}

        <h3 className="line-clamp-2 font-display text-[17px] font-semibold leading-snug text-on-dark">
          {pkg.package_name.replace(/ Group Tour$/, '')}
        </h3>

        <CardChips items={route} />

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-0.5">
          {duration && <CardFact icon="clock" text={duration} />}
          <CardFact icon="pin" text="Mumbai - Mumbai" />
        </div>

        {travelWindows.length > 0 && (
          <CardFact
            icon="calendar"
            text={travelWindows.slice(0, 2).join(', ')}
            trail={travelWindows.length > 2 ? `+${travelWindows.length - 2} windows` : undefined}
          />
        )}
      </div>
    </CardShell>
  );
}

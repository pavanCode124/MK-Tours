// Catalogue metadata layered on top of the CRM feed.
//
// The CRM gives us packages, destination slugs, durations and prices. It does
// not know which state a destination sits in, which region it belongs to, what
// a trip is "for", or which photo should represent it. That editorial layer
// lives here so the navigation, the destination grid and the theme/season
// browsers all read from one place.

import {
  destinationLabel,
  durationNights,
  type Package,
} from './mktours';

/* -------------------------------------------------------------------------- */
/* Destinations                                                               */
/* -------------------------------------------------------------------------- */

export interface DestinationMeta {
  /** Display name, overriding the slug-cased default. */
  label?: string;
  state: string;
  region: Region;
  /** Path under /public/images. */
  image: string;
  /** One line used on the destination page and card hovers. */
  blurb?: string;
}

export type Region =
  | 'North India'
  | 'South India'
  | 'West India'
  | 'East India'
  | 'Himalayas'
  | 'Nepal';

/** Keyed by the destination slug exactly as the CRM stores it. */
export const DESTINATIONS: Record<string, DestinationMeta> = {
  // Jammu & Kashmir
  srinagar: { state: 'Jammu & Kashmir', region: 'Himalayas', image: 'dest-srinagar.jpg', blurb: 'Shikaras on Dal Lake, Mughal gardens and houseboat evenings.' },
  gulmarg: { state: 'Jammu & Kashmir', region: 'Himalayas', image: 'dest-gulmarg.jpg', blurb: "Meadow of flowers in summer, and one of Asia's highest gondolas." },
  sonmarg: { state: 'Jammu & Kashmir', region: 'Himalayas', image: 'dest-sonmarg.jpg', blurb: 'The meadow of gold, gateway to the Thajiwas glacier.' },
  pahalgam: { state: 'Jammu & Kashmir', region: 'Himalayas', image: 'dest-pahalgam.jpg', blurb: 'Pine valleys along the Lidder, and the start of the Amarnath trail.' },
  katra: { state: 'Jammu & Kashmir', region: 'Himalayas', image: 'dest-katra.jpg', blurb: 'The base town for the climb to Mata Vaishno Devi.' },
  vaishnodevi: { label: 'Vaishno Devi', state: 'Jammu & Kashmir', region: 'Himalayas', image: 'dest-vaishnodevi.jpg', blurb: 'The cave shrine in the Trikuta hills, reached on foot from Katra.' },

  // Uttar Pradesh
  varanasi: { state: 'Uttar Pradesh', region: 'North India', image: 'dest-varanasi.jpg', blurb: 'Ganga aarti at dusk, and the oldest living city on the river.' },
  kashi: { label: 'Kashi', state: 'Uttar Pradesh', region: 'North India', image: 'dest-varanasi.jpg', blurb: 'Kashi Vishwanath and the ghats that give Varanasi its other name.' },
  ayodhya: { state: 'Uttar Pradesh', region: 'North India', image: 'dest-ayodhya.jpg', blurb: 'The Ram Janmabhoomi temple and the ghats of the Sarayu.' },
  prayagraj: { state: 'Uttar Pradesh', region: 'North India', image: 'dest-prayagraj.jpg', blurb: 'Triveni Sangam, where the Ganga, Yamuna and Saraswati meet.' },
  vrindavan: { state: 'Uttar Pradesh', region: 'North India', image: 'dest-vrindavan.jpg', blurb: 'Banke Bihari, Prem Mandir and the lanes Krishna is said to have walked.' },
  mathura: { state: 'Uttar Pradesh', region: 'North India', image: 'dest-vrindavan.jpg', blurb: 'Shri Krishna Janmabhoomi and the Yamuna ghats.' },
  agra: { state: 'Uttar Pradesh', region: 'North India', image: 'dest-agra.jpg', blurb: 'The Taj Mahal at sunrise, and the red sandstone of Agra Fort.' },
  gorakhpur: { state: 'Uttar Pradesh', region: 'North India', image: 'dest-prayagraj.jpg', blurb: 'Gorakhnath Math, and the rail gateway to the Nepal border.' },

  // Bihar / Jharkhand
  gaya: { state: 'Bihar', region: 'East India', image: 'dest-gaya.jpg', blurb: 'Vishnupad, and Bodh Gaya where the Buddha found enlightenment.' },
  baidyanath: { label: 'Baidyanath Dham', state: 'Jharkhand', region: 'East India', image: 'dest-baidyanath.jpg', blurb: 'One of the twelve Jyotirlingas, at Deoghar.' },

  // Rajasthan
  jaipur: { state: 'Rajasthan', region: 'North India', image: 'dest-jaipur.jpg', blurb: 'Hawa Mahal, Amber Fort and the bazaars of the pink city.' },
  jodhpur: { state: 'Rajasthan', region: 'North India', image: 'dest-jodhpur.jpg', blurb: 'Mehrangarh above a sea of indigo houses.' },
  jaisalmer: { state: 'Rajasthan', region: 'North India', image: 'dest-jaisalmer.jpg', blurb: 'A living fort of golden sandstone on the edge of the Thar.' },
  longewala: { state: 'Rajasthan', region: 'North India', image: 'dest-thar.jpg', blurb: 'The 1971 battlefield and war memorial near the western border.' },
  kuldhara: { state: 'Rajasthan', region: 'North India', image: 'dest-thar.jpg', blurb: 'The abandoned village said to have emptied in a single night.' },

  // Punjab
  amritsar: { state: 'Punjab', region: 'North India', image: 'dest-amritsar.jpg', blurb: 'Harmandir Sahib, the langar hall, and the Wagah retreat.' },

  // Kerala
  kochi: { state: 'Kerala', region: 'South India', image: 'dest-kochi.jpg', blurb: 'Chinese fishing nets, Fort Kochi and five centuries of trade.' },
  cochin: { label: 'Cochin', state: 'Kerala', region: 'South India', image: 'dest-kochi.jpg', blurb: 'The harbour city at the mouth of the backwaters.' },
  munnar: { state: 'Kerala', region: 'South India', image: 'dest-munnar.jpg', blurb: 'Tea terraces folded over the Western Ghats at 1,600 metres.' },
  thekkady: { state: 'Kerala', region: 'South India', image: 'dest-thekkady.jpg', blurb: 'Periyar Tiger Reserve, spice estates and lake safaris.' },
  alleppey: { state: 'Kerala', region: 'South India', image: 'dest-alleppey.jpg', blurb: 'A night on a houseboat through the Kuttanad backwaters.' },

  // Nepal
  kathmandu: { state: 'Nepal', region: 'Nepal', image: 'dest-kathmandu.jpg', blurb: 'Pashupatinath, Boudhanath and the durbar squares of the valley.' },
  pokhara: { state: 'Nepal', region: 'Nepal', image: 'dest-pokhara.jpg', blurb: 'Phewa Lake under the Annapurna wall and Machhapuchhre.' },
  muktinath: { state: 'Nepal', region: 'Nepal', image: 'dest-muktinath.jpg', blurb: 'The 108 waterspouts at 3,800 metres in Mustang.' },
  lumbini: { state: 'Nepal', region: 'Nepal', image: 'dest-lumbini.jpg', blurb: 'The birthplace of the Buddha and the Ashoka pillar.' },
  chitwan: { state: 'Nepal', region: 'Nepal', image: 'dest-chitwan.jpg', blurb: 'Sal forest and grassland, rhino country on the Terai.' },
};

const FALLBACK_IMAGE = 'dest-varanasi.jpg';

/**
 * Destinations the CRM has not tagged on a package. Keyed by package slug, so
 * an itinerary that visits Mathura and Agra still appears under those places.
 */
const IMPLIED_DESTINATIONS: Record<string, string[]> = {
  'vrindavan-group-tour': ['mathura', 'vrindavan', 'agra'],
  'amritsar-vaishnodevi-shivkhori-group-tour': ['amritsar', 'katra', 'vaishnodevi'],
  'ayodhya-kashi-gaya-baidyanath-group-tour': ['gaya', 'baidyanath'],
};

/** Destination slugs for a package, including the ones implied by its itinerary. */
export function packageDestinations(pkg: Package): string[] {
  const fromCrm = (pkg.destinations ?? []).map((d) => d.trim().toLowerCase()).filter(Boolean);
  const implied = IMPLIED_DESTINATIONS[pkg.slug ?? ''] ?? [];
  return [...new Set([...fromCrm, ...implied])];
}

export interface Destination {
  slug: string;
  label: string;
  state: string;
  region: Region;
  image: string;
  blurb?: string;
  count: number;
}

export function destinationFor(slug: string, count = 0): Destination {
  const meta = DESTINATIONS[slug];
  return {
    slug,
    label: meta?.label ?? destinationLabel(slug),
    state: meta?.state ?? 'India',
    region: meta?.region ?? 'North India',
    image: `/images/${meta?.image ?? FALLBACK_IMAGE}`,
    blurb: meta?.blurb,
    count,
  };
}

/** Every destination across the catalogue, most-visited first. */
export function allDestinations(packages: Package[]): Destination[] {
  const counts = new Map<string, number>();
  for (const pkg of packages) {
    for (const slug of packageDestinations(pkg)) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([slug, count]) => destinationFor(slug, count))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/** Destinations grouped by state, biggest state first — used by the mega menu. */
export function destinationsByState(packages: Package[]): { state: string; items: Destination[] }[] {
  const groups = new Map<string, Destination[]>();
  for (const d of allDestinations(packages)) {
    const list = groups.get(d.state) ?? [];
    list.push(d);
    groups.set(d.state, list);
  }
  return [...groups.entries()]
    .map(([state, items]) => ({ state, items: items.sort((a, b) => a.label.localeCompare(b.label)) }))
    .sort((a, b) => b.items.length - a.items.length || a.state.localeCompare(b.state));
}

export function destinationsByRegion(packages: Package[]): { region: Region; items: Destination[] }[] {
  const groups = new Map<Region, Destination[]>();
  for (const d of allDestinations(packages)) {
    const list = groups.get(d.region) ?? [];
    list.push(d);
    groups.set(d.region, list);
  }
  return [...groups.entries()]
    .map(([region, items]) => ({ region, items }))
    .sort((a, b) => b.items.length - a.items.length);
}

export function packagesForDestination(packages: Package[], slug: string): Package[] {
  return packages.filter((p) => packageDestinations(p).includes(slug.toLowerCase()));
}

export function packagesForRegion(packages: Package[], region: Region): Package[] {
  return packages.filter((p) =>
    packageDestinations(p).some((slug) => (DESTINATIONS[slug]?.region ?? 'North India') === region),
  );
}

export function packagesForState(packages: Package[], state: string): Package[] {
  return packages.filter((p) =>
    packageDestinations(p).some((slug) => DESTINATIONS[slug]?.state === state),
  );
}

/* -------------------------------------------------------------------------- */
/* Themes — what a trip is for                                                */
/* -------------------------------------------------------------------------- */

export interface Theme {
  slug: string;
  label: string;
  blurb: string;
  /** Package slugs that belong to this theme. */
  packages: string[];
}

export const THEMES: Theme[] = [
  {
    slug: 'pilgrimage',
    label: 'Pilgrimage',
    blurb: 'Jyotirlingas, char dham and the temple towns of the Ganga plain.',
    packages: [
      'vrindavan-group-tour',
      'ayodhya-kashi-gaya-baidyanath-group-tour',
      'amritsar-vaishnodevi-shivkhori-group-tour',
      'nepal-with-muktinath-group-tour',
      'kashmir-with-vaishnodevi-group-tour',
    ],
  },
  {
    slug: 'hill-station',
    label: 'Hills & Valleys',
    blurb: 'Kashmir meadows, Munnar tea country and the Annapurna foothills.',
    packages: ['kashmir-with-vaishnodevi-group-tour', 'kerala-group-tour', 'nepal-with-muktinath-group-tour'],
  },
  {
    slug: 'heritage',
    label: 'Heritage & Forts',
    blurb: 'Rajput forts, Mughal monuments and walled cities still lived in.',
    packages: ['royal-rajasthan-group-tour', 'vrindavan-group-tour'],
  },
  {
    slug: 'family',
    label: 'Family',
    blurb: 'Gentle pacing, twin and triple sharing, and a tour manager throughout.',
    packages: [
      'vrindavan-group-tour',
      'kerala-group-tour',
      'royal-rajasthan-group-tour',
      'kashmir-with-vaishnodevi-group-tour',
      'ayodhya-kashi-gaya-baidyanath-group-tour',
      'amritsar-vaishnodevi-shivkhori-group-tour',
    ],
  },
  {
    slug: 'honeymoon',
    label: 'Honeymoon',
    blurb: 'Houseboats, hill stations and the quieter corners of a group route.',
    packages: ['kerala-group-tour', 'kashmir-with-vaishnodevi-group-tour'],
  },
  {
    slug: 'international',
    label: 'International',
    blurb: 'Across the border to Nepal, on the same fixed-departure terms.',
    packages: ['nepal-with-muktinath-group-tour'],
  },
];

export function packagesForTheme(packages: Package[], slug: string): Package[] {
  const theme = THEMES.find((t) => t.slug === slug);
  if (!theme) return [];
  return packages.filter((p) => theme.packages.includes(p.slug ?? ''));
}

export function themesWithCounts(packages: Package[]): (Theme & { count: number })[] {
  return THEMES.map((t) => ({ ...t, count: packagesForTheme(packages, t.slug).length })).filter((t) => t.count > 0);
}

/* -------------------------------------------------------------------------- */
/* Seasons                                                                    */
/* -------------------------------------------------------------------------- */

export interface Season {
  slug: string;
  label: string;
  window: string;
  note: string;
  /** Tailwind classes for the tinted card, matching the reference's palette. */
  tone: string;
  months: number[];
}

export const SEASONS: Season[] = [
  { slug: 'year-round', label: 'Year Round', window: 'Always open', note: 'All-weather routes', tone: 'border-border bg-raised', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  { slug: 'summer', label: 'Summer', window: 'Mar – Jun', note: 'Hills & valleys', tone: 'border-meadow-300/60 bg-meadow-50', months: [3, 4, 5, 6] },
  { slug: 'monsoon', label: 'Monsoon', window: 'Jun – Sep', note: 'Waterfalls & green', tone: 'border-meadow-500/40 bg-meadow-50', months: [6, 7, 8, 9] },
  { slug: 'winter', label: 'Winter', window: 'Oct – Feb', note: 'Peak season', tone: 'border-amber/40 bg-amber-50', months: [10, 11, 12, 1, 2] },
];

/** Which seasons suit a package, by the destinations it visits. */
export function seasonsForPackage(pkg: Package): string[] {
  const slugs = packageDestinations(pkg);
  const regions = new Set(slugs.map((s) => DESTINATIONS[s]?.region).filter(Boolean));
  const out = new Set<string>(['year-round']);
  if (regions.has('Himalayas') || regions.has('Nepal')) out.add('summer');
  if (regions.has('South India')) out.add('monsoon');
  if (regions.has('North India') || regions.has('East India')) out.add('winter');
  if (regions.has('South India')) out.add('winter');
  return [...out];
}

export function packagesForSeason(packages: Package[], slug: string): Package[] {
  if (slug === 'year-round') return packages;
  return packages.filter((p) => seasonsForPackage(p).includes(slug));
}

/* -------------------------------------------------------------------------- */
/* Departure cities                                                           */
/* -------------------------------------------------------------------------- */

export interface DepartureCity {
  slug: string;
  label: string;
  state: string;
  note: string;
  image: string;
}

/**
 * MK Tours' fixed departures run on train from Mumbai, with a Pune boarding
 * option on the same rake. Everything in the catalogue leaves from here.
 */
export const DEPARTURE_CITIES: DepartureCity[] = [
  { slug: 'mumbai', label: 'Mumbai', state: 'Maharashtra', note: 'CSMT / LTT · train departures', image: '/images/city-mumbai.jpg' },
  { slug: 'pune', label: 'Pune', state: 'Maharashtra', note: 'Boarding on the same rake', image: '/images/city-mumbai-night.jpg' },
];

export function packagesForCity(packages: Package[]): Package[] {
  // Every fixed departure currently originates in Mumbai, with Pune boarding.
  return packages;
}

/* -------------------------------------------------------------------------- */
/* Duration buckets                                                           */
/* -------------------------------------------------------------------------- */

export interface DurationBucket {
  days: number;
  nights: number;
  short: string;
  label: string;
  count: number;
}

export function durationBuckets(packages: Package[]): DurationBucket[] {
  const map = new Map<number, number>();
  for (const pkg of packages) {
    if (pkg.days) map.set(pkg.days, (map.get(pkg.days) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([days, count]) => {
      const nights = Math.max(days - 1, 0);
      return {
        days,
        nights,
        short: `${nights}N`,
        label: `${days} Days / ${nights} Nights`,
        count,
      };
    });
}

/** "6 Days / 5 Nights" for a package, or "" when the CRM has no duration. */
export function longDuration(pkg: Package): string {
  if (!pkg.days) return '';
  const nights = durationNights(pkg);
  return nights === 0 ? '1 Day Trip' : `${pkg.days} Days / ${nights} Nights`;
}

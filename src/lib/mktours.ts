// Read-only data layer for MK Tours.
//
// Everything here is a GET against the CRM's PUBLIC endpoints — the same routes
// the agency's own public page (tripzocrm.com/hosts/mk-tours) reads. Nothing in
// this file writes to Supabase, and every request is pinned to MK Tours' org id,
// so no other agency's data can reach the site.

export const MK_TOURS_ORG_ID = '32c3d1c0-0ae1-4f2a-bf02-a34846ad07cd';
export const MK_TOURS_SLUG = 'mk-tours';

const API_BASE = 'https://api.tripzocrm.cloud/api/public';
const STORAGE_BASE = 'https://supa.tripzocrm.cloud/storage/v1/object/public/media';

/** Seconds a fetched page may be served before it is refreshed from the CRM. */
const REVALIDATE = 900;

export interface Host {
  id: string;
  name: string;
  image_url: string | null;
  cover_image_url: string | null;
  description: string | null;
  slug: string | null;
  whatsapp_number: string | null;
}

export interface Pricing {
  label: string;
  price: number;
}

export interface Package {
  id: string;
  organization_id: string;
  package_name: string;
  slug: string | null;
  package_code: string | null;
  description: string | null;
  highlights: string | null;
  inclusions: string | null;
  exclusions: string | null;
  terms_and_conditions: string | null;
  payment_policy: string | null;
  cancellation_policy: string | null;
  privacy_policy: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  days: number | null;
  nights: number | null;
  price: number | null;
  original_price: number | null;
  currency: string | null;
  banner_image: string | null;
  whatsapp_banner_image: string | null;
  package_pdf: string | null;
  package_type: string | null;
  pricing: Pricing[] | null;
  destinations: string[] | null;
  is_visible: boolean;
  updated_at: string | null;
  extra_data: Record<string, unknown> | null;
}

export interface TourDay {
  id: string;
  day_num: number;
  title: string | null;
  sightseeing: {
    activity: string | null;
    description_points: string | null;
    city: string | null;
    country: string | null;
  } | null;
}

export interface TourDetail {
  pkg: Package;
  days: TourDay[];
}

export interface Team {
  id: string;
  full_name: string;
  role: string;
}

export interface Legal {
  privacy_html: string;
  terms_html: string;
  contact: { phone?: string; email?: string; website?: string };
}

/** GET a public endpoint, cached for REVALIDATE seconds. Throws on any failure. */
async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`CRM ${path} responded ${res.status}`);
  return (await res.json()) as T;
}

export function getHost(): Promise<Host> {
  return getJson<Host>(`/hosts/${MK_TOURS_ORG_ID}`);
}

/** Visible packages for MK Tours only. The org check is a second guard on top of the URL. */
export async function getPackages(): Promise<Package[]> {
  const rows = await getJson<Package[]>(`/hosts/${MK_TOURS_ORG_ID}/packages`);
  return rows.filter((p) => p.organization_id === MK_TOURS_ORG_ID && p.is_visible);
}

export async function getPackageBySlug(slug: string): Promise<Package | undefined> {
  const packages = await getPackages();
  return packages.find((p) => p.slug === slug);
}

export async function getTour(slug: string): Promise<TourDetail | null> {
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return null;
  const detail = await getJson<TourDetail>(`/tours/${encodeURIComponent(pkg.slug ?? pkg.id)}`);
  if (detail.pkg.organization_id !== MK_TOURS_ORG_ID) return null;
  return { pkg: detail.pkg, days: detail.days ?? [] };
}

export async function getTeam(): Promise<Team[]> {
  const rows = await getJson<Team[]>(`/hosts/${MK_TOURS_ORG_ID}/team`);
  return Array.isArray(rows) ? rows : [];
}

export function getLegal(): Promise<Legal> {
  return getJson<Legal>(`/legal/${MK_TOURS_ORG_ID}`);
}

/** Resolve a stored Supabase Storage path (e.g. "packages/<org>/<id>.png") to a public URL. */
export function mediaUrl(path: string | null | undefined): string | undefined {
  const value = path?.trim();
  if (!value) return undefined;
  if (value.startsWith('http')) return value;
  return `${STORAGE_BASE}/${value.replace(/^\/+/, '')}`;
}

/** Card image: the WhatsApp banner first, like the CRM catalogue does, then the banner. */
export function packageImage(pkg: Package): string | undefined {
  return mediaUrl(pkg.whatsapp_banner_image) ?? mediaUrl(pkg.banner_image);
}

/** "6D / 5N", or nothing when the package has no duration. */
export function durationLabel(pkg: Package): string {
  const days = pkg.days ?? 0;
  if (!days) return '';
  const nights = pkg.nights ?? Math.max(days - 1, 0);
  return `${days}D / ${nights}N`;
}

/** Lowest price across the package's pricing options, falling back to the headline price. */
export function startingPrice(pkg: Package): number | null {
  const options = (pkg.pricing ?? []).map((o) => o.price).filter((n) => n > 0);
  if (options.length) return Math.min(...options);
  return pkg.price && pkg.price > 0 ? pkg.price : null;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/** Wa.me deep link. Opens WhatsApp in the visitor's own app; no data is sent to the CRM. */
export function whatsappLink(number: string | null | undefined, text?: string): string | undefined {
  const digits = number?.replace(/\D/g, '');
  if (!digits) return undefined;
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${digits}${query}`;
}

/** Display name for a destination slug from the CRM, e.g. "varanasi" → "Varanasi". */
export function destinationLabel(slug: string): string {
  return slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Every destination across the packages, with how many packages mention it, most common first. */
export function getDestinations(packages: Package[]): { slug: string; label: string; count: number; image?: string }[] {
  const map = new Map<string, { count: number; image?: string }>();
  for (const pkg of packages) {
    for (const raw of pkg.destinations ?? []) {
      const slug = raw.trim().toLowerCase();
      if (!slug) continue;
      const entry = map.get(slug) ?? { count: 0, image: undefined };
      entry.count += 1;
      entry.image ??= packageImage(pkg);
      map.set(slug, entry);
    }
  }
  return [...map.entries()]
    .map(([slug, v]) => ({ slug, label: destinationLabel(slug), ...v }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/** Distinct duration options ("6D / 5N"), shortest first, with package counts. */
export function getDurations(packages: Package[]): { days: number; label: string; count: number }[] {
  const map = new Map<number, number>();
  for (const pkg of packages) {
    if (pkg.days) map.set(pkg.days, (map.get(pkg.days) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([days, count]) => ({ days, count, label: `${days} Days` }));
}

/** The agency's public social/contact links, from the packages' extra_data (first one that has them). */
export function getContactExtras(packages: Package[]): {
  instagram?: string;
  googleProfile?: string;
  website?: string;
  emergencyPhone?: string;
} {
  for (const pkg of packages) {
    const contact = (pkg.extra_data?.contact ?? {}) as Record<string, string | undefined>;
    if (contact.instagram_url || contact.google_profile_url || contact.website) {
      return {
        instagram: contact.instagram_url,
        googleProfile: contact.google_profile_url,
        website: contact.website,
        emergencyPhone: contact.emergency_phone,
      };
    }
  }
  return {};
}

/** Public web address for the agency's own site. */
export function websiteUrl(website: string | undefined): string | undefined {
  if (!website) return undefined;
  return website.startsWith('http') ? website : `https://${website}`;
}

/** Lines of the agency's description, minus the emoji-only lines, for the hero and intro. */
export function descriptionLines(description: string | null | undefined): string[] {
  return (description ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !/^📞/.test(l));
}

/* -------------------------------------------------------------------------- */
/* Presentation helpers                                                       */
/* -------------------------------------------------------------------------- */

/** Nights for a package: the CRM value when set, otherwise days - 1. */
export function durationNights(pkg: Package): number {
  if (typeof pkg.nights === 'number' && pkg.nights >= 0) return pkg.nights;
  return Math.max((pkg.days ?? 1) - 1, 0);
}

/** "3 Days / 2 Nights", or "1 Day Trip" — the reference site's phrasing. */
export function durationPhrase(pkg: Package): string {
  if (!pkg.days) return '';
  const nights = durationNights(pkg);
  return nights === 0 ? '1 Day Trip' : `${pkg.days} Days / ${nights} Nights`;
}

/** Highest price across the package's sharing options, for a "from–to" range. */
export function topPrice(pkg: Package): number | null {
  const options = (pkg.pricing ?? []).map((o) => o.price).filter((n) => n > 0);
  if (options.length) return Math.max(...options);
  return pkg.price && pkg.price > 0 ? pkg.price : null;
}

/** The CRM stores "9309901865 | 8308686083"; take the numbers one at a time. */
export function phoneNumbers(raw: string | null | undefined): string[] {
  return (raw ?? '')
    .split('|')
    .map((p) => p.trim())
    .filter(Boolean);
}

/** A tel: href for a raw CRM phone string, assuming +91 when no country code. */
export function telHref(raw: string | null | undefined): string | undefined {
  const digits = (raw ?? '').replace(/\D/g, '');
  if (!digits) return undefined;
  return `tel:+${digits.length === 10 ? '91' + digits : digits}`;
}

/** "+91 93099 01865" from any of the CRM's phone spellings. */
export function formatPhone(raw: string | null | undefined): string {
  const digits = (raw ?? '').replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return raw ?? '';
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

/** Strip CRM rich text down to a plain sentence, for cards and meta tags. */
export function plainText(html: string | null | undefined, max = 160): string {
  const text = (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/[\s,.;:–-]+\S*$/, '') + '…';
}

/** The headline a card shows under the title, from highlights or description. */
export function packageTagline(pkg: Package): string {
  return plainText(pkg.description, 120) || plainText(pkg.highlights, 120);
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { Button, Display, Eyebrow, Icon } from '@/components/ui';
import { CompassRose, FlightTag, PineTree, SmokeShadow, TopoField } from '@/components/Decor';
import { packagesForTheme, THEMES, themesWithCounts } from '@/lib/catalog';
import { AGENCY } from '@/lib/content';
import { getPackages, whatsappLink } from '@/lib/mktours';

const THEME_IMAGES: Record<string, string> = {
  pilgrimage: '/images/dest-varanasi.jpg',
  'hill-station': '/images/dest-gulmarg.jpg',
  heritage: '/images/dest-jaisalmer.jpg',
  family: '/images/hero-alleppey.jpg',
  honeymoon: '/images/dest-munnar.jpg',
  international: '/images/dest-pokhara.jpg',
};

export const dynamicParams = false;

export function generateStaticParams() {
  return THEMES.map((t) => ({ slug: t.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const theme = THEMES.find((t) => t.slug === slug);
  if (!theme) return { title: 'Not found' };
  return { title: `${theme.label} Tours`, description: theme.blurb };
}

export default async function ThemePage({ params }: Props) {
  const { slug } = await params;
  const theme = THEMES.find((t) => t.slug === slug);
  if (!theme) notFound();

  const packages = await getPackages();
  const tours = packagesForTheme(packages, slug);
  const others = themesWithCounts(packages).filter((t) => t.slug !== slug);
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'm looking at your ${theme.label.toLowerCase()} tours.`);

  return (
    <>
      <PageHero
        image={THEME_IMAGES[slug] ?? '/images/hero-varanasi.jpg'}
        eyebrow="Explore trips"
        title={`${theme.label} Tours`}
        lede={theme.blurb}
        crumbs={[{ href: '/packages', label: 'Explore Trips' }, { label: theme.label }]}
      >
        <FlightTag from="Mumbai" to={theme.label} note={`${tours.length} ${tours.length === 1 ? 'tour' : 'tours'}`} />
      </PageHero>

      <div className="relative overflow-hidden">
        <TopoField className="pointer-events-none absolute -right-12 top-[12%] hidden h-[320px] w-[38%] text-sherwood-700/8 lg:block" />
        <CompassRose className="pointer-events-none absolute -left-20 bottom-[22%] hidden h-[250px] w-[250px] text-sherwood-700/8 xl:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          {tours.length > 0 ? (
            <>
              <div className="mb-9">
                <Eyebrow className="mb-4">Departures</Eyebrow>
                <Display className="display-caps text-[27px] sm:text-[33px]">
                  {tours.length} {theme.label.toLowerCase()} {tours.length === 1 ? 'departure' : 'departures'}
                </Display>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tours.map((p, i) => (
                  <PackageCard key={p.id} pkg={p} priority={i < 3} />
                ))}
              </div>
            </>
          ) : (
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-16 text-center shadow-soft">
              <SmokeShadow className="pointer-events-none absolute inset-0 h-full w-full text-sherwood-600/12" />
              <PineTree className="pointer-events-none absolute -bottom-2 right-10 hidden h-[150px] w-[64px] text-sherwood-700/12 tree-breathe sm:block" />
              <div className="relative">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-meadow-50 text-meadow-700 ring-1 ring-meadow-300/60">
                  <Icon name="sparkle" className="h-6 w-6" />
                </span>
                <p className="text-[14.5px] text-muted">Nothing scheduled under this theme at the moment.</p>
                {wa && (
                  <Button href={wa} external variant="meadow" className="mt-7">
                    Ask us what is coming up
                  </Button>
                )}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <section className="mt-20">
              <Eyebrow className="mb-4">Change direction</Eyebrow>
              <Display className="display-caps text-[27px] sm:text-[33px]">Other ways to travel</Display>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {others.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/themes/${t.slug}`}
                    className="group/t inline-flex items-center gap-2 rounded-full border border-border bg-raised px-4 py-2.5 text-[12.5px] font-semibold text-text shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-meadow-300 hover:bg-meadow-50 hover:text-meadow-700"
                  >
                    {t.label}
                    <span className="rounded-full bg-surface px-1.5 py-0.5 text-[10px] font-bold text-subtle transition-colors group-hover/t:bg-meadow-100 group-hover/t:text-meadow-700">
                      {t.count}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

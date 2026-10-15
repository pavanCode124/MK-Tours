import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CardRail } from '@/components/CardRail';
import { PACKAGE_ITEM, PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { ExperienceCard } from '@/components/sections';
import { Button, Display, Icon } from '@/components/ui';
import { CompassRose, PineTree, SmokeShadow, TopoField } from '@/components/Decor';
import { packagesForTheme, THEME_IMAGES, THEMES, themesWithCounts } from '@/lib/catalog';
import { AGENCY } from '@/lib/content';
import { getPackages, whatsappLink } from '@/lib/mktours';


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
        title={`${theme.label} Tours`}
        lede={theme.blurb}
        crumbs={[{ href: '/packages', label: 'Explore Trips' }, { label: theme.label }]}
      >
      </PageHero>

      <div className="relative overflow-hidden">
        <TopoField className="pointer-events-none absolute -right-12 top-[12%] hidden h-[320px] w-[38%] text-azure-700/8 lg:block" />
        <CompassRose className="pointer-events-none absolute -left-20 bottom-[22%] hidden h-[250px] w-[250px] text-azure-700/8 xl:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-10 md:px-8 lg:px-12 lg:py-14">
          {tours.length > 0 ? (
            <>
              <div className="mb-9">
                <Display className="display-caps text-[27px] sm:text-[33px]">
                  {tours.length} {theme.label.toLowerCase()} {tours.length === 1 ? 'departure' : 'departures'}
                </Display>
              </div>
              <CardRail itemClassName={PACKAGE_ITEM} label="Departures">
                {tours.map((p, i) => (
                  <PackageCard key={p.id} pkg={p} priority={i < 3} />
                ))}
              </CardRail>
            </>
          ) : (
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-12 text-center shadow-soft">
              <SmokeShadow className="pointer-events-none absolute inset-0 h-full w-full text-azure-600/12" />
              <PineTree className="pointer-events-none absolute -bottom-2 right-10 hidden h-[150px] w-[64px] text-azure-700/12 tree-breathe sm:block" />
              <div className="relative">
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-vermilion-50 text-vermilion-700 ring-1 ring-vermilion-300/60">
                  <Icon name="sparkle" className="h-6 w-6" />
                </span>
                <p className="text-[14.5px] text-muted">Nothing scheduled under this theme at the moment.</p>
                {wa && (
                  <Button href={wa} external variant="accent" className="mt-7">
                    Ask us what is coming up
                  </Button>
                )}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <section className="mt-20">
              <Display className="display-caps text-[27px] sm:text-[33px]">Other ways to travel</Display>
              <CardRail className="mt-7" itemClassName="w-[230px] sm:w-[250px] lg:w-[265px]" label="Other experiences">
                {others.map((t) => (
                  <ExperienceCard key={t.slug} theme={t} />
                ))}
              </CardRail>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

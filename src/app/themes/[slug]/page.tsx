import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PackageCard } from '@/components/PackageCard';
import { PageHero } from '@/components/PageHero';
import { Button, Display } from '@/components/ui';
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
      />

      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        {tours.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((p, i) => (
              <PackageCard key={p.id} pkg={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-surface px-6 py-14 text-center">
            <p className="text-[14px] text-muted">Nothing scheduled under this theme at the moment.</p>
            {wa && (
              <Button href={wa} external variant="solid" className="mt-6">
                Ask us what is coming up
              </Button>
            )}
          </div>
        )}

        {others.length > 0 && (
          <section className="mt-16 border-t border-border pt-12">
            <Display className="text-[26px]">Other ways to travel</Display>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {others.map((t) => (
                <Link
                  key={t.slug}
                  href={`/themes/${t.slug}`}
                  className="rounded-xl border border-border-strong bg-raised px-4 py-2.5 text-[12.5px] text-text transition-colors hover:border-sherwood-800 hover:text-sherwood-800"
                >
                  {t.label} <span className="text-subtle">({t.count})</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

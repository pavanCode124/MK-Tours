import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { GuideCard } from '@/components/sections';
import { Button, Display, Eyebrow, Icon } from '@/components/ui';
import { CameraBadge, FlightTag, PineTree, TopoField } from '@/components/Decor';
import { AGENCY, GUIDES } from '@/lib/content';
import { whatsappLink } from '@/lib/mktours';

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return { title: 'Guide not found' };
  return { title: guide.title, description: guide.excerpt };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) notFound();

  const more = GUIDES.filter((g) => g.slug !== slug).slice(0, 3);
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I read your guide "${guide.title}" and have a question.`);

  return (
    <>
      <PageHero
        image={guide.image}
        eyebrow={guide.kicker}
        title={guide.title}
        lede={guide.excerpt}
        crumbs={[{ href: '/blog', label: 'Travel Guides' }, { label: guide.title }]}
      >
        <FlightTag from="Journal" to={guide.kicker} note={`${guide.readMinutes} min read`} />
      </PageHero>

      <div className="relative overflow-hidden">
        <TopoField className="pointer-events-none absolute -right-12 top-[18%] hidden h-[320px] w-[34%] text-sherwood-700/8 xl:block" />
        <CameraBadge className="pointer-events-none absolute -left-12 top-[12%] hidden h-[200px] w-[240px] -rotate-6 text-sherwood-700/8 xl:block" />

        <article className="relative mx-auto max-w-[820px] px-5 py-14 md:px-8 lg:py-20">
          {/* The body sits on a raised card, so a long read has an edge to hold. */}
          <div className="card p-7 sm:p-11">
            <div className="flex flex-wrap items-center gap-3 border-b border-border pb-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-meadow-50 px-3.5 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-meadow-700">
                <Icon name="book" className="h-3.5 w-3.5" />
                {guide.kicker}
              </span>
              <span className="inline-flex items-center gap-2 text-[11.5px] font-semibold text-subtle">
                <Icon name="clock" className="h-3.5 w-3.5" />
                {guide.readMinutes} min read
              </span>
            </div>
            <div className="mt-8 space-y-6 text-[15.5px] leading-[1.85] text-muted">
              {guide.body.map((p, i) => (
                <p
                  key={p.slice(0, 40)}
                  className={
                    i === 0
                      ? 'text-[17px] leading-[1.75] text-text first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[52px] first-letter:font-bold first-letter:leading-[0.85] first-letter:text-meadow-600'
                      : ''
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-[1.75rem] bg-sherwood-900 p-8 text-on-dark shadow-float sm:p-10">
            <PineTree className="pointer-events-none absolute -bottom-1 right-5 hidden h-[140px] w-[60px] text-black/25 tree-breathe sm:block" />
            <div className="relative">
              <Eyebrow tone="dark" className="mb-4">
                Over to you
              </Eyebrow>
              <Display className="text-[23px] text-on-dark">Planning this trip?</Display>
              <p className="mt-3 text-[13.5px] leading-[1.75] text-on-dark/80">
                We run this route as a fixed departure from Mumbai, and privately on your own dates. Tell us what you have
                in mind and we will send the next departure date and a price.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="/packages" variant="meadow">
                  See our departures
                </Button>
                {wa && (
                  <Button href={wa} external variant="onDark">
                    Ask a question
                  </Button>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>

      {more.length > 0 && (
        <section className="relative overflow-hidden bg-surface py-16 lg:py-20">
          <div className="pointer-events-none absolute inset-0 dotfield opacity-50" />
          <div className="relative mx-auto max-w-[1320px] px-5 md:px-8 lg:px-12">
            <Eyebrow className="mb-4">Keep reading</Eyebrow>
            <Display className="display-caps text-[27px] sm:text-[33px]">More guides</Display>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((g) => (
                <GuideCard key={g.slug} {...g} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

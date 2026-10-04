import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/PageHero';
import { GuideCard } from '@/components/sections';
import { Button, Display } from '@/components/ui';
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
      />

      <article className="mx-auto max-w-[760px] px-5 py-12 md:px-8 lg:py-16">
        <p className="text-[11.5px] uppercase tracking-[0.12em] text-subtle">{guide.readMinutes} min read</p>
        <div className="mt-8 space-y-6 text-[15.5px] leading-[1.8] text-muted">
          {guide.body.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>

        <div className="mt-12 border border-border bg-surface p-7">
          <Display className="text-[22px]">Planning this trip?</Display>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">
            We run this route as a fixed departure from Mumbai, and privately on your own dates. Tell us what you have in
            mind and we will send the next departure date and a price.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/packages" variant="solid">
              See our departures
            </Button>
            {wa && (
              <Button href={wa} external variant="outline">
                Ask a question
              </Button>
            )}
          </div>
        </div>
      </article>

      {more.length > 0 && (
        <section className="border-t border-border py-14">
          <div className="mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12">
            <Display className="text-[26px]">More guides</Display>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

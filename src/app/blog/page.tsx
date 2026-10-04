import type { Metadata } from 'next';
import { PlainPageHero } from '@/components/PageHero';
import { GuideCard } from '@/components/sections';
import { GUIDES } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Travel Guides',
  description:
    'Practical guides to the places MK Tours travels to — when to go, how long you need, and what each route actually involves.',
};

export default function BlogPage() {
  return (
    <>
      <PlainPageHero
        eyebrow="Resources"
        title="Read Before You Go"
        lede="Short, practical notes on the places we travel to — written by the people who run the routes, not by a content desk."
        crumbs={[{ label: 'Travel Guides' }]}
      />

      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <GuideCard key={g.slug} {...g} />
          ))}
        </div>
      </div>
    </>
  );
}

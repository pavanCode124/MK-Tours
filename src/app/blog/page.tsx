import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PlainPageHero } from '@/components/PageHero';
import { GuideCard } from '@/components/sections';
import { Display, Eyebrow, Icon } from '@/components/ui';
import { CameraBadge, FlightPath, PineTree, TopoField } from '@/components/Decor';
import { GUIDES } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Travel Guides',
  description:
    'Practical guides to the places MK Tours travels to — when to go, how long you need, and what each route actually involves.',
};

export default function BlogPage() {
  const [lead, ...rest] = GUIDES;

  return (
    <>
      <PlainPageHero
        eyebrow="Resources"
        title={
          <>
            Read before <span className="flourish">you go</span>
          </>
        }
        lede="Short, practical notes on the places we travel to — written by the people who run the routes, not by a content desk."
        crumbs={[{ label: 'Travel Guides' }]}
      />

      <div className="relative overflow-hidden">
        <CameraBadge className="pointer-events-none absolute -left-10 top-[30%] hidden h-[220px] w-[260px] -rotate-6 text-azure-700/8 xl:block" />
        <TopoField className="pointer-events-none absolute -right-10 bottom-[18%] hidden h-[320px] w-[40%] text-azure-700/8 lg:block" />
        <FlightPath
          variant="fall"
          className="pointer-events-none absolute right-0 top-6 hidden h-[150px] w-[60%] text-vermilion-500/15 lg:block"
        />
        <PineTree className="pointer-events-none absolute -bottom-2 left-[6%] hidden h-[190px] w-[82px] text-azure-700/10 tree-breathe lg:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          {/* The newest guide leads as a wide feature card */}
          {lead && (
            <Link
              href={`/blog/${lead.slug}`}
              className="card group mb-6 grid overflow-hidden lg:grid-cols-[1.05fr_1fr] hover:card-hover"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[340px]">
                <Image
                  src={lead.image}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-105"
                />
                <span className="sheen pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-azure-900/55 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-on-dark backdrop-blur-md">
                  Latest · {lead.kicker}
                </span>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <Eyebrow className="mb-4">Featured guide</Eyebrow>
                <Display className="text-[26px] leading-tight sm:text-[32px]">{lead.title}</Display>
                <p className="mt-4 text-[14px] leading-[1.8] text-muted">{lead.excerpt}</p>
                <span className="mt-7 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-vermilion-700">
                  <Icon name="clock" className="h-4 w-4" />
                  {lead.readMinutes} min read
                  <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((g) => (
              <GuideCard key={g.slug} {...g} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

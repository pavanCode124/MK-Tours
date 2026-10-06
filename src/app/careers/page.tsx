import type { Metadata } from 'next';
import { PlainPageHero } from '@/components/PageHero';
import { Button, Display, Eyebrow, Icon } from '@/components/ui';
import { BanyanTree, FlightPath, PineTree, SmokeShadow, TopoField } from '@/components/Decor';
import { AGENCY } from '@/lib/content';
import { whatsappLink } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Work with MK Tours — tour managers, ground coordinators and travel consultants, based in Mumbai.',
};

const ROLES = [
  {
    title: 'Tour Manager',
    type: 'Full time · On the road',
    icon: 'compass' as const,
    body: 'Travel with group departures from Mumbai, hold the itinerary together, and look after travellers from the platform out and back. Hindi and Marathi essential; a third language helps.',
  },
  {
    title: 'Ground Coordinator',
    type: 'Full time · Mumbai office',
    icon: 'home' as const,
    body: 'Hold the hotels, the coaches and the rail bookings together before a departure leaves. Detail work, phone work, and the discipline to confirm everything twice.',
  },
  {
    title: 'Travel Consultant',
    type: 'Full time · Mumbai office',
    icon: 'phone' as const,
    body: 'Answer enquiries, build quotations, and take travellers from the first WhatsApp message to a confirmed booking. Knowing the destinations matters more than knowing a CRM.',
  },
];

export default function CareersPage() {
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to apply for a role.`);

  return (
    <>
      <PlainPageHero
        eyebrow="Resources"
        title={
          <>
            Work <span className="flourish">with us</span>
          </>
        }
        lede="We are a small team that runs a lot of departures. If you like the road, the detail, or both, we would like to hear from you."
        crumbs={[{ label: 'Careers' }]}
      />

      <div className="relative overflow-hidden">
        <FlightPath
          variant="rise"
          className="pointer-events-none absolute left-[4%] top-8 hidden h-[150px] w-[80%] text-vermilion-500/15 lg:block"
        />
        <TopoField className="pointer-events-none absolute -left-12 bottom-[22%] hidden h-[300px] w-[38%] text-azure-700/8 lg:block" />
        <BanyanTree className="pointer-events-none absolute -right-14 top-[25%] hidden h-[240px] w-[240px] text-azure-700/8 xl:block" />

        <div className="relative mx-auto max-w-[1320px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          <div className="mb-9">
            <Eyebrow className="mb-4">Open roles</Eyebrow>
            <Display className="display-caps text-[27px] sm:text-[33px]">
              {ROLES.length} roles we are hiring for
            </Display>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {ROLES.map((r) => (
              <div key={r.title} className="card group flex flex-col p-7 hover:card-hover">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-azure-800 text-vermilion-300 shadow-soft transition-colors duration-500 group-hover:bg-vermilion-500 group-hover:text-white">
                  <Icon name={r.icon} className="h-5 w-5" />
                </span>
                <span className="inline-flex w-fit rounded-full bg-vermilion-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-vermilion-700">
                  {r.type}
                </span>
                <h2 className="mt-3 font-display text-[22px] font-semibold leading-snug text-text">{r.title}</h2>
                <p className="mt-3 flex-1 text-[13.5px] leading-[1.75] text-muted">{r.body}</p>
                <a
                  href={`mailto:${AGENCY.email}?subject=${encodeURIComponent(`Application: ${r.title}`)}`}
                  className="mt-7 inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg px-5 py-2.5 text-[11.5px] font-bold uppercase tracking-[0.12em] text-text transition-all duration-300 hover:border-azure-700 hover:bg-azure-800 hover:text-on-dark"
                >
                  Apply for this role
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </div>
            ))}
          </div>

          <div className="relative mt-16 overflow-hidden rounded-[2rem] border border-border bg-surface px-6 py-12 text-center shadow-soft">
            <SmokeShadow className="pointer-events-none absolute inset-0 h-full w-full text-azure-600/12" />
            <PineTree className="pointer-events-none absolute -bottom-2 left-10 hidden h-[150px] w-[64px] text-azure-700/12 tree-breathe sm:block" />
            <div className="relative">
              <Eyebrow className="mb-4">Open application</Eyebrow>
              <Display className="text-[24px]">Nothing here that fits?</Display>
              <p className="mx-auto mt-3.5 max-w-lg text-[13.5px] leading-[1.75] text-muted">
                Send us your CV anyway. We hire when the right person turns up, not only when a role is posted.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href={`mailto:${AGENCY.email}?subject=Open%20application`} external variant="solid">
                  Email your CV
                </Button>
                {wa && (
                  <Button href={wa} external variant="outline">
                    Message us
                  </Button>
                )}
              </div>
              <p className="mt-7 inline-flex items-center gap-2 rounded-full bg-raised px-4 py-2 text-[12px] text-muted shadow-soft">
                <Icon name="pin" className="h-4 w-4 text-vermilion-700" />
                {AGENCY.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

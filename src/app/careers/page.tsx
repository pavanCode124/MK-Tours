import type { Metadata } from 'next';
import { PlainPageHero } from '@/components/PageHero';
import { Button, Display, Icon } from '@/components/ui';
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
    body: 'Travel with group departures from Mumbai, hold the itinerary together, and look after travellers from the platform out and back. Hindi and Marathi essential; a third language helps.',
  },
  {
    title: 'Ground Coordinator',
    type: 'Full time · Mumbai office',
    body: 'Hold the hotels, the coaches and the rail bookings together before a departure leaves. Detail work, phone work, and the discipline to confirm everything twice.',
  },
  {
    title: 'Travel Consultant',
    type: 'Full time · Mumbai office',
    body: 'Answer enquiries, build quotations, and take travellers from the first WhatsApp message to a confirmed booking. Knowing the destinations matters more than knowing a CRM.',
  },
];

export default function CareersPage() {
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to apply for a role.`);

  return (
    <>
      <PlainPageHero
        eyebrow="Resources"
        title="Work With Us"
        lede="We are a small team that runs a lot of departures. If you like the road, the detail, or both, we would like to hear from you."
        crumbs={[{ label: 'Careers' }]}
      />

      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        <div className="grid gap-5 lg:grid-cols-3">
          {ROLES.map((r) => (
            <div key={r.title} className="flex flex-col border border-border bg-raised p-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-meadow-700">{r.type}</span>
              <h2 className="mt-2 font-display text-[22px] font-normal leading-snug text-text">{r.title}</h2>
              <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-muted">{r.body}</p>
              <a
                href={`mailto:${AGENCY.email}?subject=${encodeURIComponent(`Application: ${r.title}`)}`}
                className="mt-6 text-[12.5px] font-medium text-meadow-700 underline-offset-4 hover:underline"
              >
                Apply for this role →
              </a>
            </div>
          ))}
        </div>

        <div className="mt-14 border border-border bg-surface px-6 py-10 text-center">
          <Display className="text-[24px]">Nothing here that fits?</Display>
          <p className="mx-auto mt-3 max-w-lg text-[13.5px] leading-relaxed text-muted">
            Send us your CV anyway. We hire when the right person turns up, not only when a role is posted.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button href={`mailto:${AGENCY.email}?subject=Open%20application`} external variant="solid">
              Email your CV
            </Button>
            {wa && (
              <Button href={wa} external variant="outline">
                Message us
              </Button>
            )}
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-[12px] text-subtle">
            <Icon name="pin" className="h-4 w-4" />
            {AGENCY.address}
          </p>
        </div>
      </div>
    </>
  );
}

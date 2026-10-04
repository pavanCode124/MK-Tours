import type { Metadata } from 'next';
import { PlainPageHero } from '@/components/PageHero';
import { FaqList } from '@/components/sections';
import { Button, Display, Icon } from '@/components/ui';
import { AGENCY, FAQS } from '@/lib/content';
import { formatPhone, telHref, whatsappLink } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Reach MK Tours on WhatsApp or by phone, 24×7. We help you pick a departure, check dates, and answer anything before you book.',
};

export default function ContactPage() {
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);

  return (
    <>
      <PlainPageHero
        eyebrow="Get in touch"
        title="Have questions? Let's talk."
        lede={`Our team is on WhatsApp and on the phone, ${AGENCY.hours.toLowerCase()}. We will help you pick the right departure, check dates, or answer anything you need before you book.`}
        crumbs={[{ label: 'Contact' }]}
      />

      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        {/* Channels */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card
            icon="phone"
            title="Call us"
            lines={[formatPhone(AGENCY.phonePrimary), formatPhone(AGENCY.phoneSecondary)]}
            note={AGENCY.hours}
            action={{ href: telHref(AGENCY.phonePrimary) ?? '#', label: 'Call now', external: true }}
          />
          <Card
            icon="check"
            title="WhatsApp"
            lines={[formatPhone(AGENCY.phonePrimary)]}
            note="Fastest way to reach us"
            action={wa ? { href: wa, label: 'Chat on WhatsApp', external: true } : undefined}
          />
          <Card
            icon="mail"
            title="Email"
            lines={[AGENCY.email]}
            note="We reply the same day"
            action={{ href: `mailto:${AGENCY.email}`, label: 'Send an email', external: true }}
          />
          <Card
            icon="shield"
            title="Emergency (on tour)"
            lines={[formatPhone(AGENCY.emergencyPhone)]}
            note="For travellers already on the road"
            action={{ href: telHref(AGENCY.emergencyPhone) ?? '#', label: 'Call emergency line', external: true }}
          />
        </div>

        {/* Where we are */}
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-raised p-6 lg:col-span-2">
            <Display className="text-[22px]">Where we are</Display>
            <p className="mt-3 text-[14px] leading-relaxed text-muted">{AGENCY.address}</p>
            <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
              Fixed departures leave by train from Mumbai, with boarding available at Pune on the same rake. Private
              groups can start from any city — tell us where you are and we will price it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/packages" variant="solid">
                Browse departures
              </Button>
              <Button href={AGENCY.googleProfile} external variant="outline">
                Find us on Google
              </Button>
            </div>
          </div>
          <div className="rounded-2xl bg-sherwood-800 p-6 text-on-dark">
            <Display className="text-[20px] text-on-dark">Plan with us</Display>
            <p className="mt-3 text-[13px] leading-relaxed text-on-dark/75">
              Send us your dates, your group size and roughly where you want to go. We come back with the next departure
              that fits, or a private quotation.
            </p>
            <ul className="mt-5 space-y-2.5 text-[12.5px] text-on-dark/80">
              {['Your travel dates', 'How many travelling, and ages', 'Train class and room sharing', 'Anything you need us to plan around'].map(
                (l) => (
                  <li key={l} className="flex items-start gap-2.5">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-meadow-300" />
                    {l}
                  </li>
                ),
              )}
            </ul>
            {wa && (
              <Button href={wa} external variant="meadow" className="mt-6 w-full">
                Start on WhatsApp
              </Button>
            )}
          </div>
        </div>

        {/* Full FAQ */}
        <section id="faq" className="mt-16 scroll-mt-28 border-t border-border pt-12">
          <Display className="text-[30px] sm:text-[36px]">Common Questions</Display>
          <div className="mt-10 space-y-12">
            {FAQS.map((group) => (
              <div key={group.group}>
                <h3 className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-meadow-700">
                  {group.group}
                </h3>
                <FaqList items={group.items} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Card({
  icon,
  title,
  lines,
  note,
  action,
}: {
  icon: 'phone' | 'mail' | 'check' | 'shield';
  title: string;
  lines: string[];
  note: string;
  action?: { href: string; label: string; external?: boolean };
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-raised p-6">
      <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-meadow-50 text-meadow-700">
        <Icon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">{title}</h2>
      <div className="mt-2 space-y-0.5">
        {lines.map((l) => (
          <p key={l} className="text-[14px] leading-snug text-text">
            {l}
          </p>
        ))}
      </div>
      <p className="mt-1.5 text-[11.5px] text-subtle">{note}</p>
      {action && (
        <a
          href={action.href}
          {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="mt-auto pt-5 text-[12.5px] font-medium text-meadow-700 underline-offset-4 hover:underline"
        >
          {action.label} →
        </a>
      )}
    </div>
  );
}

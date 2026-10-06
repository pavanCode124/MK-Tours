import type { Metadata } from 'next';
import { PlainPageHero } from '@/components/PageHero';
import { FaqList } from '@/components/sections';
import { Button, Display, Eyebrow, Icon } from '@/components/ui';
import { CameraBadge, FlightPath, FlightTag, PineTree, SmokePlume, TopoField } from '@/components/Decor';
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
        title={
          <>
            Have questions? <span className="flourish">Let&apos;s talk.</span>
          </>
        }
        lede={`Our team is on WhatsApp and on the phone, ${AGENCY.hours.toLowerCase()}. We will help you pick the right departure, check dates, or answer anything you need before you book.`}
        crumbs={[{ label: 'Contact' }]}
      >
        <FlightTag from="You" to="Our desk" note="Replies same day" />
      </PlainPageHero>

      <div className="relative overflow-hidden">
        <FlightPath
          variant="fall"
          className="pointer-events-none absolute right-0 top-10 hidden h-[150px] w-[60%] text-vermilion-500/18 lg:block"
        />
        <TopoField className="pointer-events-none absolute -left-12 top-[40%] hidden h-[320px] w-[40%] text-azure-700/8 lg:block" />
        <SmokePlume
          seed={4}
          className="pointer-events-none absolute -right-4 bottom-[22%] hidden h-[250px] w-[190px] text-azure-600/12 lg:block"
        />

        <div className="relative mx-auto max-w-[1320px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          {/* Channels */}
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <ChannelCard
              icon="phone"
              title="Call us"
              lines={[formatPhone(AGENCY.phonePrimary), formatPhone(AGENCY.phoneSecondary)]}
              note={AGENCY.hours}
              action={{ href: telHref(AGENCY.phonePrimary) ?? '#', label: 'Call now', external: true }}
            />
            <ChannelCard
              icon="check"
              title="WhatsApp"
              lines={[formatPhone(AGENCY.phonePrimary)]}
              note="Fastest way to reach us"
              highlight
              action={wa ? { href: wa, label: 'Chat on WhatsApp', external: true } : undefined}
            />
            <ChannelCard
              icon="mail"
              title="Email"
              lines={[AGENCY.email]}
              note="We reply the same day"
              action={{ href: `mailto:${AGENCY.email}`, label: 'Send an email', external: true }}
            />
            <ChannelCard
              icon="shield"
              title="Emergency (on tour)"
              lines={[formatPhone(AGENCY.emergencyPhone)]}
              note="For travellers already on the road"
              action={{ href: telHref(AGENCY.emergencyPhone) ?? '#', label: 'Call emergency line', external: true }}
            />
          </div>

          {/* Where we are */}
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <div className="card relative overflow-hidden p-7 sm:p-9 lg:col-span-2">
              <CameraBadge className="pointer-events-none absolute -right-6 -top-4 hidden h-[160px] w-[190px] text-azure-700/8 sm:block" />
              <div className="relative">
                <Eyebrow className="mb-4">Our base</Eyebrow>
                <Display className="text-[24px]">Where we are</Display>
                <p className="mt-4 flex items-start gap-2.5 text-[14px] leading-relaxed text-muted">
                  <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-vermilion-700" />
                  {AGENCY.address}
                </p>
                <p className="mt-4 text-[13.5px] leading-[1.75] text-muted">
                  Fixed departures leave by train from Mumbai, with boarding available at Pune on the same rake. Private
                  groups can start from any city — tell us where you are and we will price it.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href="/packages" variant="solid">
                    Browse departures
                  </Button>
                  <Button href={AGENCY.googleProfile} external variant="outline">
                    Find us on Google
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.5rem] bg-azure-900 p-7 text-on-dark shadow-float">
              <PineTree className="pointer-events-none absolute -bottom-1 -right-3 h-[140px] w-[60px] text-black/25 tree-breathe" />
              <div className="relative">
                <Eyebrow tone="dark" className="mb-4">
                  Plan with us
                </Eyebrow>
                <Display className="text-[21px] text-on-dark">What to send us</Display>
                <p className="mt-3 text-[13px] leading-relaxed text-on-dark/75">
                  Send us your dates, your group size and roughly where you want to go. We come back with the next
                  departure that fits, or a private quotation.
                </p>
                <ul className="mt-6 space-y-2.5 text-[12.5px] text-on-dark/85">
                  {[
                    'Your travel dates',
                    'How many travelling, and ages',
                    'Train class and room sharing',
                    'Anything you need us to plan around',
                  ].map((l) => (
                    <li key={l} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-vermilion-500/20 text-vermilion-300">
                        <Icon name="check" className="h-3 w-3" />
                      </span>
                      {l}
                    </li>
                  ))}
                </ul>
                {wa && (
                  <Button href={wa} external variant="accent" className="mt-7 w-full">
                    Start on WhatsApp
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Full FAQ */}
          <section id="faq" className="mt-20 scroll-mt-28">
            <div className="text-center">
              <Eyebrow className="mb-5">FAQ</Eyebrow>
              <Display className="display-caps text-[30px] sm:text-[38px]">
                Common <span className="flourish">questions</span>
              </Display>
            </div>
            <div className="mt-12 space-y-12">
              {FAQS.map((group) => (
                <div key={group.group}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border-strong" />
                    <h3 className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-vermilion-700">
                      {group.group}
                    </h3>
                    <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border-strong" />
                  </div>
                  <FaqList items={group.items} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function ChannelCard({
  icon,
  title,
  lines,
  note,
  action,
  highlight = false,
}: {
  icon: 'phone' | 'mail' | 'check' | 'shield';
  title: string;
  lines: string[];
  note: string;
  action?: { href: string; label: string; external?: boolean };
  highlight?: boolean;
}) {
  return (
    <div
      className={`group flex flex-col rounded-[1.5rem] border p-6 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-float ${
        highlight ? 'border-vermilion-300 bg-vermilion-50' : 'border-border bg-raised'
      }`}
    >
      <span
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl transition-colors duration-500 ${
          highlight
            ? 'bg-vermilion-500 text-white shadow-glow'
            : 'bg-vermilion-50 text-vermilion-700 ring-1 ring-vermilion-300/50 group-hover:bg-vermilion-500 group-hover:text-white'
        }`}
      >
        <Icon name={icon} className="h-5 w-5" />
      </span>
      <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-vermilion-700">{title}</h2>
      <div className="mt-2 space-y-0.5">
        {lines.map((l) => (
          <p key={l} className="text-[14px] font-semibold leading-snug text-text">
            {l}
          </p>
        ))}
      </div>
      <p className="mt-1.5 text-[11.5px] text-subtle">{note}</p>
      {action && (
        <a
          href={action.href}
          {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12.5px] font-bold text-vermilion-700 underline-offset-4 hover:underline"
        >
          {action.label}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </a>
      )}
    </div>
  );
}

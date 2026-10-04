import type { Metadata } from 'next';
import { PlainPageHero } from '@/components/PageHero';
import { LegalBody } from '@/components/LegalBody';
import { AGENCY } from '@/lib/content';
import { LEGAL_EFFECTIVE_DATE, TERMS_HTML } from '@/lib/legal-content';
import { getLegal, getPackages } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'The booking, payment, cancellation and liability terms that apply to every MK Tours package.',
};

export default async function TermsPage() {
  // The CRM is the source of truth when the agency has published terms there;
  // otherwise we show the same copy as the agency's published policy page.
  const [legal, packages] = await Promise.all([getLegal().catch(() => null), getPackages().catch(() => [])]);
  const html = legal?.terms_html?.trim() || TERMS_HTML;

  // Per-package payment and cancellation policies, as written in the CRM.
  const cancellation = packages.find((p) => p.cancellation_policy?.trim())?.cancellation_policy;
  const payment = packages.find((p) => p.payment_policy?.trim())?.payment_policy;

  return (
    <>
      <PlainPageHero
        eyebrow={`Legal · Effective ${LEGAL_EFFECTIVE_DATE}`}
        title="Terms & Conditions"
        lede="These terms govern every booking made with MK Tours, on this site or over WhatsApp."
        crumbs={[{ label: 'Terms & Conditions' }]}
      />
      <LegalBody
        html={html}
        fallback={`Write to ${AGENCY.email} for a copy of our current booking terms.`}
        blocks={[
          ...(payment ? [{ title: 'Payment policy', html: payment }] : []),
          ...(cancellation ? [{ id: 'cancellation', title: 'Cancellation & refunds', html: cancellation }] : []),
        ]}
        sections={[
          {
            title: 'Questions about these terms',
            body: `Write to ${AGENCY.email} or call +91 ${AGENCY.phonePrimary} and we will walk you through anything that affects your booking.`,
          },
        ]}
      />
    </>
  );
}

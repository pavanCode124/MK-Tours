import type { Metadata } from 'next';
import { PlainPageHero } from '@/components/PageHero';
import { LegalBody } from '@/components/LegalBody';
import { AGENCY } from '@/lib/content';
import { getLegal, getPackages } from '@/lib/mktours';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How MK Tours collects, uses and protects the information you give us when you book a tour.',
};

export default async function PrivacyPage() {
  const [legal, packages] = await Promise.all([getLegal().catch(() => null), getPackages().catch(() => [])]);

  // The agency maintains one policy, published on every package in the CRM.
  const html = legal?.privacy_html?.trim() || packages.find((p) => p.privacy_policy?.trim())?.privacy_policy || '';

  return (
    <>
      <PlainPageHero eyebrow="Legal" title="Privacy Policy" crumbs={[{ label: 'Privacy Policy' }]} />
      <LegalBody
        html={html}
        fallback={`We collect only what a booking needs — names, contact details, identity documents and travel preferences — and share it only with the hotels, transport operators and railways required to arrange your trip. For anything else, write to ${AGENCY.email}.`}
        sections={[
          {
            title: 'Questions about your data',
            body: `Write to ${AGENCY.email} or call +91 ${AGENCY.phonePrimary}. We will tell you what we hold and remove anything we are not required to keep for accounting.`,
          },
        ]}
      />
    </>
  );
}

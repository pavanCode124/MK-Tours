import Link from 'next/link';
import { Display } from './ui';

/**
 * Renders a legal page body from the CRM's rich text, falling back to a short
 * summary when the CRM field is empty, plus any extra sections the page adds.
 */
export function LegalBody({
  html,
  fallback,
  sections = [],
  blocks = [],
}: {
  html?: string;
  fallback: string;
  sections?: { title: string; body: string }[];
  blocks?: { id?: string; title: string; html: string }[];
}) {
  const hasHtml = Boolean(html && html.replace(/<[^>]+>/g, '').trim());

  return (
    <div className="mx-auto max-w-[820px] px-5 py-12 md:px-8 lg:py-16">
      {hasHtml ? (
        <div className="rich-text text-[14.5px] text-muted" dangerouslySetInnerHTML={{ __html: html! }} />
      ) : (
        <p className="text-[14.5px] leading-[1.8] text-muted">{fallback}</p>
      )}

      {blocks.map((b) => (
        <section key={b.title} id={b.id} className="mt-12 scroll-mt-28 border-t border-border pt-10">
          <Display className="text-[24px]">{b.title}</Display>
          <div className="rich-text mt-4 text-[14.5px] text-muted" dangerouslySetInnerHTML={{ __html: b.html }} />
        </section>
      ))}

      {sections.map((s) => (
        <section key={s.title} className="mt-12 border-t border-border pt-10">
          <Display className="text-[24px]">{s.title}</Display>
          <p className="mt-4 text-[14.5px] leading-[1.8] text-muted">{s.body}</p>
        </section>
      ))}

      <p className="mt-12 border-t border-border pt-8 text-[13px] text-subtle">
        Each tour page carries the policies that apply to that specific departure.{' '}
        <Link href="/packages" className="font-medium text-meadow-700 underline-offset-4 hover:underline">
          Browse tour packages
        </Link>
        .
      </p>
    </div>
  );
}

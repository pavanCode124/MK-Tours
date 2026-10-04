import Link from 'next/link';
import { Display, Icon } from './ui';
import { TopoField } from './Decor';

/**
 * Renders a legal page body from the CRM's rich text, falling back to a short
 * summary when the CRM field is empty, plus any extra sections the page adds.
 *
 * The prose now sits on a raised card inside a quiet gutter, with each extra
 * section carried on its own card, so a long policy reads as a document rather
 * than as one unbroken column of grey text.
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
    <div className="relative overflow-hidden py-14 lg:py-20">
      <TopoField className="pointer-events-none absolute -right-10 top-10 hidden h-[340px] w-[38%] text-sherwood-700/8 lg:block" />
      <div className="relative mx-auto max-w-[900px] px-5 md:px-8">
        <div className="card p-7 sm:p-10">
          {hasHtml ? (
            <div className="rich-text text-[14.5px] text-muted" dangerouslySetInnerHTML={{ __html: html! }} />
          ) : (
            <p className="text-[14.5px] leading-[1.85] text-muted">{fallback}</p>
          )}
        </div>

        {blocks.map((b) => (
          <section key={b.title} id={b.id} className="card mt-6 scroll-mt-28 p-7 sm:p-10">
            <Display className="text-[23px]">{b.title}</Display>
            <div className="rich-text mt-4 text-[14.5px] text-muted" dangerouslySetInnerHTML={{ __html: b.html }} />
          </section>
        ))}

        {sections.map((s) => (
          <section key={s.title} className="mt-6 rounded-[1.5rem] border border-meadow-300/60 bg-meadow-50 p-7 shadow-soft sm:p-10">
            <Display className="text-[23px]">{s.title}</Display>
            <p className="mt-4 text-[14.5px] leading-[1.85] text-muted">{s.body}</p>
          </section>
        ))}

        <p className="mt-8 flex flex-wrap items-center gap-2 rounded-[1.5rem] bg-surface px-6 py-5 text-[13px] text-muted">
          <Icon name="shield" className="h-4 w-4 shrink-0 text-meadow-700" />
          Each tour page carries the policies that apply to that specific departure.
          <Link href="/packages" className="font-bold text-meadow-700 underline-offset-4 hover:underline">
            Browse tour packages →
          </Link>
        </p>
      </div>
    </div>
  );
}

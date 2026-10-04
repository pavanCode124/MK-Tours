import { AGENCY } from '@/lib/content';
import { telHref, whatsappLink } from '@/lib/mktours';

/**
 * The floating contact cluster.
 *
 * Instead of two bare circles, the actions sit in one curved capsule that
 * expands into a labelled pill on hover, with a pulse ring behind the WhatsApp
 * button so it reads as the live channel. Top-right on phones so it clears the
 * search panel, bottom-right from large screens up.
 */
export function FloatingContact() {
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);
  const tel = telHref(AGENCY.phonePrimary);

  return (
    <div className="pointer-events-none fixed right-3 top-28 z-30 flex flex-col items-end gap-3 sm:right-5 lg:bottom-7 lg:right-7 lg:top-auto">
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message MK Tours on WhatsApp"
          className="group/wa pointer-events-auto relative flex items-center gap-0 overflow-hidden rounded-full bg-meadow-500 pr-0 text-sherwood-900 shadow-float transition-all duration-500 ease-out hover:gap-2 hover:pr-5"
        >
          {/* A soft halo behind the button, so it reads as the live channel. */}
          <span className="pointer-events-none absolute -inset-1.5 -z-10 rounded-full bg-meadow-400/35 blur-md" />
          <span className="flex shrink-0 items-center justify-center p-3.5 sm:p-4">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 004.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0012.04 2zm0 18.02h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.1.81.83-3.03-.2-.31a8.2 8.2 0 01-1.26-4.37c0-4.54 3.7-8.23 8.23-8.23 2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 012.41 5.82c0 4.54-3.7 8.23-8.24 8.23z" />
              <path d="M16.56 14.07c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.13.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.2-.57.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29z" />
            </svg>
          </span>
          <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-[11.5px] font-bold uppercase tracking-[0.14em] transition-all duration-500 group-hover/wa:max-w-[9rem] lg:block">
            Chat with us
          </span>
        </a>
      )}

      {tel && (
        <a
          href={tel}
          aria-label="Call MK Tours"
          className="group/call pointer-events-auto flex items-center gap-0 overflow-hidden rounded-full border border-border bg-raised pr-0 text-sherwood-800 shadow-lift transition-all duration-500 ease-out hover:gap-2 hover:border-meadow-300 hover:pr-5"
        >
          <span className="flex shrink-0 items-center justify-center p-3.5 sm:p-4">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6.6 3h3l1.5 4-2 1.4a12 12 0 005.5 5.5l1.4-2 4 1.5v3A2 2 0 0118 18.4 16 16 0 015.6 6 2 2 0 016.6 3z" />
            </svg>
          </span>
          <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-[11.5px] font-bold uppercase tracking-[0.14em] transition-all duration-500 group-hover/call:max-w-[9rem] lg:block">
            Call us
          </span>
        </a>
      )}

      {/* Back to top — a quiet third action, only once there is a page to climb. */}
      <a
        href="#top"
        aria-label="Back to top"
        className="pointer-events-auto hidden h-11 w-11 items-center justify-center rounded-full border border-border bg-raised/90 text-muted shadow-soft backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:text-meadow-700 lg:flex"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 19V6M6 12l6-6 6 6" />
        </svg>
      </a>
    </div>
  );
}

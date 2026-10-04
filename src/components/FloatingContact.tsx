import { AGENCY } from '@/lib/content';
import { telHref, whatsappLink } from '@/lib/mktours';

/**
 * The call / WhatsApp pair that floats over the page, as on the reference site:
 * top-right on small screens so it clears the search card, bottom-right on
 * desktop.
 */
export function FloatingContact() {
  const wa = whatsappLink(AGENCY.whatsapp, `Hi ${AGENCY.name}, I'd like to plan a trip.`);
  const tel = telHref(AGENCY.phonePrimary);

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-30 flex flex-col gap-3 sm:right-6 lg:bottom-8 lg:right-8 lg:top-auto">
      {tel && (
        <div className="group/call pointer-events-auto relative">
          <a
            href={tel}
            aria-label="Call MK Tours"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-meadow-500 text-white shadow-lg transition-transform duration-200 ease-out hover:scale-[1.04] sm:h-14 sm:w-14"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6.6 3h3l1.5 4-2 1.4a12 12 0 005.5 5.5l1.4-2 4 1.5v3A2 2 0 0118 18.4 16 16 0 015.6 6 2 2 0 016.6 3z" />
            </svg>
          </a>
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap bg-text/85 px-3 py-1.5 text-xs font-semibold text-on-dark opacity-0 transition-opacity duration-200 group-hover/call:opacity-100 lg:block">
            Call Us
          </span>
        </div>
      )}
      {wa && (
        <div className="group/wa pointer-events-auto relative">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message MK Tours on WhatsApp"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-sherwood-800 text-white shadow-lg transition-transform duration-200 ease-out hover:scale-[1.04] sm:h-14 sm:w-14"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 004.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0012.04 2zm0 18.02h-.01a8.2 8.2 0 01-4.18-1.15l-.3-.18-3.1.81.83-3.03-.2-.31a8.2 8.2 0 01-1.26-4.37c0-4.54 3.7-8.23 8.23-8.23 2.2 0 4.26.86 5.82 2.41a8.18 8.18 0 012.41 5.82c0 4.54-3.7 8.23-8.24 8.23z" />
              <path d="M16.56 14.07c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.1-.5.11-.11.25-.29.37-.44.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.84-.2-.49-.4-.42-.55-.43h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.13.17 1.74 2.65 4.21 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.67-1.18.2-.57.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29z" />
            </svg>
          </a>
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap bg-text/85 px-3 py-1.5 text-xs font-semibold text-on-dark opacity-0 transition-opacity duration-200 group-hover/wa:opacity-100 lg:block">
            WhatsApp
          </span>
        </div>
      )}
    </div>
  );
}

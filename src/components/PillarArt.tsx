/**
 * Line-art illustrations for the "why us" pillars. Each one is drawn here as a
 * plain SVG — no icon package — so the stroke weight, the pale blob behind it
 * and the confetti all stay on the house palette.
 *
 * Every drawing shares one 120x100 box and is stroked in `currentColor`, so the
 * card decides the colour.
 */

export type ArtName =
  /* why-us pillars */
  | 'group'
  | 'pin'
  | 'shield'
  | 'home'
  /* how-it-works steps */
  | 'enquiry'
  | 'quote'
  | 'booking'
  | 'manager';

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

/** Three travellers — one with a pack, flanked by the rest of the group. */
function GroupArt() {
  return (
    <g {...STROKE}>
      {/* centre figure */}
      <circle cx="60" cy="26" r="9.5" />
      <path d="M43 74v-12a17 17 0 0 1 34 0v12" />
      {/* the bag over their shoulder */}
      <path d="M70 50 80 58" />
      <rect x="78" y="58" width="15" height="14" rx="3" />
      <path d="M78 64h15" />
      {/* left figure */}
      <circle cx="29" cy="38" r="7.5" />
      <path d="M17 74v-10a12 12 0 0 1 18-10.4" />
      {/* right figure */}
      <circle cx="91" cy="38" r="7.5" />
      <path d="M103 74v-10a12 12 0 0 0-18-10.4" />
    </g>
  );
}

/** A train front standing beside a dated calendar page. */
function TrainDateArt() {
  return (
    <g {...STROKE}>
      {/* calendar */}
      <rect x="12" y="24" width="38" height="36" rx="5" />
      <path d="M12 35h38" />
      <path d="M22 24v-6M40 24v-6" />
      <path d="M21 44h5M31 44h5M41 44h5M21 52h5M31 52h5" />
      {/* train */}
      <path d="M66 26h26a6 6 0 0 1 6 6v28H60V32a6 6 0 0 1 6-6Z" />
      <path d="M66 34h26v12H66z" />
      <path d="M60 50h38" />
      <path d="M68 55h4M86 55h4" />
      <circle cx="70" cy="66" r="4.5" />
      <circle cx="88" cy="66" r="4.5" />
      {/* track */}
      <path d="M54 76h52" />
      <path d="M62 76v5M78 76v5M94 76v5" />
    </g>
  );
}

/** A price tag carrying one rupee figure, with the list beside it in full. */
function PriceArt() {
  return (
    <g {...STROKE}>
      {/* tag */}
      <path d="M52 18H28a7 7 0 0 0-7 7v24a7 7 0 0 0 2 5l22 22a7 7 0 0 0 10 0l19-19a7 7 0 0 0 0-10L57 20a7 7 0 0 0-5-2Z" />
      <circle cx="36" cy="33" r="4.5" />
      {/* the one figure on the tag */}
      <path d="M36 50h17M36 57h17M42 50c7 .8 7 8 0 8.6M42 58.6 53 70" />
      {/* the list beside it — exclusions written out, not buried */}
      <path d="m88 27 2.6 2.6 5-5.6M88 41l2.6 2.6 5-5.6M88 55l2.6 2.6 5-5.6" />
      <path d="M100 28h11M100 42h11M100 56h7" />
    </g>
  );
}

/** An award rosette, for ten thousand travellers and counting. */
function TrustArt() {
  return (
    <g {...STROKE}>
      <circle cx="60" cy="34" r="21" />
      <circle cx="60" cy="34" r="14.5" />
      <path d="m60 26 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z" />
      {/* ribbons */}
      <path d="M47 51 38 78l12-5.5L58 80l5-21" />
      <path d="m73 51 9 27-12-5.5" />
      {/* the long count underneath: travellers, year on year */}
      <path d="M20 70h16M24 78h12M84 70h16M88 78h12" />
    </g>
  );
}

/** A question asked: a speech bubble with a pin in it, and the dates beside. */
function EnquiryArt() {
  return (
    <g {...STROKE}>
      {/* the bubble */}
      <path d="M26 20h52a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H50l-13 11V60h-11a8 8 0 0 1-8-8V28a8 8 0 0 1 8-8Z" />
      {/* the place, asked for */}
      <path d="M52 28c6 0 10.5 4.5 10.5 10.3C62.5 45 52 54 52 54s-10.5-9-10.5-15.7C41.5 32.5 46 28 52 28Z" />
      <circle cx="52" cy="38.4" r="3.6" />
      {/* the dates, at the corner */}
      <rect x="86" y="46" width="26" height="24" rx="4" />
      <path d="M86 54h26M94 46v-5M104 46v-5" />
      <path d="M93 62h4M103 62h4" />
    </g>
  );
}

/** The quote in writing: a sheet with the figure on it and nothing implied. */
function QuoteArt() {
  return (
    <g {...STROKE}>
      <path d="M28 12h38l16 16v52a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6Z" />
      <path d="M66 12v16h16" />
      <path d="M32 40h34M32 48h34M32 56h22" />
      {/* the one figure, on its own line */}
      <path d="M32 68h22" />
      <path d="M58 66h20M58 72h20M63 66c6 .7 6 6.3 0 6.9M63 72.9 76 84" />
      {/* read, then held */}
      <path d="M92 74l5 5 11-13" />
    </g>
  );
}

/** The booking made: two rail stubs, torn along the perforation and confirmed. */
function BookingArt() {
  return (
    <g {...STROKE}>
      {/* the near stub */}
      <path d="M18 34h48v10a6 6 0 0 0 0 12v10H18V56a6 6 0 0 0 0-12V34Z" />
      <path d="M44 34v5M44 47v5M44 60v5" />
      <path d="M25 44h12M25 54h12" />
      <path d="M52 48h8M52 56h5" />
      {/* the stub behind it */}
      <path d="M74 24h32v10a6 6 0 0 0 0 12v10H74" />
      <path d="M82 36h16M82 48h11" />
      {/* confirmed */}
      <circle cx="90" cy="76" r="13" />
      <path d="m84 76 4 4 8-9" />
    </g>
  );
}

/** Somebody travelling with you: a tour manager under the platform sign. */
function ManagerArt() {
  return (
    <g {...STROKE}>
      {/* the platform sign, on its post */}
      <rect x="72" y="14" width="38" height="20" rx="4" />
      <path d="M79 21h12M79 27h20" />
      <path d="M91 34v50" />
      {/* the manager, cap and all */}
      <circle cx="32" cy="36" r="10" />
      <path d="M22 32a10 10 0 0 1 20 0Z" />
      <path d="M42 32h6" />
      <path d="M18 84V68a14 14 0 0 1 28 0v16" />
      {/* the arm, and the flag it carries */}
      <path d="M46 72l8-9" />
      <path d="M56 62V40" />
      <path d="M56 42h14l-4 5 4 5H56" />
      {/* the platform edge */}
      <path d="M10 84h100" />
      <path d="M10 91h100" strokeDasharray="1 7" />
    </g>
  );
}

const ART: Record<ArtName, () => React.ReactElement> = {
  group: GroupArt,
  pin: TrainDateArt,
  shield: PriceArt,
  home: TrustArt,
  enquiry: EnquiryArt,
  quote: QuoteArt,
  booking: BookingArt,
  manager: ManagerArt,
};

/**
 * The illustration block that sits in the foot of a pillar card: a pale dome,
 * a few scattered confetti marks and the drawing itself.
 */
export function PillarArt({ name, className = '' }: { name: ArtName; className?: string }) {
  const Drawing = ART[name] ?? GroupArt;

  return (
    <div className={`pointer-events-none relative ${className}`}>
      {/* the pale dome the drawing stands on */}
      <span className="absolute inset-x-6 bottom-0 top-8 rounded-t-full bg-azure-100/70 transition-colors duration-500 group-hover:bg-vermilion-50" />

      {/* confetti — small squares and dots, as loose as a pencil margin */}
      <svg viewBox="0 0 160 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect x="16" y="78" width="9" height="9" rx="1.5" transform="rotate(-18 20 82)" fill="none" stroke="var(--color-marigold-600)" strokeWidth="1.4" />
        <rect x="132" y="30" width="8" height="8" rx="1.5" transform="rotate(22 136 34)" fill="none" stroke="var(--color-vermilion-300)" strokeWidth="1.4" />
        <circle cx="140" cy="86" r="4" fill="var(--color-azure-500)" opacity="0.65" />
        <circle cx="30" cy="34" r="3.5" fill="var(--color-marigold)" />
        <circle cx="118" cy="104" r="2.6" fill="var(--color-vermilion-500)" />
        <circle cx="46" cy="104" r="2.2" fill="var(--color-azure-200)" />
      </svg>

      <svg viewBox="0 0 120 100" className="relative h-full w-full text-azure-700" aria-hidden="true">
        <Drawing />
      </svg>
    </div>
  );
}

/**
 * The thin stray line that drifts across a card behind the words — the one
 * flourish that keeps these cards from reading as plain boxes.
 */
export function PillarSquiggle({ seed = 0, className = '' }: { seed?: number; className?: string }) {
  const paths = [
    'M-10 26C24 6 48 52 88 30c28-16 46 12 78 0',
    'M-10 18C30 2 52 48 96 26c30-15 44 10 74 2',
    'M-8 46C26 60 44 14 82 26c28 9 50-6 86 4',
    'M-6 8C22 34 54 6 80 30c22 20 52 4 92 16',
    'M-10 36C18 18 40 56 74 42c26-11 56 6 92-10',
  ];
  return (
    <svg
      viewBox="0 0 160 70"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute text-azure-200 ${className}`}
      aria-hidden="true"
    >
      <path d={paths[seed % paths.length]} fill="none" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

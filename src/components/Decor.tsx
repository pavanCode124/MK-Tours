/**
 * The site's decorative layer.
 *
 * Everything here is `aria-hidden` ornament drawn as inline SVG: tree lines and
 * single trees, an aeroplane tracking a dashed vapour arc, drifting smoke
 * plumes, a film strip and a loose topographic field. They are placed behind
 * content at low opacity to give sections depth without shipping extra images.
 *
 * All of them take a `className` so the caller decides size, position, rotation
 * and opacity. None of them carry their own colour: each inherits `currentColor`
 * from its wrapper, so a `text-*` utility on the caller tints the whole drawing.
 */

/* -------------------------------------------------------------------------- */
/* Trees                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A Himalayan deodar — the conifer that lines every Kashmir road. Drawn as a
 * stack of drooping tiers rather than a single triangle, so a row of them reads
 * as forest rather than as a bar chart.
 */
export function PineTree({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 90 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M43 220v-52h4v52z" fill="currentColor" opacity="0.85" />
        <g fill="currentColor">
          <path d="M45 4c6 14 14 25 20 33-7 2-13 1-20-2-7 3-13 4-20 2 6-8 14-19 20-33z" />
          <path d="M45 38c8 18 18 32 26 42-9 3-18 2-26-2-8 4-17 5-26 2 8-10 18-24 26-42z" opacity="0.95" />
          <path d="M45 82c9 21 21 37 31 49-11 3-21 2-31-2-10 4-20 5-31 2 10-12 22-28 31-49z" opacity="0.9" />
          <path d="M45 130c10 23 23 41 35 54-12 4-24 3-35-2-11 5-23 6-35 2 12-13 25-31 35-54z" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}

/**
 * A broad-crowned banyan, the counterweight to the conifer: a thick trunk with
 * aerial roots and a cloud of foliage built from overlapping lobes.
 */
export function BanyanTree({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g fill="currentColor">
          {/* Canopy — overlapping lobes read as a single broad crown */}
          <path d="M100 18c26 0 44 12 52 28 16 3 28 15 28 30 0 18-16 31-38 31H58c-22 0-38-13-38-31 0-15 12-27 28-30 8-16 26-28 52-28z" />
          {/* Lower foliage skirt */}
          <path
            d="M44 104c14 8 34 12 56 12s42-4 56-12c-6 14-26 23-56 23s-50-9-56-23z"
            opacity="0.9"
          />
        </g>
        <g stroke="currentColor" strokeLinecap="round" fill="none">
          {/* Trunk */}
          <path d="M96 112v88M108 112v88" strokeWidth="7" />
          {/* Aerial roots, the banyan's signature */}
          <path d="M62 112c-2 30-6 56-4 88" strokeWidth="3.5" opacity="0.8" />
          <path d="M78 116c-3 26-5 50-4 84" strokeWidth="2.5" opacity="0.7" />
          <path d="M132 112c3 30 6 56 4 88" strokeWidth="3.5" opacity="0.8" />
          <path d="M148 118c2 24 4 48 3 82" strokeWidth="2.5" opacity="0.65" />
          <path d="M118 124c4 22 7 44 6 76" strokeWidth="2" opacity="0.6" />
          {/* Ground line */}
          <path d="M34 200h132" strokeWidth="3" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}

/**
 * A full tree line for the foot of a section — conifers, a couple of broad
 * crowns and some scrub, drawn as one silhouette so it tiles edge to edge.
 * Sits directly above a section boundary at low opacity.
 */
export function TreeLine({ className = '' }: { className?: string }) {
  // Conifers at varied heights and spacings, drawn as explicit tiered shapes so
  // the row reads as trees at any opacity rather than as a torn edge. The
  // positions are irregular on purpose — an even rhythm looks like a graph.
  const conifers = [
    { x: 28, h: 150, w: 46 },
    { x: 96, h: 104, w: 36 },
    { x: 150, h: 170, w: 52 },
    { x: 232, h: 120, w: 40 },
    { x: 300, h: 148, w: 46 },
    { x: 368, h: 96, w: 34 },
    { x: 424, h: 162, w: 50 },
    { x: 500, h: 116, w: 38 },
    { x: 566, h: 142, w: 44 },
    { x: 638, h: 100, w: 36 },
    { x: 694, h: 168, w: 52 },
    { x: 774, h: 124, w: 40 },
    { x: 840, h: 150, w: 46 },
    { x: 910, h: 98, w: 34 },
    { x: 966, h: 158, w: 48 },
    { x: 1042, h: 118, w: 38 },
    { x: 1106, h: 146, w: 46 },
    { x: 1172, h: 106, w: 36 },
  ];
  // Rounded broadleaf crowns that fill the gaps between the conifers.
  const broadleaf = [
    { x: 66, r: 32 },
    { x: 196, r: 26 },
    { x: 268, r: 34 },
    { x: 400, r: 28 },
    { x: 464, r: 36 },
    { x: 538, r: 26 },
    { x: 610, r: 32 },
    { x: 668, r: 28 },
    { x: 736, r: 34 },
    { x: 812, r: 26 },
    { x: 880, r: 32 },
    { x: 940, r: 28 },
    { x: 1006, r: 34 },
    { x: 1080, r: 26 },
    { x: 1142, r: 32 },
  ];

  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 180"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          {/* Broadleaf crowns sit behind, as softer mass */}
          {broadleaf.map((b) => (
            <g key={`b${b.x}`} opacity="0.72">
              <ellipse cx={b.x} cy={180 - b.r * 0.9} rx={b.r} ry={b.r * 0.82} />
              <rect x={b.x - 3} y={180 - b.r} width="6" height={b.r} />
            </g>
          ))}
          {/* Conifers in front: three drooping tiers over a short trunk */}
          {conifers.map((c) => {
            const base = 180;
            const top = base - c.h;
            const t = (n: number) => top + (c.h - 18) * n;
            return (
              <g key={`c${c.x}`}>
                <rect x={c.x - 3} y={base - 24} width="6" height="24" />
                <path
                  d={`M${c.x} ${top}
                      L${c.x + c.w * 0.42} ${t(0.36)} L${c.x + c.w * 0.2} ${t(0.33)}
                      L${c.x + c.w * 0.62} ${t(0.68)} L${c.x + c.w * 0.34} ${t(0.65)}
                      L${c.x + c.w} ${base - 16} L${c.x - c.w} ${base - 16}
                      L${c.x - c.w * 0.34} ${t(0.65)} L${c.x - c.w * 0.62} ${t(0.68)}
                      L${c.x - c.w * 0.2} ${t(0.33)} L${c.x - c.w * 0.42} ${t(0.36)} Z`}
                />
              </g>
            );
          })}
          {/* A low scrub band ties the trunks together along the ground */}
          <path d="M0 180v-18c40-10 74 6 118-2s78 8 124 0 86 8 132 0 88 6 134-2 86 8 132 0 88 6 134-2 86 8 132 0 90 6 136-2 70 6 118 0v26z" />
        </g>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Flight                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * An aeroplane tracking a dashed arc, with a vapour trail that draws itself in
 * behind it. The plane rides the same path the trail is drawn from, using CSS
 * motion paths, so the two can never drift out of register.
 *
 * `variant` picks the arc: `rise` climbs left to right, `fall` descends, and
 * `arch` crests in the middle.
 */
const FLIGHT_PATHS = {
  rise: 'M8 150C120 150 250 126 360 92 470 58 560 36 672 24',
  fall: 'M8 24C120 36 250 58 360 92 470 126 560 148 672 156',
  arch: 'M8 140C130 44 260 14 340 14 420 14 550 44 672 140',
} as const;

export function FlightPath({
  className = '',
  variant = 'rise',
}: {
  className?: string;
  variant?: keyof typeof FLIGHT_PATHS;
}) {
  const d = FLIGHT_PATHS[variant];
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-full w-full overflow-visible" viewBox="0 0 680 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* The vapour trail: a soft wide wash under a crisp dashed stroke. */}
        <path d={d} stroke="currentColor" strokeWidth="9" strokeLinecap="round" opacity="0.12" />
        <path
          className="trail-draw"
          d={d}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.75"
        />
        {/* Waypoint beads at either end of the leg. */}
        <circle cx="8" cy={variant === 'fall' ? 24 : variant === 'arch' ? 140 : 150} r="4.5" fill="currentColor" opacity="0.5" />
        <circle cx="672" cy={variant === 'fall' ? 156 : variant === 'arch' ? 140 : 24} r="4.5" fill="currentColor" opacity="0.5" />

        {/* The aeroplane. offsetPath keeps it on the trail at every size. */}
        <g
          className="plane-track"
          style={{ offsetPath: `path("${d}")`, offsetRotate: 'auto' } as React.CSSProperties}
        >
          <path
            d="M20 0l-7-4.5v3L2-3l-1-6-3.5-1.5L-4-4l-6.5-1.5-2.5-4-3 .5 1.5 4.5-4 1 1.5 2.5h4l2.5 3.5-1.5 4.5 3 .5 2.5-4L-1 3l-.5 6.5L3 8l1-6 11-4.5v3z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
}

/**
 * A boarding-pass style flight tag: two stubs divided by a perforation, the sort
 * of ornament that belongs on a travel page without pretending to be a real
 * document. Takes its text from the caller.
 */
export function FlightTag({
  from,
  to,
  note,
  className = '',
}: {
  from: string;
  to: string;
  note?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-stretch overflow-hidden rounded-2xl border border-vermilion-300/70 bg-vermilion-50 shadow-soft ${className}`}
      aria-hidden="true"
    >
      <span className="flex flex-col justify-center px-4 py-2.5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-vermilion-700">From</span>
        <span className="font-display text-[15px] leading-none text-azure-800">{from}</span>
      </span>
      <span className="flex items-center border-x border-dashed border-vermilion-400/70 px-3 text-vermilion-600">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="M21 16v-2l-8-2.5V6a1.5 1.5 0 10-3 0v5.5L2 14v2l8-1.5V19l-2.5 1.5V22l4-1 4 1v-1.5L13 19v-4.5z" />
        </svg>
      </span>
      <span className="flex flex-col justify-center px-4 py-2.5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-vermilion-700">To</span>
        <span className="font-display text-[15px] leading-none text-azure-800">{to}</span>
      </span>
      {note && (
        <span className="flex items-center border-l border-dashed border-vermilion-400/70 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-vermilion-700">
          {note}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Smoke                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A drifting plume — vapour off a steam engine, incense off a ghat, cloud off a
 * ridge. Blurred overlapping ellipses rising on staggered delays, so the shape
 * never repeats exactly. Used as a soft shadow-mass behind headings and photos.
 */
export function SmokePlume({ className = '', seed = 0 }: { className?: string; seed?: number }) {
  const puffs = [
    { cx: 48, cy: 150, rx: 26, ry: 20, delay: 0, dur: 13 },
    { cx: 70, cy: 118, rx: 32, ry: 25, delay: 2.4, dur: 15 },
    { cx: 56, cy: 86, rx: 38, ry: 29, delay: 4.6, dur: 14 },
    { cx: 82, cy: 58, rx: 44, ry: 33, delay: 6.8, dur: 16 },
    { cx: 66, cy: 30, rx: 50, ry: 36, delay: 9.1, dur: 17 },
  ];
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 160 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={`smoke-blur-${seed}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <g filter={`url(#smoke-blur-${seed})`} fill="currentColor">
          {puffs.map((p) => (
            <ellipse
              key={`${p.cx}-${p.cy}`}
              className="smoke-drift"
              cx={p.cx}
              cy={p.cy}
              rx={p.rx}
              ry={p.ry}
              style={{ animationDelay: `${p.delay + seed * 0.7}s`, animationDuration: `${p.dur}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

/**
 * A static, very soft smoke mass — the shadow a plume would cast rather than the
 * plume itself. No animation, so it is safe to use in large numbers.
 */
export function SmokeShadow({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="smoke-mass-a" cx="35%" cy="62%" r="55%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="smoke-mass-b" cx="66%" cy="38%" r="48%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.4" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="105" cy="124" rx="118" ry="70" fill="url(#smoke-mass-a)" />
        <ellipse cx="198" cy="76" rx="100" ry="62" fill="url(#smoke-mass-b)" />
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Camera                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * A compact rangefinder camera with a shutter-burst halo — the second camera
 * motif alongside the pencil-sketched SLR, so repeated placements do not read as
 * the same drawing pasted twice.
 */
export function CameraBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Body, with the generous corner radius the rest of the UI uses */}
          <rect x="24" y="54" width="192" height="118" rx="26" strokeWidth="4" />
          {/* Top plate and hot shoe */}
          <path d="M84 54l12-20h48l12 20" strokeWidth="3.5" />
          <path d="M108 34h24" strokeWidth="3" />
          {/* Lens */}
          <circle cx="120" cy="113" r="42" strokeWidth="4" />
          <circle cx="120" cy="113" r="27" strokeWidth="2.8" />
          <circle cx="120" cy="113" r="12" strokeWidth="2.4" />
          <path d="M104 99c5-6 13-9 21-8" strokeWidth="2.2" />
          {/* Viewfinder, dial and release */}
          <rect x="40" y="70" width="30" height="20" rx="8" strokeWidth="2.6" />
          <circle cx="192" cy="80" r="11" strokeWidth="2.6" />
          <path d="M176 150h26" strokeWidth="2.4" />
          {/* Shutter burst — short rays off the lens */}
          <g strokeWidth="2.6" opacity="0.65">
            <path d="M120 44v-14M186 113h16M38 113H22M166 60l10-11M74 60L64 49M166 166l10 11M74 166l-10 11" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Fields and dividers                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Loose contour lines, as on a trekking map. A quiet way to fill the dead space
 * beside a heading without another photograph.
 */
export function TopoField({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M-10 236c70-24 118-6 170-34s96-62 160-56 90 26 90 26" />
          <path d="M-10 206c74-26 122-10 174-40s96-58 156-52 90 24 90 24" />
          <path d="M6 178c70-26 114-14 164-44s92-54 148-48 82 22 82 22" />
          <path d="M34 152c62-26 100-16 146-44s84-50 134-44 76 20 76 20" />
          <path d="M66 128c52-24 84-16 124-42s74-44 118-38 66 16 66 16" />
          <path d="M102 104c42-22 68-14 100-36s62-38 98-32 52 12 52 12" />
          <path d="M142 82c32-18 52-12 78-30s48-30 76-26 38 8 38 8" />
        </g>
      </svg>
    </div>
  );
}

/**
 * The curved seam between two sections. Rendered as a filled wave whose colour
 * comes from `currentColor`, so the caller tints it to match the section it is
 * flowing *into*. `flip` turns the wave upside down.
 */
export function WaveDivider({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        className={`h-full w-full ${flip ? 'rotate-180' : ''}`}
        viewBox="0 0 1200 90"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 90V38c128 0 206 30 334 30s204-38 332-38 206 34 334 34V90z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/**
 * A compass rose, for the odd corner that wants a mark rather than a drawing.
 */
export function CompassRose({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="80" cy="80" r="66" stroke="currentColor" strokeWidth="2" />
        <circle cx="80" cy="80" r="52" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <path d="M80 10l13 57L80 80 67 67z" fill="currentColor" />
        <path d="M80 150l-13-57L80 80l13 13z" fill="currentColor" opacity="0.55" />
        <path d="M150 80l-57 13L80 80l13-13z" fill="currentColor" opacity="0.7" />
        <path d="M10 80l57-13L80 80 67 93z" fill="currentColor" opacity="0.7" />
        <g stroke="currentColor" strokeWidth="1.5" opacity="0.6">
          <path d="M80 4v10M80 146v10M4 80h10M146 80h10" />
        </g>
      </svg>
    </div>
  );
}

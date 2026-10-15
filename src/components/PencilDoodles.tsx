/**
 * Margin doodles drawn in the same graphite hand as {@link PencilCamera} and
 * {@link PencilPalm}: open curves rather than filled shapes, a turbulence
 * filter for the pencil wobble, and a little hatching where a form falls away.
 * All of them are decorative — size and tilt them from `className`, and keep
 * them at a low opacity so they sit behind the type.
 */

/** The shared graphite wobble. Each doodle needs its own filter id. */
function Graphite({ id, seed, scale = 2.2 }: { id: string; seed: number; scale?: number }) {
  return (
    <defs>
      <filter id={id} x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed={seed} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={scale} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  );
}

/** A couple walking hand in hand, one of them carrying the pack. */
export function PencilCouple({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-auto w-full text-azure-800" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Graphite id="pencil-couple-graphite" seed={11} />
        <g
          filter="url(#pencil-couple-graphite)"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* She walks on the left */}
          <circle cx="70" cy="50" r="19" strokeWidth="2.6" />
          {/* hair, gathered and falling past the shoulder */}
          <path d="M52 44C50 24 66 28 70 30C76 28 90 26 88 46" strokeWidth="2.2" />
          <path d="M52 52C46 66 46 80 50 90" strokeWidth="2" />
          <path d="M88 52C94 66 94 80 90 90" strokeWidth="2" />
          <path d="M70 69L70 79" strokeWidth="2.2" />
          {/* dress */}
          <path d="M56 87C62 79 78 79 85 87L98 168C82 176 58 176 44 168Z" strokeWidth="2.6" />
          <path d="M57 98C68 104 84 103 90 97" strokeWidth="1.6" opacity="0.8" />
          <path d="M55 92C44 108 40 130 44 148" strokeWidth="2.2" />
          <path d="M86 92C97 105 105 119 109 130" strokeWidth="2.2" />
          <path d="M64 172L60 230" strokeWidth="2.4" />
          <path d="M81 173L85 230" strokeWidth="2.4" />
          <path d="M52 232C58 236 66 234 64 230" strokeWidth="2" />
          <path d="M93 232C87 236 79 234 81 230" strokeWidth="2" />

          {/* He walks on the right, a little taller */}
          <circle cx="152" cy="44" r="20" strokeWidth="2.6" />
          {/* a cap of hair */}
          <path d="M133 38C134 18 170 18 171 40" strokeWidth="2.2" />
          <path d="M152 64L152 75" strokeWidth="2.2" />
          {/* shirt */}
          <path d="M134 84C140 76 164 76 170 84L174 152C160 158 142 158 130 152Z" strokeWidth="2.6" />
          <path d="M152 76L152 110" strokeWidth="1.6" opacity="0.75" />
          <path d="M171 88C182 103 187 125 185 146" strokeWidth="2.2" />
          <path d="M133 88C122 101 114 117 110 130" strokeWidth="2.2" />
          {/* the pack rides on his far shoulder */}
          <path d="M173 94C188 96 194 110 192 126C190 140 182 146 174 146" strokeWidth="2.2" />
          <path d="M172 112C180 110 188 111 192 114" strokeWidth="1.6" opacity="0.8" />
          <path d="M168 86C178 84 184 88 186 94" strokeWidth="1.8" />
          <path d="M140 155L136 230" strokeWidth="2.4" />
          <path d="M164 155L168 230" strokeWidth="2.4" />
          <path d="M128 232C134 236 142 234 140 230" strokeWidth="2" />
          <path d="M176 232C170 236 162 234 164 230" strokeWidth="2" />

          {/* their hands, joined between them */}
          <circle cx="110" cy="133" r="6.5" strokeWidth="2.2" />

          {/* the path underfoot */}
          <path d="M18 240C62 231 158 231 204 240" strokeWidth="2" />
          <g strokeWidth="1.3" opacity="0.6">
            <path d="M34 242L42 234" />
            <path d="M70 244L79 235" />
            <path d="M118 244L127 235" />
            <path d="M160 242L168 234" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** A stand of firs — the hill-station doodle. */
export function PencilPines({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-auto w-full text-azure-800" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Graphite id="pencil-pines-graphite" seed={5} />
        <g
          filter="url(#pencil-pines-graphite)"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* y is set so each trunk lands on the ground line below */}
          <Fir x={96} y={6} s={1} />
          <Fir x={26} y={73} s={0.66} />
          <Fir x={164} y={49} s={0.78} />

          {/* the ground they stand on */}
          <path d="M12 206C62 197 162 197 208 206" strokeWidth="2" />
          <g strokeWidth="1.3" opacity="0.6">
            <path d="M30 208L38 200" />
            <path d="M76 210L85 201" />
            <path d="M132 210L141 201" />
            <path d="M178 208L186 200" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** One fir, drawn as three ragged tiers over a two-line trunk. */
function Fir({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 10C-8 28 -18 46 -30 64C-12 60 12 60 30 64C18 46 8 28 0 10" strokeWidth="2.6" />
      <path d="M0 48C-10 70 -22 90 -36 108C-14 103 14 103 36 108C22 90 10 70 0 48" strokeWidth="2.6" />
      <path d="M0 90C-12 116 -26 138 -42 158C-16 152 16 152 42 158C26 138 12 116 0 90" strokeWidth="2.6" />
      <path d="M-6 158L-6 196" strokeWidth="2.4" />
      <path d="M7 158L7 196" strokeWidth="2.4" />
      {/* the side that falls away from the light */}
      <g strokeWidth="1.4" opacity="0.65">
        <path d="M8 36L20 56" />
        <path d="M10 76L26 100" />
        <path d="M12 120L32 150" />
      </g>
    </g>
  );
}

/** A packed rucksack — the doodle for anything about getting ready. */
export function PencilBackpack({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-auto w-full text-azure-800" viewBox="0 0 170 210" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Graphite id="pencil-backpack-graphite" seed={17} />
        <g
          filter="url(#pencil-backpack-graphite)"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* the grab loop */}
          <path d="M60 44C54 24 66 13 85 13C104 13 116 24 110 44" strokeWidth="2.6" />
          {/* body */}
          <path d="M32 66C32 48 48 39 85 39C122 39 138 48 138 66L140 166C140 183 127 191 85 191C43 191 30 183 31 166Z" strokeWidth="3" />
          {/* the flap folds over the top */}
          <path d="M34 74C54 99 116 99 136 74" strokeWidth="2.4" />
          <path d="M80 97L80 110" strokeWidth="2" />
          <path d="M72 110C72 104 98 104 98 110C98 116 72 116 72 110Z" strokeWidth="2" />
          {/* front pocket */}
          <path d="M56 124C56 116 62 114 85 114C108 114 114 116 114 124L115 156C115 164 107 166 85 166C63 166 55 164 56 156Z" strokeWidth="2.4" />
          <path d="M58 134C74 139 97 139 113 134" strokeWidth="1.6" opacity="0.8" />
          {/* side straps */}
          <path d="M33 104C24 106 20 114 22 124" strokeWidth="2" />
          <path d="M137 104C146 106 150 114 148 124" strokeWidth="2" />
          {/* hatching down the near edge */}
          <g strokeWidth="1.5" opacity="0.65">
            <path d="M122 176L136 158" />
            <path d="M104 182L130 152" />
            <path d="M86 186L100 170" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** A hot-air balloon, for the pages that talk about where you could go. */
export function PencilBalloon({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg className="h-auto w-full text-azure-800" viewBox="0 0 180 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Graphite id="pencil-balloon-graphite" seed={23} />
        <g
          filter="url(#pencil-balloon-graphite)"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* envelope */}
          <path d="M90 12C133 12 161 45 161 83C161 114 128 142 90 172C52 142 19 114 19 83C19 45 47 12 90 12Z" strokeWidth="3" />
          {/* gores */}
          <path d="M90 12C68 50 66 132 90 172" strokeWidth="2" />
          <path d="M90 12C112 50 114 132 90 172" strokeWidth="2" />
          <path d="M53 22C42 56 50 116 73 164" strokeWidth="1.8" opacity="0.85" />
          <path d="M127 22C138 56 130 116 107 164" strokeWidth="1.8" opacity="0.85" />
          {/* the band around its waist */}
          <path d="M23 66C58 80 122 80 157 66" strokeWidth="2.2" />
          <path d="M31 104C60 118 120 118 149 104" strokeWidth="2.2" />
          {/* ropes down to the basket */}
          <path d="M73 168L78 198" strokeWidth="2" />
          <path d="M107 168L102 198" strokeWidth="2" />
          {/* basket */}
          <path d="M74 198L106 198L102 224C94 227 86 227 78 224Z" strokeWidth="2.6" />
          <path d="M76 208C86 211 94 211 104 208" strokeWidth="1.5" opacity="0.8" />
          <path d="M77 216C86 219 94 219 103 216" strokeWidth="1.5" opacity="0.8" />
          {/* hatching on the side that turns away */}
          <g strokeWidth="1.5" opacity="0.6">
            <path d="M126 134L146 108" />
            <path d="M114 148L140 118" />
            <path d="M104 158L124 134" />
          </g>
        </g>
      </svg>
    </div>
  );
}

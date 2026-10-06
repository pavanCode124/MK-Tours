/**
 * A pencil-sketched beach palm, drawn in the same hand as {@link PencilCamera}
 * so the two read as one set of margin doodles. Fronds are open curves rather
 * than filled shapes, and the shared turbulence filter gives the graphite
 * wobble. Tilt it with a rotation utility on `className`. Decorative only.
 */
export function PencilPalm({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        className="h-auto w-full text-azure-800"
        viewBox="0 0 180 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="pencil-palm-graphite" x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <g
          filter="url(#pencil-palm-graphite)"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Trunk — two lines that taper together, with ring notches between */}
          <path d="M84 222C80 180 74 140 86 74" strokeWidth="3" />
          <path d="M97 222C94 180 88 140 95 76" strokeWidth="2.4" />
          <g strokeWidth="1.5" opacity="0.8">
            <path d="M83 200L96 199" />
            <path d="M81 180L94 179" />
            <path d="M79 158L92 157" />
            <path d="M78 134L91 134" />
            <path d="M79 110L92 111" />
          </g>

          {/* Fronds — each a spine with a few ribs hanging off it */}
          <g strokeWidth="2.4">
            <path d="M90 72C66 62 40 64 20 50" />
            <path d="M90 72C72 48 52 30 32 24" />
            <path d="M90 72C88 44 92 20 86 10" />
            <path d="M90 72C106 50 128 34 146 30" />
            <path d="M90 72C112 68 138 72 160 62" />
            <path d="M90 72C110 84 132 94 150 112" />
            <path d="M90 72C66 80 44 92 30 112" />
          </g>
          <g strokeWidth="1.4" opacity="0.8">
            <path d="M58 64L52 76" />
            <path d="M38 58L31 70" />
            <path d="M66 50L58 60" />
            <path d="M48 34L41 45" />
            <path d="M89 44L80 52" />
            <path d="M88 24L79 33" />
            <path d="M116 48L114 60" />
            <path d="M136 36L135 49" />
            <path d="M120 70L120 82" />
            <path d="M142 66L143 78" />
            <path d="M118 86L112 96" />
            <path d="M136 100L129 109" />
            <path d="M62 80L62 92" />
            <path d="M42 94L41 106" />
          </g>

          {/* Coconuts at the crown */}
          <circle cx="82" cy="80" r="5.5" strokeWidth="2" />
          <circle cx="96" cy="84" r="5" strokeWidth="2" />

          {/* A suggestion of sand, hatched */}
          <path d="M44 222C70 215 112 215 142 222" strokeWidth="2" />
          <g strokeWidth="1.3" opacity="0.6">
            <path d="M56 222L64 214" />
            <path d="M70 224L79 215" />
            <path d="M108 224L117 215" />
            <path d="M124 222L132 214" />
          </g>
        </g>
      </svg>
    </div>
  );
}

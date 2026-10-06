/**
 * A pencil-sketched camera — the Top Destinations backdrop. Every edge is a
 * hand-drawn curve rather than a true rectangle, and a turbulence filter adds
 * the graphite wobble, so it reads as a notebook doodle rather than an icon.
 * Tilt it with a rotation utility on `className`. Decorative only.
 */
export function PencilCamera({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        className="h-auto w-full text-azure-800"
        viewBox="0 0 320 230"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* The graphite wobble: nudges every stroke off its true path. */}
          <filter id="pencil-camera-graphite" x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <clipPath id="pencil-camera-lens">
            <circle cx="160" cy="146" r="40" />
          </clipPath>
        </defs>

        <g
          filter="url(#pencil-camera-graphite)"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Body */}
          <path
            d="M50 86C40 86 30 95 30 107L31 183C31 196 41 205 53 205L267 207C281 207 291 198 290 185L287 105C287 93 278 84 265 84Z"
            strokeWidth="3"
          />
          {/* Prism hump */}
          <path d="M127 85C125 70 129 57 141 55L186 53C197 52 202 63 201 77L202 86" strokeWidth="3" />
          {/* Viewfinder window on the hump */}
          <path d="M146 70C145 64 149 62 157 62L176 62C183 62 185 65 184 71" strokeWidth="2" />

          {/* Lens */}
          <circle cx="160" cy="146" r="52" strokeWidth="3" />
          <circle cx="160" cy="146" r="40" strokeWidth="2.2" />
          <circle cx="160" cy="146" r="25" strokeWidth="2.2" />
          {/* Catchlight on the glass */}
          <path d="M145 133C149 128 156 125 163 126" strokeWidth="2" />

          {/* Flash */}
          <path
            d="M60 111C58 101 63 96 73 96L97 95C106 95 108 101 107 111C106 118 100 120 91 120L73 121C65 121 61 118 60 111Z"
            strokeWidth="2.2"
          />
          {/* Shutter release */}
          <path d="M236 79C234 69 239 64 249 64L262 65C270 65 272 70 271 79" strokeWidth="2.4" />
          {/* Mode dial */}
          <path d="M243 142C243 129 253 121 265 122C276 123 283 132 282 143" strokeWidth="2.2" />
          {/* Strap lugs */}
          <path d="M30 103C19 100 15 91 20 83" strokeWidth="2.4" />
          <path d="M289 103C300 100 304 92 299 84" strokeWidth="2.4" />

          {/* Hatching — body shade, kept clear of the lens barrel */}
          <g strokeWidth="1.6" opacity="0.75">
            <path d="M46 176L70 150" />
            <path d="M55 187L89 151" />
            <path d="M70 193L99 162" />
            <path d="M88 196L104 179" />
          </g>
          {/* Hatching — the lens falls away to the lower right */}
          <g strokeWidth="1.6" opacity="0.7" clipPath="url(#pencil-camera-lens)">
            <path d="M156 186L196 146" />
            <path d="M168 190L200 158" />
            <path d="M182 192L202 172" />
          </g>
        </g>
      </svg>
    </div>
  );
}

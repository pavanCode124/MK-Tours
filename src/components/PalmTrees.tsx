/**
 * A quiet beach-silhouette watermark — a palm tree rendered in the brand
 * navy at low opacity, tucked into a section corner. Decorative only.
 */
export function PalmTrees({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden="true">
      <svg
        className="palm-sway h-full w-auto text-sherwood-800"
        viewBox="0 0 126 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M62 170 C58 130 48 100 60 55" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
        <g fill="currentColor">
          <path d="M60 55 C35 45 15 50 2 35 C20 30 42 35 58 48 Z" />
          <path d="M60 55 C45 30 30 12 15 8 C35 10 52 22 60 45 Z" />
          <path d="M60 55 C64 30 72 12 68 6 C82 14 86 32 78 50 C73 53 66 54 60 55 Z" />
          <path d="M60 55 C78 38 96 30 108 18 C100 36 84 46 65 52 Z" />
          <path d="M60 55 C82 52 100 60 118 58 C108 70 88 70 68 60 Z" />
        </g>
      </svg>
    </div>
  );
}

'use client';

import { useState, type ReactNode } from 'react';

/**
 * The "All Tours / Karnataka / Kerala …" filter above the package grid. The
 * cards themselves are rendered on the server and handed in as children, so
 * this component only decides which group is on screen.
 */
export function PackageTabs({ groups }: { groups: { label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);
  if (groups.length === 0) return null;

  return (
    <div>
      {groups.length > 1 && (
        <div className="rail -mx-5 mb-8 flex gap-2.5 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          {groups.map((g, i) => (
            <button
              key={g.label}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`shrink-0 rounded-xl border px-5 py-2.5 text-[12px] font-semibold transition-colors duration-200 ${
                i === active
                  ? 'border-sherwood-800 bg-sherwood-800 text-on-dark'
                  : 'border-border-strong bg-raised text-text hover:border-sherwood-800 hover:text-sherwood-800'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}
      {groups.map((g, i) => (
        <div key={g.label} hidden={i !== active}>
          {g.content}
        </div>
      ))}
    </div>
  );
}

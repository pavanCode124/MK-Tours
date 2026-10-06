'use client';

import { useState, type ReactNode } from 'react';

/**
 * The "All Tours / Karnataka / Kerala …" filter above the package grid. The
 * cards themselves are rendered on the server and handed in as children, so
 * this component only decides which group is on screen.
 *
 * The tabs now sit inside one curved track, with the active pill lifted on a
 * shadow rather than outlined — the same shape language as the rest of the UI.
 */
export function PackageTabs({ groups }: { groups: { label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);
  if (groups.length === 0) return null;

  return (
    <div>
      {groups.length > 1 && (
        <div className="rail -mx-5 mb-9 flex overflow-x-auto px-5 md:mx-0 md:px-0">
          <div className="inline-flex shrink-0 gap-1.5 rounded-full border border-border bg-raised p-1.5 shadow-soft md:flex-wrap">
            {groups.map((g, i) => (
              <button
                key={g.label}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`shrink-0 rounded-full px-5 py-2.5 text-[12.5px] font-bold transition-all duration-300 ${
                  i === active
                    ? 'bg-azure-900 text-on-dark shadow-lift'
                    : 'text-muted hover:bg-vermilion-50 hover:text-vermilion-700'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
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

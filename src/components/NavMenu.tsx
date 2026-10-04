'use client';

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react';

/**
 * The primary navigation's dropdown controller.
 *
 * One piece of state — the id of the single open panel — is shared by every
 * trigger in the bar. That is what fixes the old glitch where clicking one tab
 * left its panel pinned open (it kept DOM focus, and the CSS used
 * `group-focus-within`) while hovering a neighbour opened a second panel on
 * top. Here, opening any panel closes whichever one was open, so at most one
 * is ever visible.
 */

interface NavState {
  openId: string | null;
  open: (id: string) => void;
  close: () => void;
  toggle: (id: string) => void;
}

const NavCtx = createContext<NavState | null>(null);

export function NavBar({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const open = useCallback(
    (id: string) => {
      cancelClose();
      setOpenId(id);
    },
    [cancelClose],
  );

  const close = useCallback(() => {
    cancelClose();
    setOpenId(null);
  }, [cancelClose]);

  const toggle = useCallback(
    (id: string) => {
      cancelClose();
      setOpenId((current) => (current === id ? null : id));
    },
    [cancelClose],
  );

  // Escape closes, and so does a click anywhere outside the bar.
  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenId(null);
    };
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest?.('[data-navbar]')) setOpenId(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [openId]);

  useEffect(() => cancelClose, [cancelClose]);

  return (
    <NavCtx.Provider value={{ openId, open, close, toggle }}>
      <nav
        data-navbar
        aria-label="Primary"
        className={className}
        onMouseLeave={() => {
          cancelClose();
          closeTimer.current = setTimeout(() => setOpenId(null), 140);
        }}
        onMouseEnter={cancelClose}
      >
        {children}
      </nav>
    </NavCtx.Provider>
  );
}

function useNav() {
  const ctx = useContext(NavCtx);
  if (!ctx) throw new Error('NavMenu parts must be used inside <NavBar>');
  return ctx;
}

const TRIGGER =
  'relative flex items-center gap-1.5 whitespace-nowrap py-2 text-[13.5px] font-medium tracking-[0.01em] text-text transition-colors hover:text-meadow-700';

/** A dropdown trigger plus its panel. Opens on hover, click and keyboard focus. */
export function NavMenu({
  label,
  children,
  width = 'w-[880px]',
  align = 'left',
}: {
  label: string;
  children: ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}) {
  const { openId, open, close, toggle } = useNav();
  const id = useId();
  const isOpen = openId === id;

  const alignment =
    align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'right' ? 'right-0' : 'left-0';

  return (
    <div
      className="relative"
      onMouseEnter={() => open(id)}
      onFocus={() => open(id)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) close();
      }}
    >
      <button
        type="button"
        className={TRIGGER}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={() => toggle(id)}
      >
        {label}
        <svg
          viewBox="0 0 20 20"
          className={`h-3 w-3 text-subtle transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span
          className={`absolute inset-x-0 -bottom-[3px] h-[2px] origin-left rounded-full bg-meadow-600 transition-transform duration-200 ${
            isOpen ? 'scale-x-100' : 'scale-x-0'
          }`}
        />
      </button>

      <div
        data-open={isOpen}
        aria-hidden={!isOpen}
        onClick={close}
        className={`nav-panel absolute top-[calc(100%+14px)] z-40 ${width} ${alignment} max-w-[min(94vw,1120px)] overflow-hidden border border-border bg-raised shadow-[0_24px_60px_-18px_rgba(28,46,61,0.3)]`}
      >
        {children}
      </div>
    </div>
  );
}

/** The sliver of gold that sits under the active panel's trigger row. */
export function NavLinkClass() {
  return TRIGGER;
}

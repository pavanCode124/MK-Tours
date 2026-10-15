'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * The sticky header shell.
 *
 * At the very top of the page the bars stay opaque, so the wordmark and the
 * skyblue navigation band read as solid chrome. Once the page has moved a
 * little, `data-scrolled` flips and the CSS in globals.css turns both bars to
 * glass — translucent, blurred and lifted over whatever is sliding beneath.
 */
export function ScrollAwareHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    const apply = () => {
      frame = 0;
      el.dataset.scrolled = window.scrollY > 8 ? 'true' : 'false';
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header ref={ref} data-scrolled="false" className="site-header group sticky top-0 z-40">
      {children}
    </header>
  );
}

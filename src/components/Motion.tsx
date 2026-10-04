'use client';

import { useEffect } from 'react';

/**
 * Reveals anything marked `.reveal` as it scrolls into view, and keeps watching
 * for nodes added later (route changes, tab switches). Mounted once in the root
 * layout. If JavaScript never runs, the fallback in globals.css is overridden by
 * this effect being absent — so we also unhide everything immediately when the
 * observer is unavailable or motion is reduced.
 */
export function RevealObserver() {
  useEffect(() => {
    const reveal = (el: Element) => el.classList.add('is-visible');

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll('.reveal').forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    const observeAll = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => {
        // Anything already on screen on first paint shows without animating in.
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight * 0.9) reveal(el);
        else io.observe(el);
      });
    };

    observeAll();
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

/**
 * Last-resort safety net: if the bundle fails to load, nothing marked `.reveal`
 * would ever be shown. This inline script runs before hydration and unhides the
 * page after a beat, so content is never permanently invisible.
 */
export function RevealFallbackScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html:
          "setTimeout(function(){document.querySelectorAll('.reveal:not(.is-visible)').forEach(function(e){if(e.getBoundingClientRect().top<innerHeight)e.classList.add('is-visible')})},1200)",
      }}
    />
  );
}

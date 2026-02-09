// src/hooks/useNavbarScroll.js
import { useEffect, useRef, useState } from "react";

export function useNavbarScroll({
  compactOffset = 80, // da quanti px in giù la navbar diventa "compatta"
  hideOffset = 80, // da quanti px in giù può iniziare a nascondersi
  revealDelta = 16, // pixel verso SU necessari per mostrare
  hideDelta = 12, // pixel verso GIÙ necessari per nascondere
} = {}) {
  const [state, setState] = useState({
    hidden: false,
    compact: false,
    progress: 0,
  });

  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const getMaxScroll = () => {
      const body = document.body;
      const html = document.documentElement;
      const scrollHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
      const viewport = window.innerHeight;
      return Math.max(scrollHeight - viewport, 1);
    };

    lastYRef.current = window.scrollY || 0;

    const onScroll = () => {
      const currentY = window.scrollY || 0;
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const prevY = lastYRef.current;
        const delta = currentY - prevY;
        const nearTop = currentY <= 4;
        const maxScroll = getMaxScroll();
        const progress = Math.min(Math.max(currentY / maxScroll, 0), 1);

        setState((prev) => {
          let hidden = prev.hidden;

          if (nearTop || currentY < hideOffset) {
            // in alto o in zona "hero": sempre visibile
            hidden = false;
          } else {
            if (delta <= -revealDelta) {
              // scroll deciso verso SU → mostra
              hidden = false;
            } else if (delta >= hideDelta) {
              // scroll deciso verso GIÙ → nascondi
              hidden = true;
            }
          }

          const compact = currentY > compactOffset;

          lastYRef.current = currentY;
          tickingRef.current = false;

          if (hidden === prev.hidden && compact === prev.compact && progress === prev.progress) {
            return prev;
          }

          return { hidden, compact, progress };
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [compactOffset, hideOffset, revealDelta, hideDelta]);

  return state; // { hidden, compact, progress }
}

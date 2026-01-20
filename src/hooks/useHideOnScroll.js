// src/hooks/useHideOnScroll.js
import { useEffect, useRef, useState } from "react";

/**
 * Ritorna true/false se la navbar deve essere nascosta
 * in base SOLO alla direzione dello scroll.
 * Nessun riferimento a isOpen o ad altri stati esterni.
 */
export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY || 0;

    const onScroll = () => {
      const y = window.scrollY || 0;

      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const prev = lastY.current;
        const delta = y - prev; // >0 giù, <0 su
        const nearTop = y <= 8;

        if (nearTop) {
          // in alto => sempre visibile
          setHidden(false);
        } else {
          if (delta < -1) {
            // anche pochissimo verso SU => mostra
            setHidden(false);
          } else if (delta > 1) {
            // verso GIÙ => nascondi
            setHidden(true);
          }
        }

        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}

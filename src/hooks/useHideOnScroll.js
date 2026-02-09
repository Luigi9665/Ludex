import { useEffect, useRef, useState } from "react";

export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const hiddenRef = useRef(false); // tiene il valore corrente senza triggerare re-render

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

        let nextHidden = hiddenRef.current;

        if (nearTop) {
          nextHidden = false;
        } else {
          if (delta < -1) {
            nextHidden = false; // scroll su → mostra
          } else if (delta > 1) {
            nextHidden = true; // scroll giù → nascondi
          }
        }

        // evita setState inutili
        if (nextHidden !== hiddenRef.current) {
          hiddenRef.current = nextHidden;
          setHidden(nextHidden);
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

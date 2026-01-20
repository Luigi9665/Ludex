import { useEffect, useRef, useState } from "react";

export const useRevealOnScroll = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            // una volta visibile, non torniamo più hidden
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15, // 15% visibile
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return { ref, visible };
};

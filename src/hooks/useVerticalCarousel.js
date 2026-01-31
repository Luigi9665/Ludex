import { useState, useCallback, useEffect } from "react";

/**
 * Hook per gestire il carousel verticale con animazioni smooth
 * @param {number} totalItems - Numero totale di item nel carousel
 * @param {Function} onReachEnd - Callback quando si raggiunge l'ultimo item (per loadMore)
 */
export const useVerticalCarousel = (totalItems, onReachEnd) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = avanti, -1 = indietro
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Naviga alla card successiva
  const goToNext = useCallback(() => {
    if (isTransitioning) return;

    if (currentIndex < totalItems - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else if (currentIndex === totalItems - 1 && onReachEnd) {
      // Siamo all'ultima card, notifica per loadMore
      onReachEnd();
    }
  }, [currentIndex, totalItems, isTransitioning, onReachEnd]);

  // Naviga alla card precedente
  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;

    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, isTransitioning]);

  // Naviga a un indice specifico
  const goToIndex = useCallback(
    (index) => {
      if (isTransitioning || index === currentIndex) return;

      if (index >= 0 && index < totalItems) {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
      }
    },
    [currentIndex, totalItems, isTransitioning],
  );

  // Gestione scroll wheel
  useEffect(() => {
    let timeout;

    const handleWheel = (e) => {
      // Previeni scroll default durante la transizione
      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      // Debounce scroll per evitare transizioni troppo rapide
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (e.deltaY > 0) {
          goToNext();
        } else if (e.deltaY < 0) {
          goToPrevious();
        }
      }, 50);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      clearTimeout(timeout);
    };
  }, [goToNext, goToPrevious, isTransitioning]);

  // Gestione touch/swipe
  useEffect(() => {
    let touchStart = 0;
    let touchEnd = 0;

    const handleTouchStart = (e) => {
      touchStart = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      touchEnd = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (touchStart - touchEnd > 50) {
        // Swipe up
        goToNext();
      }

      if (touchStart - touchEnd < -50) {
        // Swipe down
        goToPrevious();
      }
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goToNext, goToPrevious]);

  // Calcola progress
  const progress = totalItems > 0 ? ((currentIndex + 1) / totalItems) * 100 : 0;

  return {
    currentIndex,
    direction,
    goToNext,
    goToPrevious,
    goToIndex,
    progress,
    setIsTransitioning,
  };
};

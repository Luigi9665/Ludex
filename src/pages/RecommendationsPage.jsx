import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

import { loadRecommendations, loadMoreRecommendations } from "../redux/action";
import RecommendationCard from "../components/Recommendations/RecommendationCard";
import { useVerticalCarousel } from "../hooks/useVerticalCarousel";

import styles from "../styles/Recommendations/RecommendationsPage.module.css";

const RecommendationsPage = () => {
  const dispatch = useDispatch();

  const { items, loading, error, hasMore } = useSelector(
    (state) =>
      state.recommendations || {
        items: [],
        loading: false,
        error: null,
        hasMore: false,
      },
  );

  // blocco lo scroll del body per avere effetto "pagina ferma"
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, []);

  // primo load
  useEffect(() => {
    dispatch(loadRecommendations());
  }, [dispatch]);

  // hook carosello verticale
  const { currentIndex, direction, goToIndex, progress, setIsTransitioning } = useVerticalCarousel(items.length, () => {
    // quando arrivo all’ultima card → carico altri consigli se ci sono
    if (hasMore && !loading) {
      dispatch(loadMoreRecommendations());
    }
  });

  const handleRetry = () => {
    dispatch(loadRecommendations());
  };

  const cardVariants = {
    enter: (dir) => ({
      y: dir > 0 ? "100vh" : "-100vh",
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: (dir) => ({
      y: dir > 0 ? "-100vh" : "100vh",
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  /* ========== stati globali (loading / error / empty) ========== */

  if (loading && items.length === 0) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p className={styles.loadingText}>Stiamo cercando i giochi perfetti per te...</p>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2 className={styles.errorTitle}>Oops! Qualcosa è andato storto</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button className={styles.retryButton} onClick={handleRetry}>
          Riprova
        </button>
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>🎮</div>
        <h2 className={styles.emptyTitle}>Nessun gioco trovato</h2>
        <p className={styles.emptyMessage}>Prova a modificare le tue preferenze per ottenere nuovi consigli.</p>
      </div>
    );
  }

  // safety: se per qualche motivo currentIndex è fuori range
  const safeIndex = currentIndex < 0 ? 0 : currentIndex >= items.length ? items.length - 1 : currentIndex;

  const currentGame = items[safeIndex];
  const isAtEnd = safeIndex === items.length - 1;
  const completion = Math.round(progress);
  const isComplete = completion >= 100 || (isAtEnd && !hasMore);
  const safeCompletion = Math.max(completion, 1);

  return (
    <div className={styles.pageContainer}>
      {/* HEADER FISSO - VERSIONE PREMIUM */}
      <div className="container">
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleWrapper}>
              <h1 className={styles.title}>
                <span className={styles.titleGlow} data-text="I Tuoi Giochi Consigliati">
                  I Tuoi Giochi Consigliati
                </span>
              </h1>
              <p className={styles.subtitle}>Scrolla per scoprire i tuoi match perfetti</p>
            </div>

            <div className={styles.counterBadge}>
              <div className={styles.badgeGlow} aria-hidden="true" />

              <span className={styles.badgeIcon}>🎮</span>

              <span className={styles.badgeText}>
                <span className={styles.badgeCurrent}>{safeIndex + 1}</span>
                <span className={styles.badgeSeparator}>/</span>
                <span className={styles.badgeTotal}>{items.length}</span>
              </span>

              <div className={styles.badgeProgress}>
                <motion.div
                  className={styles.badgeProgressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${((safeIndex + 1) / items.length) * 100}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* PROGRESS BAR LATERALE SINISTRA - PREMIUM VERSION */}
      <aside className={`${styles.sideProgress} ${isComplete ? styles.sideProgressComplete : ""}`}>
        {/* Glow ambientale */}
        <div className={styles.sideAmbientGlow} aria-hidden="true" />

        {/* Track container */}
        <div className={styles.sideTrack}>
          {/* Fill animato */}
          <motion.div
            className={styles.sideFill}
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />

          {/* Effetto shimmer che segue il fill */}
          <motion.div
            className={styles.sideShimmer}
            initial={{ top: "100%" }}
            animate={{ top: `${100 - progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            aria-hidden="true"
          />

          {/* Tick marks decorativi */}
          <div className={styles.sideTicks} aria-hidden="true">
            {[0, 25, 50, 75, 100].map((tick) => (
              <div key={tick} className={`${styles.sideTick} ${progress >= tick ? styles.sideTickActive : ""}`} style={{ bottom: `${tick}%` }} />
            ))}
          </div>
        </div>

        {/* Label percentuale */}
        <div className={styles.sideLabel}>
          {isComplete && <span className={styles.sideLabelIcon}>🎉</span>}
          <span className={styles.sideLabelText}>{isComplete ? "Completo!" : `${safeCompletion}%`}</span>
        </div>
      </aside>

      {/* CAROUSEL CENTRALE */}
      <main className={styles.carouselContainer}>
        <AnimatePresence initial={false} custom={direction} mode="wait" onExitComplete={() => setIsTransitioning(false)}>
          <motion.div
            key={currentGame?.gameId || safeIndex}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className={styles.cardWrapper}
            onAnimationStart={() => setIsTransitioning(true)}
            onAnimationComplete={() => setIsTransitioning(false)}
          >
            <RecommendationCard game={currentGame} />
          </motion.div>
        </AnimatePresence>

        {/* dots laterali */}
        <div className={styles.navigationDots}>
          {items.map((game, index) => (
            <button
              key={game.gameId ?? index}
              className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ""}`}
              onClick={() => goToIndex(index)}
              aria-label={`Vai al gioco ${index + 1}`}
              title={`${index + 1}. ${game.title}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default RecommendationsPage;

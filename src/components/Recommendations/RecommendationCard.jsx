import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import PreferenceSummaryBox from "./PreferenceSummaryBox";
import ReasonsList from "./ReasonsList";
import styles from "../../styles/Recommendations/RecommendationCard.module.css";

// ✅ action già esistenti nel tuo redux
import { markRecommendationInterested, markRecommendationNotInterested } from "../../redux/action"; // <-- aggiusta il path se diverso

const RecommendationCard = ({ game }) => {
  const { gameId, title, coverUrl, platforms, genres, shortDescription, isFreeToPlay, matchedPreferencesCount, matchedReasons = [], reasonSummary } = game;

  const [imageLoaded, setImageLoaded] = useState(false);

  // ✅ micro-state solo per feedback visivo
  const [pressedAction, setPressedAction] = useState(null); // "interested" | "notInterested" | null

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ leggo pendingByGameId per anti multi-click e per disabilitare i bottoni
  const isPending = useSelector((state) => !!state?.recommendations?.pendingByGameId?.[gameId]);

  const handleCardClick = () => {
    if (!gameId) return;
    // se l'utente ha appena cliccato un bottone, evito che il click "passi" e navighi
    if (isPending || pressedAction) return;
    navigate(`/game/${gameId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  const MAX_REASONS = 4;

  const cardClassName = useMemo(() => {
    const base = styles.card;
    const pressed = pressedAction === "interested" ? styles.cardPressedInterested : pressedAction === "notInterested" ? styles.cardPressedNotInterested : "";
    const pending = isPending ? styles.cardPending : "";
    return [base, pressed, pending].filter(Boolean).join(" ");
  }, [pressedAction, isPending, styles]);

  const onInterested = (e) => {
    e.stopPropagation();
    if (!gameId || isPending) return;

    // micro feedback visivo immediato (non rimuove nulla)
    setPressedAction("interested");

    // ✅ chiamiamo il thunk già pronto (rimuove localmente DOPO success)
    dispatch(markRecommendationInterested(gameId));
  };

  const onNotInterested = (e) => {
    e.stopPropagation();
    if (!gameId || isPending) return;

    setPressedAction("notInterested");

    // payload opzionale (notes/reason) → per ora null
    dispatch(markRecommendationNotInterested(gameId, null));
  };

  return (
    <article
      className={cardClassName}
      data-game-id={gameId}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-disabled={isPending ? "true" : "false"}
    >
      {/* Ambient glow layer */}
      <div className={styles.ambientGlow} aria-hidden="true" />

      {/* LAYOUT WRAPPER - consente 2 colonne su ultrawide */}
      <div className={styles.cardInner}>
        {/* Hero Image Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroFrame}>
            <div className={styles.imageContainer}>
              <img
                src={coverUrl}
                alt={`${title} cover art`}
                className={`${styles.heroImage} ${imageLoaded ? styles.loaded : ""}`}
                onLoad={() => setImageLoaded(true)}
                loading="lazy"
              />

              <div className={styles.gradientOverlay} aria-hidden="true" />
              <div className={styles.vignetteOverlay} aria-hidden="true" />
              <div className={styles.glassShimmer} aria-hidden="true" />
            </div>

            {isFreeToPlay && (
              <div className={styles.freeBadge}>
                <span>FREE</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section - con scroll interno su overflow */}
        <div className={styles.contentSection}>
          <div className={styles.contentScroll}>
            {/* Title Area */}
            <div className={styles.titleArea}>
              <h2 className={styles.title}>{title}</h2>

              {/* Metadata Row */}
              <div className={styles.metadata}>
                {platforms && platforms.length > 0 && (
                  <div className={styles.platforms}>
                    {platforms.slice(0, 3).map((platform, idx) => (
                      <span key={idx} className={styles.platformTag}>
                        {platform}
                      </span>
                    ))}
                    {platforms.length > 3 && <span className={styles.platformTag}>+{platforms.length - 3}</span>}
                  </div>
                )}

                {genres && genres.length > 0 && (
                  <div className={styles.genres}>
                    {genres.slice(0, 2).map((genre, idx) => (
                      <span key={idx} className={styles.genreTag}>
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Preference Match Box */}
            {matchedPreferencesCount > 0 && (
              <div className={styles.preferenceSection}>
                <PreferenceSummaryBox matchedCount={matchedPreferencesCount} />
              </div>
            )}

            {/* Description */}
            {shortDescription && <p className={styles.description}>{shortDescription}</p>}

            {/* Matched Reasons */}
            {matchedReasons && matchedReasons.length > 0 && (
              <div className={styles.reasonsSection}>
                <ReasonsList reasons={matchedReasons.slice(0, MAX_REASONS)} />
              </div>
            )}

            {/* Reason Summary */}
            {reasonSummary && (
              <div className={styles.summarySection}>
                <div className={styles.summaryCard}>
                  <p className={styles.summaryText}>{reasonSummary}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button type="button" className={`${styles.actionButton} ${styles.actionInterested}`} onClick={onInterested} disabled={isPending}>
                <span className={styles.buttonIcon}>🔥</span>
                <span>{isPending && pressedAction === "interested" ? "Aggiungo..." : "Mi interessa"}</span>
              </button>

              <button type="button" className={`${styles.actionButton} ${styles.actionNotInterested}`} onClick={onNotInterested} disabled={isPending}>
                <span className={styles.buttonIcon}>💡</span>
                <span>{isPending && pressedAction === "notInterested" ? "Ok..." : "Non fa per me"}</span>
              </button>
            </div>

            {/* (opzionale) bottone dev-only per rimuovere al volo senza API */}
            {/* <button onClick={(e) => { e.stopPropagation(); dispatch(removeRecommendationLocal(gameId)); }}>
              DEBUG remove
            </button> */}
          </div>
        </div>
      </div>

      {/* Bottom glass reflection */}
      <div className={styles.bottomReflection} aria-hidden="true" />
    </article>
  );
};

export default RecommendationCard;

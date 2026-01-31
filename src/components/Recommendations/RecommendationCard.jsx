import React, { useState } from "react";
import { useNavigate } from "react-router";
import PreferenceSummaryBox from "./PreferenceSummaryBox";
import ReasonsList from "./ReasonsList";
import styles from "../../styles/Recommendations/RecommendationCard.module.css";

const RecommendationCard = ({ game }) => {
  const { gameId, title, coverUrl, platforms, genres, shortDescription, isFreeToPlay, matchedPreferencesCount, matchedReasons = [], reasonSummary } = game;

  const [imageLoaded, setImageLoaded] = useState(false);

  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!gameId) return;
    navigate(`/game/${gameId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article className={styles.card} data-game-id={gameId} onClick={handleCardClick} role="button" tabIndex={0} onKeyDown={handleKeyDown}>
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
                <ReasonsList reasons={matchedReasons} />
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
              <button
                type="button"
                className={`${styles.actionButton} ${styles.actionInterested}`}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Mi interessa", gameId);
                }}
              >
                <span className={styles.buttonIcon}>🔥</span>
                <span>Mi interessa</span>
              </button>

              <button
                type="button"
                className={`${styles.actionButton} ${styles.actionNotInterested}`}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Non fa per me", gameId);
                }}
              >
                <span className={styles.buttonIcon}>💡</span>
                <span>Non fa per me</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glass reflection */}
      <div className={styles.bottomReflection} aria-hidden="true" />
    </article>
  );
};

export default RecommendationCard;

import { Link } from "react-router";
import StarRating from "../StarRating";

const GameCard = ({ game, variant = "full", enableAddButton, alreadyInLibrary = false, onAddClick }) => {
  const heroImage = game.heroImageUrl || game.coverUrl;
  const hasRating = typeof game.rating === "number" && game.rating > 0;
  const hasReview = typeof game.review === "string" && game.review.trim().length > 0;
  const isReviewPublic = game.isReviewPublic === true;

  const platforms = Array.isArray(game.platform) ? game.platform : [game.platform].filter(Boolean);
  const genres = Array.isArray(game.genre) ? game.genre : [game.genre].filter(Boolean);

  const statusConfig = {
    Playing: { label: "Continua", className: "lx-game-card-cta" },
    Backlog: { label: "Inizia", className: "lx-game-card-cta lx-game-card-cta--backlog" },
    Completed: { label: "Rigioca", className: "lx-game-card-cta lx-game-card-cta--completed" },
    Paused: { label: "Riprendi", className: "lx-game-card-cta lx-game-card-cta--paused" },
  };

  const statusBadgeClass = {
    Playing: "lx-game-card-status-badge--playing",
    Backlog: "lx-game-card-status-badge--backlog",
    Completed: "lx-game-card-status-badge--completed",
    Paused: "lx-game-card-status-badge--paused",
  };

  const status = statusConfig[game.status] || { label: "Gioca", className: "lx-game-card-cta" };
  const badgeClass = statusBadgeClass[game.status] || "";

  const progress = game.progress || 0;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getLastActivityText = () => {
    if (!game.lastUpdatedAt) return null;
    const lastUpdate = new Date(game.lastUpdatedAt);
    const now = new Date();
    const diffDays = Math.floor((now - lastUpdate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aggiornato oggi";
    if (diffDays === 1) return "Aggiornato ieri";
    if (diffDays < 7) return `${diffDays} giorni fa`;
    return lastUpdate.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
  };

  // ===== COMPACT VARIANT (per Library) =====
  if (variant === "compact") {
    const isInLibrary = alreadyInLibrary === true;
    const primaryGenre = genres[0];
    const primaryPlatform = platforms[0];

    return (
      <article className="lx-game-card lx-game-card--compact">
        <Link to={`/game/${game.gameId}`} className="lx-game-card-compact-link">
          <div className="lx-game-card-compact-cover">
            <img src={heroImage} alt={game.title} loading="lazy" />
            <div className="lx-game-card-compact-gradient" />

            {/* Titolo base (sempre visibile) */}
            <div className="lx-game-card-compact-main">
              <h4 className="lx-game-card-compact-title" title={game.title}>
                {game.title}
              </h4>
            </div>

            {/* Layer hover con dettagli + CTA */}
            <div className="lx-game-card-compact-hover">
              <div className="lx-game-card-compact-meta">
                {primaryGenre && <span className="lx-game-card-compact-chip">{primaryGenre}</span>}
                {primaryPlatform && <span className="lx-game-card-compact-chip">{primaryPlatform}</span>}
              </div>

              {enableAddButton && (
                <div className="lx-game-card-compact-footer">
                  <button
                    type="button"
                    className={`lx-game-card-compact-cta ${isInLibrary ? "lx-game-card-compact-cta--owned" : ""}`}
                    disabled={isInLibrary}
                    onClick={(e) => {
                      e.preventDefault(); // evita il navigation del Link
                      if (!isInLibrary && onAddClick) {
                        onAddClick(game);
                      }
                    }}
                  >
                    {isInLibrary ? "Già in libreria" : "Aggiungi alla libreria"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </Link>
      </article>
    );
  }

  // ===== FULL VARIANT (Home / Carousel) =====
  return (
    <article className="lx-game-card lx-game-card--full">
      <div className="lx-game-card-inner">
        {/* Column 1: Media & Status */}
        <div className="lx-game-card-media">
          <div className="lx-game-card-cover">
            <img src={heroImage} alt={game.title} loading="lazy" />
            <div className="lx-game-card-cover-overlay" />
            {game.status && <span className={`lx-game-card-status-badge ${badgeClass}`}>{game.status}</span>}
          </div>

          {platforms.length > 0 && (
            <div className="lx-game-card-platforms">
              {platforms.slice(0, 3).map((platform, idx) => (
                <div key={idx} className="lx-game-card-platform-icon" title={platform}>
                  {platform.substring(0, 2).toUpperCase()}
                </div>
              ))}
            </div>
          )}

          {game.status === "Playing" && progress > 0 && (
            <div className="lx-game-card-progress-ring">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle className="lx-game-card-progress-ring-bg" cx="30" cy="30" r={radius} />
                <circle
                  className="lx-game-card-progress-ring-fill"
                  cx="30"
                  cy="30"
                  r={radius}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="lx-game-card-progress-ring-text">{progress}%</div>
            </div>
          )}
        </div>

        {/* Column 2: Info */}
        <div className="lx-game-card-info">
          <Link to={`/game/${game.gameId}`} style={{ textDecoration: "none" }}>
            <h4 className="lx-game-card-title">{game.title}</h4>
          </Link>

          <div className="lx-game-card-meta-row">
            {game.releaseDate && <span className="lx-game-card-meta-item">{new Date(game.releaseDate).getFullYear()}</span>}
            {game.releaseDate && genres.length > 0 && <span className="lx-game-card-meta-separator">•</span>}
            {genres.length > 0 && <span className="lx-game-card-meta-item">{genres[0]}</span>}
          </div>

          {genres.length > 0 && (
            <div className="lx-game-card-tags">
              {genres.slice(0, 4).map((genre, idx) => (
                <span key={idx} className="lx-game-card-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}

          {hasReview && isReviewPublic && <div className="lx-game-card-review-snippet">{game.review}</div>}

          {game.status === "Playing" && progress > 0 && (
            <div className="lx-game-card-progress-bar">
              <div className="lx-game-card-progress-label">
                <span>Completamento</span>
                <span>{progress}%</span>
              </div>
              <div className="lx-game-card-progress-track">
                <div className="lx-game-card-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Column 3: Actions & Insight */}
        <div className="lx-game-card-actions">
          <Link to={`/game/${game.gameId}`} className={status.className}>
            {status.label}
          </Link>

          <div className="lx-game-card-secondary-actions">
            <Link to={`/game/${game.gameId}`} className="lx-game-card-secondary-btn">
              Dettagli
            </Link>
            <Link to={`/game/${game.gameId}`} className="lx-game-card-secondary-btn">
              Simili
            </Link>
          </div>

          <div className="lx-game-card-rating">
            <div className="lx-game-card-rating-label">La tua valutazione</div>
            {hasRating ? (
              <div className="lx-game-card-rating-value">{game.rating.toFixed(1)}</div>
            ) : (
              <div className="lx-game-card-rating-value lx-game-card-rating-value--unrated">Non valutato</div>
            )}
          </div>

          {game.lastUpdatedAt && <div className="lx-game-card-last-activity">{getLastActivityText()}</div>}
        </div>
      </div>
    </article>
  );
};

export default GameCard;

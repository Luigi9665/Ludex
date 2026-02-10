import { useState, useMemo } from "react";
import { Link } from "react-router";
import { useUserGameActions } from "../../hooks/useUserGameActions.js";

const GameCard = ({
  game,
  variant = "full",
  enableAddButton,
  alreadyInLibrary = false,
  onAddClick,
  isMe = true, // true = libreria mia, false = card “read-only” se vorrai in futuro
}) => {
  const heroImage = game.heroImageUrl || game.coverUrl;

  const platforms = useMemo(() => (Array.isArray(game.platform) ? game.platform : [game.platform].filter(Boolean)), [game.platform]);

  const genres = useMemo(() => (Array.isArray(game.genre) ? game.genre : [game.genre].filter(Boolean)), [game.genre]);

  const hasRating = typeof game.rating === "number" && game.rating > 0;
  const hasReview = typeof game.review === "string" && game.review.trim().length > 0;
  const isReviewPublic = game.isReviewPublic === true;

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

  const progress = typeof game.progress === "number" ? game.progress : 0;
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
    return lastUpdate.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const lastActivityText = getLastActivityText();

  // ===== Stato locale per l’edit “sessione” (Playing / Completed) =====
  const [isEditingSession, setIsEditingSession] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);

  const [draftProgress, setDraftProgress] = useState(progress);
  const [draftRating, setDraftRating] = useState(hasRating ? game.rating : null);
  const [draftReview, setDraftReview] = useState(hasReview ? game.review : "");
  const [draftIsPublic, setDraftIsPublic] = useState(isReviewPublic);

  const { startFromBacklog, resumeFromPaused, replayFromCompleted, updateSession } = useUserGameActions({ isMe });

  const openSessionEdit = () => {
    setDraftProgress(typeof game.progress === "number" ? game.progress : 0);
    setDraftRating(hasRating ? game.rating : null);
    setDraftReview(hasReview ? game.review : "");
    setDraftIsPublic(isReviewPublic);
    setIsEditingSession(true);
  };

  const handlePrimaryAction = async () => {
    switch (game.status) {
      case "Backlog":
        await startFromBacklog(game);
        break;
      case "Paused":
        await resumeFromPaused(game);
        break;
      case "Completed":
        await replayFromCompleted(game);
        break;
      case "Playing":
      default:
        openSessionEdit();
        break;
    }
  };

  const handleSessionCancel = () => {
    setDraftProgress(typeof game.progress === "number" ? game.progress : 0);
    setDraftRating(hasRating ? game.rating : null);
    setDraftReview(hasReview ? game.review : "");
    setDraftIsPublic(isReviewPublic);
    setIsEditingSession(false);
  };

  const handleSessionSave = async () => {
    const isPlaying = game.status === "Playing";
    const payload = {
      ...(isPlaying ? { progress: draftProgress } : {}),
      rating: draftRating,
      review: draftReview,
      isReviewPublic: draftIsPublic,
    };

    setIsSavingSession(true);
    try {
      await updateSession(game, payload, "Sessione aggiornata.");
      setIsEditingSession(false);
    } finally {
      setIsSavingSession(false);
    }
  };

  // ===== URL "Simili" → /library?genre=...&genre=... (max 3) =====
  const similarHref = useMemo(() => {
    const similarGenres = genres.slice(0, 3);
    if (similarGenres.length === 0) return "/library";

    const params = new URLSearchParams();
    similarGenres.forEach((g) => {
      if (g) params.append("genre", g);
    });

    const query = params.toString();
    return query ? `/library?${query}` : "/library";
  }, [genres]);

  // ===== COMPACT VARIANT (Library) =====
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

            <div className="lx-game-card-compact-main">
              <h4 className="lx-game-card-compact-title" title={game.title}>
                {game.title}
              </h4>
            </div>

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
                      e.preventDefault();
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
        {/* HEADER */}
        <div className="lx-game-card-header">
          <div className="lx-game-card-cover">
            <img src={heroImage} alt={game.title} loading="lazy" />
            <div className="lx-game-card-cover-overlay" />

            {game.status && <span className={`lx-game-card-status-badge ${badgeClass}`}>{game.status}</span>}

            {game.status === "Playing" && progress > 0 && (
              <div className="lx-game-card-progress-ring">
                <svg width="60" height="60" viewBox="0 0 60 60" aria-hidden="true">
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

            {platforms.length > 0 && (
              <div className="lx-game-card-platforms">
                {platforms.slice(0, 3).map((platform, idx) => (
                  <span key={idx} className="lx-game-card-platform-pill" title={platform}>
                    {platform.substring(0, 3).toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BODY */}
        <div className="lx-game-card-body">
          <Link to={`/game/${game.gameId}`} className="lx-game-card-title-link">
            <h4 className="lx-game-card-title" title={game.title}>
              {game.title}
            </h4>
          </Link>

          <div className="lx-game-card-meta-row">
            {game.releaseDate && <span className="lx-game-card-meta-item">{new Date(game.releaseDate).getFullYear()}</span>}
            {game.releaseDate && genres.length > 0 && <span className="lx-game-card-meta-separator">•</span>}
            {genres.length > 0 && <span className="lx-game-card-meta-item">{genres[0]}</span>}
          </div>

          {genres.length > 0 &&
            (() => {
              const maxGenres = 3;
              const displayedGenres = genres.slice(0, maxGenres);
              const remainingCount = genres.length - maxGenres;

              return (
                <div className="lx-game-card-tags">
                  {displayedGenres.map((genre, idx) => (
                    <span key={idx} className="lx-game-card-tag" title={genre}>
                      {genre}
                    </span>
                  ))}

                  {remainingCount > 0 && <span className="lx-game-card-tag lx-game-card-tag--more">+{remainingCount}</span>}
                </div>
              );
            })()}

          {/* Review / Editor inline */}
          {isEditingSession ? (
            <div className="lx-game-card-session-edit">
              {game.status === "Playing" && (
                <div className="lx-game-card-session-field">
                  <div className="lx-game-card-progress-label">
                    <span>Completamento</span>
                    <span className="ms-1">{draftProgress}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={draftProgress}
                    onChange={(e) => setDraftProgress(Number(e.target.value))}
                    className="lx-game-card-progress-slider"
                  />
                </div>
              )}

              <div className="lx-game-card-session-field">
                <label className="lx-game-card-session-label">Valutazione (1–5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={1}
                  value={draftRating ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraftRating(val === "" ? null : Number(val));
                  }}
                  className="lx-game-card-session-input"
                />
              </div>

              <div className="lx-game-card-session-field">
                <label className="lx-game-card-session-label">Recensione</label>
                <textarea
                  rows={3}
                  value={draftReview}
                  onChange={(e) => setDraftReview(e.target.value)}
                  className="lx-game-card-session-textarea"
                  placeholder="Scrivi cosa ne pensi del gioco…"
                />
                <label className="lx-game-card-session-toggle">
                  <input type="checkbox" checked={draftIsPublic} onChange={(e) => setDraftIsPublic(e.target.checked)} />
                  <span>Rendi la recensione pubblica</span>
                </label>
              </div>
            </div>
          ) : hasReview ? (
            <div className="lx-game-card-review">
              <p className="lx-game-card-review-text">{game.review}</p>
            </div>
          ) : (
            <p className="lx-game-card-review-empty">Non ancora recensito</p>
          )}
        </div>

        {/* FOOTER */}
        <div className="lx-game-card-footer">
          {isEditingSession ? (
            <div className="lx-game-card-footer-primary-group">
              <button type="button" className="lx-game-card-cta lx-game-card-cta--ghost" onClick={handleSessionCancel} disabled={isSavingSession}>
                Annulla
              </button>
              <button type="button" className="lx-game-card-cta lx-game-card-cta--primary-save" onClick={handleSessionSave} disabled={isSavingSession}>
                {isSavingSession ? "Salvataggio..." : "Salva"}
              </button>
            </div>
          ) : (
            <button type="button" className={status.className} onClick={handlePrimaryAction} disabled={isSavingSession}>
              {status.label}
            </button>
          )}

          <div className="lx-game-card-secondary-actions">
            <Link to={`/game/${game.gameId}`} className="lx-game-card-secondary-btn">
              Dettagli
            </Link>
            <Link to={similarHref} className="lx-game-card-secondary-btn">
              Simili
            </Link>
          </div>

          <div className="lx-game-card-footer-meta">
            <button
              type="button"
              className="lx-game-card-rating lx-game-card-rating--clickable"
              onClick={() => {
                if (!isEditingSession && (game.status === "Playing" || game.status === "Completed")) {
                  openSessionEdit();
                }
              }}
            >
              <span className="lx-game-card-rating-label">La tua valutazione</span>

              <span className={hasRating ? "lx-game-card-rating-value" : "lx-game-card-rating-value lx-game-card-rating-value--unrated"}>
                {hasRating ? game.rating.toFixed(1) : "N/D"}
              </span>
            </button>

            {lastActivityText && <div className="lx-game-card-last-activity">{lastActivityText}</div>}
          </div>
        </div>
      </div>
    </article>
  );
};

export default GameCard;

import { Link } from "react-router";
import StarRating from "../StarRating";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

const GameCard = ({ game }) => {
  const { ref, visible } = useRevealOnScroll();

  const statusColors = {
    Playing: "lx-badge-cyan",
    Completed: "lx-badge-purple",
    Backlog: "lx-badge-gray",
  };

  const platforms = Array.isArray(game.platform) ? game.platform.slice(0, 2).join(" •") : game.platform || "";

  const genres = Array.isArray(game.genre) ? game.genre.join(" • ") : game.genre || "";

  // ---- LOGICA RATING FLESSIBILE ----
  const hasAggregate = typeof game.averageRating === "number" && typeof game.reviewsCount === "number";

  const hasUserRating = typeof game.rating === "number";

  let ratingValue = 0;
  let ratingLabel = "";

  if (hasAggregate) {
    ratingValue = game.averageRating;
    const reviews = game.reviewsCount;
    ratingLabel = `${reviews} recensione${reviews === 1 ? "" : "i"}`;
  } else if (hasUserRating) {
    ratingValue = game.rating;
    ratingLabel = "La tua valutazione";
  }

  const showRating = hasAggregate || hasUserRating;

  return (
    <div ref={ref} className={`lx-game-card lx-glow-card lx-reveal ${visible ? "lx-reveal-visible" : ""}`}>
      <div className="lx-game-card lx-glow-card">
        {/* COVER + STATUS */}
        <div className="lx-game-cover">
          <img src={game.coverUrl} alt={game.title} loading="lazy" decoding="async" />
          {game.status && <span className={`lx-badge ${statusColors[game.status] || ""}`}>{game.status}</span>}
        </div>

        {/* INFO */}
        <div className="lx-game-info">
          <h5 className="lx-game-title">{game.title}</h5>

          {/* ⭐ RATING – solo se esiste */}
          {showRating && (
            <div className="lx-game-rating-row mb-2">
              <div className="lx-game-rating-main">
                <StarRating rating={ratingValue} size="xs" />
                <span className="lx-game-rating-value">{ratingValue.toFixed(1)}</span>
              </div>
              <span className="lx-game-rating-count">{ratingLabel}</span>
            </div>
          )}

          {/* PLATFORMS */}
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="lx-platform">{platforms}</span>
          </div>

          {/* GENRES */}
          {genres && (
            <div className="lx-genre-row">
              <span className="lx-genre-pill">{genres}</span>
            </div>
          )}

          <Link to={`/game/${game.gameId}`} className="btn lx-btn-outline w-100 mt-3">
            Dettagli
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;

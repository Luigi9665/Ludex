import { useNavigate } from "react-router";
import StarRating from "../StarRating";

const GamePlayersSection = ({ userGames = [] }) => {
  const STATUS_LABELS = {
    0: "Backlog",
    1: "Playing",
    2: "In pausa",
    3: "Abbandonato",
    4: "Completato",
  };

  const navigate = useNavigate();

  if (!userGames.length) return null;

  const handleUserClick = (userId) => {
    if (!userId) return;
    navigate(`/profile/${userId}`);
  };

  const truncateReview = (text, max = 220) => {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "…" : text;
  };

  return (
    <section className="lx-game-players-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="lx-section-title mb-0">Chi sta giocando</h2>
          <span className="lx-link small">
            {userGames.length} giocator
            {userGames.length === 1 ? "e" : "i"}
          </span>
        </div>

        <div className="lx-game-players-grid">
          {userGames.map((ug) => (
            <article key={ug.userId ?? ug.username} className="lx-player-card">
              {/* HEADER: avatar + username + status */}
              <div className="lx-player-head">
                <div className="lx-player-avatar">{ug.username?.[0]?.toUpperCase() || "?"}</div>
                <div>
                  <button type="button" className="lx-player-username-btn" onClick={() => handleUserClick(ug.userId)}>
                    @{ug.username}
                  </button>
                  <div className="lx-player-status">{STATUS_LABELS[ug.status] ?? `Status ${ug.status}`}</div>
                </div>
              </div>

              {/* RATING */}
              <div className="lx-player-rating-row">
                {typeof ug.rating === "number" && ug.rating > 0 ? (
                  <>
                    <StarRating rating={ug.rating} size="xs" />
                    <span className="lx-player-rating-value">{ug.rating.toFixed(1)} / 5</span>
                  </>
                ) : (
                  <span className="lx-player-rating-empty">Nessuna valutazione</span>
                )}
              </div>

              {/* REVIEW (se presente) */}
              {ug.review && (
                <div className="lx-player-review">
                  <div className="lx-player-review-label">Recensione</div>
                  <p className="lx-player-review-text">{truncateReview(ug.review)}</p>
                </div>
              )}

              {/* volendo: progress / ultima attività */}
              {/* <div className="lx-player-footer">
                Ultimo aggiornamento: ...
              </div> */}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GamePlayersSection;

import { Link } from "react-router";
import StarRating from "../StarRating";

const GameCard = ({ game }) => {
  const statusColors = {
    Playing: "lx-badge-cyan",
    Completed: "lx-badge-purple",
    Backlog: "lx-badge-gray",
  };

  const platforms = Array.isArray(game.platform)
    ? game.platform.slice(0, 2).join(" • ") // max 2 piattaforme in vista
    : game.platform || "";

  const genres = Array.isArray(game.genre) ? game.genre.join(" • ") : game.genre || "";

  return (
    <div className="lx-game-card lx-glow-card">
      <div className="lx-game-cover">
        <img src={game.coverUrl} alt={game.title} />
        <span className={`lx-badge ${statusColors[game.status] || ""}`}>{game.status}</span>
      </div>

      <div className="lx-game-info">
        <h5 className="lx-game-title">{game.title}</h5>

        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="lx-platform">{platforms}</span>
          {game.rating ? <StarRating rating={game.rating} /> : <span className="text-muted">—</span>}
        </div>

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
  );
};

export default GameCard;

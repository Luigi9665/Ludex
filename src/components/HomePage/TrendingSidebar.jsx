import { Link } from "react-router";
import LxLoader from "../LxLoader";
import React, { useMemo } from "react";

const TrendingSidebar = ({ trending }) => {
  const trendingLoading = trending?.loading ?? false;
  const trendingError = trending?.error ?? null;
  const trendingItems = useMemo(() => (trending?.items ?? []).slice(0, 8), [trending?.items]);

  return (
    <aside className="lx-trending-frame">
      <div className="lx-trending">
        <header className="lx-trending-header">
          <i className="bi bi-fire" />
          <h3 className="lx-trending-title">In Tendenza</h3>
        </header>

        {trendingLoading && (
          <div className="lx-trending-loading">
            <LxLoader message="Caricamento..." />
          </div>
        )}

        {!trendingLoading && trendingError && <div className="lx-trending-error">Impossibile caricare</div>}

        {!trendingLoading && !trendingError && trendingItems.length > 0 && (
          <div className="lx-trending-list">
            {trendingItems.map((game, idx) => {
              const hasRating = game.averageRating && game.averageRating > 0;

              return (
                <Link key={game.gameId} to={`/game/${game.gameId}`} className="lx-trending-item">
                  <div className="lx-trending-rank">#{idx + 1}</div>
                  <img src={game.coverUrl} alt={game.title} className="lx-trending-cover" />
                  <div className="lx-trending-info">
                    <div className="lx-trending-game-title">{game.title}</div>
                    <div className="lx-trending-meta">
                      {hasRating && (
                        <>
                          <span className="lx-trending-rating">★ {game.averageRating.toFixed(1)}</span>
                          <span className="lx-trending-dot">•</span>
                        </>
                      )}
                      <span className="lx-trending-reviews">{game.reviewsCount || 0} review</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default React.memo(TrendingSidebar);

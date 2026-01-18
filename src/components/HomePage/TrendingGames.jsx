import { useRef } from 'react';
import { Link } from 'react-router';

const TrendingGames = ({ games }) => {
  const trackRef = useRef(null);

  if (!games || games.length === 0) {
    return (
      <section className="lx-section">
        <div className="container">
          <div className="lx-glass p-4 text-center">
            <h2 className="lx-section-title mb-3">🔥 Giochi in tendenza</h2>
            <p className="text-white-50 mb-0">
              Nessun gioco in evidenza per questa settimana. Torna a dare un'occhiata più tardi.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const scrollByAmount = direction => {
    if (!trackRef.current) return;
    const container = trackRef.current;
    const cardWidth = container.firstChild?.getBoundingClientRect().width || 260;
    const offset = direction === 'left' ? -cardWidth * 1.2 : cardWidth * 1.2;

    container.scrollBy({
      left: offset,
      behavior: 'smooth',
    });
  };

  return (
    <section className="lx-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="lx-section-title">🔥 Giochi in tendenza</h2>

          {games.length > 3 && (
            <div className="lx-carousel-nav d-none d-md-inline-flex">
              <button
                type="button"
                className="lx-carousel-arrow"
                onClick={() => scrollByAmount('left')}
                aria-label="Scorri a sinistra"
              >
                <i className="bi bi-chevron-left" />
              </button>
              <button
                type="button"
                className="lx-carousel-arrow"
                onClick={() => scrollByAmount('right')}
                aria-label="Scorri a destra"
              >
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </div>

        <div className="lx-carousel-wrapper">
          <div className="lx-carousel-fade lx-carousel-fade-left" />
          <div className="lx-carousel-fade lx-carousel-fade-right" />

          <div className="lx-carousel-track" ref={trackRef}>
            {games.map((game, idx) => {
              const hasRating = game.averageRating && game.averageRating > 0;
              const ratingLabel = hasRating ? `${game.averageRating.toFixed(1)} / 5` : '—';

              const reviewsLabel =
                game.reviewsCount === 1 ? '1 recensione' : `${game.reviewsCount} recensioni`;

              return (
                <div key={game.gameId} className="lx-carousel-item">
                  <div className="lx-trending-card lx-glow-card">
                    <div className="lx-trending-rank">#{idx + 1}</div>

                    <div className="lx-game-cover">
                      <img src={game.coverUrl} alt={game.title} />
                    </div>

                    <div className="lx-game-info">
                      <h5 className="lx-game-title mb-1">{game.title}</h5>

                      <div className="d-flex justify-content-between align-items-center small">
                        <span className="lx-trend-rating">★ {ratingLabel}</span>
                        <span className="lx-trend-reviews">{reviewsLabel}</span>
                      </div>

                      <Link to={`/game/${game.gameId}`} className="btn lx-btn-outline w-100 mt-3">
                        Dettagli
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-3 d-md-none text-center">
          <span className="text-muted small">
            Trascina le card a destra o sinistra per scorrere i giochi.
          </span>
        </div>
      </div>
    </section>
  );
};

export default TrendingGames;

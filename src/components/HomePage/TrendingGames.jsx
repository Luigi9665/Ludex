import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";

const TrendingGames = ({ games }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
    },
    [
      Autoplay({
        delay: 2500, // tempo tra una slide e l'altra
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!games || games.length === 0) return null;

  return (
    <section className="lx-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="lx-section-title">Giochi in tendenza</h2>

          {games.length > 3 && (
            <div className="lx-carousel-nav d-none d-md-inline-flex">
              <button type="button" className="lx-carousel-arrow" onClick={scrollPrev} aria-label="Scorri a sinistra">
                <i className="bi bi-chevron-left" />
              </button>
              <button type="button" className="lx-carousel-arrow" onClick={scrollNext} aria-label="Scorri a destra">
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          )}
        </div>

        <div className="lx-carousel-wrapper">
          <div className="lx-carousel-fade lx-carousel-fade-left" />
          <div className="lx-carousel-fade lx-carousel-fade-right" />

          {/* Embla viewport */}
          <div className="lx-carousel-viewport" ref={emblaRef}>
            <div className="lx-carousel-track">
              {games.map((game, idx) => {
                const hasRating = game.averageRating && game.averageRating > 0;
                const ratingLabel = hasRating ? `${game.averageRating.toFixed(1)} / 5` : "—";
                const reviewsLabel = game.reviewsCount === 1 ? "1 recensione" : `${game.reviewsCount} recensioni`;

                return (
                  <div key={game.gameId} className="lx-carousel-item lx-carousel-item--auto">
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
        </div>

        <div className="mt-3 d-md-none text-center">
          <span className="text-muted small">Scorri a destra o sinistra per vedere più giochi.</span>
        </div>
      </div>
    </section>
  );
};

export default TrendingGames;

import { Link } from "react-router";
import useEmblaCarousel from "embla-carousel-react";

const GameRelatedSection = ({ relatedGames = [], genres = [] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    containScroll: "trimSnaps",
  });

  if (!relatedGames.length) return null;

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="lx-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="lx-section-title mb-0">Giochi correlati</h2>
          {genres.length > 0 && <span className="lx-link small ms-3">Basato su: {genres[0]}</span>}
          <div className="lx-carousel-nav d-none d-md-inline-flex ms-auto">
            <button type="button" className="lx-carousel-arrow" onClick={scrollPrev}>
              <i className="bi bi-chevron-left" />
            </button>
            <button type="button" className="lx-carousel-arrow" onClick={scrollNext}>
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>

        <div className="lx-carousel-wrapper">
          <div className="lx-carousel-fade lx-carousel-fade-left" />
          <div className="lx-carousel-fade lx-carousel-fade-right" />

          <div className="lx-carousel-viewport" ref={emblaRef}>
            <div className="lx-carousel-track">
              {relatedGames.map((g) => (
                <div key={g.gameId} className="lx-carousel-item">
                  <div className="lx-glow-card lx-game-card">
                    <div className="lx-game-cover">
                      <img src={g.coverUrl} alt={g.title} />
                    </div>
                    <div className="lx-game-info">
                      <h5 className="lx-game-title">{g.title}</h5>
                      {Array.isArray(g.genre) && g.genre.length > 0 && (
                        <div className="lx-genre-row">
                          <span className="lx-genre-pill">{g.genre.slice(0, 2).join(" • ")}</span>
                        </div>
                      )}
                      <Link to={`/game/${g.gameId}`} className="btn lx-btn-outline w-100 mt-3">
                        Dettagli
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameRelatedSection;

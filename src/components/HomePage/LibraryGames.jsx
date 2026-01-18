import { useRef } from "react";
import { Link } from "react-router";
import GameCard from "./GameCard";

const LibraryGames = ({ games }) => {
  const trackRef = useRef(null);

  if (!games || games.length === 0) {
    return (
      <section className="lx-section">
        <div className="container">
          <div className="lx-glass p-5 text-center">
            <i className="bi bi-controller display-1 mb-3 lx-text-glow"></i>
            <h3>Nessun gioco ancora</h3>
            <p className="text-white-50 mb-4">La tua libreria è ancora vuota. Inizia ad aggiungere i tuoi titoli preferiti.</p>
            <button className="btn lx-btn-primary">Aggiungi il primo gioco</button>
          </div>
        </div>
      </section>
    );
  }

  const scrollByAmount = (direction) => {
    if (!trackRef.current) return;
    const container = trackRef.current;
    const cardWidth = container.firstChild?.getBoundingClientRect().width || 260;
    const offset = direction === "left" ? -cardWidth * 1.2 : cardWidth * 1.2;

    container.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  };

  return (
    <section className="lx-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="lx-section-title">Ultimi Giochi Aggiunti Alla Tua Libreria:</h2>
          <div className="d-flex align-items-center gap-3">
            <Link to="/library" className="lx-link d-none d-md-inline">
              Vedi tutti →
            </Link>
            <div className="lx-carousel-nav d-none d-md-flex">
              <button type="button" className="lx-carousel-arrow" onClick={() => scrollByAmount("left")} aria-label="Scorri a sinistra">
                <i className="bi bi-chevron-left" />
              </button>
              <button type="button" className="lx-carousel-arrow" onClick={() => scrollByAmount("right")} aria-label="Scorri a destra">
                <i className="bi bi-chevron-right" />
              </button>
            </div>
          </div>
        </div>

        <div className="lx-carousel-wrapper">
          <div className="lx-carousel-fade lx-carousel-fade-left" />
          <div className="lx-carousel-fade lx-carousel-fade-right" />

          <div className="lx-carousel-track" ref={trackRef}>
            {games.map((game) => (
              <div key={game.gameId} className="lx-carousel-item">
                <GameCard game={game} />
              </div>
            ))}
          </div>
        </div>

        {/* Link visibile su mobile sotto al carousel */}
        <div className="mt-3 d-md-none text-center">
          <Link to="/library" className="lx-link">
            Vedi tutta la libreria →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LibraryGames;

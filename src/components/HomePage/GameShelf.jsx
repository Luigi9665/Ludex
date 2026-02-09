import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import GameCard from "./GameCard";

const GameShelf = ({ title, subtitle, games, variant }) => {
  const variantClass = variant ? `lx-shelf--${variant}` : "";

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={`lx-shelf ${variantClass}`}>
      <header className="lx-shelf-header">
        <div className="lx-shelf-title-group">
          <h3 className="lx-shelf-title">{title}</h3>
          {subtitle && <p className="lx-shelf-subtitle">{subtitle}</p>}
        </div>
        <div className="lx-shelf-controls">
          <span className="lx-shelf-count">{games.length}</span>
          <button className="lx-shelf-arrow" onClick={scrollPrev} disabled={!canScrollPrev} aria-label="Precedente">
            <i className="bi bi-chevron-left" />
          </button>
          <button className="lx-shelf-arrow" onClick={scrollNext} disabled={!canScrollNext} aria-label="Successivo">
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </header>

      <div className="lx-shelf-carousel">
        <div className="lx-shelf-carousel-viewport" ref={emblaRef}>
          <div className="lx-shelf-carousel-container">
            {games.map((game) => (
              <div key={game.gameId} className="lx-shelf-carousel-slide">
                {/* Home = versione full */}
                <GameCard game={game} variant="full" />
              </div>
            ))}
          </div>
        </div>

        {scrollSnaps.length > 1 && (
          <div className="lx-shelf-dots">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                className={`lx-shelf-dot ${index === selectedIndex ? "lx-shelf-dot--active" : ""}`}
                onClick={() => scrollTo(index)}
                aria-label={`Vai allo slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameShelf;

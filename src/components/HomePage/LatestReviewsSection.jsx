import { Link, useNavigate } from "react-router";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import StarRating from "../StarRating";
import LxLoader from "../LxLoader";

const LatestReviewsSection = ({ loading, error, reviews }) => {
  const items = reviews ?? [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const navigate = useNavigate();

  const handleUserClick = (userId) => {
    if (!userId) return;
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <section className="lx-section">
        <div className="container">
          <LxLoader message="Carico le ultime recensioni..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="lx-section">
        <div className="container">
          <div className="lx-glass p-4 text-center">
            <p className="text-muted mb-0">Le recensioni stanno respawnando… riprova tra poco.</p>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="lx-section">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="lx-section-title">Ultime Recensioni</h2>
          <span className="lx-link ms-3">Live dalla community</span>

          <div className="lx-carousel-nav d-none d-md-inline-flex ms-auto">
            <button type="button" className="lx-carousel-arrow" onClick={scrollPrev} aria-label="Scorri a sinistra">
              <i className="bi bi-chevron-left" />
            </button>
            <button type="button" className="lx-carousel-arrow" onClick={scrollNext} aria-label="Scorri a destra">
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>

        <div className="lx-carousel-wrapper">
          <div className="lx-carousel-fade lx-carousel-fade-left" />
          <div className="lx-carousel-fade lx-carousel-fade-right" />

          <div className="lx-carousel-viewport" ref={emblaRef}>
            <div className="lx-carousel-track lx-carousel-track--reviews">
              {items.map((r) => (
                <article key={r.userGameId} className="lx-carousel-item lx-carousel-item--auto lx-review-item">
                  <div className="lx-glow-card lx-review-card2">
                    <div className="lx-review-head">
                      <img className="lx-review-cover2" src={r.coverUrl} alt={r.title} />
                      <div className="flex-grow-1">
                        <div className="lx-review-title">{r.title}</div>
                        <div className="lx-review-meta">
                          <button type="button" className="lx-player-username-btn" onClick={() => handleUserClick(r.userId)}>
                            @{r.username}
                          </button>
                          <span className="lx-dot">•</span>
                          <span className="lx-review-status">{String(r.status)}</span>
                        </div>
                        <div className="mt-1">{r.rating ? <StarRating rating={r.rating} /> : <span className="text-muted">—</span>}</div>
                      </div>
                    </div>

                    <p className="lx-review-snippet2">{r.review}</p>

                    <div className="d-flex gap-2 mt-auto">
                      <Link to={`/game/${r.gameId}`} className="btn lx-btn-outline flex-grow-1">
                        Vai al gioco
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestReviewsSection;

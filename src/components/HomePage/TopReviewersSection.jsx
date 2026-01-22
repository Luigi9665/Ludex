import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import LxLoader from "../LxLoader";

const TopReviewersSection = ({ loading, error, users }) => {
  const items = users ?? [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
    },
    [
      Autoplay({
        delay: 4500,
        stopOnInteraction: false,
      }),
    ],
  );

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  if (loading) {
    return (
      <section className="lx-section">
        <div className="container">
          <LxLoader message="Carico i top player..." />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="lx-section">
        <div className="container">
          <div className="lx-glass p-4 text-center">
            <p className="text-muted mb-0">Leaderboard offline… riprova tra poco.</p>
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
          <h2 className="lx-section-title">Top Reviewer</h2>
          <span className="lx-link ms-3">Chi sta grindando di più</span>

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
            <div className="lx-carousel-track">
              {items.map((u, idx) => (
                <div key={u.userid ?? `${u.username}-${idx}`} className="lx-carousel-item lx-carousel-item--auto">
                  <div className="lx-glow-card lx-topper-card p-3 h-100">
                    <div className="d-flex align-items-center gap-3">
                      <div className={`lx-rank-badge ${idx < 3 ? "lx-rank-badge--top" : ""}`}>#{idx + 1}</div>

                      <div className="flex-grow-1">
                        <div className="lx-topper-name">@{u.username}</div>
                        <div className="lx-topper-sub text-white-50 small">Recensioni pubbliche</div>
                      </div>

                      <div className="lx-topper-count">
                        <span>{u.reviewsCount}</span>
                      </div>
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

export default TopReviewersSection;

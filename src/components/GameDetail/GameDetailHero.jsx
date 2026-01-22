function GameDetailHero({
  title,
  description,
  coverUrl,
  releaseDate,
  platforms = [],
  genres = [],
  alreadyInLibrary,
  onAddClick,
  onGenreClick,
  onPlatformClick,
}) {
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <section className="lx-game-detail-hero">
      {/* background blur della cover */}
      <div className="lx-game-detail-hero-bg">
        <img src={coverUrl} alt={title} />
        <div className="lx-game-detail-hero-overlay" />
      </div>

      <div className="container position-relative">
        <div className="row g-4 align-items-start">
          {/* COVER */}
          <div className="col-12 col-md-4 col-lg-3">
            <div className="lx-game-detail-cover lx-glow-card">
              <img src={coverUrl} alt={title} />
            </div>
          </div>

          {/* INFO PRINCIPALI */}
          <div className="col-12 col-md-8 col-lg-9">
            <div className="d-flex flex-column gap-3">
              {/* titolo + piattaforme */}
              <div>
                <h1 className="lx-game-detail-title">
                  {title}
                  {releaseYear && <span className="lx-game-detail-year"> ({releaseYear})</span>}
                </h1>

                {platforms.length > 0 && <p className="lx-game-detail-sub">Disponibile su {platforms.join(" • ")}</p>}
              </div>

              {/* PILL GENERE / PIATTAFORME */}
              <div className="d-flex flex-wrap gap-2">
                {genres.map((g) => (
                  <button key={g} type="button" className="lx-pill lx-pill-genre" onClick={() => onGenreClick && onGenreClick(g)}>
                    {g}
                  </button>
                ))}

                {platforms.map((p) => (
                  <button key={p} type="button" className="lx-pill lx-pill-platform" onClick={() => onPlatformClick && onPlatformClick(p)}>
                    {p}
                  </button>
                ))}
              </div>

              {/* CTA */}
              <div className="d-flex flex-wrap align-items-center gap-2 mt-1">
                {!alreadyInLibrary ? (
                  <button type="button" className="btn lx-btn-primary" onClick={onAddClick}>
                    <i className="bi bi-plus-circle me-2" />
                    Aggiungi alla tua libreria
                  </button>
                ) : (
                  <span className="lx-card-inlibrary-pill">
                    <i className="bi bi-check2-circle me-1" />
                    Nella tua libreria
                  </span>
                )}
              </div>

              {/* DESCRIZIONE */}
              {description && (
                <div className="lx-game-detail-description mt-3">
                  <h2 className="lx-section-subtitle">Descrizione</h2>
                  <p>{description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GameDetailHero;

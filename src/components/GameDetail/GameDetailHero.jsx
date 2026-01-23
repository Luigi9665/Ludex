const GameDetailHero = ({
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
}) => {
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;

  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const d = new Date(dateString);
    return d.toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleAddClick = () => {
    if (alreadyInLibrary) return;
    onAddClick?.();
  };

  return (
    <section className="lx-hero lx-hero--game-detail">
      {/* background blur della cover */}
      <div className="lx-hero-bg-blur" style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : {}} />

      {/* overlay per leggibilità */}
      <div className="lx-hero-overlay" />

      {/* contenuto */}
      <div className="lx-hero-content">
        {/* COVER */}
        <div className="lx-hero-cover">{coverUrl && <img src={coverUrl} alt={title} className="lx-cover-image" loading="lazy" decoding="async" />}</div>

        {/* INFO */}
        <div className="lx-hero-info">
          <h1 className="lx-hero-title">
            {title}
            {releaseYear && <span> ({releaseYear})</span>}
          </h1>

          {/* meta riga: data + piattaforme */}
          <div className="lx-hero-meta">
            {releaseDate && <span className="lx-meta-item">{formatDate(releaseDate)}</span>}
            {platforms.length > 0 && <span className="lx-meta-item">{platforms.join(" • ")}</span>}
          </div>

          {/* GENRE / PLATFORM pills */}
          <div className="lx-hero-genres">
            {genres.map((g) => (
              <button key={g} type="button" className="lx-genre-tag" onClick={() => onGenreClick?.(g)}>
                {g}
              </button>
            ))}

            {platforms.map((p) => (
              <button key={p} type="button" className="lx-genre-tag lx-genre-tag--platform" onClick={() => onPlatformClick?.(p)}>
                {p}
              </button>
            ))}
          </div>

          {/* DESCRIZIONE */}
          {description && <p className="lx-hero-description">{description}</p>}

          {/* CTA */}
          {alreadyInLibrary ? (
            <button type="button" className="lx-btn-add-library lx-btn-add-library--disabled" disabled>
              <i className="bi bi-check2-circle lx-btn-icon" />
              Nella tua libreria
            </button>
          ) : (
            <button type="button" className="lx-btn-add-library" onClick={handleAddClick}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="lx-btn-icon">
                <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Aggiungi alla libreria
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default GameDetailHero;

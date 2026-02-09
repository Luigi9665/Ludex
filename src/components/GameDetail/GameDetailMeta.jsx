const GameDetailMeta = ({ releaseDate, genres = [], platforms = [] }) => {
  return (
    <section className="lx-section-orchestrated" style={{ marginTop: "40px" }}>
      <div className="lx-game-detail-meta">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="lx-meta-block">
              <div className="lx-meta-label">Data di uscita</div>
              <div className="lx-meta-value">{releaseDate ? new Date(releaseDate).toLocaleDateString("it-IT") : "—"}</div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="lx-meta-block">
              <div className="lx-meta-label">Genere</div>
              <div className="lx-meta-value">{genres.length > 0 ? genres.join(" • ") : "—"}</div>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="lx-meta-block">
              <div className="lx-meta-label">Piattaforme</div>
              <div className="lx-meta-value">{platforms.length > 0 ? platforms.join(" • ") : "—"}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameDetailMeta;

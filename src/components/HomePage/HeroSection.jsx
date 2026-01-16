const HeroSection = ({ user }) => {
  return (
    <section className="lx-hero">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h1 className="lx-hero-title mb-3">
              Ciao, <span className="lx-text-glow">{user.username}</span>
            </h1>
            <p className="lx-hero-subtitle mb-4">Benvenuto nella tua libreria gaming personale</p>
            <div className="d-flex gap-3 flex-wrap">
              <button className="btn lx-btn-primary">
                <i className="bi bi-plus-circle me-2"></i>Aggiungi Gioco
              </button>
              <button className="btn lx-btn-warm">
                <i className="bi bi-pencil-square me-2"></i>Scrivi Recensione
              </button>
            </div>
          </div>
          <div className="col-lg-4 mt-4 mt-lg-0">
            <div className="lx-glass p-4">
              <div className="row text-center">
                <div className="col-4">
                  <div className="lx-stat-number">{user.stats.gamesCount}</div>
                  <div className="lx-stat-label">Giochi</div>
                </div>
                <div className="col-4">
                  <div className="lx-stat-number">{user.stats.reviewsCount}</div>
                  <div className="lx-stat-label">Recensioni</div>
                </div>
                <div className="col-4">
                  <div className="lx-stat-number">{user.stats.friendsCount}</div>
                  <div className="lx-stat-label">Amici</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

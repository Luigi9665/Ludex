import { Link } from "react-router";

const HeroSection = ({ user, stats }) => {
  const isGuest = !user || !stats;

  // MODE: GUEST (utente non connesso)
  if (isGuest) {
    return (
      <section className="lx-hero lx-hero-guest">
        <div className="container text-center py-5">
          <h1 className="lx-hero-title">Benvenuto Viaggiatore 👾</h1>

          <p className="lx-hero-guest-text mt-3">
            Stai esplorando LUDEX in modalità ospite. Accedi o crea un profilo per sbloccare la tua libreria personale, salvare giochi e lasciare recensioni
            luminose come un critico d'élite.
          </p>

          <div className="mt-4 d-flex justify-content-center gap-3">
            <Link to="/auth" className="btn lx-btn-primary" style={{ textDecoration: "" }}>
              Accedi
            </Link>
            <Link to="/auth" className="btn lx-btn-outline">
              Crea Account
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // MODE: USER LOGGATO
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
                  <div className="lx-stat-number">{stats.gamesCount}</div>
                  <div className="lx-stat-label">Giochi</div>
                </div>
                <div className="col-4">
                  <div className="lx-stat-number">{stats.reviewsCount}</div>
                  <div className="lx-stat-label">Recensioni</div>
                </div>
                <div className="col-4">
                  <div className="lx-stat-number">{stats.friendsCount}</div>
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

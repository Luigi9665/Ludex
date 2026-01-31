import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { loadQuestionnaireStatus } from "../../redux/action";

const HeroSection = ({ user, stats }) => {
  const isGuest = !user || !stats;

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.questionnaire);

  useEffect(() => {
    dispatch(loadQuestionnaireStatus());
  }, [dispatch]);

  // MODE: GUEST (utente non connesso)
  if (isGuest) {
    return (
      <section className="lx-hero lx-hero-guest">
        <div className="container text-center py-5">
          <h1 className="lx-hero-title">Benvenuto Viaggiatore 👾</h1>

          <p className="lx-hero-guest-text mt-3">
            Stai esplorando LUDEX in modalità ospite.
            <br />
            Accedi o crea un profilo per sbloccare la tua libreria personale, salvare giochi, lasciare recensioni e attivare la vera magia: il questionario
            delle preferenze.
          </p>

          <p className="lx-hero-guest-text mt-2">
            Solo con un account possiamo ricordarci i tuoi gusti e consigliarti giochi su misura in base alle tue risposte. Senza login… niente profilo, niente
            magia ✨
          </p>

          <div className="mt-4 d-flex justify-content-center gap-3">
            <Link to="/auth" className="btn lx-btn-primary d-flex align-items-center" style={{ textDecoration: "none" }}>
              Accedi
            </Link>
            <Link to="/auth" className="btn lx-btn-outline d-flex align-items-center">
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
          {/* Spiegazione questionario */}
          <div className="col-lg-8">
            <h1 className="lx-hero-title mb-3">
              Ciao, <span className="lx-text-glow">{user.username}</span>
            </h1>

            <p className="lx-hero-subtitle mb-3">Vuoi consigli di gioco davvero su misura?</p>

            <p className="lx-hero-guest-text mb-4">
              Rispondi al nostro questionario interattivo: in pochi minuti capiamo cosa ti piace (storia, azione, difficoltà, durata delle sessioni...) e usiamo
              le tue risposte per costruire un profilo di preferenze. Da lì in poi, le raccomandazioni saranno molto più intelligenti di una semplice lista di
              giochi popolari.
            </p>

            <div className="d-flex gap-3 flex-wrap">
              <Link to="/questionnaire" className="btn lx-btn-primary d-flex align-items-center" style={{ textDecoration: "none" }}>
                <i className="bi bi-stars me-2"></i>
                Compila il Questionario
              </Link>

              <Link to="/library" className="btn lx-btn-warm d-flex align-items-center" style={{ textDecoration: "none" }}>
                <i className="bi bi-controller me-2"></i>
                Vai alla tua libreria
              </Link>

              {status.hasAnyPreferences && (
                <Link to="/recommendations" className="btn lx-btn-primary" style={{ textDecoration: "none" }}>
                  I tuoi giochi consigliati
                </Link>
              )}
            </div>
          </div>
          {/* Fine Spiegazione questionario */}

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

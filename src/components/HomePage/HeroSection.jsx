import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { loadQuestionnaireStatus } from "../../redux/action";

const HeroSection = ({ user, stats, userGames = [] }) => {
  const isGuest = !user || !stats;

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.questionnaire);

  useEffect(() => {
    dispatch(loadQuestionnaireStatus());
  }, [dispatch]);

  const nowPlaying = userGames.find((g) => g.status === "Playing");

  if (isGuest) {
    return (
      <section className="lx-hero-frame">
        <div className="lx-hero lx-hero--guest">
          <div className="lx-hero-content">
            <h1 className="lx-hero-title">
              Benvenuto Viaggiatore <span className="lx-hero-emoji">👾</span>
            </h1>

            <p className="lx-hero-text">
              Stai esplorando <span className="lx-text-glow">LUDEX</span> in modalità ospite.
            </p>

            <p className="lx-hero-text lx-hero-text--secondary">
              Accedi o crea un profilo per sbloccare la tua libreria personale, salvare giochi, lasciare recensioni e attivare il questionario delle preferenze
              per ricevere consigli su misura.
            </p>

            <div className="lx-hero-actions">
              <Link to="/auth" className="lx-btn-primary">
                <i className="bi bi-box-arrow-in-right" />
                Accedi
              </Link>
              <Link to="/auth" className="lx-btn-outline">
                <i className="bi bi-person-plus" />
                Crea Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="lx-hero-frame">
      <div className="lx-hero lx-hero--user">
        <div className="lx-hero-content">
          <h1 className="lx-hero-title">
            Ciao, <span className="lx-text-glow">{user.username}</span>
          </h1>

          <p className="lx-hero-subtitle">Vuoi consigli di gioco davvero su misura?</p>

          <p className="lx-hero-text">
            Rispondi al nostro questionario interattivo: in pochi minuti capiamo cosa ti piace e usiamo le tue risposte per costruire un profilo di preferenze
            personalizzato.
          </p>

          <div className="lx-hero-actions">
            <Link to="/questionnaire" className="lx-btn-primary">
              <i className="bi bi-stars" />
              Compila il Questionario
            </Link>

            <Link to="/library" className="lx-btn-warm">
              <i className="bi bi-controller" />
              Vai alla libreria
            </Link>

            {status.hasAnyPreferences && (
              <Link to="/recommendations" className="lx-btn-outline">
                <i className="bi bi-magic" />
                Giochi consigliati
              </Link>
            )}
          </div>
        </div>

        <aside className="lx-hero-side">
          {nowPlaying ? (
            <div className="lx-now-playing">
              <header className="lx-now-playing-header">
                <span className="lx-now-playing-title">Now Playing</span>
                <div className="lx-now-playing-status">
                  <span className="lx-now-playing-pulse" />
                  <span>In corso</span>
                </div>
              </header>

              <div className="lx-now-playing-content">
                <div className="lx-now-playing-cover">
                  <img src={nowPlaying.heroImageUrl || nowPlaying.coverUrl} alt={nowPlaying.title} />
                </div>

                <h4 className="lx-now-playing-game-title">{nowPlaying.title}</h4>
                <p className="lx-now-playing-platform">{Array.isArray(nowPlaying.platform) ? nowPlaying.platform.join(", ") : nowPlaying.platform}</p>

                <div className="lx-now-playing-progress">
                  <div className="lx-now-playing-progress-label">
                    <span>Completamento</span>
                    <span>{nowPlaying.progress || 0}%</span>
                  </div>
                  <div className="lx-now-playing-progress-bar">
                    <div className="lx-now-playing-progress-fill" style={{ width: `${nowPlaying.progress || 0}%` }} />
                  </div>
                </div>

                <div className="lx-now-playing-meta">
                  <div className="lx-now-playing-meta-item">
                    <span className="lx-now-playing-meta-value">{nowPlaying.hoursPlayed || 0}h</span>
                    <span className="lx-now-playing-meta-label">Giocate</span>
                  </div>
                  <div className="lx-now-playing-meta-item">
                    <span className="lx-now-playing-meta-value">
                      {nowPlaying.lastUpdatedAt ? new Date(nowPlaying.lastUpdatedAt).toLocaleDateString("it-IT", { day: "numeric", month: "short" }) : "—"}
                    </span>
                    <span className="lx-now-playing-meta-label">Ultima</span>
                  </div>
                </div>

                <Link to={`/profile`} className="lx-now-playing-cta">
                  <i className="bi bi-play-fill" />
                  Riprendi
                </Link>
              </div>
            </div>
          ) : (
            <div className="lx-hero-stats">
              <div className="lx-stat-card">
                <div className="lx-stat-value">{stats.gamesCount}</div>
                <div className="lx-stat-label">Giochi</div>
              </div>
              <div className="lx-stat-card">
                <div className="lx-stat-value">{stats.reviewsCount}</div>
                <div className="lx-stat-label">Recensioni</div>
              </div>
              <div className="lx-stat-card">
                <div className="lx-stat-value">{stats.friendsCount}</div>
                <div className="lx-stat-label">Amici</div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};

export default HeroSection;

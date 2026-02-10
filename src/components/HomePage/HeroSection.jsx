import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { loadQuestionnaireStatus } from "../../redux/action";

const HeroSection = ({ user, stats, userGames = [] }) => {
  const isGuest = !user || !stats;

  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.questionnaire);
  const hasPreferences = status?.hasAnyPreferences === true;

  useEffect(() => {
    dispatch(loadQuestionnaireStatus());
  }, [dispatch]);

  const nowPlaying = userGames.find((g) => g.status === "Playing");

  // ============================
  // GUEST HERO
  // ============================
  if (isGuest) {
    return (
      <section className="lx-hero-frame">
        <div className="lx-hero lx-hero--guest">
          <div className="lx-hero-homepage-content">
            <h1 className="lx-hero-homepage-title">
              Benvenuto Viaggiatore <span className="lx-hero-emoji">👾</span>
            </h1>

            <p className="lx-hero-text">
              <span className="lx-text-glow">Ludex</span> è la tua plancia di comando per trovare giochi che parlano davvero ai tuoi gusti, senza suggerimenti
              casuali o liste infinite da scorrere.
            </p>

            <p className="lx-hero-text lx-hero-text--secondary">
              Ora stai esplorando in modalità ospite: puoi dare un&apos;occhiata, ma senza libreria personale, preferenze salvate o consigli su misura.
              Accedendo crei il tuo profilo, compili un breve questionario e da lì in poi ogni gioco che visiti o aggiungi aiuta Ludex a capire cosa ti piace.
            </p>

            <div className="lx-hero-actions">
              <Link to="/auth" className="lx-btn-primary">
                <i className="bi bi-box-arrow-in-right" />
                Accedi
              </Link>
              <Link to="/auth" className="lx-btn-outline">
                <i className="bi bi-person-plus" />
                Crea account
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ============================
  // USER HERO
  // ============================
  return (
    <section className="lx-hero-frame">
      <div className="lx-hero lx-hero--user">
        <div className="lx-hero-homepage-content">
          <h1 className="lx-hero-title">
            Ciao, <span className="lx-text-glow">{user.username}</span>
          </h1>

          {!hasPreferences ? (
            <>
              <p className="lx-hero-subtitle">Iniziamo a capire cosa ti piace davvero.</p>

              <p className="lx-hero-text">
                Quante volte hai perso tempo cercando un gioco che fosse davvero in linea con i tuoi gusti? Con il nostro questionario interattivo ti facciamo
                solo poche domande mirate e usiamo le risposte per costruire il tuo profilo di preferenze.
              </p>

              <p className="lx-hero-text lx-hero-text--secondary">
                Da quel momento ogni gioco che visiti o aggiungi alla libreria aiuta Ludex a filtrare il rumore e a mostrarti solo i titoli che hanno davvero
                senso per te. Il riquadro <strong>Now Playing</strong> tiene traccia delle tue sessioni e contribuisce a rendere i consigli sempre più precisi.
              </p>

              <div className="lx-hero-actions">
                <Link to="/questionnaire" className="lx-btn-primary">
                  <i className="bi bi-stars" />
                  Compila il questionario
                </Link>

                <Link to="/library" className="lx-btn-warm">
                  <i className="bi bi-controller" />
                  Vai alla libreria
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="lx-hero-subtitle">Abbiamo già un&apos;idea dei tuoi gusti. Continuiamo ad affinarla.</p>

              <p className="lx-hero-text">
                In base alle tue risposte e ai giochi che hai esplorato abbiamo costruito un profilo di preferenze solo tuo. Le raccomandazioni che vedi non
                sono generiche: sono calibrate sul modo in cui ti piace giocare.
              </p>

              <p className="lx-hero-text lx-hero-text--secondary">
                Ogni nuova sessione, ogni titolo che aggiungi alla libreria o anche solo una scheda gioco che apri rende Ludex più preciso. Il pannello{" "}
                <strong>Now Playing</strong> segue quello che stai giocando adesso e usa questi segnali per aggiornare nel tempo i giochi consigliati.
              </p>

              <div className="lx-hero-actions">
                <Link to="/recommendations" className="lx-btn-primary">
                  <i className="bi bi-magic" />
                  Giochi consigliati per te
                </Link>

                <Link to="/library" className="lx-btn-warm">
                  <i className="bi bi-controller" />
                  Vai alla libreria
                </Link>

                <Link to="/questionnaire" className="lx-btn-outline">
                  <i className="bi bi-stars" />
                  Affina le preferenze
                </Link>
              </div>
            </>
          )}
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
                      {nowPlaying.lastUpdatedAt
                        ? new Date(nowPlaying.lastUpdatedAt).toLocaleDateString("it-IT", {
                            day: "numeric",
                            month: "short",
                          })
                        : "—"}
                    </span>
                    <span className="lx-now-playing-meta-label">Ultima</span>
                  </div>
                </div>

                <Link to={`/profile`} className="lx-now-playing-cta">
                  <i className="bi bi-play-fill" />
                  Riprendi la sessione
                </Link>
              </div>
            </div>
          ) : (
            <div className="lx-hero-stats">
              <div className="lx-stat-card">
                <div className="lx-stat-value">{stats.gamesCount}</div>
                <div className="lx-stat-label">Giochi in libreria</div>
              </div>
              <div className="lx-stat-card">
                <div className="lx-stat-value">{stats.reviewsCount}</div>
                <div className="lx-stat-label">Recensioni scritte</div>
              </div>
              <div className="lx-stat-card">
                <div className="lx-stat-value">{stats.friendsCount}</div>
                <div className="lx-stat-label">Amici su Ludex</div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};

export default HeroSection;

import { useEffect, useState } from "react";
import HeroLoggedOut from "../assets/landing/hero_guest.png";
import HeroLoggedIn from "../assets/landing/hero_logged.png";
import LibraryScreenshot from "../assets/landing/library.png";
import GameDetailScreenshot from "../assets/landing/game_detail.png";
import AddGameModalScreenshot from "../assets/landing/modal_add_game.png";
import ProfileScreenshot from "../assets/landing/profile.png";
import HomeFullScreenshot from "../assets/landing/home_full.png";
import LogoLudexPng from "../assets/LogoLudex3Ridimensionato.png";
import "../styles/LandingPageStyle.css";

// Sub-components
const FeatureCard = ({ icon, title, description }) => (
  <div className="lx-landing-frame lx-landing-feature-card lx-landing-reveal">
    <div className="lx-landing-feature-icon">
      <i className={`bi ${icon}`} />
    </div>
    <h3 className="lx-landing-feature-title">{title}</h3>
    <p className="lx-landing-feature-text">{description}</p>
  </div>
);

const ReviewCard = ({ username, rating, snippet }) => (
  <div className="lx-landing-review-card lx-landing-reveal">
    <div className="lx-landing-review-header">
      <div className="lx-landing-review-avatar">{username.charAt(0).toUpperCase()}</div>
      <div className="lx-landing-review-info">
        <div className="lx-landing-review-username">@{username}</div>
        <div className="lx-landing-review-stars">
          {"★".repeat(Math.floor(rating))}
          <span className="lx-landing-review-rating">{rating}/5</span>
        </div>
      </div>
    </div>
    <p className="lx-landing-review-snippet">{snippet}</p>
  </div>
);

const TopReviewerCard = ({ username, count, badge, rank }) => (
  <div className="lx-landing-reviewer-card lx-landing-reveal">
    <div className="lx-landing-reviewer-rank">#{rank}</div>
    <div className="lx-landing-reviewer-info">
      <div className="lx-landing-reviewer-name">@{username}</div>
      <div className="lx-landing-reviewer-count">{count} recensioni</div>
      {badge && <span className="lx-landing-reviewer-badge">{badge}</span>}
    </div>
  </div>
);

const FAQItem = ({ question, answer }) => (
  <div className="lx-landing-faq-item lx-landing-reveal">
    <h4 className="lx-landing-faq-question">{question}</h4>
    <p className="lx-landing-faq-answer">{answer}</p>
  </div>
);

const LandingPage = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    document.querySelectorAll(".lx-landing-reveal").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const DATABASE_COVERS = [
    {
      url: "https://cdn2.steamgriddb.com/grid/078d2a1275f0d53cda67d165440aeb50.png",
      title: "Animal Crossing: New Horizons",
    },
    {
      url: "https://cdn2.steamgriddb.com/grid/5cdf5c84489e801e6bac5693b1c8e290.png",
      title: "Baldur's Gate III",
    },
    {
      url: "https://cdn2.steamgriddb.com/grid/a350d0242847ce6bf914261c6e2712c1.png",
      title: "Astro Bot",
    },
    {
      url: "https://image.api.playstation.com/vulcan/ap/rnd/202504/1515/99f254edff001a6a52d1d9f09af28959abfbaf1fe1a034b4.jpg",
      title: "ARC Raiders",
    },
    {
      url: "https://cdn2.steamgriddb.com/grid/ce95c1acad71f8b15e61223a530cef0c.jpg",
      title: "Apollo Justice: Ace Attorney Trilogy",
    },
    {
      url: "https://cdn2.steamgriddb.com/grid/45713287ba01bb2c9dfa4a9c486e4cc9.png",
      title: "Battlefield 6",
    },
    {
      url: "https://cdn2.steamgriddb.com/grid/325ab9f1731fdc4a2cffc4de6f5c480b.png",
      title: "Blue Prince",
    },
    {
      url: "https://cdn2.steamgriddb.com/grid/ccd427e9a45f148777fe91e6850bf8eb.png",
      title: "Call of Duty: Black Ops 6",
    },
    {
      url: "https://cdn2.steamgriddb.com/grid/e7fff0c2739cf86c8aa5559eefe74220.png",
      title: "Clair Obscur: Expedition 33",
    },
    {
      url: "https://assets.gam3s.gg/hytale_cover_8177e5e369.png",
      title: "Hytale",
    },
    {
      url: "https://cdn2.steamgriddb.com/grid/5855660034a74cfe0e5fc8d57d17f4ac.png",
      title: "God of War",
    },
    {
      url: "https://cdn2.steamgriddb.com/grid/557fa68027943a8b0d3b66c4e72ff23b.png",
      title: "Elden Ring ",
    },
  ];

  return (
    <div className="lx-landing">
      {/* Navbar */}
      <nav className="lx-landing-nav">
        <div className="lx-landing-nav-inner">
          <div className="lx-landing-nav-logo">
            <img src={LogoLudexPng} className="lx-navbar-logo" alt="Ludex" />
          </div>

          <div className="lx-landing-nav-links">
            <a href="#features" className="lx-landing-nav-link">
              Features
            </a>
            <a href="#community" className="lx-landing-nav-link">
              Community
            </a>
            <a href="#why-signup" className="lx-landing-nav-link">
              Perché registrarsi?
            </a>
            <a href="#faq" className="lx-landing-nav-link">
              FAQ
            </a>
          </div>

          <div className="lx-landing-nav-cta">
            <a href="/home" className="lx-landing-nav-btn lx-landing-nav-btn--primary">
              Entra in Ludex
            </a>
            <a href="/auth" className="lx-landing-nav-btn lx-landing-nav-btn--secondary">
              Accedi
            </a>
          </div>

          <button type="button" className="lx-landing-nav-toggle" onClick={toggleNav} aria-label="Toggle navigation">
            <span className="lx-landing-nav-toggle-bar" />
            <span className="lx-landing-nav-toggle-bar" />
            <span className="lx-landing-nav-toggle-bar" />
          </button>
        </div>

        {/* Mobile Nav */}
        {isNavOpen && (
          <div className="lx-landing-nav-mobile">
            <div className="lx-landing-nav-mobile-overlay" onClick={closeNav} />
            <div className="lx-landing-nav-mobile-panel">
              <button type="button" className="lx-landing-nav-mobile-close" onClick={closeNav} aria-label="Close navigation">
                ×
              </button>

              <div className="lx-landing-nav-mobile-links">
                <a href="#features" className="lx-landing-nav-mobile-link" onClick={closeNav}>
                  Features
                </a>
                <a href="#community" className="lx-landing-nav-mobile-link" onClick={closeNav}>
                  Community
                </a>
                <a href="#why-signup" className="lx-landing-nav-mobile-link" onClick={closeNav}>
                  Perché registrarsi?
                </a>
                <a href="#faq" className="lx-landing-nav-mobile-link" onClick={closeNav}>
                  FAQ
                </a>
              </div>

              <a href="/auth" className="lx-landing-nav-btn lx-landing-nav-btn--primary lx-landing-nav-btn--mobile">
                Entra in Ludex
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="hero" className="lx-landing-section lx-landing-hero">
        <div className="lx-landing-inner">
          <div className="lx-landing-hero-grid">
            <div className="lx-landing-hero-content lx-landing-reveal">
              <h1 className="lx-landing-hero-title">La libreria definitiva per i tuoi videogiochi</h1>

              <p className="lx-landing-hero-subtitle">
                Giochi sparsi tra piattaforme, backlog infinito, difficile ricordare cosa giocare dopo? Ludex è la soluzione unica per organizzare la tua
                esperienza gaming.
              </p>

              <div className="lx-landing-hero-bullets">
                <div className="lx-landing-hero-bullet">
                  <i className="bi bi-controller" />
                  <span>Organizza backlog, giochi in corso e completati</span>
                </div>
                <div className="lx-landing-hero-bullet">
                  <i className="bi bi-graph-up" />
                  <span>Tieni traccia dei progressi e delle valutazioni</span>
                </div>
                <div className="lx-landing-hero-bullet">
                  <i className="bi bi-people" />
                  <span>Scopri cosa sta giocando la community</span>
                </div>
              </div>

              <div className="lx-landing-hero-cta">
                <a href="/auth" className="lx-landing-btn lx-landing-btn--primary">
                  Crea la tua libreria
                </a>
                <a href="#library-in-action" className="lx-landing-btn lx-landing-btn--outline">
                  Guarda un esempio
                </a>
              </div>

              <p className="lx-landing-hero-hint">
                <i className="bi bi-stars" />
                Inizia con un breve questionario: scegli piattaforme e generi preferiti, al resto pensa Ludex.
              </p>
            </div>

            <div className="lx-landing-hero-media lx-landing-reveal">
              <div className="lx-landing-frame lx-landing-hero-screenshot">
                <img src={HeroLoggedOut} alt="Schermata di Ludex - home per utente non loggato" />

                <div className="lx-landing-hero-pills">
                  <span className="lx-landing-pill lx-landing-pill--backlog">
                    <i className="bi bi-clock" /> Backlog 42 giochi
                  </span>
                  <span className="lx-landing-pill lx-landing-pill--playing">
                    <i className="bi bi-play-circle" /> In corso 5
                  </span>
                  <span className="lx-landing-pill lx-landing-pill--completed">
                    <i className="bi bi-check-circle" /> Completati 30
                  </span>
                  <span className="lx-landing-pill lx-landing-pill--recommended">
                    <i className="bi bi-magic" /> Consigliati per te
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="lx-landing-section lx-landing-features">
        <div className="lx-landing-inner">
          <div className="lx-landing-section-header lx-landing-reveal">
            <h2 className="lx-landing-section-title">Come funziona</h2>
            <p className="lx-landing-section-subtitle">Tre semplici passaggi per organizzare la tua esperienza gaming</p>
          </div>

          <div className="lx-landing-features-grid">
            <FeatureCard
              icon="bi-plus-circle"
              title="Aggiungi i tuoi giochi"
              description="Cerca nel nostro vasto database e aggiungi i titoli alla tua libreria personale. Supportiamo tutte le piattaforme principali."
            />
            <FeatureCard
              icon="bi-bookmark-check"
              title="Imposta stato, rating e tag"
              description="Segna cosa stai giocando, cosa hai completato, valuta con le stelle e scrivi recensioni personali."
            />
            <FeatureCard
              icon="bi-graph-up"
              title="Guarda statistiche e scopri"
              description="Visualizza le tue stats, monitora i progressi e ricevi suggerimenti basati sui tuoi gusti e sulla community."
            />
          </div>
        </div>
      </section>

      {/* Onboarding */}
      <section id="onboarding" className="lx-landing-section lx-landing-onboarding">
        <div className="lx-landing-inner">
          <div className="lx-landing-onboarding-grid">
            <div className="lx-landing-onboarding-content lx-landing-reveal">
              <h2 className="lx-landing-section-title">Un questionario, e Ludex capisce come giochi</h2>

              <p className="lx-landing-text">
                Dopo la registrazione, Ludex ti propone un <strong>breve questionario guidato </strong>
                che ti aiuta a personalizzare completamente la tua esperienza.
              </p>

              <div className="lx-landing-onboarding-points">
                <div className="lx-landing-onboarding-point">
                  <i className="bi bi-1-circle-fill" />
                  <div>
                    <strong>Piattaforme preferite</strong>
                    <p>PC, PlayStation, Xbox, Nintendo Switch, Cloud Gaming...</p>
                  </div>
                </div>
                <div className="lx-landing-onboarding-point">
                  <i className="bi bi-2-circle-fill" />
                  <div>
                    <strong>Generi che ami</strong>
                    <p>RPG, Action, Indie, Strategia, Adventure...</p>
                  </div>
                </div>
                <div className="lx-landing-onboarding-point">
                  <i className="bi bi-3-circle-fill" />
                  <div>
                    <strong>Come gestisci il backlog</strong>
                    <p>Poco tempo? Backlog enorme? Preferisci titoli brevi o lunghi?</p>
                  </div>
                </div>
              </div>

              <div className="lx-landing-onboarding-benefits">
                <p className="lx-landing-onboarding-benefit">
                  <i className="bi bi-check2-circle" />
                  La Home privata mostra subito shelf e giochi rilevanti per te
                </p>
                <p className="lx-landing-onboarding-benefit">
                  <i className="bi bi-check2-circle" />
                  La Libreria e la Community si adattano ai tuoi gusti
                </p>
                <p className="lx-landing-onboarding-benefit">
                  <i className="bi bi-check2-circle" />È rapido (pochi step) e opzionale, ma fortemente consigliato
                </p>
              </div>
            </div>

            <div className="lx-landing-onboarding-visual lx-landing-reveal">
              <div className="lx-landing-frame lx-landing-wizard-preview">
                <div className="lx-landing-wizard-steps">
                  <span className="lx-landing-wizard-step lx-landing-wizard-step--active">Step 1/3 – Piattaforme</span>
                  <span className="lx-landing-wizard-step">Step 2/3 – Generi</span>
                  <span className="lx-landing-wizard-step">Step 3/3 – Come gestisci il backlog?</span>
                </div>
                <img src={AddGameModalScreenshot} alt="Anteprima wizard di onboarding" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Library in Action */}
      <section id="library-in-action" className="lx-landing-section lx-landing-library">
        <div className="lx-landing-inner">
          <div className="lx-landing-section-header lx-landing-reveal">
            <h2 className="lx-landing-section-title">La tua libreria in azione</h2>
            <p className="lx-landing-section-subtitle">Organizza i giochi in shelf dinamiche basate sullo stato: In corso, Da iniziare, Completati</p>
          </div>

          <div className="lx-landing-library-grid">
            <div className="lx-landing-library-screenshot lx-landing-reveal">
              <div className="lx-landing-frame">
                <img src={LibraryScreenshot} alt="Schermata della libreria giochi Ludex" />
              </div>
            </div>

            <div className="lx-landing-library-content lx-landing-reveal">
              <h3 className="lx-landing-library-subtitle">Dividi i giochi come preferisci</h3>
              <ul className="lx-landing-library-list">
                <li>
                  <i className="bi bi-play-circle-fill" /> <strong>In corso</strong> – Cosa stai giocando ora
                </li>
                <li>
                  <i className="bi bi-clock-fill" /> <strong>Da iniziare</strong> – Il tuo backlog organizzato
                </li>
                <li>
                  <i className="bi bi-check-circle-fill" /> <strong>Completati</strong> – I tuoi traguardi
                </li>
                <li>
                  <i className="bi bi-pause-circle-fill" /> <strong>In pausa</strong> – Quando serve una pausa
                </li>
              </ul>

              <p className="lx-landing-library-text">
                Supportiamo immagini hero orizzontali per creare <strong>shelf a tutta larghezza</strong>, ottimizzate per essere navigabili velocemente anche
                con centinaia di giochi.
              </p>

              {/* Mini shelf preview */}
              <div className="lx-landing-mini-shelf">
                <div className="lx-landing-mini-shelf-header">
                  <span className="lx-landing-mini-shelf-title">
                    <i className="bi bi-play-circle-fill" /> In corso
                  </span>
                  <span className="lx-landing-mini-shelf-count">12</span>
                </div>
                <div className="lx-landing-mini-shelf-cards">
                  <div className="lx-landing-mini-card">
                    <div className="lx-landing-mini-card-cover">
                      <span className="lx-landing-mini-card-pill lx-landing-pill--playing">Playing</span>
                      <img src="https://cdn2.steamgriddb.com/grid/e7fff0c2739cf86c8aa5559eefe74220.png" alt="Clair Obscur: Expedition 33" loading="lazy" />
                    </div>
                  </div>
                  <div className="lx-landing-mini-card">
                    <div className="lx-landing-mini-card-cover">
                      <span className="lx-landing-mini-card-pill lx-landing-pill--playing">Playing</span>
                      <img src="https://cdn2.steamgriddb.com/grid/557fa68027943a8b0d3b66c4e72ff23b.png" alt="Clair Obscur: Expedition 33" loading="lazy" />
                    </div>
                  </div>
                  <div className="lx-landing-mini-card">
                    <div className="lx-landing-mini-card-cover">
                      <span className="lx-landing-mini-card-pill lx-landing-pill--playing">Playing</span>
                      <img src="https://cdn2.steamgriddb.com/grid/c32d0e02132a853fdf5b8010aa71602e.png" alt="Clair Obscur: Expedition 33" loading="lazy" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="lx-landing-section lx-landing-community">
        <div className="lx-landing-inner">
          <div className="lx-landing-section-header lx-landing-reveal">
            <h2 className="lx-landing-section-title">Community & recensioni</h2>
            <p className="lx-landing-section-subtitle">Scopri cosa gioca la community, leggi recensioni autentiche e trova nuovi titoli</p>
          </div>

          <div className="lx-landing-community-grid">
            <div className="lx-landing-community-col lx-landing-reveal">
              <h3 className="lx-landing-community-col-title">
                <i className="bi bi-star-fill" /> Ultime recensioni
              </h3>
              <div className="lx-landing-community-cards">
                <ReviewCard username="EternalGod" rating={4.5} snippet="Un RPG incredibile con una storia coinvolgente e meccaniche profonde." />
                <ReviewCard username="Frontend1" rating={5} snippet="Atmosfere uniche, puzzle ben pensati. Lo consiglio a tutti gli amanti degli indie." />
                <ReviewCard username="Balatro" rating={4} snippet="Gameplay solido ma un po' ripetitivo verso la fine. Nel complesso ottimo." />
              </div>
            </div>

            <div className="lx-landing-community-col lx-landing-reveal">
              <h3 className="lx-landing-community-col-title">
                <i className="bi bi-trophy-fill" /> Top reviewers
              </h3>
              <div className="lx-landing-community-cards">
                <TopReviewerCard username="EternalGod" count={67} badge="RPG Expert" rank={1} />
                <TopReviewerCard username="Frontend1" count={52} badge="Indie Lover" rank={2} />
                <TopReviewerCard username="PixelMaster" count={48} rank={3} />
                <TopReviewerCard username="NightGamer" count={41} rank={4} />
                <TopReviewerCard username="RetroFan" count={38} rank={5} />
              </div>
            </div>
          </div>

          <div className="lx-landing-community-visual lx-landing-reveal">
            <div className="lx-landing-frame lx-landing-community-screenshot">
              <img src={HomeFullScreenshot} alt="Community feed e trending games" />
            </div>
          </div>

          <p className="lx-landing-community-text lx-landing-reveal">
            Puoi <strong>vedere cosa gioca la community</strong>, leggere recensioni dettagliate, visitare i profili pubblici e seguire cosa stanno giocando i
            tuoi giocatori preferiti.
          </p>
        </div>
      </section>

      {/* Database */}
      <section id="database" className="lx-landing-section lx-landing-database">
        <div className="lx-landing-inner">
          <div className="lx-landing-database-grid">
            <div className="lx-landing-database-visual lx-landing-reveal">
              <div className="lx-landing-database-box">
                <div className="lx-landing-database-covers">
                  {DATABASE_COVERS.map((src, i) => (
                    <div key={i} className="lx-landing-database-cover">
                      <div className="lx-landing-database-cover-blur" aria-hidden="true" />
                      <img
                        className="lx-landing-database-cover-img"
                        src={src.url}
                        alt={src.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="lx-landing-database-tags">
                  <span className="lx-landing-pill">RPG</span>
                  <span className="lx-landing-pill">Single player</span>
                  <span className="lx-landing-pill">PC</span>
                  <span className="lx-landing-pill">Indie</span>
                  <span className="lx-landing-pill">Co-op</span>
                  <span className="lx-landing-pill">Action</span>
                  <span className="lx-landing-pill">Adventure</span>
                  <span className="lx-landing-pill">Strategy</span>
                </div>
              </div>
            </div>

            <div className="lx-landing-database-content lx-landing-reveal">
              <h2 className="lx-landing-section-title">Un database enorme, ma non ti perdi</h2>

              <p className="lx-landing-text">
                Il nostro catalogo è <strong>molto ampio</strong> e copre tutte le piattaforme principali. Ogni gioco ha generi, piattaforme, stato nella tua
                libreria e rating.
              </p>

              <p className="lx-landing-text">
                Puoi <strong>filtrare facilmente</strong> per genere, piattaforma, anno di uscita e stato, senza mai perderti tra migliaia di titoli.
              </p>

              <div className="lx-landing-database-features">
                <div className="lx-landing-database-feature">
                  <i className="bi bi-search" />
                  <span>Ricerca veloce e intelligente</span>
                </div>
                <div className="lx-landing-database-feature">
                  <i className="bi bi-funnel" />
                  <span>Filtri avanzati per genere e piattaforma</span>
                </div>
                <div className="lx-landing-database-feature">
                  <i className="bi bi-tags" />
                  <span>Tag e metadati completi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Signup */}
      <section id="why-signup" className="lx-landing-section lx-landing-why">
        <div className="lx-landing-inner">
          <div className="lx-landing-section-header lx-landing-reveal">
            <h2 className="lx-landing-section-title">Perché registrarsi?</h2>
            <p className="lx-landing-section-subtitle">Confronta cosa puoi fare con e senza un account Ludex</p>
          </div>

          <div className="lx-landing-why-grid">
            <div className="lx-landing-frame lx-landing-why-card lx-landing-reveal">
              <h3 className="lx-landing-why-card-title">
                <i className="bi bi-eye" /> Senza account
              </h3>
              <ul className="lx-landing-why-list">
                <li>
                  <i className="bi bi-check" /> Sfogli il catalogo
                </li>
                <li>
                  <i className="bi bi-check" /> Vedi i giochi in tendenza
                </li>
                <li>
                  <i className="bi bi-check" /> Leggi alcune recensioni pubbliche
                </li>
              </ul>
            </div>

            <div className="lx-landing-frame lx-landing-why-card lx-landing-why-card--premium lx-landing-reveal">
              <h3 className="lx-landing-why-card-title">
                <i className="bi bi-star-fill" /> Con account Ludex
              </h3>
              <ul className="lx-landing-why-list">
                <li>
                  <i className="bi bi-check-circle-fill" /> Salvi giochi nella tua libreria
                </li>
                <li>
                  <i className="bi bi-check-circle-fill" /> Imposti stato e rating personali
                </li>
                <li>
                  <i className="bi bi-check-circle-fill" /> Scrivi le tue recensioni
                </li>
                <li>
                  <i className="bi bi-check-circle-fill" /> Visualizzi statistiche personali
                </li>
                <li>
                  <i className="bi bi-check-circle-fill" /> Profilo pubblico/privato
                </li>
                <li>
                  <i className="bi bi-check-circle-fill" /> Onboarding guidato con questionario
                </li>
                <li>
                  <i className="bi bi-check-circle-fill" /> Suggerimenti personalizzati
                </li>
              </ul>
            </div>
          </div>

          <div className="lx-landing-why-after lx-landing-reveal">
            <div className="lx-landing-why-after-content">
              <h3 className="lx-landing-why-after-title">Dopo il login</h3>
              <p className="lx-landing-why-after-text">
                La tua home privata si trasforma: vedi le tue statistiche, i giochi in corso, suggerimenti basati sulle tue preferenze e un feed personalizzato.
              </p>
            </div>
            <div className="lx-landing-frame lx-landing-why-after-screenshot">
              <img src={HeroLoggedIn} alt="Home privata dopo il login" />
            </div>
          </div>

          <div className="lx-landing-why-cta lx-landing-reveal">
            <a href="/auth" className="lx-landing-btn lx-landing-btn--primary lx-landing-btn--large">
              <i className="bi bi-rocket-takeoff" /> Inizia ora
            </a>
            <p className="lx-landing-why-cta-hint">Registrazione gratuita · Questionario opzionale ma consigliato</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="lx-landing-section lx-landing-faq">
        <div className="lx-landing-inner">
          <div className="lx-landing-section-header lx-landing-reveal">
            <h2 className="lx-landing-section-title">Domande frequenti</h2>
          </div>

          <div className="lx-landing-faq-list">
            <FAQItem
              question="Ludex è gratuito?"
              answer="Sì, Ludex è completamente gratuito. Puoi creare un account, gestire la tua libreria e partecipare alla community senza alcun costo."
            />
            <FAQItem
              question="Posso nascondere le mie recensioni?"
              answer="Certamente. Ogni recensione può essere pubblica o privata. Decidi tu se condividerla con la community o tenerla per te."
            />
            <FAQItem
              question="Posso usare Ludex se gioco su più piattaforme?"
              answer="Assolutamente sì. Ludex supporta tutte le piattaforme principali (PC, PlayStation, Xbox, Nintendo Switch, Cloud Gaming) e puoi gestire giochi da tutte contemporaneamente."
            />
            <FAQItem
              question="Serve installare qualcosa?"
              answer="No, Ludex è una web app. Ti basta un browser e una connessione internet. Nessun download, nessuna installazione."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="lx-landing-footer">
        <div className="lx-landing-inner">
          <div className="lx-landing-footer-content">
            <div className="lx-landing-footer-brand">
              <img src={LogoLudexPng} className="lx-navbar-logo" alt="Ludex" />
              <p className="lx-landing-footer-copyright">© 2026 Ludex. La tua libreria gaming.</p>
            </div>

            {/* <div className="lx-landing-footer-links">
              <a href="#privacy" className="lx-landing-footer-link">
                Privacy
              </a>
              <a href="#terms" className="lx-landing-footer-link">
                Termini
              </a>
            </div> */}

            <div className="lx-landing-footer-social">
              {/* <a href="#discord" className="lx-landing-footer-social-link" aria-label="Discord">
                <i className="bi bi-discord" />
              </a>
              <a href="#twitter" className="lx-landing-footer-social-link" aria-label="Twitter">
                <i className="bi bi-twitter-x" />
              </a> */}
              <a href="https://github.com/Luigi9665" className="lx-landing-footer-social-link" aria-label="GitHub">
                <i className="bi bi-github" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

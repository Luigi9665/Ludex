import { Link } from "react-router";
import LxLoader from "../LxLoader";
import HeroSection from "./HeroSection";
import LibraryGames from "./LibraryGames";

const HomePrivateArea = ({ isLogged, authUser, userDetails, userLoading }) => {
  // ❌ non loggato
  if (!isLogged) {
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

  // ✅ loggato ma sto ancora caricando dal backend
  if (userLoading || !userDetails) {
    return (
      <section className="lx-section">
        <div className="container">
          <LxLoader message="Sto preparando la tua libreria personale..." />
        </div>
      </section>
    );
  }

  // ✅ loggato + dettagli pronti
  const games = userDetails.games || [];
  const reviews = games.filter((g) => (g.review ?? "").trim().length > 0);

  const stats = {
    gamesCount: games.length,
    reviewsCount: reviews.length,
    friendsCount: 0,
  };

  return (
    <>
      <HeroSection user={authUser} stats={stats} />
      <LibraryGames games={games} />
    </>
  );
};

export default HomePrivateArea;

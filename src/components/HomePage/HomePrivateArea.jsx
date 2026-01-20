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
          <h1 className="lx-hero-title">
            <span className="lx-text-glow">Benvenuto </span>Viaggiatore 👾
          </h1>

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

  console.log("Homeprivate", games);

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

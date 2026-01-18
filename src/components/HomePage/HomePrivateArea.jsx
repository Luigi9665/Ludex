import LxLoader from '../LxLoader';
import HeroSection from './HeroSection';
import LibraryGames from './LibraryGames';

const HomePrivateArea = ({ isLogged, authUser, userDetails, userLoading }) => {
  // ❌ non loggato
  if (!isLogged) {
    return (
      <section className="lx-hero-guest">
        <div className="container">
          <div className="lx-glass p-4 p-md-5 text-center">
            <h2 className="mb-3 lx-hero-title">
              Benvenuto in <span className="lx-text-glow">Ludex</span>
            </h2>
            <p className="lx-hero-guest-text mb-4">
              Crea il tuo profilo, costruisci la tua libreria e scopri i giochi che stanno
              appassionando la community.
            </p>
            <p className="text-white-50 small mb-0">
              Accedi o registrati per vedere la tua dashboard personalizzata.
            </p>
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
  const reviews = games.filter(g => (g.review ?? '').trim().length > 0);

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
